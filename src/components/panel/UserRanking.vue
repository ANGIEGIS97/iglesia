<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { usuarios, type UserWithId } from "../../lib/api.ts";

const users = ref<UserWithId[]>([]);
const isLoading = ref(true);
const error = ref("");

const loadRanking = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    const rankingData = await usuarios.getRanking();
    users.value = rankingData;
  } catch (err) {
    console.error("Error al cargar el ranking:", err);
    error.value = "Error al cargar el ranking de usuarios";
  } finally {
    isLoading.value = false;
  }
};

const getTopThreeClass = (index: number) => {
  switch (index) {
    case 0:
      return "bg-yellow-500 text-white"; // Oro
    case 1:
      return "bg-gray-300 text-gray-800"; // Plata
    case 2:
      return "bg-amber-600 text-white"; // Bronce
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"; // Resto
  }
};

// Nombres de rangos
const rankNames = [
  "Bronce",
  "Plata",
  "Oro",
  "Diamante",
  "Platino"
];

// Obtener el nombre del rango según el valor
const getRankName = (rank: number) => {
  // Ajustar el índice para acceder al array (restar 1 porque los rangos empiezan en 1 pero los arrays en 0)
  const rankIndex = Math.max(0, rank - 1);
  return rankNames[Math.min(rankIndex, rankNames.length - 1)];
};

// Obtener el color del rango
const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return "text-amber-600 dark:text-amber-500"; // Bronce
    case 2: return "text-gray-400 dark:text-gray-300"; // Plata
    case 3: return "text-yellow-500 dark:text-yellow-400"; // Oro
    case 4: return "text-blue-400 dark:text-blue-300"; // Diamante
    case 5: return "text-purple-500 dark:text-purple-400"; // Platino
    default: return "text-amber-600 dark:text-amber-500"; // Bronce por defecto
  }
};

const getEmojiForRank = (index: number) => {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return `${index + 1}`;
  }
};

const getProfileColor = (name: string) => {
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

const getInitial = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

const getAchievementPercentage = (user: UserWithId) => {
  if (!user.achievements || !user.achievements.length) return 0;
  const unlockedCount = user.achievements.filter((a) => a.unlocked).length;
  return Math.round((unlockedCount / user.achievements.length) * 100);
};

// Variables para manejar el listener del estado del juego
let gameStateLoadedListener = null;
let timeoutId = null;

const handleGameStateLoaded = () => {
  console.log("UserRanking: Estado del juego cargado, emitiendo evento rankingPageVisited");
  window.dispatchEvent(new CustomEvent("rankingPageVisited"));
  
  // Limpiar el listener después de usarlo
  if (gameStateLoadedListener) {
    window.removeEventListener("gameStateLoaded", gameStateLoadedListener);
    gameStateLoadedListener = null;
  }
  
  // Limpiar el timeout si existe
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

onMounted(() => {
  loadRanking();
  
  // Configurar el listener para el evento de carga del estado del juego
  gameStateLoadedListener = handleGameStateLoaded;
  window.addEventListener("gameStateLoaded", gameStateLoadedListener);
  
  // Timeout de respaldo en caso de que el evento no se dispare
  timeoutId = setTimeout(() => {
    console.log("UserRanking: Timeout de respaldo - emitiendo evento rankingPageVisited");
    window.dispatchEvent(new CustomEvent("rankingPageVisited"));
    
    // Limpiar el listener si el timeout se ejecuta
    if (gameStateLoadedListener) {
      window.removeEventListener("gameStateLoaded", gameStateLoadedListener);
      gameStateLoadedListener = null;
    }
    timeoutId = null;
  }, 5000); // Timeout de respaldo de 5 segundos
});

// Limpiar listeners cuando el componente se desmonte
onUnmounted(() => {
  // Limpiar cualquier listener que pueda quedar
  if (typeof window !== 'undefined' && gameStateLoadedListener) {
    window.removeEventListener("gameStateLoaded", gameStateLoadedListener);
    gameStateLoadedListener = null;
  }
  
  // Limpiar timeout si existe
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
});
</script>

<template>
  <div class="space-y-6 mt-24">
    <!-- Manteniendo el estilo del título y botón como solicitado -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0"
    >
      <div>
        <h2
          class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent flex items-center gap-2"
        >
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          Ranking Global
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Los usuarios más destacados de la plataforma
        </p>
      </div>
      <button
        @click="loadRanking"
        class="w-full sm:w-auto px-6 py-2.5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md flex items-center justify-center gap-2 text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Actualizar Ranking
      </button>
    </div>

    <!-- Mensaje de error -->
    <div
      v-if="error"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md mb-4 animate-fade-in"
    >
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-3 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>{{ error }}</span>
      </div>
      <button
        class="absolute top-2 right-2 text-red-500 hover:text-red-700"
        @click="error = ''"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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

    <!-- Estado de carga -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-12"
    >
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-12 h-12 text-teal-500" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path
              fill="currentColor"
              d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
              class="spinner"
            />
          </svg>
        </div>
      </div>
      <p class="mt-4 text-teal-600 dark:text-teal-400 font-medium">
        Cargando ranking...
      </p>
    </div>

    <!-- Sin usuarios -->
    <div
      v-else-if="users.length === 0"
      class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
    >
      <div
        class="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
        No hay usuarios en el ranking
      </h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        Aún no hay datos de gamificación para mostrar. Los usuarios aparecerán
        aquí cuando comiencen a ganar puntos y logros.
      </p>
    </div>

    <!-- Contenido principal del ranking -->
    <div v-else class="space-y-8">
      <!-- Podio para los 3 primeros lugares - REDISEÑADO CON MÁS ESPACIO -->
      <div class="relative h-96 md:h-[450px] hidden md:block">
        <div class="flex justify-center items-end h-full">
          <!-- Segundo lugar -->
          <div class="relative mx-8 z-10">
            <div class="flex flex-col items-center">
              <div
                class="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-white font-bold text-xl mb-2"
                :style="{
                  backgroundColor: getProfileColor(users[1]?.displayName),
                }"
              >
                {{ getInitial(users[1]?.displayName) }}
              </div>
              <div class="text-center mb-3">
                <div class="text-3xl">🥈</div>
                <div class="font-bold truncate w-28 mx-auto dark:text-white">
                  {{ users[1]?.displayName || "Usuario" }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <span :class="getRankColor(users[1]?.userRank || 1)">{{ getRankName(users[1]?.userRank || 1) }}</span> • 
                  Nivel {{ users[1]?.userLevel }} • {{ users[1]?.userXp }} XP
                </div>
              </div>
              <div
                class="h-32 w-28 bg-gray-300 dark:bg-gray-700 rounded-t-lg flex items-end justify-center pb-2"
              >
                <span class="font-bold text-gray-700 dark:text-gray-300"
                  >2</span
                >
              </div>
            </div>
          </div>

          <!-- Primer lugar (más alto) -->
          <div class="relative mx-8 z-20">
            <div class="flex flex-col items-center">
              <div
                class="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-white font-bold text-2xl mb-2"
                :style="{
                  backgroundColor: getProfileColor(users[0]?.displayName),
                }"
              >
                {{ getInitial(users[0]?.displayName) }}
              </div>
              <div class="text-center mb-3">
                <div class="text-4xl">👑</div>
                <div class="font-bold truncate w-32 mx-auto dark:text-white">
                  {{ users[0]?.displayName || "Usuario" }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <span :class="getRankColor(users[0]?.userRank || 1)">{{ getRankName(users[0]?.userRank || 1) }}</span> • 
                  Nivel {{ users[0]?.userLevel }} • {{ users[0]?.userXp }} XP
                </div>
              </div>
              <div
                class="h-40 w-32 bg-yellow-400 dark:bg-yellow-600 rounded-t-lg flex items-end justify-center pb-2"
              >
                <span class="font-bold text-yellow-800 dark:text-yellow-100"
                  >1</span
                >
              </div>
            </div>
          </div>

          <!-- Tercer lugar -->
          <div class="relative mx-8 z-10">
            <div class="flex flex-col items-center">
              <div
                class="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-white font-bold text-xl mb-2"
                :style="{
                  backgroundColor: getProfileColor(users[2]?.displayName),
                }"
              >
                {{ getInitial(users[2]?.displayName) }}
              </div>
              <div class="text-center mb-3">
                <div class="text-3xl">🥉</div>
                <div class="font-bold truncate w-28 mx-auto dark:text-white">
                  {{ users[2]?.displayName || "Usuario" }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <span :class="getRankColor(users[2]?.userRank || 1)">{{ getRankName(users[2]?.userRank || 1) }}</span> • 
                  Nivel {{ users[2]?.userLevel }} • {{ users[2]?.userXp }} XP
                </div>
              </div>
              <div
                class="h-24 w-28 bg-amber-600 dark:bg-amber-800 rounded-t-lg flex items-end justify-center pb-2"
              >
                <span class="font-bold text-amber-100">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de usuarios en tarjetas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(user, index) in users"
          :key="user.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 relative"
          :class="{
            'md:hidden': index < 3 && users.length > 3,
            'border-[0.5px] border-yellow-400 dark:border-yellow-500': index === 0,
            'border-[0.5px] border-gray-300 dark:border-gray-400': index === 1,
            'border-[0.5px] border-amber-600 dark:border-amber-700': index === 2,
          }"
        >
          <!-- Fondo degradado superpuesto -->
          <div
            class="absolute inset-0 opacity-20"
            :class="[
              index === 0
                ? 'bg-gradient-to-br from-yellow-400/70 to-yellow-600/20 dark:from-yellow-500/70 dark:to-yellow-700/20'
                : index === 1
                ? 'bg-gradient-to-br from-gray-300/70 to-gray-500/20 dark:from-gray-400/70 dark:to-gray-600/20'
                : index === 2
                ? 'bg-gradient-to-br from-amber-600/70 to-amber-800/20 dark:from-amber-700/70 dark:to-amber-900/20'
                : 'bg-gradient-to-br from-teal-600/30 to-teal-800/20 dark:from-teal-600/70 dark:to-teal-800/20'
            ]"
          ></div>
          
          <div class="p-5 relative z-10">
            <div class="flex items-center">
              <!-- Posición -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4"
                :class="[
                  index === 0
                    ? 'bg-yellow-400 text-yellow-800 dark:bg-yellow-500 dark:text-yellow-100'
                    : index === 1
                    ? 'bg-gray-300 text-gray-800 dark:bg-gray-400 dark:text-gray-100'
                    : index === 2
                    ? 'bg-amber-600 text-white dark:bg-amber-700'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
                ]"
              >
                <span v-if="index < 3">{{ getEmojiForRank(index) }}</span>
                <span v-else>{{ index + 1 }}</span>
              </div>

              <!-- Avatar y nombre -->
              <div class="flex-1">
                <div class="flex items-center">
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3"
                    :style="{
                      backgroundColor: getProfileColor(user.displayName),
                    }"
                  >
                    {{ getInitial(user.displayName) }}
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-gray-800 dark:text-gray-200 flex items-center justify-between">
                      <span>{{ user.displayName || "Usuario" }}</span>
                      <span class="text-sm text-gray-500 dark:text-gray-400 md:hidden">{{ user.userXp }} XP</span>
                    </div>
                    <div class="flex items-center space-x-2 mt-1">
                      <!-- Rango -->
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="{
                          'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100': user.userRank === 1,
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': user.userRank === 2,
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100': user.userRank === 3,
                          'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100': user.userRank === 4,
                          'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100': user.userRank === 5
                        }"
                      >
                        <i class="fas fa-star text-[8px] mr-1"></i>
                        {{ getRankName(user.userRank || 1) }}
                      </span>
                      
                      <!-- Nivel -->
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="{
                          'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100': user.userRank === 1,
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': user.userRank === 2,
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100': user.userRank === 3,
                          'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100': user.userRank === 4,
                          'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100': user.userRank === 5
                        }"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-3 w-3 mr-1"
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
                        Nivel {{ user.userLevel }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Barra de progreso de logros -->
            <div class="mt-4">
              <div class="flex justify-between items-center mb-1">
                <span
                  class="text-xs font-medium text-gray-500 dark:text-gray-400"
                  >Logros</span
                >
                <span
                  class="text-xs font-medium text-teal-600 dark:text-teal-400"
                  >{{ getAchievementPercentage(user) }}%</span
                >
              </div>
              <div
                class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden"
              >
                <div
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="{
                    'bg-yellow-400': index === 0,
                    'bg-gray-400': index === 1,
                    'bg-amber-600': index === 2,
                    'bg-teal-500': index > 2,
                  }"
                  :style="{
                    width: `${getAchievementPercentage(user)}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  animation: spin 1.5s linear infinite;
  transform-origin: center;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
