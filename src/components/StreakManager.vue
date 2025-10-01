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

const emit = defineEmits(['streakUpdate', 'checkStreakAchievements']);

// Función helper para crear estructura de streak vacía
const createEmptyStreak = () => ({
  current: 0,
  maxReached: 0,
  lastActivity: null,
  lastWeekStart: null,
  weeklyGoalMet: false
});

// Estado de los streaks
const streakData = ref({
  anuncios: createEmptyStreak(),
  fechas: createEmptyStreak()
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

// Función para calcular días desde la última actividad
const getDaysSinceLastActivity = (lastActivity) => {
  if (!lastActivity) return null;
  const now = new Date();
  const lastDate = new Date(lastActivity);
  const diffMs = now.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Función para obtener el fin de la semana (domingo 23:59:59)
const getWeekEnd = (date = new Date()) => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6); // Domingo de la semana actual
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

// Función para calcular días restantes hasta el fin de la semana actual
const getDaysUntilWeekEnd = () => {
  const now = new Date();
  const weekEnd = getWeekEnd(now);
  const diffMs = weekEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
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

/**
 * Actualizar streak cuando hay actividad
 * 
 * LÓGICA DE RACHA SEMANAL (BASADA EN SEMANAS DE CALENDARIO):
 * - Primera publicación → Streak = 1 (primera semana)
 * - Publicar en la misma semana → No incrementa (ya ganaste esta semana)
 * - Publicar en la siguiente semana consecutiva → Streak += 1 (nueva semana ganada)
 * - Saltar una semana completa sin publicar → Streak = 1 (racha perdida)
 * 
 * Una semana = de Lunes a Domingo
 * Solo se puede ganar 1 racha por semana de calendario.
 */
const updateStreak = async (tipo, fecha = new Date()) => {
  const currentWeekStart = getWeekStart(fecha);
  const fechaString = fecha.toISOString();
  const streak = streakData.value[tipo];
  
  // Si no hay actividad previa, inicializar con 1 semana
  if (!streak.lastActivity) {
    streak.current = 1;
    if (streak.maxReached === 0) {
      streak.maxReached = 1;
    }
    streak.lastActivity = fechaString;
    streak.lastWeekStart = currentWeekStart.toISOString();
    streak.weeklyGoalMet = true;
  } else {
    const lastActivityDate = new Date(streak.lastActivity);
    const lastWeekStart = streak.lastWeekStart ? new Date(streak.lastWeekStart) : getWeekStart(lastActivityDate);
    
    // Misma semana: Solo actualizar timestamp, NO incrementar (ya ganaste esta semana)
    if (isSameWeek(fecha, lastActivityDate)) {
      streak.lastActivity = fechaString;
      streak.weeklyGoalMet = true;
    } 
    // Semana siguiente consecutiva: GANA UNA SEMANA (+1 al streak)
    else if (isNextWeek(lastWeekStart, currentWeekStart)) {
      streak.current += 1;
      if (streak.current > streak.maxReached) {
        streak.maxReached = streak.current;
      }
      streak.weeklyGoalMet = true;
      streak.lastActivity = fechaString;
      streak.lastWeekStart = currentWeekStart.toISOString();
    }
    // Más de una semana sin actividad: PIERDE LA RACHA (resetea a 1)
    else {
      streak.current = 1;
      streak.weeklyGoalMet = true;
      streak.lastActivity = fechaString;
      streak.lastWeekStart = currentWeekStart.toISOString();
    }
  }

  // Guardar los datos actualizados
  await saveStreakData();
  emit('streakUpdate', { tipo, streak: { ...streak } });
  
  // Emitir evento para verificar logros con todos los datos de streaks
  emit('checkStreakAchievements', streakData.value);
};

// Función para verificar y actualizar el estado del streak
const checkWeeklyStatus = () => {
  const currentWeekStart = getWeekStart();
  let updated = false;

  ['anuncios', 'fechas'].forEach((tipo) => {
    const streak = streakData.value[tipo];
    let tipoUpdated = false;

    if (streak.lastActivity) {
      const lastActivityDate = new Date(streak.lastActivity);
      const lastWeekStart = streak.lastWeekStart ? new Date(streak.lastWeekStart) : getWeekStart(lastActivityDate);

      // Si la actividad fue en la semana actual, mantener goal como cumplido
      if (isSameWeek(currentWeekStart, lastActivityDate)) {
        if (!streak.weeklyGoalMet) {
          streak.weeklyGoalMet = true;
          updated = true;
          tipoUpdated = true;
        }
      } 
      // Si la actividad fue en la semana anterior (consecutiva), mantener streak pero marcar como pendiente
      else if (isNextWeek(lastWeekStart, currentWeekStart)) {
        // El usuario está en la semana siguiente, aún puede publicar para mantener streak
        if (streak.weeklyGoalMet) {
          streak.weeklyGoalMet = false;
          updated = true;
          tipoUpdated = true;
        }
      }
      // Si pasó más de una semana sin actividad, resetear el streak
      else {
        streak.weeklyGoalMet = false;
        if (streak.current !== 0) {
          streak.current = 0;
          updated = true;
          tipoUpdated = true;
        }
      }
    }

    // Notificar a contenedor si hubo cambios para este tipo
    if (tipoUpdated) {
      emit('streakUpdate', { tipo, streak: { ...streak } });
    }
  });

  // Persistir cambios si hubo actualizaciones
  if (updated) {
    saveStreakData().then(() => {
      console.log("Datos de streaks actualizados y guardados en Firestore");
    }).catch(error => {
      console.error("Error al guardar datos de streaks:", error);
    });
  }
};

// Función para obtener tooltip descriptivo
const getStreakTooltip = (tipo) => {
  const streak = streakData.value[tipo];
  const tipoDisplay = tipo === 'anuncios' ? 'anuncios' : 'fechas';
  const itemSingular = tipo === 'anuncios' ? 'anuncio' : 'fecha';
  const weekText = streak.current === 1 ? 'semana' : 'semanas';
  if (!streak.lastActivity || streak.current === 0) {
    return `Sin racha. Publica 1 ${itemSingular} cada semana (Lun-Dom) para mantener tu racha`;
  }
  
  const now = new Date();
  const lastActivityDate = new Date(streak.lastActivity);
  
  // Si ya publicó esta semana, mostrar que la semana está cumplida
  if (isSameWeek(now, lastActivityDate)) {
    return `🔥 ${streak.current} ${weekText} consecutivas - ✅ Ya cumpliste esta semana`;
  }
  
  // Si no ha publicado esta semana, mostrar días restantes para publicar
  const daysRemaining = getDaysUntilWeekEnd();
  const daysText = daysRemaining === 1 ? 'día' : 'días';
  
  if (daysRemaining > 0) {
    if (daysRemaining <= 2) {
      return `🔥 ${streak.current} ${weekText} consecutivas - ⚠️ ¡Solo ${daysRemaining} ${daysText} para publicar esta semana!`;
    } else {
      return `🔥 ${streak.current} ${weekText} consecutivas - ${daysRemaining} ${daysText} para publicar esta semana`;
    }
  } else {
    return `💀 Racha perdida. Publica 1 ${itemSingular} para empezar de nuevo`;
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
          lastWeekStart: gameState.streaks.anuncios?.lastWeekStart || null,
          weeklyGoalMet: gameState.streaks.anuncios?.weeklyGoalMet || false
        },
        fechas: {
          current: gameState.streaks.fechas?.current || 0,
          maxReached: gameState.streaks.fechas?.maxReached || 0,
          lastActivity: gameState.streaks.fechas?.lastActivity || null,
          lastWeekStart: gameState.streaks.fechas?.lastWeekStart || null,
          weeklyGoalMet: gameState.streaks.fechas?.weeklyGoalMet || false
        }
      };
    } else {
      // No hay datos en Firestore, inicializar desde cero
      console.log("No hay datos de streaks en Firestore, inicializando desde cero");
      streakData.value = {
        anuncios: createEmptyStreak(),
        fechas: createEmptyStreak()
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
    anuncios: createEmptyStreak(),
    fechas: createEmptyStreak()
  };

  // Limpiar localStorage
  localStorage.removeItem(`streakData_${user.uid}`);

  // Guardar estado limpio en Firestore
  await saveStreakData();
};

// =====================================================
// COMANDOS DE DEBUGGING
// =====================================================

// Debug: Mostrar estado completo de streaks
const debugShowStreaks = () => {
  console.group("🔥 ESTADO ACTUAL DE STREAKS");
  console.log("📊 Datos completos:", JSON.parse(JSON.stringify(streakData.value)));
  
  ['anuncios', 'fechas'].forEach(tipo => {
    const streak = streakData.value[tipo];
    console.group(`📈 ${tipo.toUpperCase()}`);
    console.log(`Current: ${streak.current}`);
    console.log(`Max Reached: ${streak.maxReached}`);
    console.log(`Weekly Goal Met: ${streak.weeklyGoalMet ? '✅' : '❌'}`);
    console.log(`Last Activity: ${streak.lastActivity ? new Date(streak.lastActivity).toLocaleString() : 'Nunca'}`);
    console.log(`Last Week Start: ${streak.lastWeekStart ? new Date(streak.lastWeekStart).toLocaleString() : 'N/A'}`);
    console.groupEnd();
  });
  
  console.groupEnd();
};

// Debug: Simular actividad de streak
const debugSimulateActivity = (tipo, fechaOffset = 0) => {
  if (!['anuncios', 'fechas'].includes(tipo)) {
    console.error("❌ Tipo debe ser 'anuncios' o 'fechas'");
    return;
  }
  
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + fechaOffset);
  
  console.log(`🎮 Simulando actividad de ${tipo} para fecha: ${fecha.toLocaleString()}`);
  reportActivity(tipo, fecha);
};

// Debug: Información detallada de fechas y streaks
const debugWeekInfo = () => {
  const now = new Date();
  
  console.group("📅 INFORMACIÓN DE STREAKS");
  console.log(`Fecha actual: ${now.toLocaleString()}`);
  console.log(`Día de la semana (0=Domingo): ${now.getDay()}`);
  
  ['anuncios', 'fechas'].forEach(tipo => {
    const streak = streakData.value[tipo];
    console.group(`\n📊 ${tipo.toUpperCase()}`);
    console.log(`Streak actual: ${streak.current} semanas`);
    console.log(`Máximo alcanzado: ${streak.maxReached} semanas`);
    console.log(`Estado: ${streak.weeklyGoalMet ? '✅ Activo' : '❌ Inactivo'}`);
    
    if (streak.lastActivity) {
      const lastDate = new Date(streak.lastActivity);
      const daysSince = getDaysSinceLastActivity(streak.lastActivity);
      const daysUntilWeekEnd = getDaysUntilWeekEnd();
      
      console.log(`Última actividad: ${lastDate.toLocaleString()}`);
      console.log(`Días desde última actividad: ${daysSince}`);
      console.log(`Días hasta fin de semana: ${daysUntilWeekEnd}`);
      console.log(`Estado del streak: ${streak.weeklyGoalMet ? '🔥 ACTIVO' : '⚠️ PENDIENTE'}`);
    } else {
      console.log(`Sin actividad registrada`);
    }
    console.groupEnd();
  });
  
  console.groupEnd();
};

// Debug: Forzar estado específico de streak
const debugSetStreak = (tipo, current, weeksAgo = 0) => {
  if (!['anuncios', 'fechas'].includes(tipo)) {
    console.error("❌ Tipo debe ser 'anuncios' o 'fechas'");
    return;
  }
  
  const lastActivityDate = new Date();
  lastActivityDate.setDate(lastActivityDate.getDate() - (weeksAgo * 7));
  const lastWeekStart = getWeekStart(lastActivityDate);
  
  console.log(`🔧 Estableciendo ${tipo} streak a ${current} semanas, última actividad hace ${weeksAgo} semanas`);
  
  const streak = streakData.value[tipo];
  streak.current = current;
  streak.lastActivity = lastActivityDate.toISOString();
  streak.lastWeekStart = lastWeekStart.toISOString();
  streak.weeklyGoalMet = weeksAgo === 0;
  
  if (current > streak.maxReached) {
    streak.maxReached = current;
  }
  
  saveStreakData();
  
  const now = new Date();
  if (isSameWeek(now, lastActivityDate)) {
    console.log(`✅ Ya publicó esta semana - Semana cumplida`);
  } else {
    console.log(`⚠️ Faltan ${getDaysUntilWeekEnd()} días para fin de semana`);
  }
};

// Debug: Verificar estado semanal manualmente
const debugCheckWeeklyStatus = () => {
  console.log("🔍 Verificando estado semanal...");
  checkWeeklyStatus();
  debugShowStreaks();
};

// Debug: Limpiar todos los datos (localStorage + Firestore)
const debugClearAllData = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) {
    console.error("❌ No hay usuario autenticado");
    return;
  }
  
  console.warn("🗑️ LIMPIANDO TODOS LOS DATOS DE STREAKS");
  
  // Limpiar localStorage
  localStorage.removeItem(`streakData_${user.uid}`);
  console.log("✅ localStorage limpiado");
  
  // Resetear estado local
  await resetStreaks();
  console.log("✅ Estado local reseteado");
  
  console.log("🔄 Recargando datos...");
  await loadStreakData();
  debugShowStreaks();
};

// Debug: Simular paso del tiempo (cambiar todas las fechas)
const debugTimeTravel = (daysOffset) => {
  console.log(`⏰ Viajando en el tiempo ${daysOffset} días...`);
  
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + daysOffset);
  
  ['anuncios', 'fechas'].forEach(tipo => {
    const streak = streakData.value[tipo];
    if (streak.lastActivity) {
      const lastDate = new Date(streak.lastActivity);
      lastDate.setDate(lastDate.getDate() + daysOffset);
      streak.lastActivity = lastDate.toISOString();
      
    if (streak.lastWeekStart) {
      const lastWeekDate = new Date(streak.lastWeekStart);
      lastWeekDate.setDate(lastWeekDate.getDate() + daysOffset);
      streak.lastWeekStart = lastWeekDate.toISOString();
      }
    }
  });
  
  checkWeeklyStatus();
  console.log(`📅 Nueva fecha simulada: ${newDate.toLocaleString()}`);
  debugShowStreaks();
};

// Debug: Exportar datos de streaks
const debugExportData = () => {
  const data = {
    streaks: streakData.value,
    timestamp: new Date().toISOString(),
    user: auth_api.getCurrentUser()?.uid || 'anonymous'
  };
  
  console.log("📤 DATOS DE EXPORTACIÓN:");
  console.log(JSON.stringify(data, null, 2));
  
  // Copiar al clipboard si está disponible
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    console.log("📋 Datos copiados al clipboard");
  }
  
  return data;
};

// Debug: Importar datos de streaks
const debugImportData = (data) => {
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (parsedData.streaks) {
      console.log("📥 Importando datos de streaks...");
      streakData.value = parsedData.streaks;
      saveStreakData();
      console.log("✅ Datos importados exitosamente");
      debugShowStreaks();
    } else {
      console.error("❌ Formato de datos inválido");
    }
  } catch (error) {
    console.error("❌ Error al importar datos:", error);
  }
};

// Debug: Testear logros de streaks manualmente
const debugTestStreakAchievements = () => {
  console.log("🏆 Testeando logros de streaks con datos actuales...");
  console.log("Datos actuales:", JSON.parse(JSON.stringify(streakData.value)));
  emit('checkStreakAchievements', streakData.value);
  console.log("✅ Verificación de logros completada");
};

// Debug: Configurar streaks para testing de logros
const debugSetupStreakTest = (anunciosWeeks = 0, fechasWeeks = 0, weeksAgo = 0) => {
  console.log(`🧪 Configurando streaks para testing: Anuncios=${anunciosWeeks}, Fechas=${fechasWeeks}, Hace ${weeksAgo} semanas`);
  
  const lastActivityDate = new Date();
  lastActivityDate.setDate(lastActivityDate.getDate() - (weeksAgo * 7));
  const lastWeekStart = getWeekStart(lastActivityDate);
  const now = new Date();
  
  // Configurar streak de anuncios
  streakData.value.anuncios.current = anunciosWeeks;
  streakData.value.anuncios.maxReached = Math.max(streakData.value.anuncios.maxReached, anunciosWeeks);
  streakData.value.anuncios.weeklyGoalMet = weeksAgo === 0 && anunciosWeeks > 0;
  streakData.value.anuncios.lastActivity = anunciosWeeks > 0 ? lastActivityDate.toISOString() : null;
  streakData.value.anuncios.lastWeekStart = anunciosWeeks > 0 ? lastWeekStart.toISOString() : null;
  
  // Configurar streak de fechas
  streakData.value.fechas.current = fechasWeeks;
  streakData.value.fechas.maxReached = Math.max(streakData.value.fechas.maxReached, fechasWeeks);
  streakData.value.fechas.weeklyGoalMet = weeksAgo === 0 && fechasWeeks > 0;
  streakData.value.fechas.lastActivity = fechasWeeks > 0 ? lastActivityDate.toISOString() : null;
  streakData.value.fechas.lastWeekStart = fechasWeeks > 0 ? lastWeekStart.toISOString() : null;
  
  // Guardar y verificar logros
  saveStreakData();
  emit('checkStreakAchievements', streakData.value);
  
  console.log("✅ Configuración aplicada y logros verificados");
  debugShowStreaks();
};

// Registrar comandos globales en window para acceso desde consola
const registerDebugCommands = () => {
  if (typeof window !== 'undefined') {
    window.streakDebug = {
      show: debugShowStreaks,
      simulate: debugSimulateActivity,
      weekInfo: debugWeekInfo,
      setStreak: debugSetStreak,
      checkWeekly: debugCheckWeeklyStatus,
      clearAll: debugClearAllData,
      timeTravel: debugTimeTravel,
      export: debugExportData,
      import: debugImportData,
      reset: resetStreaks,
      testAchievements: debugTestStreakAchievements,
      setupTest: debugSetupStreakTest,
      help: () => {
        console.group("🔥 COMANDOS DE DEBUG DISPONIBLES");
        console.log("streakDebug.show() - Mostrar estado actual");
        console.log("streakDebug.simulate(tipo, diasOffset) - Simular actividad");
        console.log("streakDebug.weekInfo() - Info detallada de streaks");
        console.log("streakDebug.setStreak(tipo, semanas, semanasAtras) - Establecer streak");
        console.log("  Ejemplo: streakDebug.setStreak('anuncios', 3, 1) = 3 semanas, hace 1 semana");
        console.log("streakDebug.checkWeekly() - Verificar estado de streaks");
        console.log("streakDebug.clearAll() - Limpiar todos los datos");
        console.log("streakDebug.timeTravel(dias) - Viajar en el tiempo");
        console.log("streakDebug.export() - Exportar datos");
        console.log("streakDebug.import(data) - Importar datos");
        console.log("streakDebug.reset() - Resetear streaks");
        console.log("streakDebug.testAchievements() - Testear logros de streaks");
        console.log("streakDebug.setupTest(anuncios, fechas, semanasAtras) - Configurar streaks");
        console.log("  Ejemplo: streakDebug.setupTest(3, 2, 1) = Anuncios: 3 sem, Fechas: 2 sem, hace 1 semana");
        console.groupEnd();
        console.log("💡 Tip: Usa streakDebug.help() para ver esta ayuda");
        console.log("📅 Nota: Los streaks se basan en semanas de calendario (Lunes-Domingo)");
      }
    };
    
    console.log("🔧 Comandos de debug registrados en window.streakDebug");
    console.log("💡 Usa streakDebug.help() para ver todos los comandos disponibles");
  }
};

// =====================================================
// FIN COMANDOS DE DEBUGGING
// =====================================================

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
  streakData,
  // Comandos de debugging
  debugShowStreaks,
  debugSimulateActivity,
  debugWeekInfo,
  debugSetStreak,
  debugCheckWeeklyStatus,
  debugClearAllData,
  debugTimeTravel,
  debugExportData,
  debugImportData,
  debugTestStreakAchievements,
  debugSetupStreakTest
});

// Función helper para inicializar datos de usuario
const initializeUserData = async (user) => {
  if (user?.uid) {
    clearObsoleteLocalStorage(user.uid);
    await loadStreakData();
  }
};

// Configurar event listeners
onMounted(async () => {
  // Registrar comandos de debugging globalmente
  registerDebugCommands();
  
  // Suscribirse a cambios de autenticación
  unsubscribeAuth = auth_api.onAuthStateChange(initializeUserData);

  // Cargar datos si ya hay usuario autenticado
  await initializeUserData(auth_api.getCurrentUser());

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