import type { GameState, StreakData } from "../types/game";

interface Estadisticas {
  eventos: { agregados: number; eliminados: number; modificados: number };
  fechas: { agregados: number; eliminados: number; modificados: number };
}

const KEYS = {
  gameState: (uid: string) => `adminGameState_${uid}`,
  streaks: (uid: string) => `streakData_${uid}`,
  stats: (uid: string) => `estadisticas_${uid}`,
  token: "token",
  darkMode: "darkMode",
} as const;

function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error al guardar en localStorage [${key}]:`, e);
  }
}

function safeClear(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error al limpiar localStorage [${key}]:`, e);
  }
}

export const storage = {
  gameState: {
    get: (uid: string) => safeGet<GameState>(KEYS.gameState(uid)),
    set: (uid: string, value: GameState) => safeSet(KEYS.gameState(uid), value),
    clear: (uid: string) => safeClear(KEYS.gameState(uid)),
  },
  streaks: {
    get: (uid: string) => safeGet<StreakData>(KEYS.streaks(uid)),
    set: (uid: string, value: StreakData) => safeSet(KEYS.streaks(uid), value),
    clear: (uid: string) => safeClear(KEYS.streaks(uid)),
  },
  stats: {
    get: (uid: string) => safeGet<Estadisticas>(KEYS.stats(uid)),
    set: (uid: string, value: Estadisticas) => safeSet(KEYS.stats(uid), value),
    clear: (uid: string) => safeClear(KEYS.stats(uid)),
  },
  token: {
    get: () => localStorage.getItem(KEYS.token),
    set: (value: string) => localStorage.setItem(KEYS.token, value),
    clear: () => localStorage.removeItem(KEYS.token),
  },
  darkMode: {
    get: () => safeGet<boolean>(KEYS.darkMode),
    set: (value: boolean) => safeSet(KEYS.darkMode, value),
    clear: () => safeClear(KEYS.darkMode),
  },
};
