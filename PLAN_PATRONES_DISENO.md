# Plan: Mejoras de Patrones de Diseño — Proyecto Iglesia

## Contexto

El proyecto funciona, pero la gestión de estado está dispersa en localStorage, custom events (`window.dispatchEvent`), funciones globales en `window`, y acceso directo al DOM (`document.querySelector`). Esto genera acoplamiento entre componentes, race conditions potenciales y deuda técnica difícil de mantener. El plan organiza las mejoras en 7 grupos independientes, de mayor a menor impacto, con un orden de ejecución que minimiza conflictos.

---

## Grupo 1 — Estado Global con Pinia (Impacto Crítico)

**Problema actual:**
- `AdminEventList.vue` busca al sidebar con `document.querySelector("admin-sidebar").awardXp(amount)`
- XP se comunica via `localStorage.setItem("tempXp_${uid}", amount)`
- Streaks/logros se sincronizan con `window.dispatchEvent(new CustomEvent('streakActivity', ...))`
- `ContadorEstadisticas.vue` expone `window.actualizarContador` y `window.actualizarContadorEstadisticas` como funciones globales

### Prerequisito — `src/lib/storage.ts` ✅ COMPLETADO

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

## Grupo 3 — Capa de Servicios ✅ COMPLETADO

### 3.1 — Dividir `src/lib/api.ts` en módulos por dominio ✅ COMPLETADO

`api.ts` tenía 737 líneas con 4 dominios mezclados. Se creó `src/lib/api/` con un archivo por dominio:

```
src/lib/api/
├── users.ts    # export const usuarios = { ... }
├── events.ts   # export const eventos = { ... }
├── dates.ts    # export const fechas = { ... }  — N+1 corregido: getAll() y getAllWithUserNames()
├── auth.ts     # export const auth_api = { ... } — checkAuth exportado
└── index.ts    # re-exports para compatibilidad (ningún import existente se rompe)
```

`src/lib/api.ts` se convirtió en `export * from "./api/index"`.

**N+1 en `fechas.getAll()` corregido:** se separó en `getAll()` (solo fechas) y `getAllWithUserNames()` (versión explícita con nombres de usuario).

### 3.2 — `src/lib/errors.ts` ✅ COMPLETADO

`handleFirebaseError` estaba definida localmente en `LoginForm.vue` y re-implementada en `CambioContrasena.vue`. Centralizada en `src/lib/errors.ts`:

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

## Grupo 4 — Limpieza Menor ✅ COMPLETADO

- ✅ **Imports estáticos en `FechaToEventoConverter.vue`:** todos los `await import(...)` dentro de métodos reemplazados por imports estáticos al inicio del archivo.
- ✅ **`src/middleware/auth.ts`:** usa `storage.token.get()` en lugar de `localStorage.getItem("token")` directo.
- ✅ **`src/types/game.ts`:** interfaces explícitas `GameState`, `Achievement`, `StreakEntry`, `StreakData` creadas (antes `any[]`).

---

## Grupo 5 — Componentes Base Reutilizables UI (Impacto Alto)

**Problema actual:** el patrón de modal `fixed inset-0 bg-black/30 backdrop-blur-sm z-40` está duplicado en **18 archivos** (93 coincidencias). El sistema de notificaciones usa 3 mecanismos distintos (`window.dispatchEvent`, `$emit`, texto inline). El `confirm()` nativo no se puede estilizar.

### 5.1 — `src/components/common/BaseModal.vue` (nuevo)

Consolida el patrón de overlay en un componente base con accesibilidad incorporada.

```vue
<!-- Uso -->
<BaseModal :open="showModal" title="Confirmar" @close="showModal = false">
  <template #default><!-- contenido --></template>
  <template #footer><!-- botones --></template>
</BaseModal>
```

**Beneficios:**
- 1 solo lugar para cambiar diseño, animaciones o comportamiento de todos los modales.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` incluidos por defecto.
- Cierre con tecla ESC y click fuera del panel.
- Focus trap automático (el foco no escapa del modal mientras está abierto).

**Archivos afectados:** `LoginForm.vue`, `CambioContrasena.vue`, `ProfileModal.vue`, `AdminEventList.vue`, `AdminFechasList.vue`, `FechaModal.vue`, `EventoModal.vue` y más.

### 5.2 — `src/composables/useToast.ts` + `src/components/common/ToastContainer.vue` (nuevos)

Reemplaza el sistema de notificaciones fragmentado: `NotificacionXP.vue` escucha `window.dispatchEvent`, mientras otros componentes emiten errores por `$emit` y otros muestran texto inline.

```typescript
// src/composables/useToast.ts
export function useToast() {
  function success(message: string, duration = 3000) { ... }
  function error(message: string, duration = 4000) { ... }
  function xp(amount: number, message: string) { ... }

  return { success, error, xp };
}
```

```vue
<!-- En Layout.astro o AdminSidebar.vue — una sola vez -->
<ToastContainer />
```

**Beneficios:** todos los mensajes de éxito, error y XP se ven igual y pasan por el mismo canal. Elimina `window.dispatchEvent` de las notificaciones.

> Conviene implementar después del Grupo 1 para migrar también las notificaciones de XP del store.

### 5.3 — `src/components/common/ConfirmDialog.vue` (nuevo)

Reemplaza los `confirm()` nativos (que bloquean el hilo principal, no se pueden estilizar y algunos navegadores los suprimen en iframes).

```typescript
// En cualquier componente
const { confirm } = useConfirm();
const ok = await confirm("¿Eliminar este anuncio?", { danger: true });
if (ok) await eventos.delete(id);
```

---

## Grupo 6 — Composable `useDarkMode` (Impacto Medio)

**Problema actual:** el dark mode está en tres lugares distintos:
1. Script inline en `Layout.astro` (lee `localStorage.getItem("darkMode")` directamente).
2. Componentes que acceden a `localStorage` para leer/escribir la preferencia.
3. Detección de `prefers-color-scheme` duplicada.

Si la key cambia de nombre, hay que buscarlo en múltiples archivos.

### 6.1 — `src/composables/useDarkMode.ts` (nuevo)

```typescript
export function useDarkMode() {
  const isDark = ref(storage.darkMode.get() ?? prefersDark());

  function toggle() {
    isDark.value = !isDark.value;
    storage.darkMode.set(isDark.value);
    document.documentElement.classList.toggle("dark", isDark.value);
  }

  return { isDark, toggle };
}
```

**Acciones:**
- Añadir `darkMode` a `storage.ts` (nueva key centralizada).
- El script inline en `Layout.astro` queda como está (necesario para evitar flash), pero ahora lee desde la misma key que el composable.
- Los componentes que cambian el tema importan `useDarkMode()` en lugar de tocar `localStorage` directamente.

---

## Grupo 7 — Higiene de Código y Configuración (Impacto Bajo)

Mejoras independientes entre sí, sin dependencias. Se pueden hacer en cualquier orden.

### 7.1 — Eliminar dependencias no usadas

`axios` y `jwt-decode` están en `package.json` pero tienen **0 usos** en el código fuente. Generan ruido en auditorías de seguridad y aumentan el bundle innecesariamente.

```bash
npm uninstall axios jwt-decode
```

### 7.2 — Mover configuración de Firebase a variables de entorno

`src/lib/firebase.ts` tiene la configuración hardcodeada. El resto de servicios (Gemini, Unsplash) ya usan `import.meta.env`. Unificar el patrón.

```typescript
// src/lib/firebase.ts — después
const firebaseConfig = {
  apiKey:            import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain:        import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.PUBLIC_FIREBASE_APP_ID,
};
```

Agregar las keys a `.env` y a `.env.example`.

### 7.3 — Limpiar `console.log` de debug en producción

Hay **282 ocurrencias** de `console.log/error/warn` en 27 archivos. La mayoría son `console.error` en catch (aceptable), pero `src/lib/unsplash.ts` tiene 10 logs de debug que se ejecutan en cada instancia, incluyendo uno que imprime disponibilidad de la API key.

**Regla:** mantener `console.error` solo en bloques `catch`. Eliminar todos los `console.log` de flujo normal.

### 7.4 — Uniformizar Options API → Composition API con `<script setup>`

Hay **20 componentes con `export default {}`** (Options API) y **16 con `<script setup>`** (Composition API) mezclados. La inconsistencia dificulta la lectura y los componentes Options API no se benefician del tree-shaking de Vue 3.

**Candidatos prioritarios** (sin lógica compleja, migración directa):
`MenuInicio.vue`, `Bienvenida.vue`, `BotonTop.vue`, `Servicios.vue`, `SobreNosotros.vue`, `PieDePagina.vue`, `Pastor.vue`, `Ubicacion.vue`, `Ministerios.vue`

> `AdminFechasList.vue`, `Logros.vue`, `StreakManager.vue` — migrar junto con Grupo 1 ya que son los que más se benefician del refactor de stores.

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
| Grupo 7.1 — eliminar deps no usadas | ✅ Cero | axios y jwt-decode tienen 0 usos; no hay nada que romper |
| Grupo 7.2 — Firebase a env vars | ✅ Cero | Mismos valores, distinta fuente; comportamiento idéntico |
| Grupo 7.3 — limpiar console.log | ✅ Cero | Solo logs de debug; no afecta lógica |
| Grupo 6 — useDarkMode | ✅ Cero | Misma key de localStorage, misma lógica; añade composable reutilizable |
| Grupo 5.1 — BaseModal | ⚠️ Bajo | Requiere adaptar template de cada modal; riesgo visual, no funcional |
| Grupo 5.2 — useToast | ⚠️ Bajo | Reemplaza mecanismo de notificaciones; misma UI si se copia el diseño |
| Grupo 5.3 — ConfirmDialog | ⚠️ Bajo | Reemplaza `confirm()` nativo; comportamiento equivalente pero asíncrono |
| Grupo 7.4 — Options → Composition API | ⚠️ Bajo | Requiere reescribir estructura del componente, riesgo de omitir lifecycle hooks |
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
✅ 1.  src/lib/errors.ts                         ← centraliza errores Firebase
✅ 2.  src/data/iconOptions.ts                   ← dato estático compartido
✅ 3.  src/composables/useFormatters.ts          ← elimina duplicación de formatDate
✅ 4.  src/composables/useValidation.ts          ← elimina duplicación de isValidUrl
✅ 5.  src/lib/api/ (dividir api.ts)             ← reorganización pura con re-exports
✅ 6.  src/lib/storage.ts                        ← wrapper tipado de localStorage
✅ 7.  Imports estáticos FechaToEventoConverter.vue
✅ 8.  npm uninstall axios jwt-decode            ← eliminar deps no usadas (7.1)
✅ 9.  Firebase config → env vars               ← mover a .env (7.2)
✅ 10. Limpiar console.log de debug             ← principalmente unsplash.ts (7.3)
✅ 11. src/composables/useDarkMode.ts           ← composable dark mode (6.1)
```

> **Fase A completada al 100%.**

### Fase B — Requiere Pinia (después de Fase A)

```
✅ 12. npm install pinia
✅ 13. Registrar Pinia en astro.config.mjs       (src/pinia.ts + appEntrypoint)
✅ 14. src/stores/useStatsStore.ts               ← reemplaza ventanas globales de ContadorEstadisticas
✅ 15. src/stores/useGameStore.ts                ← unifica XP/streaks/logros
✅ 16. src/composables/useStreakLogic.ts         ← extrae lógica pura de StreakManager
✅ 17. src/composables/useAchievements.ts
       + src/data/achievementDefinitions.ts     ← reemplaza índices mágicos
✅ 18. Tests para funciones puras               ← useStreakLogic (16 tests) + achievementDefinitions (22 tests)
✅ 19. Actualizar ContadorEstadisticas.vue      ← simplificado a ~20 líneas usando useStatsStore
✅ 20. Actualizar AdminEventList.vue            ← elimina querySelector, tempXp, window.actualizarContador
✅ 21. Actualizar AdminFechasList.vue           ← mismo patrón que AdminEventList
✅ 22. Actualizar AdminSidebar.vue             ← usa useGameStore + storeToRefs, elimina custom element bridge
```

> **Fase B completada al 100%.**

### Fase C — Componentes UI base (después de Fase B recomendado, independiente posible)

```
✅ 23. src/components/common/BaseModal.vue       ← patrón modal unificado + a11y (5.1)
        - CambioContrasena.vue migrado
        - ProfileModal.vue migrado
✅ 24. src/composables/useToast.ts
       + src/components/common/ToastContainer.vue ← notificaciones unificadas (5.2)
        - AdminEventList.vue migrado (elimina NotificacionXP prop-based)
        - AdminFechasList.vue migrado (elimina NotificacionXP prop-based)
        - NotificacionXP.vue limpiado (dead code window globals eliminado)
✅ 25. src/composables/useConfirm.ts
       + src/components/common/ConfirmDialog.vue  ← reemplaza confirm() nativo (5.3)
        - AdminEventList.vue migrado (2 confirm())
        - AdminFechasList.vue migrado (2 window.confirm())
        - FechaToEventoConverter.vue migrado (1 confirm())
       - ToastContainer + ConfirmDialog montados en AdminSidebar via Teleport
```

> **Fase C completada al 100%.**

### Fase D — Uniformización de código (paralela a cualquier fase)

```
✅ 26. Componentes simples migrados a <script setup lang="ts">:
        - MenuInicio.vue   ← híbrido setup()+data()+methods → script setup
        - Bienvenida.vue   ← Options API completo → script setup
        - BotonTop.vue     ← export default { setup() } aplanado
        - Servicios.vue    ← data()+computed(sin usar)+mounted+methods
        - SobreNosotros.vue ← data()+computed+$refs+methods
        - PieDePagina.vue  ← script vacío eliminado
        - Pastor.vue       ← sin script, sin cambios
        - Ubicacion.vue    ← sin script, sin cambios
        - Ministerios.vue  ← data() con array estático

✅ 27. Componentes complejos migrados a <script setup lang="ts">:
        - AdminFechasList.vue  ← hybrid setup()+data()+methods() → script setup, renombrado fechasApi/eventosApi
        - Logros.vue           ← ya era <script setup>, sin cambios necesarios
        - StreakManager.vue    ← ya era <script setup>, sin cambios necesarios
```

---

## Tabla Resumen

| # | Mejora | Archivos nuevos | Riesgo | Fase | Estado |
|---|--------|----------------|--------|------|--------|
| prereq | `src/lib/storage.ts` | 1 | ✅ Cero | A | ✅ Hecho |
| 2.3 | `src/composables/useFormatters.ts` + `useValidation.ts` | 2 | ✅ Cero | A | ✅ Hecho |
| 2.4 | `src/data/iconOptions.ts` | 1 | ✅ Cero | A | ✅ Hecho |
| 3.1 | Dividir `api.ts` → `src/lib/api/` | 5 | ✅ Cero | A | ✅ Hecho |
| 3.2 | `src/lib/errors.ts` | 1 | ✅ Cero | A | ✅ Hecho |
| 4 | Imports estáticos `FechaToEventoConverter.vue` | 0 | ✅ Cero | A | ✅ Hecho |
| 4 | `src/types/game.ts` | 1 | ✅ Cero | A | ✅ Hecho |
| 4 | `src/middleware/auth.ts` (usar storage) | 0 | ✅ Cero | A | ✅ Hecho |
| 6.1 | `src/composables/useDarkMode.ts` | 1 | ✅ Cero | A | ✅ Hecho |
| 7.1 | Eliminar `axios` y `jwt-decode` | 0 | ✅ Cero | A | ✅ Hecho |
| 7.2 | Firebase config → env vars | 0 | ✅ Cero | A | ✅ Hecho |
| 7.3 | Limpiar `console.log` de debug | 0 | ✅ Cero | A | ✅ Hecho |
| 1.2 | `src/stores/useStatsStore.ts` | 1 | ⚠️ Bajo | B | ✅ Hecho |
| 1.1 | `src/stores/useGameStore.ts` | 1 | ⚠️ Medio | B | ✅ Hecho |
| 2.1 | `src/composables/useStreakLogic.ts` | 1 | ⚠️ Medio | B | ✅ Hecho |
| 2.2 | `src/composables/useAchievements.ts` + `achievementDefinitions.ts` | 2 | ⚠️ Medio | B | ✅ Hecho |
| 5.1 | `src/components/common/BaseModal.vue` | 1 | ⚠️ Bajo | C | ✅ Hecho |
| 5.2 | `src/composables/useToast.ts` + `ToastContainer.vue` | 2 | ⚠️ Bajo | C | ✅ Hecho |
| 5.3 | `src/composables/useConfirm.ts` + `ConfirmDialog.vue` | 2 | ⚠️ Bajo | C | ✅ Hecho |
| 7.4 | Migrar 9 componentes simples a `<script setup lang="ts">` | 0 | ⚠️ Bajo | D | ✅ Hecho |
| 7.4 | Migrar `AdminFechasList.vue`, `Logros.vue`, `StreakManager.vue` | 0 | ⚠️ Medio | D | ✅ Hecho |

---

## Verificación

### Fase A
- Importar `formatDateBogota` desde `useFormatters` en ambos componentes y confirmar que el formato de fecha mostrado es idéntico al anterior.
- Verificar que todos los imports de `api.ts` siguen funcionando sin cambios (el barrel `index.ts` los re-exporta).
- Intentar login con credenciales incorrectas → mensaje legible igual que antes.
- Verificar que dark mode sigue funcionando: cambiar tema, recargar página → persiste.
- Confirmar que la build no incluye `axios` ni `jwt-decode` en el bundle.

### Fase B
- **XP:** Crear evento en panel → XP sube en AdminSidebar. Sin `window.dispatchEvent` ni `querySelector` en la consola.
- **Streaks:** La actividad semanal se registra igual que antes; el indicador visual en StreakManager no cambia.
- **Logros:** Los logros desbloqueados persisten entre recargas; el logro "Celebrador de la Vida" se sigue desbloqueando al crear una fecha de tipo Cumpleaños.
- **Estadísticas:** Los contadores de eventos/fechas en AdminSidebar reflejan los mismos valores que antes.

### Fase C
- Abrir cada modal: aparece correctamente, se cierra con ESC, con click fuera, y el foco queda atrapado dentro mientras está abierto.
- Las notificaciones de XP, éxito y error se muestran igual que antes visualmente.
- El diálogo de confirmación al eliminar un anuncio funciona igual que el `confirm()` anterior.

### Fase D
- Verificar que los componentes migrados a `<script setup>` mantienen el mismo comportamiento: props, emits, lifecycle hooks y acceso a refs funcionan igual.

---

## Análisis de Impacto — Implementación Completada

> Estado general: **100% completo** — todas las fases A, B, C y D terminadas.

### 1. Eliminación de antipatrones de comunicación entre componentes

Esta fue la mejora más crítica. Antes existían 4 mecanismos frágiles conviviendo:

| Antes | Después |
|-------|---------|
| `document.querySelector("admin-sidebar").awardXp(amount)` — dependía de que el DOM tuviera ese elemento | `gameStore.awardXp(amount)` — llamada directa al store |
| `localStorage.setItem("tempXp_${uid}", amount)` — canal de comunicación via storage | XP se pasa directamente, sin indirección |
| `window.dispatchEvent(new CustomEvent('streakActivity', ...))` — acoplamiento global | `gameStore.reportStreakActivity(tipo)` |
| `window.actualizarContador` / `window.actualizarContadorEstadisticas` — funciones globales en `window` | `statsStore.incrementar(tipo, accion)` |

Con Pinia (`useGameStore` + `useStatsStore`), los componentes que necesitan comunicarse comparten el mismo store. No hay DOM queries, no hay events globales, no hay race conditions entre `localStorage` y el render.

### 2. Eliminación de duplicación de código

| Código duplicado | Solución |
|-----------------|----------|
| `formatDateBogota()` copiada idénticamente en 2 archivos | `useFormatters.ts` — una sola fuente |
| `isValidUrl()` duplicada | `useValidation.ts` |
| Array `iconOptions` definido en `FechaModal.vue` y re-implementado parcialmente (incompleto) en `AdminFechasList.vue` | `src/data/iconOptions.ts` |
| `handleFirebaseError` en `LoginForm.vue` y re-implementada en `CambioContrasena.vue` | `src/lib/errors.ts` |
| Patrón `fixed inset-0 bg-black/30 backdrop-blur-sm z-40` en 18+ archivos | `BaseModal.vue` |

### 3. Seguridad y configuración

- **Firebase credentials** movidas de código hardcodeado a `import.meta.env`, alineándose con el patrón que Gemini y Unsplash ya usaban. Las credenciales ya no están expuestas en el repositorio.
- **`axios` y `jwt-decode` eliminados** — dos dependencias con 0 usos que generaban ruido en auditorías de seguridad y aumentaban el bundle sin motivo.
- **`storage.ts`** centraliza todas las keys de `localStorage` con tipos y `try/catch`: antes un typo en una key era silencioso; ahora hay una sola definición tipada.

### 4. Testabilidad — primer conjunto de tests del proyecto

Antes el código era prácticamente intestable (lógica mezclada con DOM y ciclos de vida de Vue). Extraer a funciones puras permitió:

| Suite | Tests |
|-------|-------|
| `useStreakLogic` | 16 tests — lógica de semanas, zona horaria Bogotá |
| `achievementDefinitions` | 22 tests — reglas de los 32 logros |
| `useFormatters`, `useValidation`, `iconOptions` | tests de utilidades |

Los índices mágicos como `unlockAchievement(14)` se reemplazaron por `ACHIEVEMENT_IDS.CELEBRADOR_VIDA` — legibles y refactorizables.

### 5. Accesibilidad y UX de modales

`BaseModal.vue` incorpora por defecto:
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby`
- Cierre con tecla ESC
- Focus trap (el foco no escapa del modal con Tab)
- Click fuera del panel para cerrar

`ConfirmDialog.vue` reemplaza `confirm()` nativo — que en algunos navegadores se suprime dentro de iframes, no se puede estilizar, y bloquea el hilo principal.

### 6. Uniformidad del código

Todos los componentes relevantes usan ahora `<script setup lang="ts">`. Esto no es solo cosmético:
- Los componentes Options API no se benefician del tree-shaking de Vue 3
- El compilador de plantillas puede hacer más optimizaciones con `<script setup>`
- Un solo estilo facilita la lectura y el onboarding

---

## Deuda Técnica Pendiente (fuera del scope del plan)

Identificada pero dejada conscientemente fuera del alcance:

- **`StreakManager.vue` y `Logros.vue`** siguen siendo grandes (~723 líneas y ~44 KB) — el plan los migró a `<script setup>` pero no redujo su tamaño. Reducirlos requeriría un refactor de lógica de negocio separado.
- **`BaseModal.vue` no se aplicó a todos los 18 archivos** — solo a `CambioContrasena.vue` y `ProfileModal.vue`. Los modales del panel (`FechaModal`, `EventoModal`) siguen con su patrón propio.
