<template>
  <div>
    <!-- Eliminado el botón desplegable - Ahora se muestra el contenido directamente -->
    <div class="w-full my-2">
      <div
        class="rounded-lg border w-full"
        :class="
          isDarkMode
            ? 'bg-gray-700/30 border-gray-600/50'
            : 'bg-white border-gray-200'
        "
      >
        <!-- Pestañas de categorías de logros -->
        <div
          class="flex border-b"
          :class="isDarkMode ? 'border-gray-600' : 'border-gray-200'"
        >
          <button
            v-for="(tab, tabIndex) in logrosCategories"
            :key="tabIndex"
            @click="activeCategory = tabIndex"
            class="flex-1 py-[5px] px-2 font-medium text-[13px] transition-all duration-200 text-center border-b-2"
            :class="[
              activeCategory === tabIndex
                ? tabIndex === 0
                  ? isDarkMode
                    ? 'text-blue-400 border-blue-500'
                    : 'text-blue-600 border-blue-500'
                  : tabIndex === 1
                  ? isDarkMode
                    ? 'text-purple-400 border-purple-500'
                    : 'text-purple-600 border-purple-500'
                  : tabIndex === 2
                  ? isDarkMode
                    ? 'text-amber-400 border-amber-500'
                    : 'text-amber-600 border-amber-500'
                  : ''
                : isDarkMode
                ? 'text-gray-300 hover:text-gray-100 border-transparent'
                : 'text-gray-600 hover:text-gray-800 border-transparent',
            ]"
          >
            {{ tab.name }}
            <span
              class="block text-[12px]"
              :class="[
                activeCategory === tabIndex
                  ? tabIndex === 0
                    ? isDarkMode
                      ? 'text-blue-400/80'
                      : 'text-blue-500/80'
                    : tabIndex === 1
                    ? isDarkMode
                      ? 'text-purple-400/80'
                      : 'text-purple-500/80'
                    : tabIndex === 2
                    ? isDarkMode
                      ? 'text-amber-400/80'
                      : 'text-amber-500/80'
                    : ''
                  : isDarkMode
                  ? 'text-gray-400/80'
                  : 'text-gray-500/80',
              ]"
            >
              ({{ calculateCategoryCompletionPercentage(tabIndex) }}%)
            </span>
          </button>
        </div>

        <div class="p-2">
          <div
            class="grid grid-cols-4 gap-2 transition-all duration-300 ease-in-out"
            @click.stop="closeAllTooltips"
          >
            <div
              v-for="(achievementId, loopIdx) in logrosCategories[
                activeCategory
              ].achievements"
              :key="achievementId"
              @click.stop="
                handleAchievementClick(
                  achievementId,
                  achievements[achievementId]
                )
              "
              :class="[
                'w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300',
                achievements[achievementId].unlocked
                  ? isDarkMode
                    ? `bg-gradient-to-br ${
                        getAchievementColors(achievementId).darkFrom
                      } ${
                        getAchievementColors(achievementId).darkTo
                      } shadow-lg ${
                        getAchievementColors(achievementId).darkShadow
                      }`
                    : `bg-gradient-to-br ${
                        getAchievementColors(achievementId).from
                      } ${getAchievementColors(achievementId).to} shadow-md ${
                        getAchievementColors(achievementId).shadow
                      }`
                  : isDarkMode
                  ? 'bg-gray-700/80 hover:bg-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200',
                'relative group cursor-help',
              ]"
            >
              <span
                :class="[
                  'text-xl',
                  achievements[achievementId].unlocked
                    ? 'opacity-100 scale-110 transition-transform duration-300'
                    : isDarkMode
                    ? 'opacity-30 text-gray-400'
                    : 'opacity-40 text-gray-500',
                ]"
                >{{ achievements[achievementId].icon }}</span
              >

              <!-- Locked overlay -->
              <div
                v-if="!achievements[achievementId].unlocked"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div
                  :class="[
                    isDarkMode ? 'opacity-80 text-white' : ' text-gray-500',
                  ]"
                >
                  <i class="fas fa-lock"></i>
                </div>
              </div>

              <!-- Tooltip solo para logros bloqueados o en hover de escritorio -->
              <div
                :class="[
                  'absolute bottom-full mb-2 w-40 z-10 transition-all duration-200', // Base classes
                  loopIdx % 4 === 3
                    ? 'right-0'
                    : 'left-1/2 transform -translate-x-1/2', // Conditional positioning
                  'pointer-events-none', // Deshabilitar eventos de puntero por defecto para hover
                  // Lógica de visibilidad móvil (click) - solo para bloqueados
                  !achievements[achievementId].unlocked &&
                  activeTooltipIndex === achievementId
                    ? 'opacity-100 scale-100 md:opacity-0 md:scale-95' // Visible en móvil si activo, oculto en escritorio
                    : 'opacity-0 scale-95', // Oculto si no está activo
                  // Lógica de visibilidad escritorio (hover) - solo para bloqueados o en desktop
                  'md:group-hover:opacity-100 md:group-hover:scale-100', // Visible en escritorio al hacer hover
                ]"
                @click.stop
              >
                <div
                  class="relative p-3 rounded-lg shadow-xl text-xs"
                  :class="
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white border border-gray-200 shadow-gray-200/50'
                  "
                >
                  <p
                    class="font-bold mb-1"
                    :class="isDarkMode ? 'text-white' : 'text-gray-800'"
                  >
                    {{ achievements[achievementId].name }}
                  </p>
                  <p :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    {{ achievements[achievementId].description }}
                  </p>
                  <div
                    class="mt-1 text-xs"
                    :class="isDarkMode ? 'text-amber-400' : 'text-amber-600'"
                  >
                    {{
                      achievements[achievementId].unlocked
                        ? "📖 " + achievements[achievementId].verse
                        : "Bloqueado"
                    }}
                    <i
                      v-if="!achievements[achievementId].unlocked"
                      class="fas fa-lock ml-1"
                    ></i>
                  </div>
                  <div
                    class="absolute -bottom-2 w-3 h-3 rotate-45"
                    :class="[
                      loopIdx % 4 === 3
                        ? 'right-6'
                        : 'left-1/2 transform -translate-x-1/2',
                      isDarkMode
                        ? 'bg-gray-800 border-r border-b border-gray-700'
                        : 'bg-white border-r border-b border-gray-200',
                    ]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement Notification -->
    <Teleport to="body">
      <div
        v-if="showAchievement"
        class="fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300"
        @click="closeAchievementNotification"
      ></div>
      <div
        v-if="showAchievement"
        :class="[
          'fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-lg z-[100] animate-bounce',
          `border-2 ${getNotificationBorderColor()}`,
        ]"
      >
        <div class="text-center">
          <button
            @click="closeAchievementNotification"
            class="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
          <div
            :class="[
              'flex items-center justify-center mb-2 w-16 h-16 mx-auto rounded-full bg-gradient-to-br',
              getAchievementGradientColors(latestAchievement),
            ]"
          >
            <span class="text-4xl">{{ latestAchievement.icon }}</span>
          </div>
          <h3 class="text-base sm:text-xl font-bold mb-1">¡Nuevo Logro!</h3>
          <p class="text-gray-300 mb-1">{{ latestAchievement.name }}</p>
          <p class="text-green-400 text-sm mb-1">
            +{{ latestAchievement.xp }} XP
          </p>
          <p class="text-amber-400 text-xs mt-1">
            📖 {{ latestAchievement.verse }}
          </p>
        </div>
      </div>
    </Teleport>

    <!-- Modal de logros desbloqueados -->
    <ModalLogros
      :achievement="selectedAchievement"
      :show="showModal"
      :dark-mode="isDarkMode"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  defineExpose,
  onMounted,
  onUnmounted,
} from "vue";
import { auth_api } from "../lib/api.ts";
import ModalLogros from "./ModalLogros.vue";

const props = defineProps({
  darkMode: {
    type: Boolean,
    default: false,
  },
  userRank: {
    type: Number,
    default: 1, // Usar rango 1 (Bronce) como valor predeterminado
  },
});

const emit = defineEmits(["achievement-unlocked", "xp-awarded"]);

// Theme state
const isDarkMode = computed(() => props.darkMode);

// Achievement UI state
// Ya no necesitamos showAchievements ref porque siempre se mostrarán los logros
// const showAchievements = ref(false);
const showAchievement = ref(false);
const latestAchievement = ref({});
const hasNewAchievement = ref(false);
// Indice del logro con tooltip activo (para dispositivos móviles)
const activeTooltipIndex = ref(null);

// Estado para el modal de logros desbloqueados
const showModal = ref(false);
const selectedAchievement = ref(null);

// Nombres de rangos
const rankNames = ["Bronce", "Plata", "Oro", "Diamante", "Platino"];

// Obtener el nombre del rango actual
const currentRankName = computed(() => {
  // Ajustar el índice para acceder al array (restar 1 porque los rangos empiezan en 1 pero los arrays en 0)
  const rankIndex = Math.max(0, props.userRank - 1);
  return rankNames[Math.min(rankIndex, rankNames.length - 1)];
});

// Logros
const achievements = ref([
  {
    icon: "🗝️",
    name: "Guardián de la Fe",
    description: "Cambia tu contraseña",
    unlocked: false,
    verse: "Salmo 23:1",
    xp: 20, // Logro básico
  },
  {
    icon: "😇",
    name: "Nueva Criatura",
    description: "Personaliza tu perfil",
    unlocked: false,
    verse: "2 Corintios 5:17",
    xp: 20, // Logro básico
  },
  {
    icon: "🏺",
    name: "Vasija Renovada",
    description: "Cambia el tema de la interfaz",
    unlocked: false,
    verse: "Isaías 64:8",
    xp: 20, // Logro básico
  },
  {
    icon: "📜",
    name: "Portador de Buenas Nuevas",
    description: "Agrega tu primer anuncio",
    unlocked: false,
    verse: "Isaías 52:7",
    xp: 20, // Primer anuncio
  },
  {
    icon: "📢",
    name: "Mensajero",
    description: "Agrega 3 anuncios",
    unlocked: false,
    verse: "Proverbios 25:25",
    xp: 50, // Logro intermedio
  },
  {
    icon: "📅",
    name: "Organizador",
    description: "Agrega 3 fechas",
    unlocked: false,
    verse: "Eclesiastés 3:1",
    xp: 50, // Logro intermedio
  },
  {
    icon: "📣",
    name: "Heraldo",
    description: "Agrega 10 anuncios",
    unlocked: false,
    verse: "Marcos 16:15",
    xp: 100, // Logro avanzado
  },
  {
    icon: "🗓️",
    name: "Planificador",
    description: "Agrega 10 fechas",
    unlocked: false,
    verse: "Proverbios 16:9",
    xp: 100, // Logro avanzado
  },
  {
    icon: "📯",
    name: "Atalaya",
    description: "Agrega 25 anuncios",
    unlocked: false,
    verse: "Ezequiel 33:6",
    xp: 200, // Logro experto
  },
  {
    icon: "📆",
    name: "Cronista de Dios",
    description: "Agrega 25 fechas",
    unlocked: false,
    verse: "Salmo 90:12",
    xp: 200, // Logro experto
  },
  {
    icon: "✏️",
    name: "Escriba",
    description: "Modifica 10 anuncios",
    unlocked: false,
    verse: "Jeremías 30:2",
    xp: 50, // Logro intermedio
  },
  {
    icon: "🔄",
    name: "Obrero Diligente",
    description: "Modifica 10 fechas",
    unlocked: false,
    verse: "Colosenses 3:23",
    xp: 50, // Logro intermedio
  },
  {
    icon: "🗑️",
    name: "Limpiador",
    description: "Elimina 5 anuncios",
    unlocked: false,
    verse: "Salmo 51:10",
    xp: 20, // Logro básico
  },
  {
    icon: "❌",
    name: "Purificador",
    description: "Elimina 5 fechas",
    unlocked: false,
    verse: "1 Juan 1:9",
    xp: 20, // Logro básico
  },
  {
    icon: "🎂",
    name: "Celebrador de la Vida",
    description: "Agrega una fecha con icono de cumpleaños",
    unlocked: false,
    verse: "Salmo 118:24",
    xp: 50, // Logro especial
  },
  {
    icon: "👨🏻",
    name: "Varón de Valor",
    description: "Agrega una fecha con icono de reunión de varones",
    unlocked: false,
    verse: "Josué 1:9",
    xp: 50, // Logro especial
  },
  {
    icon: "👩🏽",
    name: "Mujer Virtuosa",
    description: "Agrega una fecha con icono de reunión de damas",
    unlocked: false,
    verse: "Proverbios 31:10",
    xp: 50, // Logro especial
  },
  {
    icon: "❤️",
    name: "Dador Alegre",
    description: "Agrega una fecha con icono de canasta de amor",
    unlocked: false,
    verse: "2 Corintios 9:7",
    xp: 50, // Logro especial
  },
  {
    icon: "🍷",
    name: "En Memoria de Él",
    description: "Agrega una fecha con icono de cena del Señor",
    unlocked: false,
    verse: "1 Corintios 11:24",
    xp: 50, // Logro especial
  },
  {
    icon: "🌱",
    name: "Semilla de Mostaza",
    description: "Alcanza el nivel 3",
    unlocked: false,
    verse: "Mateo 13:31-32",
    xp: 30, // Logro inicial de progresión
  },
  {
    icon: "⭐",
    name: "Siervo Fiel",
    description: "Alcanza el nivel 5",
    unlocked: false,
    verse: "Mateo 25:21",
    xp: 50, // Logro de progresión
  },
  {
    icon: "🌠",
    name: "Resplandor Divino",
    description: "Alcanza el nivel 7",
    unlocked: false,
    verse: "Daniel 12:3",
    xp: 70, // Logro de progresión intermedio
  },
  {
    icon: "🌟",
    name: "Buen Mayordomo",
    description: "Alcanza el nivel 9",
    unlocked: false,
    verse: "1 Corintios 4:2",
    xp: 90, // Logro de progresión avanzado
  },
  {
    icon: "🥉",
    name: "Medalla de Bronce",
    description: "Alcanza el nivel máximo del rango Bronce (nivel 10)",
    unlocked: false,
    verse: "1 Corintios 9:25",
    xp: 100, // Logro de rango
  },
  {
    icon: "🥈",
    name: "Medalla de Plata",
    description: "Alcanza el nivel máximo del rango Plata (nivel 10)",
    unlocked: false,
    verse: "Proverbios 25:11",
    xp: 150, // Logro de rango
  },
  {
    icon: "🥇",
    name: "Medalla de Oro",
    description: "Alcanza el nivel máximo del rango Oro (nivel 10)",
    unlocked: false,
    verse: "Job 23:10",
    xp: 200, // Logro de rango
  },
  {
    icon: "💎",
    name: "Diamante",
    description: "Alcanza el nivel máximo del rango Diamante (nivel 10)",
    unlocked: false,
    verse: "Zacarías 9:16",
    xp: 250, // Logro de rango
  },
]);

const unlockedAchievements = computed(() => {
  return achievements.value.filter((a) => a.unlocked).length;
});

const totalAchievements = computed(() => {
  return achievements.value.length;
});

// Estado para las pestañas de categorías de logros
const activeCategory = ref(0);

// Categorías de logros
const logrosCategories = ref([
  {
    name: "Contenido",
    achievements: [3, 4, 6, 8, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // Logros relacionados con anuncios y fechas
    colors: {
      from: "from-blue-400",
      to: "to-blue-600",
      shadow: "shadow-blue-500/20",
      darkFrom: "from-blue-500",
      darkTo: "to-blue-700",
      darkShadow: "shadow-blue-700/30",
    },
  },
  {
    name: "Niveles",
    achievements: [19, 20, 21, 22, 23, 24, 25, 26], // Logros relacionados con nivel y rangos
    colors: {
      from: "from-purple-400",
      to: "to-purple-600",
      shadow: "shadow-purple-500/20",
      darkFrom: "from-purple-500",
      darkTo: "to-purple-700",
      darkShadow: "shadow-purple-700/30",
    },
  },
  {
    name: "Sistema",
    achievements: [0, 1, 2], // Logros básicos del sistema
    colors: {
      from: "from-amber-400",
      to: "to-amber-600",
      shadow: "shadow-amber-500/20",
      darkFrom: "from-amber-500",
      darkTo: "to-amber-700",
      darkShadow: "shadow-amber-700/30",
    },
  },
]);

// Cargar logros desde el estado del juego
const loadAchievements = (gameState) => {
  if (!gameState?.achievements || !Array.isArray(gameState.achievements)) {
    console.warn("No hay logros para cargar o formato incorrecto");
    return;
  }

  // Actualizar estado de desbloqueo para cada logro
  gameState.achievements.forEach((achievement, index) => {
    if (
      index < achievements.value.length &&
      typeof achievement === "object" &&
      achievement.hasOwnProperty("unlocked")
    ) {
      achievements.value[index].unlocked = achievement.unlocked;
    }
  });

  // Verificar si hay nuevos logros desbloqueados
  const hasUnlocked = achievements.value.some((a) => a.unlocked);
  hasNewAchievement.value = hasUnlocked;

  // Verificar logros de rango si hay información de rango y nivel
  if (gameState.userRank !== undefined) {
    // Pasamos el rango y el nivel actual del usuario
    checkRankAchievements(gameState.userRank, gameState.userLevel || 0);
  } else {
    // Si no hay información de rango, usamos valores por defecto
    checkRankAchievements(1, 0);
  }
};

// Función para limpiar datos de logros en localStorage
const clearAchievementsLocalStorage = () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  const userId = user.uid;
  try {
    // Limpiar logros específicos
    localStorage.removeItem(`achievements_${userId}`);
    localStorage.removeItem(`haCreado_Cumpleanos_${userId}`);
    localStorage.removeItem(`haCreado_ReunionVarones_${userId}`);
    localStorage.removeItem(`haCreado_ReunionDamas_${userId}`);
    localStorage.removeItem(`haCreado_CanastaDeAmor_${userId}`);
    localStorage.removeItem(`haCreado_CenaDelSenor_${userId}`);
    console.log("Datos de logros eliminados del localStorage");
  } catch (error) {
    console.error("Error al limpiar datos de logros del localStorage:", error);
  }
};

// Función para sincronizar logros con localStorage
const syncAchievementsToLocalStorage = (achievementsData) => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  const userId = user.uid;
  try {
    // Asegurarnos de que todos los logros tengan sus versículos correspondientes
    const dataToSave = achievementsData.map((achievement, index) => {
      // Si falta el versículo, usar el de la definición original
      if (!achievement.verse && index < achievements.value.length) {
        return {
          ...achievement,
          verse: achievements.value[index].verse,
        };
      }
      return achievement;
    });

    localStorage.setItem(`achievements_${userId}`, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Error al guardar logros en localStorage:", error);
  }
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

    // Asegurarnos de que el logro tenga un versículo asignado
    if (!achievements.value[index].verse) {
      // Lista de versículos por defecto en caso de que falte
      const versiculosPorDefecto = [
        "2 Timoteo 4:7",
        "2 Corintios 5:17",
        "Isaías 64:8",
        "Isaías 52:7",
        "Proverbios 25:25",
        "Eclesiastés 3:1",
        "Marcos 16:15",
        "Proverbios 16:9",
        "Ezequiel 33:6",
        "Salmo 90:12",
        "Jeremías 30:2",
        "Colosenses 3:23",
        "Salmo 51:10",
        "1 Juan 1:9",
        "Salmo 118:24",
        "Josué 1:9",
        "Proverbios 31:10",
        "Mateo 25:21",
        "1 Corintios 4:2",
        "Apocalipsis 2:10",
      ];
      // Asignar un versículo por defecto según el índice
      achievements.value[index].verse =
        index < versiculosPorDefecto.length
          ? versiculosPorDefecto[index]
          : "Salmo 23";
    }

    achievements.value[index].unlocked = true;
    latestAchievement.value = achievements.value[index];
    showAchievement.value = true;
    hasNewAchievement.value = true;

    // Notificar al componente padre
    emit("achievement-unlocked");

    // Conceder XP específico del logro
    const xpToAward = achievements.value[index].xp || 10;
    emit("xp-awarded", xpToAward);

    // Sincronizar inmediatamente con localStorage
    syncAchievementsToLocalStorage(achievements.value);
  } else {
    console.log(`Logro ya desbloqueado: ${achievements.value[index].name}`);
  }
};

// Verificación de logros basados en estadísticas
const checkAchievementsFromStats = () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  // Obtener estadísticas del localStorage
  const userId = user.uid || "invitado";
  const contadorKey = `estadisticasContador_${userId}`;
  const datosGuardados = localStorage.getItem(contadorKey);

  // Verificar si se ha creado un evento de cumpleaños
  const haCreatedoCumpleanos = localStorage.getItem(
    `haCreado_Cumpleanos_${userId}`
  );
  if (haCreatedoCumpleanos === "true") {
    console.log("Desbloqueando logro Celebrador (cumpleaños)");
    unlockAchievement(14); // Logro "Celebrador de la Vida"
  }

  // Verificar si se ha creado un evento de reunión de varones
  const haCreadoReunionVarones = localStorage.getItem(
    `haCreado_ReunionVarones_${userId}`
  );
  if (haCreadoReunionVarones === "true") {
    console.log("Desbloqueando logro Varón de Valor");
    unlockAchievement(15); // Logro "Varón de Valor"
  }

  // Verificar si se ha creado un evento de reunión de damas
  const haCreadoReunionDamas = localStorage.getItem(
    `haCreado_ReunionDamas_${userId}`
  );
  if (haCreadoReunionDamas === "true") {
    console.log("Desbloqueando logro Mujer Virtuosa");
    unlockAchievement(16); // Logro "Mujer Virtuosa"
  }

  // Verificar si se ha creado un evento de canasta de amor
  const haCreadoCanastaDeAmor = localStorage.getItem(
    `haCreado_CanastaDeAmor_${userId}`
  );
  if (haCreadoCanastaDeAmor === "true") {
    console.log("Desbloqueando logro Dador Alegre");
    unlockAchievement(17); // Logro "Dador Alegre"
  }

  // Verificar si se ha creado un evento de cena del Señor
  const haCreadoCenaDelSenor = localStorage.getItem(
    `haCreado_CenaDelSenor_${userId}`
  );
  if (haCreadoCenaDelSenor === "true") {
    console.log("Desbloqueando logro En Memoria de Él");
    unlockAchievement(18); // Logro "En Memoria de Él"
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
    } catch (error) {
      console.error("Error al procesar estadísticas para logros:", error);
    }
  }
};

// Función para verificar logros de nivel
const checkLevelAchievements = (level) => {
  // Logros basados en nivel
  if (level >= 3) {
    unlockAchievement(19); // Semilla de Mostaza - Nivel 3
  }
  if (level >= 5) {
    unlockAchievement(20); // Siervo Fiel - Nivel 5
  }
  if (level >= 7) {
    unlockAchievement(21); // Resplandor Divino - Nivel 7
  }
  if (level >= 9) {
    unlockAchievement(22); // Buen Mayordomo - Nivel 9
  }
};

// Función para verificar logros de rango y nivel máximo
const checkRankAchievements = (rank, level) => {
  // Logros basados en rango y nivel máximo (nivel 10 de cada rango)
  if (rank == 1 && level >= 10) {
    unlockAchievement(23); // Medalla de Bronce - Nivel máximo del rango Bronce
  }
  if (rank == 2 && level >= 10) {
    unlockAchievement(24); // Medalla de Plata - Nivel máximo del rango Plata
  }
  if (rank == 3 && level >= 10) {
    unlockAchievement(25); // Medalla de Oro - Nivel máximo del rango Oro
  }
  if (rank == 4 && level >= 10) {
    unlockAchievement(26); // Diamante Precioso - Nivel máximo del rango Diamante
  }
};

// Función para forzar la sincronización desde Firebase (ignorando localStorage)
const forceFirebaseSync = async () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  try {
    // Guardar la configuración actual de versículos
    const versiculosActuales = achievements.value.map(
      (achievement) => achievement.verse
    );

    // Limpiar datos locales primero
    clearAchievementsLocalStorage();

    // Configurar un listener para restaurar los versículos después de la recarga
    const handleReload = () => {
      // Restaurar versículos después de la carga
      setTimeout(() => {
        achievements.value.forEach((achievement, index) => {
          if (index < versiculosActuales.length) {
            achievement.verse = versiculosActuales[index];
          }
        });
        // Sincronizar de nuevo para guardar los versículos
        syncAchievementsToLocalStorage(achievements.value);
      }, 1000); // Dar tiempo a que se complete la carga

      // Eliminar el listener después de usarlo
      window.removeEventListener("gameStateLoaded", handleReload);
    };

    // Escuchar el evento de carga completada
    window.addEventListener("gameStateLoaded", handleReload);

    // Esto disparará una recarga completa desde Firebase
    window.dispatchEvent(new CustomEvent("forceGameStateReload"));

    console.log("Sincronización forzada con Firebase solicitada");
    return true;
  } catch (error) {
    console.error("Error al forzar sincronización con Firebase:", error);
    return false;
  }
};

// Cerrar tooltip cuando se toca fuera
const closeAllTooltips = (event) => {
  // Si se proporciona un evento, detenemos su propagación
  if (event) {
    event.stopPropagation();
  }

  // Solo cerramos tooltips si hay alguno abierto
  if (activeTooltipIndex.value !== null) {
    console.log("Cerrando todos los tooltips");
    // Pequeño delay para evitar conflictos
    setTimeout(() => {
      activeTooltipIndex.value = null;
    }, 5);
  }
};

// Función para manejar el clic en un logro
const handleAchievementClick = (achievementId, achievement) => {
  // Si el logro está desbloqueado, mostrar el modal con detalles completos
  if (achievement && achievement.unlocked) {
    // Preparar el objeto del logro para el modal, incluyendo su ID
    selectedAchievement.value = {
      ...achievement,
      id: achievementId,
    };
    showModal.value = true;
  } else {
    // Si el logro está bloqueado, mostrar/ocultar el tooltip
    toggleTooltip(null, achievementId);
  }
};

// Función para cerrar el modal de logros desbloqueados
const closeModal = () => {
  showModal.value = false;
  selectedAchievement.value = null;
};

// Función para alternar el tooltip en dispositivos móviles (solo para logros bloqueados)
const toggleTooltip = (event, index) => {
  // Detener propagación si hay evento
  if (event) {
    event.stopPropagation();
  }

  // Verificar si el índice actual es exactamente igual al índice seleccionado
  if (activeTooltipIndex.value === index) {
    // Si es el mismo que ya está activo, lo cerramos
    activeTooltipIndex.value = null;
  } else {
    // Si es diferente o no hay ninguno activo, activamos este
    activeTooltipIndex.value = index;
  }
};

// Función para cerrar tooltips al hacer clic en cualquier lugar
const handleGlobalClick = (event) => {
  // Verificar si el evento no proviene de un tooltip o un icono de logro
  // Solo cerramos si hay un tooltip abierto
  if (activeTooltipIndex.value !== null) {
    // Añadir un pequeño retraso para evitar conflictos con el evento de clic
    setTimeout(() => {
      activeTooltipIndex.value = null;
    }, 10);
  }
};

// Agregar/remover event listener global
onMounted(() => {
  // Usamos un timeout para evitar que el evento se dispare inmediatamente al montar
  setTimeout(() => {
    window.addEventListener("click", handleGlobalClick);
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener("click", handleGlobalClick);
});

// Propiedades y métodos expuestos al componente padre
defineExpose({
  unlockAchievement,
  checkAchievementsFromStats,
  checkLevelAchievements,
  checkRankAchievements,
  loadAchievements,
  clearAchievementsLocalStorage,
  syncAchievementsToLocalStorage,
  forceFirebaseSync,
  achievements,
  hasNewAchievement,
});

// Función para calcular el porcentaje de completación de una categoría
const calculateCategoryCompletionPercentage = (categoryIndex) => {
  const category = logrosCategories.value[categoryIndex];
  if (
    !category ||
    !category.achievements ||
    category.achievements.length === 0
  ) {
    return 0;
  }
  const unlockedInCategory = category.achievements.filter(
    (id) => achievements.value[id]?.unlocked
  ).length;
  const totalInCategory = category.achievements.length;
  return Math.round((unlockedInCategory / totalInCategory) * 100);
};

// Función para obtener los colores según la categoría
const getAchievementColors = (index) => {
  // Encontrar a qué categoría pertenece este logro
  for (let i = 0; i < logrosCategories.value.length; i++) {
    if (logrosCategories.value[i].achievements.includes(index)) {
      return logrosCategories.value[i].colors;
    }
  }
  // Si no se encuentra en ninguna categoría, devolver colores por defecto (amber)
  return {
    from: "from-amber-400",
    to: "to-amber-600",
    shadow: "shadow-amber-500/20",
    darkFrom: "from-amber-500",
    darkTo: "to-amber-700",
    darkShadow: "shadow-amber-700/30",
  };
};

// Función para obtener el color del borde de la notificación
const getNotificationBorderColor = () => {
  // Buscar el índice del logro desbloqueado
  const achievementIndex = achievements.value.findIndex(
    (a) => a.name === latestAchievement.value?.name
  );
  if (achievementIndex === -1) return "border-yellow-500";

  // Buscar la categoría a la que pertenece
  for (let i = 0; i < logrosCategories.value.length; i++) {
    if (logrosCategories.value[i].achievements.includes(achievementIndex)) {
      // Usar un color basado en la categoría
      if (i === 0) return "border-blue-500"; // Contenido
      if (i === 1) return "border-purple-500"; // Niveles
      if (i === 2) return "border-amber-500"; // Sistema
    }
  }

  return "border-yellow-500"; // Color por defecto
};

// Función para obtener los colores de gradiente para la notificación de logro
const getAchievementGradientColors = (achievement) => {
  if (!achievement) return "";

  // Buscar el índice del logro desbloqueado
  const achievementIndex = achievements.value.findIndex(
    (a) => a.name === achievement.name
  );

  if (achievementIndex === -1) return "";

  // Buscar la categoría a la que pertenece
  for (let i = 0; i < logrosCategories.value.length; i++) {
    if (logrosCategories.value[i].achievements.includes(achievementIndex)) {
      // Devolver las clases de gradiente basadas en la categoría
      if (i === 0) return "from-blue-500 to-blue-700"; // Contenido
      if (i === 1) return "from-purple-500 to-purple-700"; // Niveles
      if (i === 2) return "from-amber-500 to-amber-700"; // Sistema
    }
  }

  return "from-yellow-500 to-yellow-700"; // Valor por defecto
};

// Función para cerrar la notificación de logro manualmente
const closeAchievementNotification = () => {
  showAchievement.value = false;
};
</script>

<style scoped>
@keyframes bounce {
  0% {
    transform: translateX(-50%) translateY(-30px);
  }
  20% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-15px);
  }
  60% {
    transform: translateX(-50%) translateY(0);
  }
  80% {
    transform: translateX(-50%) translateY(-5px);
  }
  100% {
    transform: translateX(-50%) translateY(0);
  }
}

.animate-bounce {
  animation: bounce 2s ease forwards;
  animation-iteration-count: 1;
}
</style>
