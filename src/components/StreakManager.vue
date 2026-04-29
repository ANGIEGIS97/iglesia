<template>
  <div class="flex items-center space-x-3">
    <!-- Streak de Anuncios -->
    <div class="flex items-center space-x-1">
      <div
        class="flex items-center space-x-1 text-xs font-medium"
        :title="getStreakTooltip('anuncios')"
      >
        <img
          src="/svg/flama.svg"
          :alt="streakData.anuncios.weeklyGoalMet ? 'Streak activo' : 'Streak inactivo'"
          :class="streakData.anuncios.weeklyGoalMet ? 'w-4 h-4 filter-red' : 'w-4 h-4 filter-gray'"
        />
        <span class="text-gray-500 dark:text-gray-200">{{ streakData.anuncios.current }}</span>
      </div>
      <span class="text-xs text-gray-500 dark:text-gray-400">Anuncios</span>
    </div>

    <!-- Streak de Fechas -->
    <div class="flex items-center space-x-1">
      <div
        class="flex items-center space-x-1 text-xs font-medium"
        :title="getStreakTooltip('fechas')"
      >
        <img
          src="/svg/flama.svg"
          :alt="streakData.fechas.weeklyGoalMet ? 'Streak activo' : 'Streak inactivo'"
          :class="streakData.fechas.weeklyGoalMet ? 'w-4 h-4 filter-blue' : 'w-4 h-4 filter-gray'"
        />
        <span class="text-gray-500 dark:text-gray-200">{{ streakData.fechas.current }}</span>
      </div>
      <span class="text-xs text-gray-500 dark:text-gray-400">Fechas</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { auth_api, usuarios } from "../lib/api.ts";
import { subscribe } from "../lib/eventBus";

const emit = defineEmits(['streakUpdate', 'checkStreakAchievements']);

const createEmptyStreak = () => ({
  current: 0,
  maxReached: 0,
  lastActivity: null,
  lastWeekStart: null,
  weeklyGoalMet: false
});

const streakData = ref({
  anuncios: createEmptyStreak(),
  fechas: createEmptyStreak()
});

let unsubscribeAuth = null;

// Inicio de la semana (lunes a las 00:00)
const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

const getDaysSinceLastActivity = (lastActivity) => {
  if (!lastActivity) return null;
  const diffMs = Date.now() - new Date(lastActivity).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const getWeekEnd = (date = new Date()) => {
  const weekEnd = getWeekStart(date);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

const getDaysUntilWeekEnd = () => {
  const diffMs = getWeekEnd().getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const isSameWeek = (date1, date2) => {
  if (!date1 || !date2) return false;
  return getWeekStart(new Date(date1)).getTime() === getWeekStart(new Date(date2)).getTime();
};

const isNextWeek = (lastWeek, currentWeek) => {
  if (!lastWeek || !currentWeek) return false;
  const nextWeek = new Date(lastWeek);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return getWeekStart(nextWeek).getTime() === getWeekStart(new Date(currentWeek)).getTime();
};

/**
 * Lógica de racha semanal (semana = Lun-Dom):
 *   - Sin actividad previa → current = 1
 *   - Misma semana         → no incrementa
 *   - Semana siguiente     → current += 1
 *   - Salto > 1 semana     → current = 1
 */
const updateStreak = async (tipo, fecha = new Date()) => {
  const currentWeekStart = getWeekStart(fecha);
  const fechaString = fecha.toISOString();
  const streak = streakData.value[tipo];

  if (!streak.lastActivity) {
    streak.current = 1;
    if (streak.maxReached === 0) streak.maxReached = 1;
    streak.lastActivity = fechaString;
    streak.lastWeekStart = currentWeekStart.toISOString();
    streak.weeklyGoalMet = true;
  } else {
    const lastActivityDate = new Date(streak.lastActivity);
    const lastWeekStart = streak.lastWeekStart
      ? new Date(streak.lastWeekStart)
      : getWeekStart(lastActivityDate);

    if (isSameWeek(fecha, lastActivityDate)) {
      streak.lastActivity = fechaString;
      streak.weeklyGoalMet = true;
    } else if (isNextWeek(lastWeekStart, currentWeekStart)) {
      streak.current += 1;
      if (streak.current > streak.maxReached) streak.maxReached = streak.current;
      streak.weeklyGoalMet = true;
      streak.lastActivity = fechaString;
      streak.lastWeekStart = currentWeekStart.toISOString();
    } else {
      streak.current = 1;
      streak.weeklyGoalMet = true;
      streak.lastActivity = fechaString;
      streak.lastWeekStart = currentWeekStart.toISOString();
    }
  }

  await saveStreakData();
  emit('streakUpdate', { tipo, streak: { ...streak } });
  emit('checkStreakAchievements', streakData.value);
};

const checkWeeklyStatus = () => {
  const currentWeekStart = getWeekStart();
  let updated = false;

  ['anuncios', 'fechas'].forEach((tipo) => {
    const streak = streakData.value[tipo];
    if (!streak.lastActivity) return;

    const lastActivityDate = new Date(streak.lastActivity);
    const lastWeekStart = streak.lastWeekStart
      ? new Date(streak.lastWeekStart)
      : getWeekStart(lastActivityDate);

    let tipoUpdated = false;

    if (isSameWeek(currentWeekStart, lastActivityDate)) {
      if (!streak.weeklyGoalMet) {
        streak.weeklyGoalMet = true;
        tipoUpdated = true;
      }
    } else if (isNextWeek(lastWeekStart, currentWeekStart)) {
      if (streak.weeklyGoalMet) {
        streak.weeklyGoalMet = false;
        tipoUpdated = true;
      }
    } else {
      streak.weeklyGoalMet = false;
      if (streak.current !== 0) {
        streak.current = 0;
        tipoUpdated = true;
      }
    }

    if (tipoUpdated) {
      updated = true;
      emit('streakUpdate', { tipo, streak: { ...streak } });
    }
  });

  if (updated) {
    saveStreakData().catch((error) => {
      console.error("Error al guardar datos de streaks:", error);
    });
  }
};

const getStreakTooltip = (tipo) => {
  const streak = streakData.value[tipo];
  const itemSingular = tipo === 'anuncios' ? 'anuncio' : 'fecha';
  const weekText = streak.current === 1 ? 'semana' : 'semanas';

  if (!streak.lastActivity || streak.current === 0) {
    return `Sin racha. Publica 1 ${itemSingular} cada semana (Lun-Dom) para mantener tu racha`;
  }

  const lastActivityDate = new Date(streak.lastActivity);
  if (isSameWeek(new Date(), lastActivityDate)) {
    return `🔥 ${streak.current} ${weekText} consecutivas - ✅ Ya cumpliste esta semana`;
  }

  const daysRemaining = getDaysUntilWeekEnd();
  const daysText = daysRemaining === 1 ? 'día' : 'días';

  if (daysRemaining > 0) {
    if (daysRemaining <= 2) {
      return `🔥 ${streak.current} ${weekText} consecutivas - ⚠️ ¡Solo ${daysRemaining} ${daysText} para publicar esta semana!`;
    }
    return `🔥 ${streak.current} ${weekText} consecutivas - ${daysRemaining} ${daysText} para publicar esta semana`;
  }
  return `💀 Racha perdida. Publica 1 ${itemSingular} para empezar de nuevo`;
};

const loadStreakData = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  try {
    const gameState = await usuarios.getGameState(user.uid);

    if (gameState && gameState.streaks) {
      streakData.value = {
        anuncios: { ...createEmptyStreak(), ...gameState.streaks.anuncios },
        fechas:   { ...createEmptyStreak(), ...gameState.streaks.fechas },
      };
    } else {
      streakData.value = {
        anuncios: createEmptyStreak(),
        fechas: createEmptyStreak()
      };
      localStorage.removeItem(`streakData_${user.uid}`);
    }

    checkWeeklyStatus();
  } catch (error) {
    console.error("Error al cargar datos de streaks:", error);
  }
};

const saveStreakData = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  try {
    const currentGameState = (await usuarios.getGameState(user.uid)) || {};
    await usuarios.updateGameState(user.uid, {
      ...currentGameState,
      streaks: streakData.value,
    });
    localStorage.setItem(`streakData_${user.uid}`, JSON.stringify(streakData.value));
  } catch (error) {
    console.error("Error al guardar datos de streaks:", error);
  }
};

const reportActivity = (tipo, fecha = new Date()) => {
  updateStreak(tipo, fecha);
};

const resetStreaks = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  streakData.value = {
    anuncios: createEmptyStreak(),
    fechas: createEmptyStreak()
  };
  localStorage.removeItem(`streakData_${user.uid}`);
  await saveStreakData();
};

const clearObsoleteLocalStorage = (currentUserId) => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('streakData_') && key !== `streakData_${currentUserId}`) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error al limpiar localStorage obsoleto:", error);
  }
};

const initializeUserData = async (user) => {
  if (user?.uid) {
    clearObsoleteLocalStorage(user.uid);
    await loadStreakData();
  }
};

defineExpose({
  reportActivity,
  loadStreakData,
  saveStreakData,
  resetStreaks,
  streakData,
});

const handleStreakActivityEvent = ({ tipo, fecha } = {}) => {
  if (tipo) reportActivity(tipo, fecha);
};

let unsubscribeStreakActivity = null;

onMounted(async () => {
  unsubscribeAuth = auth_api.onAuthStateChange(initializeUserData);
  await initializeUserData(auth_api.getCurrentUser());

  unsubscribeStreakActivity = subscribe('streakActivity', handleStreakActivityEvent);

  if (import.meta.env.DEV) {
    import("../lib/debug/streakDebug").then(({ installStreakDebug }) => {
      installStreakDebug({
        get streakData() { return streakData.value; },
        get currentUserId() { return auth_api.getCurrentUser()?.uid || null; },
        reportActivity,
        saveStreakData,
        loadStreakData,
        resetStreaks,
        checkWeeklyStatus,
        emitCheckAchievements: () => emit('checkStreakAchievements', streakData.value),
        getWeekStart,
        getDaysUntilWeekEnd,
        getDaysSinceLastActivity,
        isSameWeek,
      });
    });
  }
});

onBeforeUnmount(() => {
  if (unsubscribeAuth) unsubscribeAuth();
  if (unsubscribeStreakActivity) unsubscribeStreakActivity();
});
</script>

<style scoped>
.streak-indicator {
  transition: all 0.3s ease;
}

.streak-indicator:hover {
  transform: scale(1.05);
}
</style>
