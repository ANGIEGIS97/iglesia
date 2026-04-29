type Tipo = "anuncios" | "fechas";

interface SingleStreak {
  current: number;
  maxReached: number;
  lastActivity: string | null;
  lastWeekStart: string | null;
  weeklyGoalMet: boolean;
}

interface StreakSurface {
  readonly streakData: { anuncios: SingleStreak; fechas: SingleStreak };
  readonly currentUserId: string | null;
  reportActivity: (tipo: Tipo, fecha?: Date) => void;
  saveStreakData: () => Promise<void>;
  loadStreakData: () => Promise<void>;
  resetStreaks: () => Promise<void>;
  checkWeeklyStatus: () => void;
  emitCheckAchievements: () => void;
  getWeekStart: (date?: Date) => Date;
  getDaysUntilWeekEnd: () => number;
  getDaysSinceLastActivity: (lastActivity: string | null) => number | null;
  isSameWeek: (a: Date | string, b: Date | string) => boolean;
}

const TIPOS: Tipo[] = ["anuncios", "fechas"];

function unwrap<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function isTipo(value: unknown): value is Tipo {
  return value === "anuncios" || value === "fechas";
}

export function installStreakDebug(surface: StreakSurface) {
  if (typeof window === "undefined") return;

  const api = {
    show() {
      console.log(`uid: ${surface.currentUserId || "(sin sesión)"}`);
      const rows: Record<Tipo, Record<string, unknown>> = {
        anuncios: {} as Record<string, unknown>,
        fechas: {} as Record<string, unknown>,
      };
      TIPOS.forEach((tipo) => {
        const s = surface.streakData[tipo];
        rows[tipo] = {
          current: s.current,
          maxReached: s.maxReached,
          weeklyGoalMet: s.weeklyGoalMet,
          lastActivity: s.lastActivity ? new Date(s.lastActivity).toLocaleString() : "—",
          lastWeekStart: s.lastWeekStart ? new Date(s.lastWeekStart).toLocaleString() : "—",
        };
      });
      console.table(rows);
    },

    simulate(tipo: Tipo, daysOffset = 0) {
      if (!isTipo(tipo)) return console.error("tipo debe ser 'anuncios' o 'fechas'");
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + daysOffset);
      surface.reportActivity(tipo, fecha);
    },

    weekInfo() {
      const now = new Date();
      console.group("📅 INFORMACIÓN DE STREAKS");
      console.log(`Fecha actual: ${now.toLocaleString()} (día ${now.getDay()})`);
      TIPOS.forEach((tipo) => {
        const s = surface.streakData[tipo];
        console.group(tipo);
        console.log(`current=${s.current}, max=${s.maxReached}, weeklyGoalMet=${s.weeklyGoalMet}`);
        if (s.lastActivity) {
          console.log(`última actividad: ${new Date(s.lastActivity).toLocaleString()}`);
          console.log(`días desde última actividad: ${surface.getDaysSinceLastActivity(s.lastActivity)}`);
          console.log(`días hasta fin de semana: ${surface.getDaysUntilWeekEnd()}`);
        } else {
          console.log("sin actividad registrada");
        }
        console.groupEnd();
      });
      console.groupEnd();
    },

    setStreak(tipo: Tipo, current: number, weeksAgo = 0) {
      if (!isTipo(tipo)) return console.error("tipo debe ser 'anuncios' o 'fechas'");
      const lastActivityDate = new Date();
      lastActivityDate.setDate(lastActivityDate.getDate() - weeksAgo * 7);
      const lastWeekStart = surface.getWeekStart(lastActivityDate);

      const s = surface.streakData[tipo];
      s.current = current;
      s.lastActivity = lastActivityDate.toISOString();
      s.lastWeekStart = lastWeekStart.toISOString();
      s.weeklyGoalMet = weeksAgo === 0;
      if (current > s.maxReached) s.maxReached = current;

      surface.saveStreakData();
    },

    checkWeekly() {
      surface.checkWeeklyStatus();
      this.show();
    },

    async clearAll() {
      if (!surface.currentUserId) return console.error("Sin usuario autenticado");
      localStorage.removeItem(`streakData_${surface.currentUserId}`);
      await surface.resetStreaks();
      await surface.loadStreakData();
      this.show();
    },

    timeTravel(daysOffset: number) {
      TIPOS.forEach((tipo) => {
        const s = surface.streakData[tipo];
        if (s.lastActivity) {
          const lastDate = new Date(s.lastActivity);
          lastDate.setDate(lastDate.getDate() + daysOffset);
          s.lastActivity = lastDate.toISOString();
        }
        if (s.lastWeekStart) {
          const lastWeekDate = new Date(s.lastWeekStart);
          lastWeekDate.setDate(lastWeekDate.getDate() + daysOffset);
          s.lastWeekStart = lastWeekDate.toISOString();
        }
      });
      surface.checkWeeklyStatus();
      this.show();
    },

    export() {
      const data = {
        streaks: unwrap(surface.streakData),
        timestamp: new Date().toISOString(),
        user: surface.currentUserId || "anonymous",
      };
      console.log(JSON.stringify(data, null, 2));
      if (navigator.clipboard) navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      return data;
    },

    import(data: unknown) {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (!parsed || typeof parsed !== "object" || !("streaks" in parsed)) {
          return console.error("Formato inválido — falta { streaks }");
        }
        const streaks = (parsed as any).streaks;
        surface.streakData.anuncios = streaks.anuncios ?? surface.streakData.anuncios;
        surface.streakData.fechas = streaks.fechas ?? surface.streakData.fechas;
        surface.saveStreakData();
        this.show();
      } catch (error) {
        console.error("Error al importar datos:", error);
      }
    },

    async reset() {
      await surface.resetStreaks();
    },

    testAchievements() {
      surface.emitCheckAchievements();
    },

    setupTest(anuncios = 0, fechas = 0, weeksAgo = 0) {
      const lastActivityDate = new Date();
      lastActivityDate.setDate(lastActivityDate.getDate() - weeksAgo * 7);
      const lastWeekStart = surface.getWeekStart(lastActivityDate);

      const apply = (tipo: Tipo, weeks: number) => {
        const s = surface.streakData[tipo];
        s.current = weeks;
        s.maxReached = Math.max(s.maxReached, weeks);
        s.weeklyGoalMet = weeksAgo === 0 && weeks > 0;
        s.lastActivity = weeks > 0 ? lastActivityDate.toISOString() : null;
        s.lastWeekStart = weeks > 0 ? lastWeekStart.toISOString() : null;
      };
      apply("anuncios", anuncios);
      apply("fechas", fechas);

      surface.saveStreakData();
      surface.emitCheckAchievements();
      this.show();
    },

    help() {
      console.log(
        [
          "streakDebug API:",
          "  .show()                          → estado actual de los streaks",
          "  .simulate(tipo, daysOffset?)     → simula actividad",
          "  .weekInfo()                      → info detallada de fechas",
          "  .setStreak(tipo, n, weeksAgo?)   → fija un streak",
          "  .checkWeekly()                   → recalcula el estado semanal",
          "  .clearAll()                      → limpia datos y recarga",
          "  .timeTravel(days)                → desplaza fechas",
          "  .export() / .import(data)        → exportar/importar streaks",
          "  .reset()                         → resetea ambos streaks",
          "  .testAchievements()              → re-dispara verificación de logros",
          "  .setupTest(an, fe, weeksAgo?)    → configura ambos streaks para tests",
        ].join("\n"),
      );
    },
  };

  (window as any).streakDebug = api;
  console.log("🛠️ streakDebug disponible — ejecuta streakDebug.help()");
}
