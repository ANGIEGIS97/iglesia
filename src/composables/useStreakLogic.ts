import type { StreakEntry } from "../types/game";

export function createEmptyStreak(): StreakEntry {
  return {
    current: 0,
    maxReached: 0,
    lastActivity: null,
    lastWeekStart: null,
    weeklyGoalMet: false,
  };
}

// Obtiene el inicio de la semana (lunes 00:00:00) para una fecha dada
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

// Obtiene el fin de la semana (domingo 23:59:59)
export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

export function isSameWeek(date1: Date | string, date2: Date | string): boolean {
  if (!date1 || !date2) return false;
  return getWeekStart(new Date(date1)).getTime() === getWeekStart(new Date(date2)).getTime();
}

// Verifica si currentWeek es exactamente la semana siguiente a lastWeek
export function isNextWeek(lastWeek: Date | string, currentWeek: Date | string): boolean {
  if (!lastWeek || !currentWeek) return false;
  const next = new Date(new Date(lastWeek).getTime());
  next.setDate(next.getDate() + 7);
  return getWeekStart(next).getTime() === getWeekStart(new Date(currentWeek)).getTime();
}

// Función pura: calcula el nuevo estado del streak dado una actividad.
// No muta, no guarda — retorna el nuevo StreakEntry.
export function calculateStreakUpdate(
  streak: StreakEntry,
  activityDate: Date = new Date()
): StreakEntry {
  const currentWeekStart = getWeekStart(activityDate);
  const fechaStr = activityDate.toISOString();
  const updated = { ...streak };

  if (!updated.lastActivity) {
    updated.current = 1;
    if (updated.maxReached === 0) updated.maxReached = 1;
    updated.lastActivity = fechaStr;
    updated.lastWeekStart = currentWeekStart.toISOString();
    updated.weeklyGoalMet = true;
    return updated;
  }

  const lastActivityDate = new Date(updated.lastActivity);
  const lastWeekStart = updated.lastWeekStart
    ? new Date(updated.lastWeekStart)
    : getWeekStart(lastActivityDate);

  if (isSameWeek(activityDate, lastActivityDate)) {
    // Misma semana: actualizar timestamp, no incrementar
    updated.lastActivity = fechaStr;
    updated.weeklyGoalMet = true;
  } else if (isNextWeek(lastWeekStart, currentWeekStart)) {
    // Semana siguiente consecutiva: incrementar streak
    updated.current += 1;
    if (updated.current > updated.maxReached) updated.maxReached = updated.current;
    updated.weeklyGoalMet = true;
    updated.lastActivity = fechaStr;
    updated.lastWeekStart = currentWeekStart.toISOString();
  } else {
    // Más de una semana sin actividad: resetear a 1
    updated.current = 1;
    updated.weeklyGoalMet = true;
    updated.lastActivity = fechaStr;
    updated.lastWeekStart = currentWeekStart.toISOString();
  }

  return updated;
}

export function useStreakLogic() {
  return { createEmptyStreak, getWeekStart, getWeekEnd, isSameWeek, isNextWeek, calculateStreakUpdate };
}
