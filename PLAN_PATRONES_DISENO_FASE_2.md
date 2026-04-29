# Plan: Mejoras de Patrones de Diseño — Fase 2

> Fecha de análisis: 2026-04-25
> Continuación de [PLAN_PATRONES_DISENO.md](PLAN_PATRONES_DISENO.md)

## Contexto

La fase anterior creó la infraestructura (`storage.ts`, `useGameStore`, `useStatsStore`, `useStreakLogic`, `useAchievements`, `achievementDefinitions.ts`, `useToast`, `useConfirm`, `BaseModal`, `eventBus`), pero **muchos componentes no la consumen aún**. Los antipatrones que motivaron la creación de esa infraestructura siguen activos en paralelo: `localStorage` directo, `window.dispatchEvent`, índices mágicos, `document.body.style.overflow`, mapeos de color duplicados, refs expuestos como API.

Esta fase no introduce abstracciones nuevas: **conecta lo que ya existe**. El comportamiento debe permanecer idéntico — la migración es mecánica donde la infraestructura está completa y requiere extensión donde es parcial.

---

## Inventario de deuda detectada

### A. Estado de gamificación (XP / logros / streaks): migración a stores incompleta

| Antipatrón vigente | Ubicación | Solución existente sin usar |
|-------------------|-----------|------------------------------|
| `localStorage.setItem("adminGameState_${uid}", JSON.stringify(...))` | [AdminSidebar.vue:584,593,625](src/components/AdminSidebar.vue#L584) | `storage.gameState.set/get` en [storage.ts:42-46](src/lib/storage.ts#L42-L46) |
| `localStorage.removeItem("achievements_${uid}")`, `haCreado_*_${uid}` | [Logros.vue:646-651,677,758-799,923](src/components/Logros.vue#L646-L651) | `storage` (key nueva `achievements`, `flags`) |
| `localStorage.setItem("streakData_${uid}", ...)` | [StreakManager.vue:303,333,359,486,659](src/components/StreakManager.vue#L303) | `storage.streaks.set/get` en [storage.ts:47-51](src/lib/storage.ts#L47-L51) |
| `localStorage.getItem("estadisticasContador_${uid}")` | [Logros.vue:757](src/components/Logros.vue#L757), [useStatsStore.ts:23,27](src/stores/useStatsStore.ts#L23) | Inconsistencia: `storage.stats` usa key `estadisticas_${uid}` (ver Riesgo abajo) |
| `unlockAchievement(14)` con índices mágicos (5 ocurrencias) | [Logros.vue:766,775,784,793,802](src/components/Logros.vue#L766) | `ACHIEVEMENT_IDS.CELEBRADOR_VIDA` en [achievementDefinitions.ts:22-26](src/data/achievementDefinitions.ts#L22-L26) |
| `checkAchievementsFromStats()` reimplementa reglas con if/else | [Logros.vue:751-820](src/components/Logros.vue#L751) | `checkAchievementRules(stats, flags)` en [useAchievements.ts:19-26](src/composables/useAchievements.ts#L19-L26) |
| `updateStreak()` reimplementa lógica de semanas | [StreakManager.vue:127-176](src/components/StreakManager.vue#L127) | `calculateStreakUpdate()` puro en [useStreakLogic.ts:47-89](src/composables/useStreakLogic.ts#L47-L89) (16 tests pasando) |

### B. Comunicación entre componentes: `window` event bus paralelo al `eventBus`

`src/lib/eventBus.ts` existe y es usado por `useToast`, pero **el resto sigue usando `window.dispatchEvent`** — convivimos con dos buses.

| Evento | Publishers (window) | Subscribers (window) |
|--------|---------------------|----------------------|
| `streakActivity` | [AdminEventList.vue:41](src/components/panel/AdminEventList.vue#L41), [AdminFechasList.vue:1103](src/components/panel/AdminFechasList.vue#L1103) | [StreakManager.vue:709](src/components/StreakManager.vue#L709), [AdminSidebar.vue:751](src/components/AdminSidebar.vue#L751) |
| `statisticsUpdated` | [useStatsStore.ts:50,57](src/stores/useStatsStore.ts#L50), [FechaModal.vue:446,452,458,464,470](src/components/panel/modals/FechaModal.vue#L446) | [AdminSidebar.vue:742](src/components/AdminSidebar.vue#L742) |
| `gameStateLoaded` | [AdminSidebar.vue:617,636,642](src/components/AdminSidebar.vue#L617) | [Logros.vue:1005](src/components/Logros.vue#L1005), [UserRanking.vue:134](src/components/panel/UserRanking.vue#L134) |
| `forceGameStateReload` | [Logros.vue:1008](src/components/Logros.vue#L1008) | [AdminSidebar.vue:745](src/components/AdminSidebar.vue#L745) |
| `rankingPageVisited` | [UserRanking.vue:114,139](src/components/panel/UserRanking.vue#L114) | [AdminSidebar.vue:748](src/components/AdminSidebar.vue#L748) |

> **Bug observado:** [StreakManager.vue:721](src/components/StreakManager.vue#L721) hace `window.removeEventListener('streakActivity', () => {})` con una función anónima nueva — nunca remueve el listener real. Memoria fuga al recrear el island. La migración a `eventBus.subscribe()` (que retorna `unsubscribe`) lo elimina automáticamente.

### C. Refs de plantilla como API pública (anti-patrón)

[AdminSidebar.vue](src/components/AdminSidebar.vue) usa `logrosRef` y `streakManagerRef` para invocar **9 + 12 métodos** expuestos vía `defineExpose`. Esto acopla padre e hijo en ambas direcciones; los hijos no son reutilizables y los métodos están duplicados con su lógica de presentación.

| Componente | `defineExpose` actual | Problema |
|-----------|----------------------|----------|
| [Logros.vue:1115-1128](src/components/Logros.vue#L1115-L1128) | `unlockAchievement, checkAchievementsFromStats, checkLevelAchievements, checkRankAchievements, checkRankingVisitAchievement, checkStreakAchievements, loadAchievements, clearAchievementsLocalStorage, syncAchievementsToLocalStorage, forceFirebaseSync, achievements, hasNewAchievement` | Toda la lógica de logros vive en el componente UI |
| [StreakManager.vue:669-687](src/components/StreakManager.vue#L669-L687) | `reportActivity, loadStreakData, saveStreakData, resetStreaks, streakData` + 8 helpers de debug | Estado y persistencia mezclados con render |

### D. Patrones de UI duplicados sin centralizar

| Patrón | Duplicación | Solución propuesta |
|--------|-------------|---------------------|
| `getUserInitial(name)` + `getUserColor(name)` (mismo array de 8 colores) | [AdminSidebar.vue:516-539](src/components/AdminSidebar.vue#L516), [AccountSelector.vue:28-57](src/components/panel/AccountSelector.vue#L28) | `useUserAvatar()` |
| Mapeo `userRank → color` (amber/gray/yellow/blue/purple) | [AdminSidebar.vue](src/components/AdminSidebar.vue): 5+ bloques (`v-if`, `:class`, círculo SVG, badge, level-up notif, rank-up notif) — 23 ocurrencias del nombre de color | `useRankStyle(rank)` retornando `{ text, bg, border, label }` |
| Mapeo `infoIconoTexto → color de borde/header` | [Eventos/EventoModal.vue:172-187](src/components/Eventos/EventoModal.vue#L172) (map limpio), [ProximosEventos.vue:68-114](src/components/Eventos/ProximosEventos.vue#L68) (10 condicionales `v-if` apilados) | Reusar `iconOptions.ts` (ya existe `colorClass` por tipo) |
| `document.body.classList.add("modal-open")` / `style.overflow = "hidden"` | 8 archivos: [AdminSidebar:850-852](src/components/AdminSidebar.vue#L850), [MenuInicio:341,347,357,486](src/components/MenuInicio.vue#L341), [CambioContrasena:199,204](src/components/CambioContrasena.vue#L199), [AdminEventList:191,193](src/components/panel/AdminEventList.vue#L191), [AdminFechasList:956](src/components/panel/AdminFechasList.vue#L956), [Eventos/EventoModal:266,305,312,326,336](src/components/Eventos/EventoModal.vue#L266), [panel/modals/EventoModal:432,438](src/components/panel/modals/EventoModal.vue#L432), [ModalLogros:197,199](src/components/ModalLogros.vue#L197) | `useBodyScrollLock(isOpen)` o moverlo a `BaseModal.vue` |
| Filtros CSS `filter-red`, `filter-blue`, `filter-gray` para SVG flama | [AdminSidebar.vue:953-963](src/components/AdminSidebar.vue#L953) y [StreakManager.vue:736-746](src/components/StreakManager.vue#L736) | Mover a `src/styles/global.css` |
| Bloque `localStorage.setItem("haCreado_X_${uid}", "true"); window.dispatchEvent(new Event("statisticsUpdated"))` x5 | [panel/modals/FechaModal.vue:443-471](src/components/panel/modals/FechaModal.vue#L443-L471) | Función `markSpecialDateFlag(tipo)` en `useGameStore` |

### E. Modales sin migrar a `BaseModal`

`BaseModal.vue` existe pero solo se usa en 4 lugares (`CambioContrasena`, `ProfileModal`, `AccountSelector`, `Eventos/EventoModal`, `panel/modals/EventoModal`). Quedan modales con su propio overlay manual:

- [AdminFechasList.vue:103-124](src/components/panel/AdminFechasList.vue#L103) — overlay "Generando anuncio"
- [AdminEventList.vue](src/components/panel/AdminEventList.vue) — overlay similar (revisar)
- [ModalLogros.vue](src/components/ModalLogros.vue) — modal completo manual
- [Logros.vue:166-196](src/components/Logros.vue#L166) — notificación de logro con overlay propio
- [panel/modals/FechaModal.vue](src/components/panel/modals/FechaModal.vue) — modal grande con overlay manual

### F. Persistencia de cuentas guardadas: capa raw

[AccountSelector.vue:159-194](src/components/panel/AccountSelector.vue#L159) y [LoginForm.vue:160-190](src/components/panel/LoginForm.vue#L160) leen/escriben directamente las keys `rememberUser_*`, `rememberPassword_*`, `displayName_*`, `email_*`. La lógica de "iterar `localStorage.length` y filtrar por prefijo" está en `AccountSelector` y desacoplada de `LoginForm`, que es quien escribe esas keys.

### G. TypeScript desigual

`<script setup>` sin `lang="ts"` en componentes que tocan datos: [AdminSidebar.vue:421](src/components/AdminSidebar.vue#L421), [Logros.vue](src/components/Logros.vue), [StreakManager.vue](src/components/StreakManager.vue), [NotificacionXP.vue](src/components/NotificacionXP.vue), [CambioContrasena.vue](src/components/CambioContrasena.vue), [LoginForm.vue](src/components/panel/LoginForm.vue), [Bienvenida.vue](src/components/Bienvenida.vue). Imposibilita validar las refactorizaciones de stores.

### H. Código de debugging en producción

[StreakManager.vue:365-666](src/components/StreakManager.vue#L365-L666): ~300 líneas (`debugShowStreaks`, `debugSimulateActivity`, `debugWeekInfo`, `debugSetStreak`, `debugCheckWeeklyStatus`, `debugClearAllData`, `debugTimeTravel`, `debugExportData`, `debugImportData`, `debugTestStreakAchievements`, `debugSetupStreakTest`) con `console.log` y `window.streakDebug = {...}`. Se ejecutan en cada montaje en prod.

---

## Plan de mejoras

### Grupo 1 — Completar migración de gamificación al store (Impacto Crítico)

**Objetivo:** mover toda la lógica de XP/logros/streaks al store; los componentes solo renderizan.

#### 1.1 — Extender `useGameStore` con persistencia

```typescript
// src/stores/useGameStore.ts
export const useGameStore = defineStore("game", () => {
  // ... estado actual
  const achievements = ref<Achievement[]>([]);
  const streaks = ref<StreakData>({ anuncios: createEmptyStreak(), fechas: createEmptyStreak() });
  const specialDateFlags = ref<AchievementFlags>({});

  async function loadFromFirestore(uid: string) { /* unifica loadGameState + loadStreakData */ }
  async function persistToFirestore(uid: string) { /* unifica saveGameState + saveStreakData */ }
  function unlockAchievement(id: AchievementId) { /* mueve desde Logros.vue */ }
  function reportStreakActivity(tipo: "anuncios" | "fechas", fecha?: Date) {
    streaks.value[tipo] = calculateStreakUpdate(streaks.value[tipo], fecha);  // usa composable puro
  }
  function markSpecialDateFlag(tipo: string) { /* reemplaza los 5 bloques de FechaModal */ }
  function checkAchievementsFromState() {
    const ids = checkAchievementRules(stats, specialDateFlags.value);
    ids.forEach(unlockAchievement);
  }

  return { /* ... */ };
});
```

**Archivos que se simplifican:**
- `AdminSidebar.vue` pierde `saveGameState`, `loadGameState`, `forceReloadGameState` (~150 líneas)
- `Logros.vue` pierde `loadAchievements`, `clearAchievementsLocalStorage`, `syncAchievementsToLocalStorage`, `unlockAchievement`, `checkAchievementsFromStats`, `forceFirebaseSync` (~300 líneas) — se queda solo el render
- `StreakManager.vue` pierde `loadStreakData`, `saveStreakData`, `updateStreak`, `resetStreaks` y todo el bloque debug (~500 líneas) — se queda solo el render del indicador

#### 1.2 — Eliminar `defineExpose` de Logros y StreakManager

Los métodos expuestos pasan a ser acciones del store. `AdminSidebar` deja de usar `logrosRef.value.X()` y `streakManagerRef.value.X()` — invoca `gameStore.X()` directo. Las refs de plantilla desaparecen.

#### 1.3 — Reemplazar índices mágicos en checks especiales

Extender `ACHIEVEMENT_RULES` para cubrir las reglas que aún están hardcodeadas en `Logros.vue`:

```typescript
// achievementDefinitions.ts (extensión)
export interface AchievementContext {
  stats: Estadisticas;
  flags: AchievementFlags;
  level: number;
  rank: number;
  streaks: StreakData;
  visitedRanking: boolean;
}

export const ACHIEVEMENT_RULES: AchievementRule[] = [
  // ... reglas actuales
  // Niveles
  { id: ACHIEVEMENT_IDS.SEMILLA_MOSTAZA,    check: ({ level }) => level >= 2 },
  { id: ACHIEVEMENT_IDS.SIERVO_FIEL,        check: ({ level }) => level >= 5 },
  // Rangos
  { id: ACHIEVEMENT_IDS.MEDALLA_BRONCE,     check: ({ rank }) => rank >= 1 },
  { id: ACHIEVEMENT_IDS.MEDALLA_PLATA,      check: ({ rank }) => rank >= 2 },
  // Especiales
  { id: ACHIEVEMENT_IDS.EXPLORADOR_RANGOS,  check: ({ visitedRanking }) => visitedRanking },
  // Streaks
  { id: ACHIEVEMENT_IDS.RACHA_INICIAL,      check: ({ streaks }) => streaks.anuncios.maxReached >= 1 || streaks.fechas.maxReached >= 1 },
];
```

Esto **elimina** `checkLevelAchievements`, `checkRankAchievements`, `checkRankingVisitAchievement`, `checkStreakAchievements` del componente — todos ejecutan la misma `checkAchievementsFromState()` del store.

#### 1.4 — Mover versículos de fallback a definiciones

[Logros.vue:698-724](src/components/Logros.vue#L698-L724) tiene un array de 20 versículos como fallback dentro de `unlockAchievement`. Mover a la definición original de cada logro en el componente (ya tiene `verse` por logro) y eliminar el fallback.

---

### Grupo 2 — Unificar el bus de eventos

**Objetivo:** eliminar `window.dispatchEvent` / `window.addEventListener` para eventos de aplicación. Solo usar `eventBus` (publish/subscribe).

#### 2.1 — Migrar publishers

```typescript
// AdminEventList.vue - antes
window.dispatchEvent(new CustomEvent('streakActivity', { detail: { tipo, fecha } }));

// después
import { publish } from "../../lib/eventBus";
publish("streakActivity", { tipo, fecha });
```

| Archivo | Eventos a migrar |
|---------|------------------|
| [AdminEventList.vue:41](src/components/panel/AdminEventList.vue#L41) | `streakActivity` |
| [AdminFechasList.vue:1103](src/components/panel/AdminFechasList.vue#L1103) | `streakActivity` |
| [UserRanking.vue:114,139](src/components/panel/UserRanking.vue#L114) | `rankingPageVisited` |
| [useStatsStore.ts:50,57](src/stores/useStatsStore.ts#L50) | `statisticsUpdated` (eliminable: el store ya es la fuente de verdad reactiva) |
| [panel/modals/FechaModal.vue:446-470](src/components/panel/modals/FechaModal.vue#L446) | `statisticsUpdated` (junto con flags → al store) |

#### 2.2 — Migrar subscribers a `subscribe()` (auto-cleanup)

```typescript
// AdminSidebar.vue - antes
onMounted(() => {
  window.addEventListener("streakActivity", handleStreakActivity);
});
onBeforeUnmount(() => {
  window.removeEventListener("streakActivity", handleStreakActivity);
});

// después
import { subscribe } from "../lib/eventBus";
onMounted(() => {
  const unsub = subscribe("streakActivity", handleStreakActivity);
  onBeforeUnmount(unsub);  // o guardar en array de cleanups
});
```

> **Bonus:** la migración corrige el bug de [StreakManager.vue:721](src/components/StreakManager.vue#L721) (`removeEventListener` con función anónima nueva) sin esfuerzo adicional.

#### 2.3 — Eliminar eventos de transporte cuando el store es la fuente

Si `useGameStore` y `useStatsStore` son reactivos y compartidos, **muchos de esos eventos sobran**:
- `gameStateLoaded` → `watch(() => gameStore.userXp, ...)` o computed que reaccione
- `statisticsUpdated` → `watch(() => statsStore.estadisticas, ...)`
- `forceGameStateReload` → invocar `gameStore.loadFromFirestore(uid)` directo

Los eventos solo son necesarios cuando el subscriber está en otro Vue island (Astro). Documentar cuáles cruzan islands.

---

### Grupo 3 — Corregir inconsistencia de `storage.stats` vs `useStatsStore`

**Problema:** dos sistemas con keys distintas para datos parecidos:
- `storage.stats` usa `estadisticas_${uid}` ([storage.ts:11](src/lib/storage.ts#L11))
- `useStatsStore` y [Logros.vue:757](src/components/Logros.vue#L757) usan `estadisticasContador_${uid}`

Sin migración: si alguien usa `storage.stats.get(uid)` no leerá lo que el resto del sistema escribe.

**Acción:** unificar a una sola key (`estadisticasContador_${uid}` para no romper datos existentes). `useStatsStore` debe consumir `storage.stats` en vez de hacer su propio `_cargarDesdeStorage()`.

---

### Grupo 4 — Composables que faltan

#### 4.1 — `src/composables/useBodyScrollLock.ts`

```typescript
export function useBodyScrollLock(isLocked: Ref<boolean>) {
  watch(isLocked, (locked) => {
    if (locked) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
    }
  }, { immediate: true });

  onBeforeUnmount(() => {
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open");
  });
}
```

**Mejor opción:** integrarlo dentro de `BaseModal.vue` para que cualquier modal lo herede gratis. Componentes que migren a `BaseModal` lo dejan de gestionar.

#### 4.2 — `src/composables/useUserAvatar.ts`

```typescript
const AVATAR_COLORS = [
  "#2196F3", "#4CAF50", "#F44336", "#9C27B0",
  "#FF9800", "#009688", "#E91E63", "#673AB7",
];

export function useUserAvatar() {
  function initial(name?: string) { return name ? name.charAt(0).toUpperCase() : "U"; }
  function color(name?: string) {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }
  return { initial, color };
}
```

Reemplaza copia idéntica en [AdminSidebar.vue:516-539](src/components/AdminSidebar.vue#L516) y [AccountSelector.vue:28-57](src/components/panel/AccountSelector.vue#L28).

#### 4.3 — `src/data/rankStyles.ts` + `useRankStyle()`

```typescript
export const RANK_STYLES = {
  1: { name: "Bronce",   text: "text-amber-500",  bg: "bg-amber-500",  badge: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100" },
  2: { name: "Plata",    text: "text-gray-400",   bg: "bg-gray-400",   badge: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200" },
  3: { name: "Oro",      text: "text-yellow-500", bg: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100" },
  4: { name: "Diamante", text: "text-blue-500",   bg: "bg-blue-500",   badge: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100" },
  5: { name: "Platino",  text: "text-purple-500", bg: "bg-purple-500", badge: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100" },
} as const;

export function useRankStyle(rank: Ref<number>) {
  return computed(() => RANK_STYLES[rank.value as keyof typeof RANK_STYLES] ?? RANK_STYLES[1]);
}
```

Reemplaza los 5+ bloques `:class="{ 'text-amber-500': userRank === 1, 'text-gray-400': userRank === 2, ... }"` en [AdminSidebar.vue](src/components/AdminSidebar.vue) (23 ocurrencias del nombre de color).

#### 4.4 — `src/lib/accountsStorage.ts`

API tipada para cuentas guardadas. Centraliza el patrón "iterar localStorage por prefijo":

```typescript
export interface SavedAccount { username: string; password: string; displayName?: string; email?: string; }

export const accountsStorage = {
  list(): SavedAccount[] { /* itera rememberUser_* y arma objetos */ },
  save(account: SavedAccount): void,
  remove(username: string): void,
};
```

Reemplaza [AccountSelector.vue:122-194](src/components/panel/AccountSelector.vue#L122) y [LoginForm.vue:160-190](src/components/panel/LoginForm.vue#L160).

---

### Grupo 5 — Reusar `iconOptions.ts` para colores de evento

[iconOptions.ts](src/data/iconOptions.ts) ya define `colorClass` por tipo de evento. Reemplazar:

- [Eventos/EventoModal.vue:172-187](src/components/Eventos/EventoModal.vue#L172) — el `headerColorClass` con su propio map → leer de `iconOptions`
- [ProximosEventos.vue:68-114](src/components/Eventos/ProximosEventos.vue#L68) — los 10 condicionales `evento.infoIconoTexto === 'X' ? 'border-t-Y'` → `findIconColor(evento.infoIconoTexto)`

Helper a agregar en `iconOptions.ts`:
```typescript
export function getIconColorClass(tipo: string, prefix: "bg" | "border-t" = "bg"): string {
  const opt = iconOptions.find(o => o.value === tipo);
  return opt ? opt.colorClass.replace("bg-", `${prefix}-`) : `${prefix}-teal-500`;
}
```

---

### Grupo 6 — Migrar modales restantes a `BaseModal`

- [ModalLogros.vue](src/components/ModalLogros.vue) — wrap completo con `BaseModal`, slot por defecto.
- [Logros.vue:166-196](src/components/Logros.vue#L166) — la notificación de logro desbloqueado tiene su propio `Teleport + overlay`. Migrar.
- [AdminFechasList.vue:103-124](src/components/panel/AdminFechasList.vue#L103) y similares en [AdminEventList.vue](src/components/panel/AdminEventList.vue) — overlays "Generando anuncio". Crear un `LoadingOverlay.vue` (variante de `BaseModal` sin botón cerrar).
- [panel/modals/FechaModal.vue](src/components/panel/modals/FechaModal.vue) — modal grande, candidato más complejo.
- [panel/modals/EventoModal.vue](src/components/panel/modals/EventoModal.vue) — revisar (38 KB).

---

### Grupo 7 — Limpieza de StreakManager

#### 7.1 — Aislar el código de debug

Mover los ~300 líneas de `debugX()` a `src/lib/debug/streakDebug.ts`. Solo se carga si `import.meta.env.DEV`. El componente queda < 200 líneas.

#### 7.2 — Eliminar `console.log` de flujo normal

[StreakManager.vue:227,296,350,371-385,398,406-432,446,454,462,464,484,487,493](src/components/StreakManager.vue) tiene >40 `console.log` no asociados a `catch`. Borrar.

---

### Grupo 8 — Migrar componentes de gamificación a TypeScript

Una vez extraída la lógica al store (Grupo 1), los componentes son thin wrappers fáciles de tipar:
- `AdminSidebar.vue` → `<script setup lang="ts">`
- `Logros.vue` → `<script setup lang="ts">`
- `StreakManager.vue` → `<script setup lang="ts">`
- `NotificacionXP.vue` → `<script setup lang="ts">`
- `CambioContrasena.vue` → `<script setup lang="ts">`
- `LoginForm.vue` → `<script setup lang="ts">`

---

## Análisis de riesgo

| Grupo | Riesgo | Razón |
|-------|--------|-------|
| 4.1 `useBodyScrollLock` | ✅ Cero | Mismas instrucciones, una sola fuente |
| 4.2 `useUserAvatar` | ✅ Cero | Funciones puras copiadas idénticas |
| 4.3 `useRankStyle` | ✅ Cero | Mapeos copiados sin cambio |
| 4.4 `accountsStorage` | ✅ Cero | Mismas keys, lógica encapsulada |
| 5 — reusar `iconOptions` | ✅ Cero | Verificar que `iconOptions.colorClass` tenga todos los tipos antes de migrar |
| 7.2 — limpiar `console.log` | ✅ Cero | Solo logs de debug |
| 7.1 — extraer debug helpers | ✅ Cero | Mismas funciones, otro archivo, gated por `import.meta.env.DEV` |
| 6 — modales adicionales a `BaseModal` | ⚠️ Bajo | Riesgo visual, no funcional |
| 2 — migración `window` → `eventBus` | ⚠️ Bajo | Mismo timing pub/sub; cuidar suscripciones cross-island |
| 3 — unificar key `estadisticasContador_*` | ⚠️ Bajo | Hay que elegir una sola key sin invalidar datos existentes |
| 1.1 — extender `useGameStore` con persistencia | ⚠️ Medio | Copiar `awardXp`/`saveGameState`/`loadGameState` con su orden de operaciones (Firestore primero, localStorage backup, evento de "loaded") |
| 1.2 — quitar `defineExpose` y refs | ⚠️ Medio | Hay que asegurar que el store esté inicializado antes de que los hijos rendericen — usar `storeToRefs` y `await loadFromFirestore` antes |
| 1.3 — extender `ACHIEVEMENT_RULES` | ⚠️ Medio | Las reglas hardcodeadas tienen orden de evaluación; tests existentes en `achievementDefinitions.test.ts` deben extenderse para los nuevos casos |
| 1.4 — versículos a definiciones | ✅ Cero | Movimiento de strings |
| 8 — migrar a TypeScript | ⚠️ Bajo | Riesgo de errores de tipo previamente ocultos; resolver cada uno como bug |

---

## Orden sugerido

### Fase E — Bajo riesgo, ganancia inmediata (independientes) ✅ COMPLETADA (2026-04-27)

```
1. ✅ useBodyScrollLock + integrarlo en BaseModal          ← Grupo 4.1
2. ✅ useUserAvatar                                        ← Grupo 4.2  → AdminSidebar, AccountSelector
3. ✅ useRankStyle + rankStyles.ts                         ← Grupo 4.3  → AdminSidebar (5 bloques)
4. ✅ accountsStorage                                      ← Grupo 4.4  → AccountSelector, LoginForm
5. ✅ getIconColorClass en iconOptions.ts                  ← Grupo 5    → ProximosEventos, EventoModal
6. ✅ Mover filtros CSS .filter-red/blue/gray a global.css ← Grupo D
7. ✅ Limpiar console.log de StreakManager                 ← Grupo 7.2
8. ✅ Extraer debug helpers a src/lib/debug/streakDebug.ts ← Grupo 7.1
9. ✅ Unificar key stats (storage.stats vs estadisticasContador) ← Grupo 3
```

**Resultado:**
- Nuevos módulos: `composables/useBodyScrollLock.ts`, `composables/useUserAvatar.ts`, `composables/useRankStyle.ts`, `data/rankStyles.ts`, `lib/accountsStorage.ts`, `lib/debug/streakDebug.ts`.
- `iconOptions.ts` expone `getIconColorClass(tipo, prefix)` con variantes literales para que Tailwind las detecte.
- `BaseModal.vue` heredó `useBodyScrollLock`; los modales que pasen por él dejan de gestionar `body.overflow` manualmente.
- `AdminSidebar.vue`: 5 bloques de mapeo de color de rango → 1 (`rankStyle.bg/text/badge/...`); helpers de avatar reemplazados.
- `AccountSelector.vue` y `LoginForm.vue`: lectura/escritura cruda de `rememberUser_*`/`rememberPassword_*`/`displayName_*`/`email_*` centralizada en `accountsStorage`.
- `StreakManager.vue`: ~300 líneas de debug + ~40 `console.log` de flujo normal eliminados; bug de `removeEventListener` con función anónima corregido (ahora se guarda la referencia real). Debug helpers en `lib/debug/streakDebug.ts` gated por `import.meta.env.DEV`.
- Filtros `.filter-red/blue/gray` viven una sola vez en `global.css`.
- `storage.stats` y `useStatsStore` comparten la key `estadisticasContador_${uid}`; el store consume `storage.stats` en vez de `localStorage.getItem` directo.
- 72/72 tests pasan; `astro build` OK.

### Fase F — Migración del bus de eventos (después de Fase E) ✅ COMPLETADA (2026-04-27)

```
10. ✅ Migrar publishers de window.dispatchEvent → eventBus.publish
11. ✅ Migrar subscribers de window.addEventListener → eventBus.subscribe con auto-unsub
12. ⏸️ Eliminar eventos redundantes (gameStateLoaded, statisticsUpdated) — diferido a Fase G
```

**Resultado:**
- Publishers migrados a `publish(...)`:
  - `streakActivity` en [AdminEventList.vue:41](src/components/panel/AdminEventList.vue#L41) y [AdminFechasList.vue:1103](src/components/panel/AdminFechasList.vue#L1103)
  - `rankingPageVisited` en [UserRanking.vue](src/components/panel/UserRanking.vue) (2 ocurrencias)
  - `gameStateLoaded` en [AdminSidebar.vue](src/components/AdminSidebar.vue) (3 ocurrencias)
  - `forceGameStateReload` en [Logros.vue](src/components/Logros.vue#L1008)
  - `statisticsUpdated` en [useStatsStore.ts](src/stores/useStatsStore.ts), [statsDebug.ts](src/lib/debug/statsDebug.ts) y [panel/modals/FechaModal.vue](src/components/panel/modals/FechaModal.vue) (5 ocurrencias)
- Subscribers migrados a `subscribe(...)` con `unsubscribe` retornado:
  - `AdminSidebar.vue`: 5 listeners (`statisticsUpdated`, `forceGameStateReload`, `rankingPageVisited`, `streakActivity`, `gameStateLoaded`) reagrupados en un array `busUnsubs` con cleanup atómico en `onBeforeUnmount`. Eliminado el patrón `removeEventListener + addEventListener` para idempotencia (ya no hace falta — `subscribe` lo da gratis).
  - `StreakManager.vue`: `streakActivity` con `unsubscribeStreakActivity` real (cierra la fuga de memoria del `removeEventListener` con función anónima).
  - `Logros.vue`: `gameStateLoaded` con auto-unsub al primer disparo dentro de `forceFirebaseSync`.
  - `UserRanking.vue`: `gameStateLoaded` con cleanup unificado en una función `notifyRankingVisited` que limpia tanto el unsub del bus como el timeout.
- Los handlers leen el payload directo (`{ tipo, fecha }`), no `event.detail`.
- Cero `window.dispatchEvent`/`addEventListener`/`removeEventListener` para eventos de aplicación (`streakActivity`, `statisticsUpdated`, `gameStateLoaded`, `forceGameStateReload`, `rankingPageVisited`). Solo permanecen `popstate`, `resize`, `scroll`, `keydown` y `MutationObserver` — eventos de DOM/navegador legítimos.
- 72/72 tests pasan; `astro build` OK.

**Por qué se difiere el paso 12 a Fase G:**
- `statisticsUpdated` no se puede reemplazar hoy con `watch(statsStore.estadisticas)` porque [FechaModal.vue:443-471](src/components/panel/modals/FechaModal.vue#L443-L471) lo dispara escribiendo flags `haCreado_*` en localStorage **sin tocar `statsStore`**. El watch nunca se dispararía. Esto se resuelve en Fase G al mover esos flags al `useGameStore` con `markSpecialDateFlag()`.
- `gameStateLoaded` lleva información de "ya cargué estado del juego" que aún vive parcialmente fuera del store (achievements/streaks viven en `Logros.vue` / `StreakManager.vue`). Hasta que la Fase G mueva ese estado al `useGameStore`, no hay un único `ref` que se pueda observar de forma equivalente.

### Fase G — Stores como única fuente de verdad (después de Fase F)

```
13. Extender useGameStore con achievements, streaks, specialDateFlags, persistencia
14. Extender ACHIEVEMENT_RULES con reglas de nivel/rango/streak/visita
15. Extender tests achievementDefinitions.test.ts para reglas nuevas
16. Quitar defineExpose de Logros.vue y simplificar a render puro
17. Quitar defineExpose de StreakManager.vue y simplificar a render puro
18. Quitar saveGameState/loadGameState de AdminSidebar; usar gameStore.loadFromFirestore
19. Reemplazar índices mágicos en panel/modals/FechaModal.vue (5 bloques) con gameStore.markSpecialDateFlag
```

### Fase H — Modales restantes a BaseModal + TypeScript (paralela)

```
20. Migrar ModalLogros, Logros notification, LoadingOverlay → BaseModal
21. Migrar panel/modals/FechaModal y EventoModal → BaseModal
22. <script setup lang="ts"> en componentes de gamificación
```

---

## Verificación

### Fase E
- Abrir/cerrar cualquier modal: `body.overflow` y clase `modal-open` se aplican y limpian.
- Iniciales y colores de avatar: idénticos al actual para los mismos nombres (test snapshot opcional).
- Colores de rango en sidebar: idénticos en avatar circular, badge, pill, level-up notif.
- Colores de borde en `ProximosEventos` para cada `infoIconoTexto`: idénticos.
- Cuentas guardadas: aparecen, se eliminan, se recuerdan igual que antes.

### Fase F
- Crear evento → `streakActivity` llega a `StreakManager` (rachas se actualizan).
- Crear/eliminar/modificar fechas y eventos → contadores en `AdminSidebar` se actualizan.
- Visitar `/admin/ranking` → logro `EXPLORADOR_RANGOS` se desbloquea.
- Memoria estable al navegar entre páginas (sin listeners colgados).

### Fase G
- Subir XP → mismo level-up, rank-up y desbloqueo de logros.
- Crear fecha de tipo "Cumpleaños" → logro `CELEBRADOR_VIDA` se desbloquea.
- Recargar página → estado del juego se restaura desde Firestore.
- Las 16 + 22 pruebas existentes siguen pasando; nuevas pruebas para reglas extendidas.

### Fase H
- Cada modal se cierra con ESC, click fuera, foco atrapado dentro.
- Tipado: `npm run build` sin errores TS.

---

## Métricas esperadas

| Antes | Después | Variación |
|-------|---------|-----------|
| `AdminSidebar.vue` 965 líneas | ~250 líneas | −74 % |
| `Logros.vue` 1145 líneas (~42 KB) | ~350 líneas | −69 % |
| `StreakManager.vue` 723 líneas | ~120 líneas | −83 % |
| `localStorage.*` directos en componentes (~25 ocurrencias) | 0 | −100 % |
| `window.dispatchEvent` / `window.addEventListener` (~25 ocurrencias) | Solo `popstate`, `scroll`, `resize` | −80 % |
| `defineExpose` con métodos de lógica | Solo `openModal`/`closeModal` en `CambioContrasena` y `LoginForm` | −90 % |
| Bloques duplicados de mapeo de color de rango | 1 fuente | de 5+ a 1 |
