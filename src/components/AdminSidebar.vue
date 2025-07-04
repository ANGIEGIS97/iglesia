<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity touch-none"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed right-0 top-0 h-full w-72 shadow-lg z-50',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        isDarkMode
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white'
          : 'bg-gradient-to-b from-white to-gray-100 text-gray-800',
      ]"
    >
      <div class="py-4 h-full flex flex-col overflow-y-auto">
        <div class="flex justify-between items-center mb-3 px-2">
          <h2 class="text-xl font-bold flex items-center px-3">Administración</h2>
          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg transition-colors"
            :class="
              isDarkMode
                ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'
            "
          >
            <i class="fas fa-times w-6 h-6"></i>
          </button>
        </div>

        <!-- Perfil del Usuario con Nivel y XP -->
        <div
          class="mb-2 p-4  border backdrop-blur-sm"
          :class="
            isDarkMode
              ? 'bg-gray-700/50 border-gray-600/50'
              : 'bg-white/80 border-gray-200'
          "
        >
          <div class="flex items-center mb-3 relative px-1">
            <!-- Botón de apagado en la esquina superior derecha -->
            <button
              @click="handleLogout"
              class="absolute -top-2 -right-2 p-2 rounded-full transition-colors"
              :class="
                isDarkMode
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-red-500 hover:text-red-600'
              "
              title="Cerrar sesión"
            >
              <i class="fas fa-power-off w-5 h-5"></i>
            </button>

            <div
              class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg relative"
              :style="{ backgroundColor: getUserColor(displayName) }"
            >
              {{ getUserInitial(displayName) }}
              <div
                class="absolute -bottom-1 -right-1 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2"
                :class="{
                  'bg-amber-500 text-amber-950 ': userRank === 1,
                  'bg-gray-400 text-gray-950': userRank === 2,
                  'bg-yellow-500 text-yellow-950': userRank === 3,
                  'bg-blue-500 text-blue-950 ': userRank === 4,
                  'bg-purple-500 text-purple-950 ': userRank === 5,
                  'border-gray-800': isDarkMode,
                  'border-white': !isDarkMode,
                }"
              >
                {{ userLevel }}
              </div>
            </div>
            <div class="flex-1 ml-3">
              <h3 class="text-sm font-medium flex items-center">
                {{ displayName || "Usuario" }}
              </h3>
              <div class="text-[10px] flex items-center gap-1 mt-1">
                <!-- Rango en pill -->
                <span
                  v-if="userRank > 0"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium"
                  :class="{
                    'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100':
                      userRank === 1,
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200':
                      userRank === 2,
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100':
                      userRank === 3,
                    'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100':
                      userRank === 4,
                    'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100':
                      userRank === 5,
                  }"
                >
                  <i class="fas fa-star text-[8px] mr-0.5"></i>
                  {{ currentRankName }}
                </span>
                <!-- Nivel en pill -->
                <span
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium"
                  :class="{
                    'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100':
                      userRank === 1,
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200':
                      userRank === 2,
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100':
                      userRank === 3,
                    'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100':
                      userRank === 4,
                    'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100':
                      userRank === 5,
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-2.5 w-2.5 mr-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  Nivel {{ userLevel }}
                </span>
              </div>
              <button
                @click="openProfileModal"
                class="text-xs mt-1"
                :class="
                  isDarkMode
                    ? 'text-teal-400 hover:text-teal-300'
                    : 'text-teal-600 hover:text-teal-700'
                "
              >
                Editar perfil
              </button>
            </div>
          </div>

          <!-- XP Progress Bar -->
          <div
            class="w-full rounded-full h-2.5 mb-1"
            :class="isDarkMode ? 'bg-gray-600' : 'bg-gray-200'"
          >
            <div
              class="bg-teal-500 h-2.5 rounded-full"
              :style="{ width: `${xpPercentage}%` }"
            ></div>
          </div>
          <div
            class="flex justify-between text-xs"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            <span>XP: {{ userXp }}/{{ xpForNextLevel }}</span>
            <span>{{ xpPercentage }}%</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div>
          <!-- Tabs Header -->
          <div class="relative">
            <div 
              class="flex border-b-2 border-transparent relative"
              :class="isDarkMode ? 'border-gray-600' : 'border-gray-200'"
            >
              <!-- Indicador de tab activo animado -->
              <div
                class="absolute bottom-0 h-0.5 transition-all duration-300 ease-out"
                :class="[
                  activeTab === 'admin'
                    ? isDarkMode
                      ? 'bg-teal-500'
                      : 'bg-teal-600'
                    : activeTab === 'profile'
                    ? isDarkMode
                      ? 'bg-teal-500'
                      : 'bg-teal-600'
                    : ''
                ]"
                :style="{
                  width: '50%',
                  left: activeTab === 'admin' ? '0%' : '50%'
                }"
              ></div>
              
              <button
                @click="activeTab = 'admin'"
                :class="[
                  'flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative border-b-2',
                  activeTab === 'admin'
                    ? isDarkMode
                      ? 'text-teal-400 border-transparent bg-gradient-to-t from-teal-500/30 to-transparent'
                      : 'text-teal-600 border-transparent bg-gradient-to-t from-teal-200/40 to-transparent'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30 border-transparent'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                ]"
              >
                <span class="relative">Gestión</span>
              </button>
              <button
                @click="activeTab = 'profile'"
                :class="[
                  'flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative border-b-2',
                  activeTab === 'profile'
                    ? isDarkMode
                      ? 'text-teal-400 border-transparent bg-gradient-to-t from-teal-500/30 to-transparent'
                      : 'text-teal-600 border-transparent bg-gradient-to-t from-teal-200/40 to-transparent'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30 border-transparent'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                ]"
              >
                <span class="relative">Logros ({{ unlockedAchievementsCount }}/{{ totalAchievementsCount }})</span>
              </button>
            </div>
          </div>

          <!-- Tab Content Container -->
          <div 
            class="border-t-0 backdrop-blur-sm mt-0 pt-1"
            :class="isDarkMode 
              ? 'border-gray-600/50' 
              : 'bg-white/50 border-gray-200/50'"
          >
            <!-- Tab Content: Administración -->
            <div v-show="activeTab === 'admin'" class="space-y-1">
            <a
              href="/admin/eventos"
              @click.prevent="handleNavigation('/admin/eventos')"
              :class="[
                'flex items-center px-6 py-[10px] transition-all duration-200 border-l-4',
                currentPath === '/admin/eventos'
                  ? isDarkMode
                    ? 'bg-teal-500/20 text-teal-400 border-teal-500'
                    : 'bg-teal-50 text-teal-600 border-teal-500'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
              ]"
            >
              <i
                class="fas fa-calendar-alt w-5 h-5 mr-3"
                :class="
                  currentPath === '/admin/eventos'
                    ? isDarkMode
                      ? 'text-teal-400'
                      : 'text-teal-600'
                    : ''
                "
              ></i>
              <span>Administrar Anuncios</span>
            </a>

            <a
              href="/admin/fechas"
              @click.prevent="handleNavigation('/admin/fechas')"
              :class="[
                'flex items-center px-6 py-[10px] transition-all duration-200 border-l-4',
                currentPath === '/admin/fechas'
                  ? isDarkMode
                    ? 'bg-teal-500/20 text-teal-400 border-teal-500'
                    : 'bg-teal-50 text-teal-600 border-teal-500'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
              ]"
            >
              <i
                class="fas fa-clock w-5 h-5 mr-3"
                :class="
                  currentPath === '/admin/fechas'
                    ? isDarkMode
                      ? 'text-teal-400'
                      : 'text-teal-600'
                    : ''
                "
              ></i>
              <span>Administrar Fechas</span>
            </a>

            <!-- Ranking button -->
            <a
              href="/admin/ranking"
              @click.prevent="handleNavigation('/admin/ranking')"
              :class="[
                'flex items-center px-6 py-[10px] transition-all duration-200 border-l-4',
                currentPath === '/admin/ranking'
                  ? isDarkMode
                    ? 'bg-teal-500/20 text-teal-400 border-teal-500'
                    : 'bg-teal-50 text-teal-600 border-teal-500'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
              ]"
            >
              <i
                class="fas fa-crown w-5 h-5 mr-3"
                :class="
                  currentPath === '/admin/ranking'
                    ? isDarkMode
                      ? 'text-teal-400'
                      : 'text-teal-600'
                    : ''
                "
              ></i>
              <span>Ranking Global</span>
            </a>

            <button
              @click="openChangePassword"
              :class="[
                'flex items-center w-full px-6 py-[10px] text-left transition-all duration-200 border-l-4 border-transparent',
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              ]"
            >
              <i class="fas fa-key w-5 h-5 mr-3"></i>
              <span>Cambiar Contraseña</span>
            </button>

            <!-- Contador de Estadísticas -->
            <ContadorEstadisticas :darkMode="isDarkMode" />
            </div>

            <!-- Tab Content: Perfil -->
            <div v-show="activeTab === 'profile'" class="space-y-1">
              <!-- Componente Logros -->
              <Logros
                ref="logrosRef"
                :darkMode="isDarkMode"
                :userRank="userRank"
                @achievement-unlocked="handleAchievementUnlocked"
                @xp-awarded="awardXp"
              />
            </div>
          </div>
        </div>

        <div class="flex-grow"></div>
      </div>
    </div>

    <!-- Modal de Cambio de Contraseña -->
    <CambioContrasena
      ref="cambioContrasenaRef"
      @password-changed="awardXp(20)"
    />

    <!-- Modal de Perfil -->
    <ProfileModal
      :is-open="showProfileModal"
      :current-display-name="displayName"
      @close="showProfileModal = false"
      @update="handleProfileUpdate"
    />

    <!-- Notificación de Nivel Subido -->
    <div
      v-if="showLevelUp"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-10/12 max-w-md bg-gray-800 text-white p-2 rounded-full shadow-lg flex items-center space-x-3 z-50 sm:w-auto sm:pr-8 sm:py-2"
    >
      <div
        class="w-14 h-14 rounded-full flex items-center justify-center font-bold"
        :class="{
          'bg-amber-500 text-amber-950': userRank === 1, // Bronce
          'bg-gray-400 text-gray-950': userRank === 2, // Plata
          'bg-yellow-500 text-yellow-950': userRank === 3, // Oro
          'bg-blue-500 text-blue-950': userRank === 4, // Diamante
          'bg-purple-500 text-purple-950': userRank === 5, // Platino
          'bg-yellow-500 text-gray-900': userRank > 5 || userRank < 1, // Fallback
        }"
      >
        {{ userLevel }}
      </div>
      <div>
        <p class="font-semibold">¡Nivel Subido 🎉!</p>
        <p class="text-sm">Has alcanzado el nivel {{ userLevel }}</p>
      </div>
    </div>

    <!-- Notificación de Rango Subido -->
    <div
      v-if="showRankUp"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-10/12 max-w-md bg-gray-800 text-white p-2 rounded-full shadow-lg flex items-center space-x-3 z-50 sm:w-auto sm:pr-8 sm:py-2"
    >
      <div class="w-14 h-14 relative">
        <i
          class="fas fa-star text-4xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          :class="{
            'text-amber-400': userRank === 1, // Bronce
            'text-gray-400': userRank === 2, // Plata
            'text-yellow-400': userRank === 3, // Oro
            'text-blue-400': userRank === 4, // Diamante
            'text-purple-400': userRank === 5, // Platino
            'text-yellow-400': userRank > 5 || userRank < 1, // Fallback
          }"
        ></i>
        <span
          class="absolute inset-0 flex items-center justify-center text-base font-bold text-black"
          >{{ userRank }}</span
        >
      </div>
      <div>
        <p class="font-semibold">¡Rango Subido 🏆!</p>
        <p class="text-sm">Has alcanzado el rango de {{ currentRankName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import CambioContrasena from "./CambioContrasena.vue";
import ProfileModal from "./ProfileModal.vue";
import { auth_api, usuarios } from "../lib/api.ts";
import ContadorEstadisticas from "./ContadorEstadisticas.vue";
import Logros from "./Logros.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  darkMode: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);
const currentPath = ref("");
const cambioContrasenaRef = ref(null);
const displayName = ref("");
const showProfileModal = ref(false);
const logrosRef = ref(null);
const activeTab = ref('admin'); // Estado para controlar qué tab está activo
let unsubscribeAuth = null;
let unsubscribeProfile = null;

// Nueva propiedad computada para contar logros desbloqueados
const unlockedAchievementsCount = computed(() => {
  if (logrosRef.value && logrosRef.value.achievements) {
    return logrosRef.value.achievements.filter((ach) => ach.unlocked).length;
  }
  return 0;
});

// Nueva propiedad computada para el total de logros
const totalAchievementsCount = computed(() => {
  if (logrosRef.value && logrosRef.value.achievements) {
    return logrosRef.value.achievements.length;
  }
  return 0;
});

// Theme state
const isDarkMode = computed(() => props.darkMode);

// Gamification state
const userXp = ref(0);
const userLevel = ref(1);
const userRank = ref(1); // Iniciar con rango Bronce (1)
const rankNames = ["Bronce", "Plata", "Oro", "Diamante", "Platino"];
const xpForNextLevel = computed(() => userLevel.value * 100);
const xpPercentage = computed(() =>
  Math.min(100, Math.floor((userXp.value / xpForNextLevel.value) * 100))
);
const loginStreak = ref(0);
const showLevelUp = ref(false);
const showRankUp = ref(false);

// Obtener el nombre del rango actual
const currentRankName = computed(() => {
  // Ajustar el índice para acceder al array (restar 1 porque los rangos empiezan en 1 pero los arrays en 0)
  const rankIndex = Math.max(0, userRank.value - 1);
  return rankNames[Math.min(rankIndex, rankNames.length - 1)];
});

// Función para obtener la inicial del nombre de usuario
const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

// Función para generar un color basado en el nombre de usuario
const getUserColor = (name) => {
  const colors = [
    "#2196F3", // Azul
    "#4CAF50", // Verde
    "#F44336", // Rojo
    "#9C27B0", // Púrpura
    "#FF9800", // Naranja
    "#009688", // Verde azulado
    "#E91E63", // Rosa
    "#673AB7", // Violeta
  ];

  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Función para otorgar XP
const awardXp = (amount) => {
  userXp.value += amount;

  // Check for level up
  if (userXp.value >= xpForNextLevel.value) {
    userXp.value = userXp.value - xpForNextLevel.value;
    userLevel.value++;

    // Check if user reached level 10 to increase rank
    if (userLevel.value > 10) {
      userLevel.value = 1;
      userRank.value++;

      if (userRank.value <= rankNames.length) {
        showRankUp.value = true;
        setTimeout(() => {
          showRankUp.value = false;
        }, 3000);
      }
    } else {
      showLevelUp.value = true;
      setTimeout(() => {
        showLevelUp.value = false;
      }, 3000);
    }

    // Check for level and rank achievements
    if (logrosRef.value) {
      logrosRef.value.checkLevelAchievements(userLevel.value);
      logrosRef.value.checkRankAchievements(userRank.value, userLevel.value);
    }
  }

  // Save to localStorage
  saveGameState();
};

// Manejar evento de logro desbloqueado
const handleAchievementUnlocked = () => {
  // Esta función se llama cuando se desbloquea un logro en el componente Logros
  saveGameState();
};

// Guardar estado del juego
const saveGameState = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return; // No guardar si no hay usuario autenticado

  const gameState = {
    userXp: userXp.value,
    userLevel: userLevel.value,
    userRank: userRank.value,
    loginStreak: loginStreak.value,
    achievements: logrosRef.value ? logrosRef.value.achievements : [],
  };

  // Guardar tanto en Firestore como en localStorage para respaldo
  try {
    await usuarios.updateGameState(user.uid, gameState);
    // Almacenar una marca de tiempo para prevenir verificaciones duplicadas
    localStorage.setItem(
      `achievementsLastCheck_${user.uid}`,
      Date.now().toString()
    );
  } catch (error) {
    console.error("Error al guardar estado en Firestore:", error);
  }

  // Mantener respaldo en localStorage
  localStorage.setItem(`adminGameState_${user.uid}`, JSON.stringify(gameState));
};

// Cargar estado del juego
const loadGameState = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return; // No cargar si no hay usuario autenticado

  try {
    // Intentar cargar desde Firestore primero
    const firestoreGameState = await usuarios.getGameState(user.uid);

    if (firestoreGameState) {
      // Si se encuentra en Firestore, usar esos datos
      userXp.value = firestoreGameState.userXp || 0;
      userLevel.value = firestoreGameState.userLevel || 1;
      userRank.value = firestoreGameState.userRank || 1; // Usar rango 1 (Bronce) como valor predeterminado
      loginStreak.value = firestoreGameState.loginStreak || 0;

      // Limpiar datos potencialmente obsoletos en localStorage antes de cargar datos de Firebase
      if (logrosRef.value) {
        logrosRef.value.clearAchievementsLocalStorage();
      }

      // Cargar los logros en el componente Logros
      if (logrosRef.value && firestoreGameState.achievements) {
        logrosRef.value.loadAchievements(firestoreGameState);
      }

      // Guardar una copia local
      saveGameState();
      
      // Emitir evento indicando que el estado del juego ha sido cargado completamente
      window.dispatchEvent(new CustomEvent("gameStateLoaded"));
      return;
    }
  } catch (error) {
    console.error("Error al cargar estado desde Firestore:", error);
  }

  // Si hay un error o no hay datos en Firestore, intentar cargar desde localStorage
  const savedState = localStorage.getItem(`adminGameState_${user.uid}`);

  if (savedState) {
    const gameState = JSON.parse(savedState);
    userXp.value = gameState.userXp || 0;
    userLevel.value = gameState.userLevel || 1;
    userRank.value = gameState.userRank || 1; // Usar rango 1 (Bronce) como valor predeterminado
    loginStreak.value = gameState.loginStreak || 0;

    // Cargar los logros en el componente Logros
    if (logrosRef.value) {
      logrosRef.value.loadAchievements(gameState);
    }

    // Sincronizar con Firestore
    saveGameState();
    
    // Emitir evento indicando que el estado del juego ha sido cargado completamente
    window.dispatchEvent(new CustomEvent("gameStateLoaded"));
  } else {
    // First time - initialize
    saveGameState();
    
    // Emitir evento indicando que el estado del juego ha sido inicializado
    window.dispatchEvent(new CustomEvent("gameStateLoaded"));
  }
};

const openProfileModal = () => {
  showProfileModal.value = true;
  emit("close");
};

const handleProfileUpdate = (newDisplayName) => {
  displayName.value = newDisplayName;

  // Unlock achievement through Logros component
  if (logrosRef.value) {
    logrosRef.value.unlockAchievement(1); // Nueva Criatura achievement
  }
};

const handleNavigation = (path) => {
  emit("close");
  window.location.href = path;
};

const handleLogout = async () => {
  try {
    // Limpiar datos de logros en localStorage antes de cerrar sesión
    if (logrosRef.value) {
      logrosRef.value.clearAchievementsLocalStorage();
    }

    await auth_api.logout();
    // Redirigir a la página de despedida después del logout exitoso
    window.location.replace("/logout");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // En caso de error, forzar la redirección de todas formas
    window.location.replace("/logout");
  }
};

const openChangePassword = () => {
  cambioContrasenaRef.value?.openModal();
  emit("close");

  // Unlock achievement through Logros component
  if (logrosRef.value) {
    logrosRef.value.unlockAchievement(0); // Guardián de la Fe achievement
  }
};

const updateCurrentPath = () => {
  currentPath.value = window.location.pathname;
};

const updateUserProfile = async () => {
  const user = auth_api.getCurrentUser();
  if (user?.uid) {
    try {
      // Obtener perfil inicial
      const profile = await usuarios.getById(user.uid);
      displayName.value = profile.data.displayName || "";

      // Limpiar suscripción anterior si existe
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }

      // Suscribirse a cambios en el perfil
      unsubscribeProfile = usuarios.subscribeToProfile(user.uid, (profile) => {
        displayName.value = profile.displayName || "";
      });
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
    }
  } else {
    displayName.value = "";
    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }
  }
};

// Función para configurar el listener de estadísticas
const setupStatsListener = () => {
  window.removeEventListener("statisticsUpdated", checkStatsForAchievements);
  window.addEventListener("statisticsUpdated", checkStatsForAchievements);

  // Agregar listener para forzar recarga de estado desde Firebase
  window.removeEventListener("forceGameStateReload", forceReloadGameState);
  window.addEventListener("forceGameStateReload", forceReloadGameState);

  // Agregar listener para visita al ranking
  window.removeEventListener("rankingPageVisited", checkRankingVisitForAchievement);
  window.addEventListener("rankingPageVisited", checkRankingVisitForAchievement);
  
  console.log("AdminSidebar - Event listeners configurados correctamente");
  console.log("- statisticsUpdated listener: configurado");
  console.log("- forceGameStateReload listener: configurado");
  console.log("- rankingPageVisited listener: configurado");
};

// Función para forzar recarga del estado desde Firebase
const forceReloadGameState = async () => {
  console.log("Forzando recarga de estado desde Firebase");
  try {
    const user = auth_api.getCurrentUser();
    if (!user?.uid) return;

    // Cargar datos directamente desde Firebase
    const firestoreGameState = await usuarios.getGameState(user.uid);

    if (firestoreGameState) {
      userXp.value = firestoreGameState.userXp || 0;
      userLevel.value = firestoreGameState.userLevel || 1;
      userRank.value = firestoreGameState.userRank || 1; // Usar rango 1 (Bronce) como valor predeterminado
      loginStreak.value = firestoreGameState.loginStreak || 0;

      // Cargar los logros en el componente Logros
      if (logrosRef.value && firestoreGameState.achievements) {
        logrosRef.value.loadAchievements(firestoreGameState);
      }

      console.log("Estado recargado exitosamente desde Firebase");
    }
  } catch (error) {
    console.error("Error al forzar recarga desde Firebase:", error);
  }
};

// Función para verificar logros cuando se actualizan las estadísticas
const checkStatsForAchievements = () => {
  console.log("Evento statisticsUpdated recibido - verificando logros");
  if (logrosRef.value) {
    logrosRef.value.checkAchievementsFromStats();
  }
};

// Función para verificar logros cuando se visita el ranking
const checkRankingVisitForAchievement = () => {
  console.log("Evento rankingPageVisited recibido - verificando logro de ranking");
  console.log("logrosRef.value:", logrosRef.value);
  
  if (logrosRef.value) {
    console.log("Llamando a checkRankingVisitAchievement...");
    logrosRef.value.checkRankingVisitAchievement();
  } else {
    console.warn("logrosRef.value no está disponible");
  }
};

onMounted(async () => {
  updateCurrentPath();
  window.addEventListener("popstate", updateCurrentPath);

  // Suscribirse a cambios de autenticación
  unsubscribeAuth = auth_api.onAuthStateChange(async (user) => {
    if (user) {
      // Cargar perfil del usuario
      await updateUserProfile();

      // Load game state después de que el perfil esté cargado
      await loadGameState();

      // Configurar listener para actualizaciones de estadísticas
      setupStatsListener();

      // Revisar si hay XP temporal para agregar desde localStorage
      const tempXpKey = `tempXp_${user.uid}`;
      const tempXp = localStorage.getItem(tempXpKey);
      if (tempXp) {
        const xpToAdd = parseInt(tempXp);
        if (!isNaN(xpToAdd) && xpToAdd > 0) {
          awardXp(xpToAdd);
          localStorage.removeItem(tempXpKey);
        }
      }
    } else {
      displayName.value = "";
      // Limpiar la suscripción del perfil si existe
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
    }
  });

  // Asegurar que los event listeners se configuren después del montaje completo
  setTimeout(() => {
    setupStatsListener();
    console.log("AdminSidebar - Event listeners reconfigurados después del montaje");
  }, 500);

  // Registrar el componente como un elemento customizado para poder acceder desde otros componentes
  if (
    typeof window !== "undefined" &&
    typeof customElements !== "undefined" &&
    !customElements.get("admin-sidebar")
  ) {
    class AdminSidebarElement extends HTMLElement {}
    customElements.define("admin-sidebar", AdminSidebarElement);

    // Crear una instancia y adjuntar un método puente para awardXp
    const sidebarElement = document.createElement("admin-sidebar");
    sidebarElement.awardXp = (amount) => {
      awardXp(amount);
    };
    document.body.appendChild(sidebarElement);
  }
});

// Watch for changes in isOpen to control body scroll
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      // Actualizar la ruta actual cuando se abre el sidebar
      updateCurrentPath();
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }
);

onBeforeUnmount(() => {
  window.removeEventListener("popstate", updateCurrentPath);
  window.removeEventListener("statisticsUpdated", checkStatsForAchievements);
  window.removeEventListener("rankingPageVisited", checkRankingVisitForAchievement);

  // Limpiar todas las suscripciones
  if (unsubscribeAuth) {
    unsubscribeAuth();
    unsubscribeAuth = null;
  }
  if (unsubscribeProfile) {
    unsubscribeProfile();
    unsubscribeProfile = null;
  }
});

// Watch for changes in cambioContrasenaRef to update event handling
watch(
  () => cambioContrasenaRef.value,
  (newRef) => {
    if (newRef) {
      newRef.onPasswordChanged = () => {
        awardXp(20);
      };
    }
  }
);
</script>

<style scoped>
a {
  transition: all 0.3s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-20px) translateX(-50%);
  }
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
