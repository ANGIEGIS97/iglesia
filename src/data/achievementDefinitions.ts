export const ACHIEVEMENT_IDS = {
  // Perfil / Cuenta
  GUARDIAN_FE: 0,
  NUEVA_CRIATURA: 1,
  VASIJA_RENOVADA: 2,
  // Anuncios (por cantidad)
  PORTADOR_BUENAS_NUEVAS: 3,
  MENSAJERO: 4,
  HERALDO: 6,
  ATALAYA: 8,
  // Fechas (por cantidad)
  ORGANIZADOR: 5,
  PLANIFICADOR: 7,
  CRONISTA_DE_DIOS: 9,
  // Modificaciones
  ESCRIBA: 10,
  OBRERO_DILIGENTE: 11,
  // Eliminaciones
  LIMPIADOR: 12,
  PURIFICADOR: 13,
  // Tipos de fecha especiales
  CELEBRADOR_VIDA: 14,
  VARON_DE_VALOR: 15,
  MUJER_VIRTUOSA: 16,
  DADOR_ALEGRE: 17,
  EN_MEMORIA_EL: 18,
  // Niveles
  SEMILLA_MOSTAZA: 19,
  SIERVO_FIEL: 20,
  RESPLANDOR_DIVINO: 21,
  BUEN_MAYORDOMO: 22,
  // Rangos
  MEDALLA_BRONCE: 23,
  MEDALLA_PLATA: 24,
  MEDALLA_ORO: 25,
  DIAMANTE_PRECIOSO: 26,
  // Especiales
  EXPLORADOR_RANGOS: 27,
  RACHA_INICIAL: 28,
  CONSTANCIA: 29,
  PERSEVERANCIA: 30,
  ARMONIA_PERFECTA: 31,
} as const;

export type AchievementId = typeof ACHIEVEMENT_IDS[keyof typeof ACHIEVEMENT_IDS];

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

export interface AchievementRule {
  id: AchievementId;
  check: (stats: Estadisticas, flags: AchievementFlags) => boolean;
}

export const ACHIEVEMENT_RULES: AchievementRule[] = [
  // Tipos de fecha especiales
  { id: ACHIEVEMENT_IDS.CELEBRADOR_VIDA,   check: (_, f) => !!f.haCreado_Cumpleanos },
  { id: ACHIEVEMENT_IDS.VARON_DE_VALOR,    check: (_, f) => !!f.haCreado_ReunionVarones },
  { id: ACHIEVEMENT_IDS.MUJER_VIRTUOSA,    check: (_, f) => !!f.haCreado_ReunionDamas },
  { id: ACHIEVEMENT_IDS.DADOR_ALEGRE,      check: (_, f) => !!f.haCreado_CanastaDeAmor },
  { id: ACHIEVEMENT_IDS.EN_MEMORIA_EL,     check: (_, f) => !!f.haCreado_CenaDelSenor },
  // Anuncios
  { id: ACHIEVEMENT_IDS.PORTADOR_BUENAS_NUEVAS, check: (s) => s.eventos.agregados >= 1 },
  { id: ACHIEVEMENT_IDS.MENSAJERO,         check: (s) => s.eventos.agregados >= 3 },
  { id: ACHIEVEMENT_IDS.HERALDO,           check: (s) => s.eventos.agregados >= 10 },
  { id: ACHIEVEMENT_IDS.ATALAYA,           check: (s) => s.eventos.agregados >= 25 },
  // Fechas
  { id: ACHIEVEMENT_IDS.ORGANIZADOR,       check: (s) => s.fechas.agregados >= 3 },
  { id: ACHIEVEMENT_IDS.PLANIFICADOR,      check: (s) => s.fechas.agregados >= 10 },
  { id: ACHIEVEMENT_IDS.CRONISTA_DE_DIOS,  check: (s) => s.fechas.agregados >= 25 },
  // Modificaciones
  { id: ACHIEVEMENT_IDS.ESCRIBA,           check: (s) => s.eventos.modificados >= 10 },
  { id: ACHIEVEMENT_IDS.OBRERO_DILIGENTE,  check: (s) => s.fechas.modificados >= 10 },
  // Eliminaciones
  { id: ACHIEVEMENT_IDS.LIMPIADOR,         check: (s) => s.eventos.eliminados >= 5 },
  { id: ACHIEVEMENT_IDS.PURIFICADOR,       check: (s) => s.fechas.eliminados >= 5 },
];
