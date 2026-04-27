import { ACHIEVEMENT_IDS, type AchievementId } from "../../data/achievementDefinitions";
import { checkAchievementRules } from "../../composables/useAchievements";

interface Achievement {
  name: string;
  unlocked: boolean;
  xp?: number;
  verse?: string;
}

interface LogrosSurface {
  readonly achievements: Achievement[];
  readonly uid: string;
  unlock: (id: number) => void;
  clearAll: () => void;
}

const FLAG_TIPOS = [
  "Cumpleanos",
  "ReunionVarones",
  "ReunionDamas",
  "CanastaDeAmor",
  "CenaDelSenor",
] as const;
type FlagTipo = typeof FLAG_TIPOS[number];

const STATS_PREFIX = "estadisticasContador_";

export function installLogrosDebug(surface: LogrosSurface) {
  if (typeof window === "undefined") return;

  const unwrap = <T>(v: T): T => JSON.parse(JSON.stringify(v));

  function resolveId(idOrName: number | string): number | null {
    if (typeof idOrName === "number") return idOrName;
    const key = idOrName.toUpperCase();
    const id = (ACHIEVEMENT_IDS as Record<string, number>)[key];
    if (id === undefined) {
      console.warn(`No existe ACHIEVEMENT_IDS.${key}. Ejecuta logrosDebug.ids() para ver los disponibles.`);
      return null;
    }
    return id;
  }

  function readFlags(): Record<FlagTipo, boolean> {
    const result = {} as Record<FlagTipo, boolean>;
    for (const t of FLAG_TIPOS) {
      result[t] = surface.uid
        ? localStorage.getItem(`haCreado_${t}_${surface.uid}`) === "true"
        : false;
    }
    return result;
  }

  function readStats() {
    if (!surface.uid) return null;
    const raw = localStorage.getItem(STATS_PREFIX + surface.uid);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  const api = {
    show() {
      console.log(`uid: ${surface.uid || "(sin sesión)"}`);
      const rows = surface.achievements.map((a, i) => ({
        id: i,
        name: a.name,
        estado: a.unlocked ? "✅" : "🔒",
        xp: a.xp ?? 0,
      }));
      console.table(rows);
    },
    unlocked() {
      const rows = surface.achievements
        .map((a, i) => ({ id: i, name: a.name, xp: a.xp ?? 0 }))
        .filter((_, i) => surface.achievements[i].unlocked);
      console.table(rows);
      console.log(`${rows.length}/${surface.achievements.length} desbloqueados`);
    },
    locked() {
      const rows = surface.achievements
        .map((a, i) => ({ id: i, name: a.name, xp: a.xp ?? 0 }))
        .filter((_, i) => !surface.achievements[i].unlocked);
      console.table(rows);
      console.log(`${rows.length}/${surface.achievements.length} pendientes`);
    },
    unlock(idOrName: number | string) {
      const id = resolveId(idOrName);
      if (id === null) return;
      const a = surface.achievements[id];
      if (!a) return console.warn(`No existe el logro con id ${id}`);
      surface.unlock(id);
      console.log(`✅ unlock(${id}) → ${a.name}`);
    },
    unlockAll() {
      surface.achievements.forEach((a, i) => {
        if (!a.unlocked) surface.unlock(i);
      });
      console.log(`✅ ${surface.achievements.length} logros desbloqueados`);
    },
    flags() {
      console.table(readFlags());
    },
    setFlag(tipo: FlagTipo, value = true) {
      if (!surface.uid) return console.warn("⚠️ Sin uid");
      if (!FLAG_TIPOS.includes(tipo)) {
        return console.warn(`Tipo inválido. Usa uno de: ${FLAG_TIPOS.join(", ")}`);
      }
      const key = `haCreado_${tipo}_${surface.uid}`;
      if (value) localStorage.setItem(key, "true");
      else localStorage.removeItem(key);
      console.log(`✅ ${key} = ${value}`);
    },
    clearFlags() {
      if (!surface.uid) return console.warn("⚠️ Sin uid");
      FLAG_TIPOS.forEach(t => localStorage.removeItem(`haCreado_${t}_${surface.uid}`));
      console.log("✅ flags limpios");
    },
    clearAll() {
      surface.clearAll();
      console.log("✅ logros y flags borrados — recarga para ver el estado limpio");
    },
    checkRules() {
      const stats = readStats();
      if (!stats) return console.warn("No hay stats guardadas — ejecuta acciones primero");
      const flags = readFlags();
      const ids = checkAchievementRules(stats, flags);
      const rows = ids.map((id: number) => ({
        id,
        name: surface.achievements[id]?.name ?? "(desconocido)",
        yaDesbloqueado: surface.achievements[id]?.unlocked ? "✅" : "🔒",
      }));
      console.log(`Reglas que se cumplen ahora mismo (${ids.length}):`);
      console.table(rows);
      return ids;
    },
    ids() {
      console.table(unwrap(ACHIEVEMENT_IDS));
    },
    help() {
      console.log(
        [
          "logrosDebug API:",
          "  .show()                      → tabla con id, nombre, estado, xp",
          "  .unlocked() / .locked()      → solo los desbloqueados / pendientes",
          "  .unlock(id|nombre)           → desbloquea (ej: unlock(14) o unlock('CELEBRADOR_VIDA'))",
          "  .unlockAll()                 → desbloquea todos (testing)",
          "  .flags()                     → muestra los haCreado_* (cumpleaños, reuniones, etc.)",
          "  .setFlag(tipo, value=true)   → setea bandera (Cumpleanos|ReunionVarones|ReunionDamas|CanastaDeAmor|CenaDelSenor)",
          "  .clearFlags()                → borra todas las banderas",
          "  .clearAll()                  → borra logros + banderas (estado de fábrica)",
          "  .checkRules()                → muestra qué reglas se cumplirían dado el state actual",
          "  .ids()                       → lista ACHIEVEMENT_IDS (mapeo nombre → id)",
          "  .help()                      → esta ayuda",
        ].join("\n"),
      );
    },
  };

  (window as any).logrosDebug = api;
  console.log("🛠️ logrosDebug disponible — ejecuta logrosDebug.help()");
}

export type { LogrosSurface, Achievement };
