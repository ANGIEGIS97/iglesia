import { describe, it, expect } from "vitest";
import {
  createEmptyStreak,
  getWeekStart,
  isSameWeek,
  isNextWeek,
  calculateStreakUpdate,
} from "../useStreakLogic";

describe("createEmptyStreak", () => {
  it("crea un streak con valores vacíos", () => {
    const s = createEmptyStreak();
    expect(s.current).toBe(0);
    expect(s.maxReached).toBe(0);
    expect(s.lastActivity).toBeNull();
    expect(s.lastWeekStart).toBeNull();
    expect(s.weeklyGoalMet).toBe(false);
  });
});

describe("getWeekStart", () => {
  it("devuelve el lunes de la semana para un miércoles", () => {
    const wed = new Date("2024-01-10T12:00:00"); // miércoles
    const start = getWeekStart(wed);
    expect(start.getDay()).toBe(1); // lunes
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
  });

  it("devuelve el lunes de la semana para un domingo", () => {
    const sun = new Date("2024-01-14T12:00:00"); // domingo
    const start = getWeekStart(sun);
    expect(start.getDay()).toBe(1); // lunes
    expect(start.getDate()).toBe(8); // lunes anterior
  });

  it("devuelve el mismo día si es lunes", () => {
    const mon = new Date("2024-01-08T00:00:00"); // lunes
    const start = getWeekStart(mon);
    expect(start.getDay()).toBe(1);
    expect(start.getDate()).toBe(8);
  });
});

describe("isSameWeek", () => {
  it("dos fechas en la misma semana son iguales", () => {
    // Usar noon local para evitar que UTC midnight desplace al día anterior
    expect(isSameWeek(new Date("2024-01-08T12:00:00"), new Date("2024-01-10T12:00:00"))).toBe(true);
  });

  it("fechas en semanas distintas no son iguales", () => {
    expect(isSameWeek(new Date("2024-01-08T12:00:00"), new Date("2024-01-15T12:00:00"))).toBe(false);
  });

  it("retorna false si alguna fecha está vacía", () => {
    expect(isSameWeek("", "2024-01-10")).toBe(false);
    expect(isSameWeek("2024-01-10", "")).toBe(false);
  });
});

describe("isNextWeek", () => {
  it("detecta semana consecutiva", () => {
    expect(isNextWeek(new Date("2024-01-08T12:00:00"), new Date("2024-01-15T12:00:00"))).toBe(true);
  });

  it("no es semana siguiente si hay un salto de 2 semanas", () => {
    expect(isNextWeek(new Date("2024-01-08T12:00:00"), new Date("2024-01-22T12:00:00"))).toBe(false);
  });

  it("no es semana siguiente si es la misma semana", () => {
    expect(isNextWeek(new Date("2024-01-08T12:00:00"), new Date("2024-01-10T12:00:00"))).toBe(false);
  });
});

describe("calculateStreakUpdate", () => {
  it("primera actividad: current=1, maxReached=1", () => {
    const streak = createEmptyStreak();
    const result = calculateStreakUpdate(streak, new Date("2024-01-10"));
    expect(result.current).toBe(1);
    expect(result.maxReached).toBe(1);
    expect(result.weeklyGoalMet).toBe(true);
    expect(result.lastActivity).not.toBeNull();
  });

  it("misma semana: no incrementa current", () => {
    const streak = createEmptyStreak();
    const first = calculateStreakUpdate(streak, new Date("2024-01-08T12:00:00"));
    const second = calculateStreakUpdate(first, new Date("2024-01-10T12:00:00"));
    expect(second.current).toBe(1);
    expect(second.weeklyGoalMet).toBe(true);
  });

  it("semana consecutiva: incrementa current", () => {
    const streak = createEmptyStreak();
    const first = calculateStreakUpdate(streak, new Date("2024-01-08T12:00:00"));
    const second = calculateStreakUpdate(first, new Date("2024-01-15T12:00:00"));
    expect(second.current).toBe(2);
    expect(second.maxReached).toBe(2);
  });

  it("salto de más de una semana: resetea a 1", () => {
    const streak = createEmptyStreak();
    const first = calculateStreakUpdate(streak, new Date("2024-01-08T12:00:00"));
    const first2 = calculateStreakUpdate(first, new Date("2024-01-15T12:00:00"));
    const second2 = calculateStreakUpdate(first2, new Date("2024-01-22T12:00:00")); // 3 semanas seguidas
    expect(second2.current).toBe(3);
    const broken = calculateStreakUpdate(second2, new Date("2024-02-12T12:00:00")); // salta 2 semanas
    expect(broken.current).toBe(1);
  });

  it("maxReached no disminuye al resetear", () => {
    const streak = createEmptyStreak();
    let s = calculateStreakUpdate(streak, new Date("2024-01-08T12:00:00"));
    s = calculateStreakUpdate(s, new Date("2024-01-15T12:00:00"));
    s = calculateStreakUpdate(s, new Date("2024-01-22T12:00:00"));
    expect(s.maxReached).toBe(3);
    const broken = calculateStreakUpdate(s, new Date("2024-02-12T12:00:00"));
    expect(broken.maxReached).toBe(3);
    expect(broken.current).toBe(1);
  });

  it("no muta el objeto original", () => {
    const streak = createEmptyStreak();
    const copy = { ...streak };
    calculateStreakUpdate(streak, new Date("2024-01-10T12:00:00"));
    expect(streak.current).toBe(copy.current);
    expect(streak.lastActivity).toBe(copy.lastActivity);
  });
});
