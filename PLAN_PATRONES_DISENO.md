# Plan: Mejoras de Patrones de Diseño — Proyecto Iglesia

## Contexto

El proyecto funciona, pero la gestión de estado está dispersa en localStorage, custom events (`window.dispatchEvent`), funciones globales en `window`, y acceso directo al DOM (`document.querySelector`). Esto genera acoplamiento entre componentes, race conditions potenciales y deuda técnica difícil de mantener. El plan organiza las mejoras en 4 grupos independientes, de mayor a menor impacto, con un orden de ejecución que minimiza conflictos.

---

## Grupo 1 — Estado Global con Pinia (Impacto Crítico)

**Problema actual:**
- `AdminEventList.vue` busca al sidebar con `document.querySelector("admin-sidebar").awardXp(amount)`
- XP se comunica via `localStorage.setItem("tempXp_${uid}", amount)`
- Streaks/logros se sincronizan con `window.dispatchEvent(new CustomEvent('streakActivity', ...))`
- `ContadorEstadisticas.vue` expone `window.actualizarContador` y `window.actualizarContadorEstadisticas` como funciones globales

### Prerequisito — `src/lib/storage.ts` (nuevo, 1 archivo)

Capa tipada sobre localStorage que centraliza todas las keys y agrega `try/catch` en serialización.

```typescript
export const storage = {
  gameState: { get: (uid) => safeGet<GameState>(KEYS.gameState(uid)), set, clear },
  streaks:   { get: (uid) => safeGet<StreakData>(KEYS.streaks(uid)),   set, clear },
  stats:     { get: (uid) => safeGet<Estadisticas>(KEYS.stats(uid)),   set, clear },
  token:     { get: () => localStorage.getItem("token"),
               set: (v) => localStorage.setItem("token", v),
               clear: () => localStorage.removeItem("token") },
};
```

### 1.1 — `src/stores/useGameStore.ts` (nuevo)

Unifica todo el estado de gamificación: XP, nivel, rango, streaks, logros.

```typescript
export const useGameStore = defineStore("game", () => {
  const userXp = ref(0);
  const userLevel = ref(1);
  const userRank = ref(1);
  const streakData = ref<StreakData>({});
  const achievements = ref<Achievement[]>([]);

  async function awardXp(amount: number) { /* lógica extraída de AdminSidebar.awardXp */ }
  async function reportStreakActivity(tipo: "anuncios" | "fechas") { /* extraído de StreakManager */ }
  async function loadFromFirestore(uid: string) { /* unifica loadGameState + loadStreakData */ }
  async function persist(uid: string) { /* persiste en Firebase + storage */ }

  return { userXp, userLevel, userRank, streakData, achievements, awardXp, reportStreakActivity, loadFromFirestore };
});
```

**Componentes que se simplifican:**
| Componente | Tamaño actual | Después |
|------------|--------------|---------|
| `AdminSidebar.vue` | ~42 KB | ~10 KB — elimina `awardXp`, `saveGameState`, `loadGameState` |
| `StreakManager.vue` | 723 líneas | ~100 líneas de template puro |
| `AdminEventList.vue` | grande | Elimina querySelector, localStorage tempXp, dispatchEvent |
| `Logros.vue` | ~44 KB | Elimina `checkAchievementsFromStats`, lectura directa de localStorage |

### 1.2 — `src/stores/useStatsStore.ts` (nuevo)

Reemplaza `ContadorEstadisticas.vue` (componente fantasma invisible) y sus funciones globales en `window`.

```typescript
export const useStatsStore = defineStore("stats", () => {
  const estadisticas = ref<Estadisticas>({ eventos: { agregados:0, eliminados:0, modificados:0 }, fechas: {...} });

  function incrementar(tipo: "evento"|"fecha", accion: "agregados"|"eliminados"|"modificados") { ... }

  return { estadisticas, incrementar, cargar };
});
```

**Archivos afectados:** `AdminEventList.vue`, `AdminFechasList.vue`, `AdminSidebar.vue`, `ContadorEstadisticas.vue`

---

## Grupo 2 — Composables (Impacto Alto)

### 2.1 — `src/composables/useStreakLogic.ts` (nuevo)

Extrae las ~400 líneas de lógica temporal de `StreakManager.vue`. Funciones puras sin efectos: `getWeekStart`, `isSameWeek`, `isNextWeek`, `calculateStreakUpdate`.

> Requiere que `useGameStore` exista (Mejora 1.1).

### 2.2 — `src/composables/useAchievements.ts` + `src/data/achievementDefinitions.ts` (nuevos)

Extrae las 100+ líneas de reglas de negocio de `Logros.vue`. Define los 32 logros como `ACHIEVEMENT_RULES[]` con `check: (stats, flags) => boolean` en lugar de índices mágicos numéricos (`unlockAchievement(14)`).

**Antes:**
```javascript
// Índices mágicos — ¿qué es el 14?
if (haCreado_Cumpleanos === "true") { unlockAchievement(14); }
```

**Después:**
```typescript
// src/data/achievementDefinitions.ts
export const ACHIEVEMENT_IDS = {
  CELEBRADOR_VIDA: 14,
  MENSAJERO: 4,
  NUEVA_CRIATURA: 1,
  // ... todos los 32 con nombres semánticos
} as const;

export const ACHIEVEMENT_RULES: AchievementRule[] = [
  { id: ACHIEVEMENT_IDS.CELEBRADOR_VIDA, check: (_, flags) => flags.haCreado_Cumpleanos === true },
  { id: ACHIEVEMENT_IDS.MENSAJERO,       check: (stats) => stats.eventos.agregados >= 3 },
];
```

### 2.3 — `src/composables/useFormatters.ts` y `src/composables/useValidation.ts` (nuevos, independientes)

`formatDateBogota()` está copiada idénticamente en:
- `AdminFechasList.vue` (línea 1155)
- `FechaToEventoConverter.vue` (línea 438)

`isValidUrl()` también duplicada.

```typescript
// src/composables/useFormatters.ts
export function useFormatters() {
  const formatDateBogota = (dateStr: string): string =>
    new Date(dateStr + "T00:00:00-05:00").toLocaleDateString("es-CO", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

  return { formatDateBogota };
}
```

### 2.4 — `src/data/iconOptions.ts` (nuevo, independiente)

El array `iconOptions` (9 objetos `{value, colorClass, icon, label, colorName}`) está definido en `FechaModal.vue` y re-implementado parcialmente (incompleto, falta "Info") en `AdminFechasList.vue`. Una sola fuente importada en ambos.

---

## Grupo 3 — Capa de Servicios (Impacto Medio)

### 3.1 — Dividir `src/lib/api.ts` en módulos por dominio (independiente)

`api.ts` tiene 737 líneas con 4 dominios mezclados.

```
src/lib/api/
├── users.ts    # export const usuarios = { ... }
├── events.ts   # export const eventos = { ... }
├── dates.ts    # export const fechas = { ... }  — corregir N+1 en getAll()
├── auth.ts     # export const auth_api = { ... } — exportar checkAuth
└── index.ts    # re-exports para compatibilidad (ningún import existente se rompe)
```

`src/lib/api.ts` se convierte en `export * from "./api/index"`.

**N+1 en `fechas.getAll()`:** actualmente carga todos los usuarios para resolver nombres. Separar en `getAll()` (solo fechas) y `getAllWithUserNames()` (versión explícita).

### 3.2 — `src/lib/errors.ts` (nuevo, independiente)

`handleFirebaseError` está definida localmente en `LoginForm.vue` y re-implementada en `CambioContrasena.vue`.

```typescript
export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email":          "El correo electrónico no es válido",
  "auth/user-not-found":         "No existe una cuenta con este correo",
  "auth/wrong-password":         "Contraseña incorrecta",
  "auth/too-many-requests":      "Demasiados intentos. Intente más tarde",
  "auth/network-request-failed": "Error de conexión",
  "auth/invalid-credential":     "Credenciales inválidas",
};

export function getFirebaseErrorMessage(err: unknown, fallback = "Error desconocido"): string {
  if (err && typeof err === "object" && "code" in err)
    return FIREBASE_ERROR_MESSAGES[(err as any).code] ?? fallback;
  return fallback;
}
```

---

## Grupo 4 — Limpieza Menor (Impacto Bajo)

- **Imports estáticos en `FechaToEventoConverter.vue`:** reemplazar `await import("../../../lib/api")` dentro de métodos por imports estáticos al inicio del archivo.
- **`src/middleware/auth.ts`:** usar `storage.token.get()` en lugar de `localStorage.getItem("token")` directo.
- **`src/types/game.ts`:** interfaces explícitas `GameState`, `Achievement`, `StreakData` (actualmente `any[]`).

---

## Análisis de Riesgo — Preservar Comportamiento

> **Principio:** "No cambiar comportamiento" significa que el resultado visible es idéntico (XP, streaks, logros, UI). El mecanismo interno puede cambiar; eso es precisamente el objetivo. No significa preservar los mecanismos frágiles actuales (`window.dispatchEvent`, `document.querySelector`).

### Clasificación por riesgo

| Grupo | Riesgo | Motivo |
|-------|--------|--------|
| Grupo 3 — dividir api.ts | ✅ Cero | Reorganización pura con re-exports; ningún import existente se rompe |
| Grupo 3.2 — errors.ts | ✅ Cero | Solo centraliza mensajes; misma lógica |
| Grupo 2.3 — useFormatters / useValidation | ✅ Cero | Funciones copiadas idénticas, no reescritas |
| Grupo 2.4 — iconOptions.ts | ✅ Cero | Dato estático; mismo array |
| Grupo 4 — imports estáticos | ✅ Cero | Los servicios tienen lazy init; sin side effects al importar |
| storage.ts (prerequisito) | ✅ Cero | Mismas keys de localStorage, mismo formato; añade try/catch que faltaba |
| Grupo 1.2 — useStatsStore | ⚠️ Bajo | Mueve lógica de ContadorEstadisticas; elimina ventanas globales en window |
| Grupo 1.1 — useGameStore | ⚠️ Medio | Migra lógica compleja de XP/streaks/logros; requiere copiar exacto, no reescribir |
| Grupo 2.1 — useStreakLogic | ⚠️ Medio | Depende de 1.1; lógica de semanas con zona horaria Bogotá específica |
| Grupo 2.2 — useAchievements | ⚠️ Medio | Depende de 1.1; reglas de logros deben ser idénticas |

### Regla para Grupo 1 (Pinia stores)

**Pinia no está instalada** — requiere `npm install pinia` antes de cualquier store.

Para garantizar que el comportamiento no cambia al migrar a stores: **copiar el código exacto** de los componentes al store, no reescribirlo. El store debe ser un espejo del comportamiento actual antes de cualquier simplificación posterior.

Ejemplos de puntos críticos que deben copiarse con exactitud:
- `awardXp` en `AdminSidebar.vue` tiene lógica de level-up con `setTimeout` y persiste en Firebase
- La lógica de streaks usa zona horaria Bogotá (`T00:00:00-05:00`) de forma específica
- Los flags de logros especiales tienen keys exactas en localStorage (`haCreado_Cumpleanos_${uid}`)

---

## Orden de Implementación

### Fase A — Cero riesgo (independientes, empezar aquí)

```
1. src/lib/errors.ts                         ← centraliza errores Firebase
2. src/data/iconOptions.ts                   ← dato estático compartido
3. src/composables/useFormatters.ts          ← elimina duplicación de formatDate
4. src/composables/useValidation.ts          ← elimina duplicación de isValidUrl
5. src/lib/api/ (dividir api.ts)             ← reorganización pura con re-exports
6. src/lib/storage.ts                        ← wrapper tipado de localStorage
7. Imports estáticos FechaToEventoConverter.vue
```

### Fase B — Requiere Pinia (después de Fase A)

```
8.  npm install pinia
9.  Registrar Pinia en astro.config.mjs
10. src/stores/useStatsStore.ts              ← reemplaza ventanas globales de ContadorEstadisticas
11. src/stores/useGameStore.ts               ← unifica XP/streaks/logros
12. src/composables/useStreakLogic.ts        ← extrae lógica pura de StreakManager
13. src/composables/useAchievements.ts
    + src/data/achievementDefinitions.ts    ← reemplaza índices mágicos
```

---

## Tabla Resumen

| # | Mejora | Archivos nuevos | Riesgo | Fase |
|---|--------|----------------|--------|------|
| prereq | `src/lib/storage.ts` | 1 | ✅ Cero | A |
| 2.3 | `src/composables/useFormatters.ts` + `useValidation.ts` | 2 | ✅ Cero | A |
| 2.4 | `src/data/iconOptions.ts` | 1 | ✅ Cero | A |
| 3.1 | Dividir `api.ts` → `src/lib/api/` | 5 | ✅ Cero | A |
| 3.2 | `src/lib/errors.ts` | 1 | ✅ Cero | A |
| 4 | Imports estáticos `FechaToEventoConverter.vue` | 0 | ✅ Cero | A |
| 1.2 | `src/stores/useStatsStore.ts` | 1 | ⚠️ Bajo | B |
| 1.1 | `src/stores/useGameStore.ts` | 1 | ⚠️ Medio | B |
| 2.1 | `src/composables/useStreakLogic.ts` | 1 | ⚠️ Medio | B |
| 2.2 | `src/composables/useAchievements.ts` + `achievementDefinitions.ts` | 2 | ⚠️ Medio | B |

---

## Verificación

### Fase A
- Importar `formatDateBogota` desde `useFormatters` en ambos componentes y confirmar que el formato de fecha mostrado es idéntico al anterior.
- Verificar que todos los imports de `api.ts` siguen funcionando sin cambios (el barrel `index.ts` los re-exporta).
- Intentar login con credenciales incorrectas → mensaje legible igual que antes.

### Fase B
- **XP:** Crear evento en panel → XP sube en AdminSidebar. Sin `window.dispatchEvent` ni `querySelector` en la consola de red.
- **Streaks:** La actividad semanal se registra igual que antes; el indicador visual en StreakManager no cambia.
- **Logros:** Los logros desbloqueados persisten entre recargas; el logro "Celebrador de la Vida" se sigue desbloqueando al crear una fecha de tipo Cumpleaños.
- **Estadísticas:** Los contadores de eventos/fechas en AdminSidebar reflejan los mismos valores que antes.
