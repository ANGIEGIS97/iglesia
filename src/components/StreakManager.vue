<template>
  <div class="flex items-center space-x-3">
    <!-- Streak de Anuncios -->
    <div class="flex items-center space-x-1">
      <div
        class="flex items-center space-x-1 text-xs font-medium"
        :title="getStreakTooltip('anuncios')"
      >
        <img 
          v-if="streakData.anuncios.weeklyGoalMet" 
          src="/svg/flama.svg" 
          alt="Streak activo" 
          class="w-4 h-4 filter-red"
        />
        <img 
          v-else 
          src="/svg/flama.svg" 
          alt="Streak inactivo" 
          class="w-4 h-4 filter-gray"
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
          v-if="streakData.fechas.weeklyGoalMet" 
          src="/svg/flama.svg" 
          alt="Streak activo" 
          class="w-4 h-4 filter-blue"
        />
        <img 
          v-else 
          src="/svg/flama.svg" 
          alt="Streak inactivo" 
          class="w-4 h-4 filter-gray"
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

const emit = defineEmits(['streakUpdate']);

// Estado de los streaks
const streakData = ref({
  anuncios: {
    current: 0,
    maxReached: 0, // Agregando máximo alcanzado
    lastActivity: null,
    weeklyGoalMet: false,
    lastWeekStart: null
  },
  fechas: {
    current: 0,
    maxReached: 0, // Agregando máximo alcanzado
    lastActivity: null,
    weeklyGoalMet: false,
    lastWeekStart: null
  }
});

let unsubscribeAuth = null;

// Función para obtener el inicio de la semana (lunes)
const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

// Función para verificar si es la misma semana
const isSameWeek = (date1, date2) => {
  if (!date1 || !date2) return false;
  const week1 = getWeekStart(new Date(date1));
  const week2 = getWeekStart(new Date(date2));
  return week1.getTime() === week2.getTime();
};

// Función para verificar si es la semana siguiente
const isNextWeek = (lastWeek, currentWeek) => {
  if (!lastWeek || !currentWeek) return false;
  const lastWeekDate = new Date(lastWeek);
  const nextWeek = new Date(lastWeekDate);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return getWeekStart(nextWeek).getTime() === getWeekStart(new Date(currentWeek)).getTime();
};

// Función para actualizar streak cuando hay actividad
const updateStreak = async (tipo, fecha = new Date()) => {
  const currentWeekStart = getWeekStart(fecha);
  const currentWeekStartString = currentWeekStart.toISOString();
  const fechaString = fecha.toISOString();

  const streak = streakData.value[tipo];
  
  // Si no hay actividad previa, inicializar
  if (!streak.lastActivity) {
    streak.current = 1;
    // Inicializar máximo alcanzado
    if (streak.maxReached === 0) {
      streak.maxReached = 1;
    }
    streak.lastActivity = fechaString;
    streak.weeklyGoalMet = true;
    streak.lastWeekStart = currentWeekStartString;
  } else {
    const lastActivityDate = new Date(streak.lastActivity);
    const lastWeekStart = streak.lastWeekStart ? new Date(streak.lastWeekStart) : getWeekStart(lastActivityDate);
    
    // Si es la misma semana, no cambiar el streak pero marcar como cumplido
    if (isSameWeek(fecha, lastActivityDate)) {
      streak.weeklyGoalMet = true;
      streak.lastActivity = fechaString; // Actualizar última actividad
    } 
    // Si es la semana siguiente consecutiva, incrementar streak
    else if (isNextWeek(lastWeekStart, currentWeekStart)) {
      streak.current += 1;
      // Actualizar máximo alcanzado si es necesario
      if (streak.current > streak.maxReached) {
        streak.maxReached = streak.current;
      }
      streak.weeklyGoalMet = true;
      streak.lastActivity = fechaString;
      streak.lastWeekStart = currentWeekStartString;
    }
    // Si hay un gap de más de una semana, resetear streak
    else {
      streak.current = 1;
      streak.weeklyGoalMet = true;
      streak.lastActivity = fechaString;
      streak.lastWeekStart = currentWeekStartString;
    }
  }

  // Guardar los datos actualizados
  await saveStreakData();
  emit('streakUpdate', { tipo, streak: { ...streak } });
};

// Función para verificar y actualizar el estado semanal
const checkWeeklyStatus = () => {
  const currentWeekStart = getWeekStart();
  
  ['anuncios', 'fechas'].forEach(tipo => {
    const streak = streakData.value[tipo];
    
    if (streak.lastActivity) {
      const lastActivityDate = new Date(streak.lastActivity);
      
      // Si la última actividad no fue esta semana, marcar como no cumplido
      if (!isSameWeek(currentWeekStart, lastActivityDate)) {
        streak.weeklyGoalMet = false;
        
        // Si pasó más de una semana sin actividad, resetear el streak
        const lastWeekStart = streak.lastWeekStart ? new Date(streak.lastWeekStart) : getWeekStart(lastActivityDate);
        if (!isNextWeek(lastWeekStart, currentWeekStart) && !isSameWeek(lastWeekStart, currentWeekStart)) {
          streak.current = 0;
        }
      }
    }
  });
};

// Función para obtener tooltip descriptivo
const getStreakTooltip = (tipo) => {
  const streak = streakData.value[tipo];
  const tipoDisplay = tipo === 'anuncios' ? 'anuncios' : 'fechas';
  
  if (streak.weeklyGoalMet) {
    return `¡Streak activo! ${streak.current} semana${streak.current !== 1 ? 's' : ''} consecutiva${streak.current !== 1 ? 's' : ''} creando ${tipoDisplay}`;
  } else {
    return `⚠️ Necesitas crear al menos 1 ${tipo === 'anuncios' ? 'anuncio' : 'fecha'} esta semana para mantener tu streak de ${streak.current} semana${streak.current !== 1 ? 's' : ''}`;
  }
};

// Función para cargar datos de streaks
const loadStreakData = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  try {
    // Intentar cargar desde Firestore
    const gameState = await usuarios.getGameState(user.uid);
    
    if (gameState && gameState.streaks) {
      // Hay datos en Firestore, cargarlos
      streakData.value = {
        anuncios: {
          current: gameState.streaks.anuncios?.current || 0,
          maxReached: gameState.streaks.anuncios?.maxReached || 0,
          lastActivity: gameState.streaks.anuncios?.lastActivity || null,
          weeklyGoalMet: gameState.streaks.anuncios?.weeklyGoalMet || false,
          lastWeekStart: gameState.streaks.anuncios?.lastWeekStart || null
        },
        fechas: {
          current: gameState.streaks.fechas?.current || 0,
          maxReached: gameState.streaks.fechas?.maxReached || 0,
          lastActivity: gameState.streaks.fechas?.lastActivity || null,
          weeklyGoalMet: gameState.streaks.fechas?.weeklyGoalMet || false,
          lastWeekStart: gameState.streaks.fechas?.lastWeekStart || null
        }
      };
    } else {
      // No hay datos en Firestore, inicializar desde cero
      console.log("No hay datos de streaks en Firestore, inicializando desde cero");
      streakData.value = {
        anuncios: {
          current: 0,
          maxReached: 0,
          lastActivity: null,
          weeklyGoalMet: false,
          lastWeekStart: null
        },
        fechas: {
          current: 0,
          maxReached: 0,
          lastActivity: null,
          weeklyGoalMet: false,
          lastWeekStart: null
        }
      };
      
      // Limpiar localStorage obsoleto para este usuario
      localStorage.removeItem(`streakData_${user.uid}`);
    }

    // Verificar estado semanal después de cargar
    checkWeeklyStatus();
    
  } catch (error) {
    console.error("Error al cargar datos de streaks:", error);
  }
};

// Función para guardar datos de streaks
const saveStreakData = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  try {
    // Obtener el estado actual del juego
    const currentGameState = await usuarios.getGameState(user.uid) || {};
    
    // Agregar los datos de streaks al estado del juego
    const updatedGameState = {
      ...currentGameState,
      streaks: streakData.value
    };

    // Guardar en Firestore
    await usuarios.updateGameState(user.uid, updatedGameState);
    
    // Guardar en localStorage como respaldo
    localStorage.setItem(`streakData_${user.uid}`, JSON.stringify(streakData.value));
    
  } catch (error) {
    console.error("Error al guardar datos de streaks:", error);
  }
};

// Función pública para reportar actividad desde otros componentes
const reportActivity = (tipo, fecha = new Date()) => {
  updateStreak(tipo, fecha);
};

// Función para resetear completamente los streaks
const resetStreaks = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  console.log("Reseteando streaks completamente");
  
  // Resetear el estado local
  streakData.value = {
    anuncios: {
      current: 0,
      maxReached: 0,
      lastActivity: null,
      weeklyGoalMet: false,
      lastWeekStart: null
    },
    fechas: {
      current: 0,
      maxReached: 0,
      lastActivity: null,
      weeklyGoalMet: false,
      lastWeekStart: null
    }
  };

  // Limpiar localStorage
  localStorage.removeItem(`streakData_${user.uid}`);

  // Guardar estado limpio en Firestore
  await saveStreakData();
};

// Función para limpiar datos obsoletos de localStorage
const clearObsoleteLocalStorage = (currentUserId) => {
  try {
    // Obtener todas las claves del localStorage
    const keys = Object.keys(localStorage);
    
    // Filtrar y eliminar datos de streaks de otros usuarios o obsoletos
    keys.forEach(key => {
      if (key.startsWith('streakData_') && key !== `streakData_${currentUserId}`) {
        localStorage.removeItem(key);
        console.log(`Eliminado localStorage obsoleto: ${key}`);
      }
    });
  } catch (error) {
    console.error("Error al limpiar localStorage obsoleto:", error);
  }
};

// Exponer funciones para uso externo
defineExpose({
  reportActivity,
  loadStreakData,
  saveStreakData,
  resetStreaks,
  streakData
});

// Configurar event listeners
onMounted(async () => {
  // Suscribirse a cambios de autenticación
  unsubscribeAuth = auth_api.onAuthStateChange(async (user) => {
    if (user) {
      // Limpiar localStorage obsoleto
      clearObsoleteLocalStorage(user.uid);
      // Cargar datos de streaks
      await loadStreakData();
    }
  });

  // Cargar datos si ya hay usuario autenticado
  const currentUser = auth_api.getCurrentUser();
  if (currentUser) {
    // Limpiar localStorage obsoleto
    clearObsoleteLocalStorage(currentUser.uid);
    // Cargar datos de streaks
    await loadStreakData();
  }

  // Configurar listeners para actividad de streaks
  window.addEventListener('streakActivity', (event) => {
    const { tipo, fecha } = event.detail;
    reportActivity(tipo, fecha);
  });
});

onBeforeUnmount(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth();
  }
  
  // Limpiar event listeners
  window.removeEventListener('streakActivity', () => {});
});
</script>

<style scoped>
/* Animaciones para los indicadores */
.streak-indicator {
  transition: all 0.3s ease;
}

.streak-indicator:hover {
  transform: scale(1.05);
}

/* Filtros para colorear los SVG */
.filter-red {
  filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}

.filter-blue {
  filter: brightness(0) saturate(100%) invert(26%) sepia(81%) saturate(2851%) hue-rotate(206deg) brightness(102%) contrast(103%);
}

.filter-gray {
  filter: brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(100%);
}
</style> 