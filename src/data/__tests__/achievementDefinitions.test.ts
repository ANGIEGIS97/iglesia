import { describe, it, expect } from "vitest";
import { ACHIEVEMENT_IDS, ACHIEVEMENT_RULES } from "../achievementDefinitions";
import { checkAchievementRules } from "../../composables/useAchievements";

const emptyStats = {
  eventos: { agregados: 0, eliminados: 0, modificados: 0 },
  fechas: { agregados: 0, eliminados: 0, modificados: 0 },
};

const emptyFlags = {};

describe("ACHIEVEMENT_IDS", () => {
  it("todos los IDs son números únicos", () => {
    const values = Object.values(ACHIEVEMENT_IDS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  it("contiene los IDs críticos usados en componentes", () => {
    expect(typeof ACHIEVEMENT_IDS.PORTADOR_BUENAS_NUEVAS).toBe("number");
    expect(typeof ACHIEVEMENT_IDS.CELEBRADOR_VIDA).toBe("number");
    expect(typeof ACHIEVEMENT_IDS.VARON_DE_VALOR).toBe("number");
    expect(typeof ACHIEVEMENT_IDS.MUJER_VIRTUOSA).toBe("number");
    expect(typeof ACHIEVEMENT_IDS.DADOR_ALEGRE).toBe("number");
    expect(typeof ACHIEVEMENT_IDS.EN_MEMORIA_EL).toBe("number");
  });
});

describe("ACHIEVEMENT_RULES", () => {
  it("cada regla tiene id y check válidos", () => {
    for (const rule of ACHIEVEMENT_RULES) {
      expect(typeof rule.id).toBe("number");
      expect(typeof rule.check).toBe("function");
    }
  });

  it("los IDs de las reglas son únicos", () => {
    const ids = ACHIEVEMENT_RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("checkAchievementRules - flags de tipo de fecha", () => {
  it("desbloquea CELEBRADOR_VIDA con haCreado_Cumpleanos", () => {
    const ids = checkAchievementRules(emptyStats, { haCreado_Cumpleanos: true });
    expect(ids).toContain(ACHIEVEMENT_IDS.CELEBRADOR_VIDA);
  });

  it("no desbloquea CELEBRADOR_VIDA sin el flag", () => {
    const ids = checkAchievementRules(emptyStats, emptyFlags);
    expect(ids).not.toContain(ACHIEVEMENT_IDS.CELEBRADOR_VIDA);
  });

  it("desbloquea VARON_DE_VALOR con haCreado_ReunionVarones", () => {
    const ids = checkAchievementRules(emptyStats, { haCreado_ReunionVarones: true });
    expect(ids).toContain(ACHIEVEMENT_IDS.VARON_DE_VALOR);
  });

  it("desbloquea MUJER_VIRTUOSA con haCreado_ReunionDamas", () => {
    const ids = checkAchievementRules(emptyStats, { haCreado_ReunionDamas: true });
    expect(ids).toContain(ACHIEVEMENT_IDS.MUJER_VIRTUOSA);
  });

  it("desbloquea DADOR_ALEGRE con haCreado_CanastaDeAmor", () => {
    const ids = checkAchievementRules(emptyStats, { haCreado_CanastaDeAmor: true });
    expect(ids).toContain(ACHIEVEMENT_IDS.DADOR_ALEGRE);
  });

  it("desbloquea EN_MEMORIA_EL con haCreado_CenaDelSenor", () => {
    const ids = checkAchievementRules(emptyStats, { haCreado_CenaDelSenor: true });
    expect(ids).toContain(ACHIEVEMENT_IDS.EN_MEMORIA_EL);
  });
});

describe("checkAchievementRules - logros por anuncios", () => {
  it("desbloquea PORTADOR_BUENAS_NUEVAS con 1 evento", () => {
    const stats = { ...emptyStats, eventos: { agregados: 1, eliminados: 0, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.PORTADOR_BUENAS_NUEVAS);
  });

  it("desbloquea MENSAJERO con 3 eventos", () => {
    const stats = { ...emptyStats, eventos: { agregados: 3, eliminados: 0, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.MENSAJERO);
    expect(ids).toContain(ACHIEVEMENT_IDS.PORTADOR_BUENAS_NUEVAS);
  });

  it("no desbloquea HERALDO con menos de 10 eventos", () => {
    const stats = { ...emptyStats, eventos: { agregados: 9, eliminados: 0, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).not.toContain(ACHIEVEMENT_IDS.HERALDO);
  });

  it("desbloquea ATALAYA con 25 eventos", () => {
    const stats = { ...emptyStats, eventos: { agregados: 25, eliminados: 0, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.ATALAYA);
  });
});

describe("checkAchievementRules - logros por fechas", () => {
  it("desbloquea ORGANIZADOR con 3 fechas", () => {
    const stats = { ...emptyStats, fechas: { agregados: 3, eliminados: 0, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.ORGANIZADOR);
  });

  it("desbloquea PLANIFICADOR con 10 fechas", () => {
    const stats = { ...emptyStats, fechas: { agregados: 10, eliminados: 0, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.PLANIFICADOR);
  });

  it("desbloquea CRONISTA_DE_DIOS con 25 fechas", () => {
    const stats = { ...emptyStats, fechas: { agregados: 25, eliminados: 0, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.CRONISTA_DE_DIOS);
  });
});

describe("checkAchievementRules - modificaciones y eliminaciones", () => {
  it("desbloquea ESCRIBA con 10 eventos modificados", () => {
    const stats = { ...emptyStats, eventos: { agregados: 0, eliminados: 0, modificados: 10 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.ESCRIBA);
  });

  it("desbloquea OBRERO_DILIGENTE con 10 fechas modificadas", () => {
    const stats = { ...emptyStats, fechas: { agregados: 0, eliminados: 0, modificados: 10 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.OBRERO_DILIGENTE);
  });

  it("desbloquea LIMPIADOR con 5 eventos eliminados", () => {
    const stats = { ...emptyStats, eventos: { agregados: 0, eliminados: 5, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.LIMPIADOR);
  });

  it("desbloquea PURIFICADOR con 5 fechas eliminadas", () => {
    const stats = { ...emptyStats, fechas: { agregados: 0, eliminados: 5, modificados: 0 } };
    const ids = checkAchievementRules(stats, emptyFlags);
    expect(ids).toContain(ACHIEVEMENT_IDS.PURIFICADOR);
  });
});

describe("checkAchievementRules - sin datos", () => {
  it("no desbloquea nada con stats y flags vacíos", () => {
    const ids = checkAchievementRules(emptyStats, emptyFlags);
    expect(ids).toHaveLength(0);
  });
});
