<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
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
      <div class="p-4 h-full flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold flex items-center">Administracion</h2>
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
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Perfil del Usuario con Nivel y XP -->
        <div
          class="mb-2 p-4 rounded-lg border backdrop-blur-sm"
          :class="
            isDarkMode
              ? 'bg-gray-700/50 border-gray-600/50'
              : 'bg-white/80 border-gray-200'
          "
        >          <div class="flex items-center space-x-3 mb-3 relative">
            <!-- Botón de apagado en la esquina superior derecha -->
            <button
              @click="handleLogout"
              class="absolute -top-2 -right-2 p-2 rounded-full transition-colors"
              :class="isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'"
              title="Cerrar sesión"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>

            <div
              class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg relative"
              :style="{ backgroundColor: getUserColor(displayName) }"
            >
              {{ getUserInitial(displayName) }}
              <div
                class="absolute -bottom-1 -right-1 bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2"
                :class="isDarkMode ? 'border-gray-800' : 'border-white'"
              >
                {{ userLevel }}
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-medium flex items-center">
                {{ displayName || "Usuario" }}
                <span
                  v-if="hasNewAchievement"
                  class="ml-2 text-yellow-500 animate-pulse"
                  >⭐</span
                >
              </h3>
              <div
                class="text-xs"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'"
              >
                Nivel {{ userLevel }}
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
        <div class="space-y-1 mb-2">
          <a
            href="/admin/eventos"
            @click.prevent="handleNavigation('/admin/eventos')"
            :class="[
              'flex items-center px-4 py-3 rounded-lg transition-all duration-200 border-l-4',
              currentPath === '/admin/eventos'
                ? isDarkMode
                  ? 'bg-teal-500/20 text-teal-400 border-teal-500'
                  : 'bg-teal-50 text-teal-600 border-teal-500'
                : isDarkMode
                ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              :stroke="
                currentPath === '/admin/eventos'
                  ? isDarkMode
                    ? 'rgb(45 212 191)'
                    : 'rgb(13 148 136)'
                  : 'currentColor'
              "
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Administrar Anuncios</span>
          </a>

          <a
            href="/admin/fechas"
            @click.prevent="handleNavigation('/admin/fechas')"
            :class="[
              'flex items-center px-4 py-3 rounded-lg transition-all duration-200 border-l-4',
              currentPath === '/admin/fechas'
                ? isDarkMode
                  ? 'bg-teal-500/20 text-teal-400 border-teal-500'
                  : 'bg-teal-50 text-teal-600 border-teal-500'
                : isDarkMode
                ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              :stroke="
                currentPath === '/admin/fechas'
                  ? isDarkMode
                    ? 'rgb(45 212 191)'
                    : 'rgb(13 148 136)'
                  : 'currentColor'
              "
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Administrar Fechas</span>
          </a>

          <button
            @click="openChangePassword"
            :class="[
              'flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 border-l-4 border-transparent',
              isDarkMode
                ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span>Cambiar Contraseña</span>
          </button>

          <!-- Ranking button -->
          <a
            href="/admin/ranking"
            @click.prevent="handleNavigation('/admin/ranking')"
            :class="[
              'flex items-center px-4 py-3 rounded-lg transition-all duration-200 border-l-4',
              currentPath === '/admin/ranking'
                ? isDarkMode
                  ? 'bg-teal-500/20 text-teal-400 border-teal-500'
                  : 'bg-teal-50 text-teal-600 border-teal-500'
                : isDarkMode
                ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              :stroke="
                currentPath === '/admin/ranking'
                  ? isDarkMode
                    ? 'rgb(45 212 191)'
                    : 'rgb(13 148 136)'
                  : 'currentColor'
              "
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Ranking Global</span>
          </a>
        </div>

        <!-- Achievements -->
        <div
          class="mb-4 p-3 rounded-lg border"
          :class="
            isDarkMode
              ? 'bg-gray-700/30 border-gray-600/50'
              : 'bg-white border-gray-200'
          "
        >
          <button
            @click="toggleAchievements"
            class="w-full text-sm font-semibold mb-2 flex items-center justify-between"
            :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'"
          >
            <div class="flex items-center">
              <span class="mr-1">🏆</span> Logros ({{ unlockedAchievements }}/{{
                totalAchievements
              }})
            </div>
            <svg
              class="w-4 h-4 transition-transform"
              :class="showAchievements ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            v-if="showAchievements"
            class="grid grid-cols-4 gap-2 transition-all duration-300 ease-in-out"
          >
            <div
              v-for="(achievement, index) in achievements"
              :key="index"
              :class="[
                'w-full aspect-square rounded-lg flex items-center justify-center',
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                  : isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-200',
                'relative group',
              ]"
            >
              <span
                :class="[
                  'text-lg',
                  achievement.unlocked ? 'opacity-100' : 'opacity-40',
                ]"
                >{{ achievement.icon }}</span
              >

              <!-- Tooltip -->
              <div
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-gray-800 text-xs text-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              >
                <p class="font-semibold">{{ achievement.name }}</p>
                <p class="text-gray-300 text-xs">
                  {{ achievement.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contador de Estadísticas -->
        <ContadorEstadisticas class="mb-4" :darkMode="isDarkMode" />

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

    <!-- Level Up Notification -->
    <div
      v-if="showLevelUp"
      class="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-gray-800 border-2 border-yellow-500 text-white p-6 rounded-lg shadow-lg z-[100] animate-bounce"
    >
      <div class="text-center">
        <div class="text-yellow-400 text-4xl mb-2">🎉</div>
        <h3 class="text-xl font-bold mb-1">¡Nivel Subido!</h3>
        <p class="text-gray-300">Has alcanzado el nivel {{ userLevel }}</p>
      </div>
    </div>

    <!-- Achievement Notification -->
    <div
      v-if="showAchievement"
      class="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-gray-800 border-2 border-yellow-500 text-white p-6 rounded-lg shadow-lg z-[100] animate-bounce"
    >
      <div class="text-center">
        <div class="text-yellow-400 text-4xl mb-2">🏆</div>
        <h3 class="text-xl font-bold mb-1">¡Nuevo Logro!</h3>
        <p class="text-gray-300">{{ latestAchievement.name }}</p>
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
let unsubscribeAuth = null;
let unsubscribeProfile = null;

// Theme state
const isDarkMode = computed(() => props.darkMode);

// Gamification state
const userXp = ref(0);
const userLevel = ref(1);
const xpForNextLevel = computed(() => userLevel.value * 100);
const xpPercentage = computed(() =>
  Math.min(100, Math.floor((userXp.value / xpForNextLevel.value) * 100))
);
const loginStreak = ref(0);
const showLevelUp = ref(false);
const showAchievement = ref(false);
const hasNewAchievement = ref(false);
const latestAchievement = ref({});
const newAnnouncementsCount = ref(2);
const upcomingDatesCount = ref(3);
const showAchievements = ref(false);

// Logros
const achievements = ref([
  {
    icon: "🔒",
    name: "Guardián de la Fe",
    description: "Cambia tu contraseña",
    unlocked: false,
  },
  {
    icon: "👤",
    name: "Nueva Criatura",
    description: "Personaliza tu perfil",
    unlocked: false,
  },
  {
    icon: "🎨",
    name: "Vasija Renovada",
    description: "Cambia el tema de la interfaz",
    unlocked: false,
  },
  {
    icon: "📜",
    name: "Portador de Buenas Nuevas",
    description: "Agrega tu primer anuncio",
    unlocked: false,
  },
  {
    icon: "📢",
    name: "Mensajero",
    description: "Agrega 3 anuncios",
    unlocked: false,
  },
  {
    icon: "📅",
    name: "Organizador",
    description: "Agrega 3 fechas",
    unlocked: false,
  },
  {
    icon: "📣",
    name: "Heraldo",
    description: "Agrega 10 anuncios",
    unlocked: false,
  },
  {
    icon: "🗓️",
    name: "Planificador",
    description: "Agrega 10 fechas",
    unlocked: false,
  },
  {
    icon: "📯",
    name: "Atalaya",
    description: "Agrega 25 anuncios",
    unlocked: false,
  },
  {
    icon: "📆",
    name: "Cronista de Dios",
    description: "Agrega 25 fechas",
    unlocked: false,
  },
  {
    icon: "✏️",
    name: "Escriba",
    description: "Modifica 10 anuncios",
    unlocked: false,
  },
  {
    icon: "🔄",
    name: "Obrero Diligente",
    description: "Modifica 10 fechas",
    unlocked: false,
  },
  {
    icon: "🗑️",
    name: "Limpiador",
    description: "Elimina 5 anuncios",
    unlocked: false,
  },
  {
    icon: "❌",
    name: "Purificador",
    description: "Elimina 5 fechas",
    unlocked: false,
  },
  {
    icon: "🎂",
    name: "Celebrador de la Vida",
    description: "Agrega una fecha con icono de cumpleaños",
    unlocked: false,
  },
  {
    icon: "👨",
    name: "Varón de Valor",
    description: "Agrega una fecha con icono de reunión de varones",
    unlocked: false,
  },
  {
    icon: "👩",
    name: "Mujer Virtuosa",
    description: "Agrega una fecha con icono de reunión de damas",
    unlocked: false,
  },
  {
    icon: "⭐",
    name: "Siervo Fiel",
    description: "Alcanza el nivel 5",
    unlocked: false,
  },
  {
    icon: "🌟",
    name: "Buen Mayordomo",
    description: "Alcanza el nivel 10",
    unlocked: false,
  },
  {
    icon: "🌠",
    name: "Buen y Fiel Siervo",
    description: "Alcanza el nivel 100",
    unlocked: false,
  },
]);

const unlockedAchievements = computed(() => {
  return achievements.value.filter((a) => a.unlocked).length;
});

const totalAchievements = computed(() => {
  return achievements.value.length;
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
    showLevelUp.value = true;

    // Check for level achievements
    if (userLevel.value >= 5) {
      unlockAchievement(17); // "Siervo Fiel" - Nivel 5
    }
    if (userLevel.value >= 10) {
      unlockAchievement(18); // "Buen Mayordomo" - Nivel 10
    }
    if (userLevel.value >= 100) {
      unlockAchievement(19); // "Buen y Fiel Siervo" - Nivel 100
    }

    setTimeout(() => {
      showLevelUp.value = false;
    }, 3000);
  }

  // Save to localStorage
  saveGameState();
};

// Función para desbloquear logros
const unlockAchievement = (index) => {
  console.log(`Intentando desbloquear logro con índice: ${index}`);

  if (index < 0 || index >= achievements.value.length) {
    console.error(`Índice de logro fuera de rango: ${index}`);
    return;
  }

  if (!achievements.value[index].unlocked) {
    console.log(`Desbloqueando logro: ${achievements.value[index].name}`);
    achievements.value[index].unlocked = true;
    latestAchievement.value = achievements.value[index];
    showAchievement.value = true;
    hasNewAchievement.value = true;

    setTimeout(() => {
      showAchievement.value = false;
    }, 3000);

    // Save to localStorage
    saveGameState();

    // Award XP for achievement
    awardXp(25);
  } else {
    console.log(`Logro ya desbloqueado: ${achievements.value[index].name}`);
  }
};

// Guardar estado del juego
const saveGameState = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return; // No guardar si no hay usuario autenticado

  const gameState = {
    userXp: userXp.value,
    userLevel: userLevel.value,
    loginStreak: loginStreak.value,
    achievements: achievements.value,
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
      loginStreak.value = firestoreGameState.loginStreak || 0;

      if (
        firestoreGameState.achievements &&
        firestoreGameState.achievements.length > 0
      ) {
        // Aplicar estado de logros desde Firestore
        firestoreGameState.achievements.forEach((achievement, index) => {
          if (index < achievements.value.length) {
            achievements.value[index].unlocked = achievement.unlocked || false;
          }
        });
      }

      // Guardar una copia local
      saveGameState();
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
    loginStreak.value = gameState.loginStreak || 0;

    if (
      gameState.achievements &&
      gameState.achievements.length === achievements.value.length
    ) {
      // Si la estructura coincide, cargar directamente
      achievements.value = gameState.achievements;
    } else if (gameState.achievements) {
      // Keep the new achievements structure but load unlocked status from saved state
      const savedAchievements = gameState.achievements;
      // Map old achievements to new ones where possible
      if (savedAchievements.length > 0) {
        savedAchievements.forEach((achievement, index) => {
          if (index < achievements.value.length && achievement.unlocked) {
            achievements.value[index].unlocked = true;
          }
        });
      }
    }    // Check level achievements
    if (userLevel.value >= 5) {
      achievements.value[17].unlocked = true; // "Siervo Fiel"
    }
    if (userLevel.value >= 10) {
      achievements.value[18].unlocked = true; // "Buen Mayordomo"
    }
    if (userLevel.value >= 100) {
      achievements.value[19].unlocked = true; // "Buen y Fiel Siervo"
    }

    // Sincronizar con Firestore
    saveGameState();
  } else {
    // First time - initialize
    saveGameState();
  }
};

const openProfileModal = () => {
  showProfileModal.value = true;
  emit("close");
};

const handleProfileUpdate = (newDisplayName) => {
  displayName.value = newDisplayName;
  unlockAchievement(1); // Unlock "Identidad" achievement
  hasNewAchievement.value = false; // Reset notification
};

const handleNavigation = (path) => {
  emit("close");

  // Eliminar las referencias a completeTask
  if (path === "/admin/eventos") {
    newAnnouncementsCount.value = 0;
  } else if (path === "/admin/fechas") {
    upcomingDatesCount.value = 0;
  }

  window.location.href = path;
};

const handleLogout = async () => {
  try {
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
  unlockAchievement(0); // Unlock "Seguridad" achievement
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

const toggleAchievements = () => {
  showAchievements.value = !showAchievements.value;
};

// Función para comprobar logros basados en las estadísticas
const checkAchievementsFromStats = () => {
  // Eliminar la verificación de tiempo para que siempre procese los logros
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  // Obtener estadísticas del localStorage
  const userId = user.uid || "invitado";
  const contadorKey = `estadisticasContador_${userId}`;
  const datosGuardados = localStorage.getItem(contadorKey);

  // Verificar si se ha creado un evento de cumpleaños
  const haCreatedoCumpleanos = localStorage.getItem(
    `haCreatedoCumpleanos_${userId}`
  );
  if (haCreatedoCumpleanos === "true") {
    console.log("Desbloqueando logro Celebrador (cumpleaños)");
    unlockAchievement(14); // Logro "Celebrador de la Vida"
  }

  // Verificar si se ha creado un evento de reunión de varones
  const haCreadoReunionVarones = localStorage.getItem(
    `haCreatedoReunionVarones_${userId}`
  );
  if (haCreadoReunionVarones === "true") {
    console.log("Desbloqueando logro Varón de Valor");
    unlockAchievement(15); // Logro "Varón de Valor"
  }

  // Verificar si se ha creado un evento de reunión de damas
  const haCreadoReunionDamas = localStorage.getItem(
    `haCreatedoReunionDamas_${userId}`
  );
  if (haCreadoReunionDamas === "true") {
    console.log("Desbloqueando logro Mujer Virtuosa");
    unlockAchievement(16); // Logro "Mujer Virtuosa"
  }

  if (datosGuardados) {
    try {
      const stats = JSON.parse(datosGuardados);
      console.log("Verificando logros con estadísticas:", stats);

      // Verificar logro del primer anuncio
      if (stats.eventos.agregados >= 1) {
        unlockAchievement(3); // Portador de Buenas Nuevas - Primer anuncio
      }

      // Verificar logros de anuncios (eventos)
      if (stats.eventos.agregados >= 3) {
        unlockAchievement(4); // Mensajero - Crea 3 anuncios
      }
      if (stats.eventos.agregados >= 10) {
        unlockAchievement(6); // Heraldo - Crea 10 anuncios
      }
      if (stats.eventos.agregados >= 25) {
        unlockAchievement(8); // Atalaya - Crea 25 anuncios
      }

      // Verificar logros de fechas
      if (stats.fechas.agregados >= 3) {
        unlockAchievement(5); // Organizador - Crea 3 fechas
      }
      if (stats.fechas.agregados >= 10) {
        unlockAchievement(7); // Planificador - Crea 10 fechas
      }
      if (stats.fechas.agregados >= 25) {
        unlockAchievement(9); // Cronista de Dios - Crea 25 fechas
      }

      // Verificar logros de modificación
      if (stats.eventos.modificados >= 10) {
        unlockAchievement(10); // Escriba - Modifica 10 anuncios
      }
      if (stats.fechas.modificados >= 10) {
        unlockAchievement(11); // Obrero Diligente - Modifica 10 fechas
      }

      // Verificar logros de eliminación
      if (stats.eventos.eliminados >= 5) {
        unlockAchievement(12); // Limpiador - Elimina 5 anuncios
      }
      if (stats.fechas.eliminados >= 5) {
        unlockAchievement(13); // Purificador - Elimina 5 fechas
      }

      // Actualizar la marca de tiempo para evitar verificaciones duplicadas frecuentes
      localStorage.setItem(
        `achievementsLastCheck_${user.uid}`,
        Date.now().toString()
      );
    } catch (error) {
      console.error("Error al procesar estadísticas para logros:", error);
    }
  }
};

// Añadir un listener para eventos personalizados desde ContadorEstadisticas
const setupStatsListener = () => {
  // Eliminar el listener existente para evitar duplicados
  window.removeEventListener("statisticsUpdated", checkAchievementsFromStats);

  // Añadir un nuevo listener con una función personalizada para forzar la verificación inmediata
  window.addEventListener("statisticsUpdated", () => {
    console.log(
      "Evento statisticsUpdated recibido - verificando logros inmediatamente"
    );
    // Forzar la verificación de logros inmediatamente sin restricciones de tiempo
    checkAchievementsFromStats();
  });
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

      // Evitar cargar logros duplicados en cada navegación
      const lastCheckKey = `achievementsLastCheck_${user.uid}`;
      const lastCheck = localStorage.getItem(lastCheckKey);

      // Solo verificar si no se ha hecho recientemente (últimos 30 segundos)
      if (!lastCheck || Date.now() - parseInt(lastCheck) > 30000) {
        // Verificar logros basados en estadísticas existentes
        checkAchievementsFromStats();

        // Actualizar marca de tiempo
        localStorage.setItem(lastCheckKey, Date.now().toString());
      }

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

  // Registrar el componente como un elemento customizado para poder acceder desde otros componentes
  if (
    typeof window !== "undefined" &&
    typeof customElements !== "undefined" &&
    !customElements.get("admin-sidebar")
  ) {
    class AdminSidebarElement extends HTMLElement {
      constructor() {
        super();
      }
    }
    customElements.define("admin-sidebar", AdminSidebarElement);

    // Crear una instancia y adjuntar un método puente para awardXp
    const sidebarElement = document.createElement("admin-sidebar");
    sidebarElement.awardXp = (amount) => {
      awardXp(amount);
    };
    document.body.appendChild(sidebarElement);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", updateCurrentPath);
  // Eliminar listener de estadísticas de forma más simple
  window.removeEventListener("statisticsUpdated", checkAchievementsFromStats);
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

// Watch for changes in achievements to update CambioContrasena component
watch(
  () => achievements.value[0].unlocked,
  (newValue) => {
    if (newValue && cambioContrasenaRef.value) {
      cambioContrasenaRef.value.onPasswordChanged = () => {
        awardXp(20);
      };
    }
  }
);

// Exponer el método para que pueda ser accedido desde el componente padre
defineExpose({
  unlockAchievement,
});
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
