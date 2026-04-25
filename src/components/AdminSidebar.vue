<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 transition-opacity touch-none"
      @click="$emit('close')"
      @touchend="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed right-0 top-0 h-full w-72 shadow-lg z-50',
        'transform transition-transform duration-300 ease-in-out',
        'bg-linear-to-b from-white to-gray-100 text-gray-800',
        'dark:from-gray-800 dark:to-gray-900 dark:text-white',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div class="py-4 h-full flex flex-col overflow-y-auto">
        <div class="flex justify-between items-center mb-3 px-2">
          <h2 class="text-xl font-bold flex items-center px-3">Administración</h2>
          <!-- Close Button -->
          <button
            @click="$emit('close')"
            @touchend="$emit('close')"
            class="p-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-200 text-gray-600 hover:text-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-300 dark:hover:text-white"
          >
            <i class="fas fa-times w-6 h-6"></i>
          </button>
        </div>

        <!-- Perfil del Usuario con Nivel y XP -->
        <div
          class="py-2 px-4 border backdrop-blur-sm bg-white/80 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600/50"
        >
          <div class="flex items-center mb-2 relative px-1">
            <!-- Botón de apagado en la esquina superior derecha -->
            <button
              @click="handleLogout"
              @touchend="handleLogout"
              class="absolute -top-2 -right-2 p-2 rounded-full transition-colors cursor-pointer text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              title="Cerrar sesión"
            >
              <i class="fas fa-power-off w-5 h-5"></i>
            </button>

            <!-- Avatar con barra de progreso circular -->
            <div class="relative">
              <!-- SVG para la barra de progreso circular -->
              <svg class="w-16 h-16 transform rotate-60" viewBox="0 0 64 64">
                <!-- Círculo de fondo -->
                <circle
                  cx="32"
                  cy="32"
                  r="25"
                  stroke="currentColor"
                  class="text-gray-200 dark:text-gray-600"
                  stroke-width="12"
                  fill="none"
                />
                <!-- Círculo de progreso -->
                <circle
                  cx="32"
                  cy="32"
                  r="25"
                  stroke="currentColor"
                  :class="{
                    'text-amber-500': userRank === 1,
                    'text-gray-400': userRank === 2,
                    'text-yellow-500': userRank === 3,
                    'text-blue-500': userRank === 4,
                    'text-purple-500': userRank === 5,
                    'text-teal-500': userRank > 5 || userRank < 1
                  }"
                  class="transition-all duration-300"
                  stroke-width="12"
                  fill="none"
                  stroke-linecap="butt"
                  :stroke-dasharray="157.08"
                  :stroke-dashoffset="157.08 - (157.08 * xpPercentage) / 100"
                />
              </svg>
              
              <!-- Avatar del usuario -->
              <div
                class="absolute inset-0 w-[54px] h-[54px] rounded-full flex items-center justify-center text-white font-bold text-lg m-auto"
              :style="{ backgroundColor: getUserColor(displayName) }"
            >
              {{ getUserInitial(displayName) }}
              <div
                class="absolute -bottom-1 -right-1 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-800"
                :class="{
                  'bg-amber-500 text-amber-950 ': userRank === 1,
                  'bg-gray-400 text-gray-950': userRank === 2,
                  'bg-yellow-500 text-yellow-950': userRank === 3,
                  'bg-blue-500 text-blue-950 ': userRank === 4,
                  'bg-purple-500 text-purple-950 ': userRank === 5,
                }"
              >
                {{ userLevel }}
              </div>
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
                  :class="[
                    userRank === 1 ? 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100' : '',
                    userRank === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : '',
                    userRank === 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : '',
                    userRank === 4 ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : '',
                    userRank === 5 ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' : '',
                  ]"
                >
                  <i class="fas fa-star text-[8px] mr-0.5"></i>
                  {{ currentRankName }}
                </span>
                <!-- Nivel en pill -->
                <span
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium"
                  :class="[
                    userRank === 1 ? 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100' : '',
                    userRank === 2 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : '',
                    userRank === 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : '',
                    userRank === 4 ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : '',
                    userRank === 5 ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' : '',
                  ]"
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
                @touchend="openProfileModal"
                class="text-xs mt-1 cursor-pointer text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                Editar perfil
              </button>
            </div>
          </div>

          <!-- Información de XP -->
          <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <span>XP: {{ userXp }}/{{ xpForNextLevel }}</span>
            
            <!-- Rachas máximas -->
            <div class="flex items-center space-x-2">
              <span class="text-xs">Racha maxima:</span>
              
              <!-- Streak de Anuncios -->
              <div 
                class="flex items-center space-x-1"
                :title="anunciosMaxStreak > 0 ? `Streak máximo de anuncios: ${anunciosMaxStreak} semana${anunciosMaxStreak !== 1 ? 's' : ''}` : 'Sin racha de anuncios'"
              >
                <img 
                  src="/svg/flama.svg" 
                  alt="Streak anuncios" 
                  class="w-4 h-4"
                  :class="anunciosMaxStreak > 0 ? 'filter-red' : 'filter-gray'"
                />
                <span class="text-xs font-medium">{{ anunciosMaxStreak }}</span>
              </div>
              
              <!-- Streak de Fechas -->
              <div 
                class="flex items-center space-x-1"
                :title="fechasMaxStreak > 0 ? `Streak máximo de fechas: ${fechasMaxStreak} semana${fechasMaxStreak !== 1 ? 's' : ''}` : 'Sin racha de fechas'"
              >
                <img 
                  src="/svg/flama.svg" 
                  alt="Streak fechas" 
                  class="w-4 h-4"
                  :class="fechasMaxStreak > 0 ? 'filter-blue' : 'filter-gray'"
                />
                <span class="text-xs font-medium">{{ fechasMaxStreak }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div>
          <!-- Tabs Header -->
          <div class="relative">
            <div class="flex border-b-2 relative border-gray-200 dark:border-gray-600">
              <!-- Indicador de tab activo animado -->
              <div
                class="absolute bottom-0 h-0.5 transition-all duration-300 ease-out bg-teal-600 dark:bg-teal-500"
                :style="{
                  width: '50%',
                  left: activeTab === 'admin' ? '0%' : '50%'
                }"
              ></div>

              <button
                @click="activeTab = 'admin'"
                @touchend="() => activeTab = 'admin'"
                :class="[
                  'flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative border-b-2 border-transparent cursor-pointer',
                  activeTab === 'admin'
                    ? 'text-teal-600 bg-linear-to-t from-teal-200/40 to-transparent dark:text-teal-400 dark:from-teal-500/30'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/30'
                ]"
              >
                <span class="relative">Gestión</span>
              </button>
              <button
                @click="activeTab = 'profile'"
                @touchend="() => activeTab = 'profile'"
                :class="[
                  'flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative border-b-2 border-transparent cursor-pointer',
                  activeTab === 'profile'
                    ? 'text-teal-600 bg-linear-to-t from-teal-200/40 to-transparent dark:text-teal-400 dark:from-teal-500/30'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/30'
                ]"
              >
                <span class="relative">Logros ({{ unlockedAchievementsCount }}/{{ totalAchievementsCount }})</span>
              </button>
            </div>
          </div>

          <!-- Tab Content Container -->
          <div
            class="border-t-0 mt-0 bg-white/50 border-gray-200/50 dark:bg-gray-900 dark:border-gray-600/50"
          >
            <!-- Tab Content: Administración -->
            <div v-show="activeTab === 'admin'" class="space-y-1">
            <a
              href="/admin/eventos"
              @click.prevent="handleNavigation('/admin/eventos')"
              @touchend.prevent="handleNavigation('/admin/eventos')"
              :class="[
                'flex items-center px-6 py-[10px] transition-all duration-200 border-l-4 cursor-pointer',
                currentPath === '/admin/eventos'
                  ? 'bg-teal-50 text-teal-600 border-teal-500 dark:bg-teal-500/20 dark:text-teal-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white',
              ]"
            >
              <i
                class="fas fa-calendar-alt w-5 h-5 mr-3"
                :class="currentPath === '/admin/eventos' ? 'text-teal-600 dark:text-teal-400' : ''"
              ></i>
              <span class="flex-1">Administrar Anuncios</span>
              <i v-if="!streakStatus.anuncios.weeklyGoalMet" class="fas fa-exclamation-triangle text-xs text-yellow-500 shrink-0"></i>
            </a>

            <a
              href="/admin/fechas"
              @click.prevent="handleNavigation('/admin/fechas')"
              @touchend.prevent="handleNavigation('/admin/fechas')"
              :class="[
                'flex items-center px-6 py-[10px] transition-all duration-200 border-l-4 cursor-pointer',
                currentPath === '/admin/fechas'
                  ? 'bg-teal-50 text-teal-600 border-teal-500 dark:bg-teal-500/20 dark:text-teal-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white',
              ]"
            >
              <i
                class="fas fa-clock w-5 h-5 mr-3"
                :class="currentPath === '/admin/fechas' ? 'text-teal-600 dark:text-teal-400' : ''"
              ></i>
              <span class="flex-1">Administrar Fechas</span>
              <i v-if="!streakStatus.fechas.weeklyGoalMet" class="fas fa-exclamation-triangle text-xs text-yellow-500 shrink-0"></i>
            </a>

            <!-- Ranking button -->
            <a
              href="/admin/ranking"
              @click.prevent="handleNavigation('/admin/ranking')"
              @touchend.prevent="handleNavigation('/admin/ranking')"
              :class="[
                'flex items-center px-6 py-[10px] transition-all duration-200 border-l-4 cursor-pointer',
                currentPath === '/admin/ranking'
                  ? 'bg-teal-50 text-teal-600 border-teal-500 dark:bg-teal-500/20 dark:text-teal-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white',
              ]"
            >
              <i
                class="fas fa-crown w-5 h-5 mr-3"
                :class="currentPath === '/admin/ranking' ? 'text-teal-600 dark:text-teal-400' : ''"
              ></i>
              <span>Ranking Global</span>
            </a>

            <button
              @click="openChangePassword"
              @touchend="openChangePassword"
              class="flex items-center w-full px-6 py-[10px] text-left transition-all duration-200 border-l-4 border-transparent cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white"
            >
              <i class="fas fa-key w-5 h-5 mr-3"></i>
              <span>Cambiar Contraseña</span>
            </button>

            <!-- Contador de Estadísticas -->
            <ContadorEstadisticas :darkMode="isDarkMode" />

            <!-- Streaks Manager -->
            <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-600">
              <div class="mb-2">
                <h4 class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Rachas Semanales
                </h4>
              </div>
              <StreakManager 
                ref="streakManagerRef" 
                @streakUpdate="handleStreakUpdate"
                @checkStreakAchievements="handleCheckStreakAchievements"
              />
            </div>
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

        <div class="grow"></div>
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
import { storeToRefs } from "pinia";
import CambioContrasena from "./CambioContrasena.vue";
import ProfileModal from "./ProfileModal.vue";
import { auth_api, usuarios } from "../lib/api.ts";
import ContadorEstadisticas from "./ContadorEstadisticas.vue";
import Logros from "./Logros.vue";
import StreakManager from "./StreakManager.vue";
import { useGameStore } from "../stores/useGameStore";

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
const streakManagerRef = ref(null);
const activeTab = ref('admin'); // Estado para controlar qué tab está activo
let unsubscribeAuth = null;
let unsubscribeProfile = null;

// Estado de los streaks para mostrar indicadores
const streakStatus = ref({
  anuncios: { weeklyGoalMet: true },
  fechas: { weeklyGoalMet: true }
});

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

// Propiedades computadas para streaks
const anunciosMaxStreak = computed(() => {
  return streakManagerRef.value?.streakData?.anuncios?.maxReached || 0;
});

const fechasMaxStreak = computed(() => {
  return streakManagerRef.value?.streakData?.fechas?.maxReached || 0;
});

const anunciosWeeklyGoalMet = computed(() => {
  return streakManagerRef.value?.streakData?.anuncios?.weeklyGoalMet || false;
});

const fechasWeeklyGoalMet = computed(() => {
  return streakManagerRef.value?.streakData?.fechas?.weeklyGoalMet || false;
});

// Theme state - reactivo a la clase `dark` en <html> (fuente de verdad real del tema)
const isDarkMode = ref(
  typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
);

let darkObserver = null;

// Gamification state (from store)
const gameStore = useGameStore();
const { userXp, userLevel, userRank, loginStreak, xpForNextLevel, xpPercentage } = storeToRefs(gameStore);
const rankNames = gameStore.rankNames;
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

const awardXp = (amount) => {
  const { leveledUp, rankedUp } = gameStore.awardXp(amount);

  if (rankedUp) {
    showRankUp.value = true;
    setTimeout(() => { showRankUp.value = false; }, 3000);
    if (logrosRef.value) {
      logrosRef.value.checkRankAchievements(userRank.value, userLevel.value);
    }
  } else if (leveledUp) {
    showLevelUp.value = true;
    setTimeout(() => { showLevelUp.value = false; }, 3000);
    if (logrosRef.value) {
      logrosRef.value.checkLevelAchievements(userLevel.value);
    }
  }

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
      gameStore.setFromSaved(firestoreGameState);

      if (logrosRef.value) {
        logrosRef.value.clearAchievementsLocalStorage();
      }

      if (logrosRef.value && firestoreGameState.achievements) {
        logrosRef.value.loadAchievements(firestoreGameState);
      }

      saveGameState();
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
    gameStore.setFromSaved(gameState);

    if (logrosRef.value) {
      logrosRef.value.loadAchievements(gameState);
    }

    saveGameState();
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
  
  // Pequeña demora para permitir que se cierre el sidebar antes de navegar
  setTimeout(() => {
    window.location.href = path;
  }, 100);
};

const handleLogout = async () => {
  try {
    // Limpiar datos de logros en localStorage antes de cerrar sesión
    if (logrosRef.value) {
      logrosRef.value.clearAchievementsLocalStorage();
    }

    // Redirigir a la página de logout SIN hacer logout todavía
    // La página de logout se encargará de hacer el logout
    window.location.replace("/logout");
  } catch (error) {
    console.error("Error al preparar cierre de sesión:", error);
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

// Función para obtener el estado inicial de los streaks
const updateStreakStatus = () => {
  if (streakManagerRef.value && streakManagerRef.value.streakData) {
    streakStatus.value = {
      anuncios: { weeklyGoalMet: streakManagerRef.value.streakData.anuncios.weeklyGoalMet },
      fechas: { weeklyGoalMet: streakManagerRef.value.streakData.fechas.weeklyGoalMet }
    };
  }
};

// Función para configurar el listener de estadísticas
const setupStatsListener = () => {
  window.removeEventListener("statisticsUpdated", checkStatsForAchievements);
  window.addEventListener("statisticsUpdated", checkStatsForAchievements);

  window.removeEventListener("forceGameStateReload", forceReloadGameState);
  window.addEventListener("forceGameStateReload", forceReloadGameState);

  window.removeEventListener("rankingPageVisited", checkRankingVisitForAchievement);
  window.addEventListener("rankingPageVisited", checkRankingVisitForAchievement);

  window.removeEventListener("streakActivity", handleStreakActivity);
  window.addEventListener("streakActivity", handleStreakActivity);

  window.removeEventListener("gameStateLoaded", updateStreakStatus);
  window.addEventListener("gameStateLoaded", updateStreakStatus);
};

const forceReloadGameState = async () => {
  try {
    const user = auth_api.getCurrentUser();
    if (!user?.uid) return;

    const firestoreGameState = await usuarios.getGameState(user.uid);
    if (firestoreGameState) {
      gameStore.setFromSaved(firestoreGameState);
      if (logrosRef.value && firestoreGameState.achievements) {
        logrosRef.value.loadAchievements(firestoreGameState);
      }
    }
  } catch (error) {
    console.error("Error al forzar recarga desde Firebase:", error);
  }
};

const checkStatsForAchievements = () => {
  if (logrosRef.value) {
    logrosRef.value.checkAchievementsFromStats();
  }
};

const checkRankingVisitForAchievement = () => {
  if (logrosRef.value) {
    logrosRef.value.checkRankingVisitAchievement();
  }
};

const handleStreakUpdate = ({ tipo, streak }) => {
  streakStatus.value[tipo] = { weeklyGoalMet: streak.weeklyGoalMet };
};

const handleCheckStreakAchievements = (streakData) => {
  if (logrosRef.value) {
    logrosRef.value.checkStreakAchievements(streakData);
  }
};

const handleStreakActivity = (event) => {
  if (streakManagerRef.value) {
    const { tipo, fecha } = event.detail;
    streakManagerRef.value.reportActivity(tipo, fecha);
  }
};

onMounted(async () => {
  updateCurrentPath();
  window.addEventListener("popstate", updateCurrentPath);

  // Sincronizar estado del tema con la clase `dark` en <html>
  isDarkMode.value = document.documentElement.classList.contains("dark");
  darkObserver = new MutationObserver(() => {
    isDarkMode.value = document.documentElement.classList.contains("dark");
  });
  darkObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Suscribirse a cambios de autenticación
  unsubscribeAuth = auth_api.onAuthStateChange(async (user) => {
    if (user) {
      // Cargar perfil del usuario
      await updateUserProfile();

      // Load game state después de que el perfil esté cargado
      await loadGameState();

      // Configurar listener para actualizaciones de estadísticas
      setupStatsListener();
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
    updateStreakStatus();
  }, 500);
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
  window.removeEventListener("streakActivity", handleStreakActivity);
  window.removeEventListener("gameStateLoaded", updateStreakStatus);

  if (darkObserver) {
    darkObserver.disconnect();
    darkObserver = null;
  }

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
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

button {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Mejorar el tap en dispositivos móviles */
a:active,
button:active {
  transform: scale(0.98);
}

@media (hover: none) and (pointer: coarse) {
  /* Estilos específicos para dispositivos táctiles */
  a, button {
    min-height: 44px; /* Área mínima recomendada para elementos táctiles */
  }
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

/* Filtros para colorear los SVG de streaks */
.filter-red {
  filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}

.filter-blue {
  filter: brightness(0) saturate(100%) invert(26%) sepia(81%) saturate(2851%) hue-rotate(206deg) brightness(102%) contrast(103%);
}

.filter-gray {
  filter: brightness(0) saturate(100%) invert(62%) sepia(2%) saturate(1031%) hue-rotate(314deg) brightness(89%) contrast(85%);
}
</style>
