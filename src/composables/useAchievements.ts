import { ACHIEVEMENT_RULES, type AchievementRule } from "../data/achievementDefinitions";

export { ACHIEVEMENT_IDS } from "../data/achievementDefinitions";

interface Estadisticas {
  eventos: { agregados: number; eliminados: number; modificados: number };
  fechas: { agregados: number; eliminados: number; modificados: number };
}

interface AchievementFlags {
  haCreado_Cumpleanos?: boolean;
  haCreado_ReunionVarones?: boolean;
  haCreado_ReunionDamas?: boolean;
  haCreado_CanastaDeAmor?: boolean;
  haCreado_CenaDelSenor?: boolean;
}

// Retorna los IDs de logros que se deben desbloquear dado el estado actual
export function checkAchievementRules(
  stats: Estadisticas,
  flags: AchievementFlags
): number[] {
  return ACHIEVEMENT_RULES.filter((rule: AchievementRule) =>
    rule.check(stats, flags)
  ).map((rule) => rule.id);
}

export function useAchievements() {
  return { checkAchievementRules, ACHIEVEMENT_RULES };
}
