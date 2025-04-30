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
          class="mb-2 p-2 rounded-lg border backdrop-blur-sm"
          :class="
            isDarkMode
              ? 'bg-gray-700/50 border-gray-600/50'
              : 'bg-white/80 border-gray-200'
          "
        >
          <div class="flex items-center space-x-3 mb-3 relative">
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
                  v-if="logrosRef && logrosRef.hasNewAchievement"
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

        <!-- Componente Logros -->
        <Logros
          ref="logrosRef"
          :darkMode="isDarkMode"
          @achievement-unlocked="handleAchievementUnlocked"
          @xp-awarded="awardXp"
        />

        <!-- Navigation Menu -->
        <div class="space-y-1 mb-2">
          <a
            href="/admin/eventos"
            @click.prevent="handleNavigation('/admin/eventos')"
            :class="[
              'flex items-center px-4 py-[10px] rounded-lg transition-all duration-200 border-l-4',
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
              'flex items-center px-4 py-[10px] rounded-lg transition-all duration-200 border-l-4',
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
              'flex items-center w-full px-4 py-[10px] rounded-lg text-left transition-all duration-200 border-l-4 border-transparent',
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
              'flex items-center px-4 py-[10px] rounded-lg transition-all duration-200 border-l-4',
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
      class="fixed top-16 right-4 bg-gradient-to-r from-yellow-600 to-orange-500 text-white p-3 rounded-lg shadow-xl z-50 animate-slide-in-right"
    >
      <div class="flex items-center">
        <div
          class="mr-3 bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold"
        >
          {{ userLevel }}
        </div>
        <div>
          <p class="font-semibold">¡Nivel Subido 🎉!</p>
          <p class="text-sm">Has alcanzado el nivel {{ userLevel }}</p>
        </div>
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
    if (logrosRef.value) {
      logrosRef.value.checkLevelAchievements(userLevel.value);
    }

    setTimeout(() => {
      showLevelUp.value = false;
    }, 3000);
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

    // Cargar los logros en el componente Logros
    if (logrosRef.value) {
      logrosRef.value.loadAchievements(gameState);
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

// Watch for changes in isOpen to control body scroll
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
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

@keyframes slide-in-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}
</style>
