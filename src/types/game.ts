export interface Achievement {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  verse: string;
  xp: number;
}

export interface StreakEntry {
  current: number;
  lastActivity: string | null;
  weeklyGoalMet: boolean;
  lastWeekStart: string | null;
}

export interface StreakData {
  anuncios: StreakEntry;
  fechas: StreakEntry;
}

export interface GameState {
  userXp: number;
  userLevel: number;
  userRank: number;
  loginStreak: number;
  achievements: Achievement[];
  streaks?: StreakData;
}
