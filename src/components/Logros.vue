<template>
  <div>
    <div class="w-full">
      <div
        class="w-full bg-white border-gray-200 dark:bg-transparent dark:border-gray-600/50"
      >
        <!-- Pestañas de categorías de logros -->
        <div class="flex border-b relative border-gray-200 dark:border-gray-600">
          <!-- Indicador de tab activo animado -->
          <div
            class="absolute bottom-0 h-0.5 transition-all duration-300 ease-out"
            :class="[
              activeCategory === 0 ? 'bg-blue-600 dark:bg-blue-500' : '',
              activeCategory === 1 ? 'bg-purple-600 dark:bg-purple-500' : '',
              activeCategory === 2 ? 'bg-amber-600 dark:bg-amber-500' : '',
            ]"
            :style="{
              width: `${100 / logrosCategories.length}%`,
              left: `${(activeCategory * 100) / logrosCategories.length}%`
            }"
          ></div>

          <button
            v-for="(tab, tabIndex) in logrosCategories"
            :key="tabIndex"
            @click="activeCategory = tabIndex"
            class="flex-1 py-[4px] px-2 font-medium text-[13px] transition-all duration-300 text-center border-b-2 border-transparent relative"
            :class="[
              activeCategory === tabIndex
                ? tabIndex === 0
                  ? 'text-blue-600 bg-linear-to-t from-blue-200/40 to-transparent dark:text-blue-400 dark:from-blue-500/30'
                  : tabIndex === 1
                  ? 'text-purple-600 bg-linear-to-t from-purple-200/40 to-transparent dark:text-purple-400 dark:from-purple-500/30'
                  : tabIndex === 2
                  ? 'text-amber-600 bg-linear-to-t from-amber-200/40 to-transparent dark:text-amber-400 dark:from-amber-500/30'
                  : ''
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700/30',
            ]"
          >
            <span class="relative z-10">{{ tab.name }}</span>
            <span
              class="block text-[12px] relative z-10"
              :class="[
                activeCategory === tabIndex
                  ? tabIndex === 0
                    ? 'text-blue-500/80 dark:text-blue-400/80'
                    : tabIndex === 1
                    ? 'text-purple-500/80 dark:text-purple-400/80'
                    : tabIndex === 2
                    ? 'text-amber-500/80 dark:text-amber-400/80'
                    : ''
                  : 'text-gray-500/80 dark:text-gray-400/80',
              ]"
            >
              ({{ calculateCategoryCompletionPercentage(tabIndex) }}%)
            </span>
          </button>
        </div>

        <div class="p-4 dark:bg-gray-700/30">
          <div
            class="grid grid-cols-4 gap-2 transition-all duration-300 ease-in-out animate-fadeIn"
            @click.stop="closeAllTooltips"
            :key="activeCategory"
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
                  ? `bg-linear-to-br shadow-md hover:brightness-110 cursor-pointer ${getAchievementColors(achievementId).from} ${getAchievementColors(achievementId).to} ${getAchievementColors(achievementId).shadow} ${getAchievementColors(achievementId).darkFrom} ${getAchievementColors(achievementId).darkTo} ${getAchievementColors(achievementId).darkShadow}`
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/80 dark:hover:bg-gray-700 cursor-help',
                'relative group',
              ]"
            >
              <img
                :src="achievements[achievementId].icon"
                :alt="achievements[achievementId].name"
                class="w-12 h-12 object-contain transition-transform duration-300"
                :class="[
                  achievements[achievementId].unlocked
                    ? 'opacity-100 scale-110'
                    : 'opacity-60 grayscale',
                ]"
              />

              <!-- Locked overlay -->
              <div
                v-if="!achievements[achievementId].unlocked"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="text-gray-500 dark:opacity-80 dark:text-white">
                  <i class="fas fa-lock"></i>
                </div>
              </div>

              <!-- Tooltip solo para logros bloqueados -->
              <div
                v-if="!achievements[achievementId].unlocked"
                :class="[
                  'absolute bottom-full mb-2 w-40 z-60 transition-all duration-200', // Base classes
                  loopIdx % 4 === 0 // Si es el primer elemento de la fila
                    ? 'left-0' // Alinear a la izquierda
                    : loopIdx % 4 === 3 // Si es el último elemento de la fila
                    ? 'right-0' // Alinear a la derecha
                    : 'left-1/2 transform -translate-x-1/2', // Centrado por defecto
                  'pointer-events-none', // Deshabilitar eventos de puntero por defecto para hover
                  // Lógica de visibilidad móvil (click) - solo para bloqueados
                  activeTooltipIndex === achievementId
                    ? 'opacity-100 scale-100 md:opacity-0 md:scale-95' // Visible en móvil si activo, oculto en escritorio
                    : 'opacity-0 scale-95', // Oculto si no está activo
                  // Lógica de visibilidad escritorio (hover) - solo para bloqueados
                  'md:group-hover:opacity-100 md:group-hover:scale-100', // Visible en escritorio al hacer hover
                ]"
                @click.stop
              >
                <div
                  class="relative p-3 rounded-lg text-[13px] bg-white border border-gray-200 shadow-md shadow-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  :class="getAchievementColors(achievementId).darkShadow"
                >
                  <p class="font-bold mb-1 text-gray-800 dark:text-white">
                    {{ achievements[achievementId].name }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    {{ achievements[achievementId].description }}
                  </p>
                  <div class="mt-1 text-xs text-amber-600 dark:text-amber-400">
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
                    class="absolute -bottom-2 w-3 h-3 rotate-45 bg-white border-r border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    :class="
                      loopIdx % 4 === 0
                        ? 'left-4'
                        : loopIdx % 4 === 3
                        ? 'right-4'
                        : 'left-1/2 transform -translate-x-1/2'
                    "
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
        class="fixed inset-0 bg-black/50 z-99 transition-opacity duration-300"
        @click="closeAchievementNotification"
      ></div>
      <div
        v-if="showAchievement"
        :class="[
          'fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-lg z-100 animate-bounce',
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
              'flex items-center justify-center mb-2 w-16 h-16 mx-auto rounded-full bg-linear-to-br',
              getAchievementGradientColors(latestAchievement),
            ]"
          >
            <img
              v-if="latestAchievement && latestAchievement.icon"
              :src="latestAchievement.icon"
              :alt="latestAchievement.name || 'Logro desbloqueado'"
              class="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            />
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
      v-if="selectedAchievement && Object.keys(selectedAchievement).length > 0"
      :achievement="selectedAchievement"
      :show="showModal"
      :dark-mode="isDarkMode"
      @close="closeModal"
      :key="'modal-logros-' + (selectedAchievement.id || Math.random())"
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
  nextTick,
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

// Theme state - reactivo a la clase `dark` en <html> (fuente de verdad real del tema)
const isDarkMode = ref(
  typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
);

let darkObserver = null;
onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains("dark");
  darkObserver = new MutationObserver(() => {
    isDarkMode.value = document.documentElement.classList.contains("dark");
  });
  darkObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

onUnmounted(() => {
  if (darkObserver) darkObserver.disconnect();
});

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
const selectedAchievement = ref({});

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
    icon: "/Iconos/GuardianFe.webp",
    name: "Guardián de la Fe",
    description: "Cambia tu contraseña",
    unlocked: false,
    verse: "Salmo 23:1",
    xp: 20, // Logro básico
  },
  {
    icon: "/Iconos/NuevaCriatura.webp",
    name: "Nueva Criatura",
    description: "Personaliza tu perfil",
    unlocked: false,
    verse: "2 Corintios 5:17",
    xp: 20, // Logro básico
  },
  {
    icon: "/Iconos/Vasija renovada.webp",
    name: "Vasija Renovada",
    description: "Cambia el tema de la interfaz",
    unlocked: false,
    verse: "Isaías 64:8",
    xp: 20, // Logro básico
  },
  {
    icon: "/Iconos/PortadorBuenaNuevas.webp",
    name: "Portador de Buenas Nuevas",
    description: "Agrega tu primer anuncio",
    unlocked: false,
    verse: "Isaías 52:7",
    xp: 20, // Primer anuncio
  },
  {
    icon: "/Iconos/Mensajero.webp",
    name: "Mensajero",
    description: "Agrega 3 anuncios",
    unlocked: false,
    verse: "Proverbios 25:25",
    xp: 50, // Logro intermedio
  },
  {
    icon: "/Iconos/Organizador.webp",
    name: "Organizador",
    description: "Agrega 3 fechas",
    unlocked: false,
    verse: "Eclesiastés 3:1",
    xp: 50, // Logro intermedio
  },
  {
    icon: "/Iconos/Heraldo.webp",
    name: "Heraldo",
    description: "Agrega 10 anuncios",
    unlocked: false,
    verse: "Marcos 16:15",
    xp: 100, // Logro avanzado
  },
  {
    icon: "/Iconos/Planificador.webp",
    name: "Planificador",
    description: "Agrega 10 fechas",
    unlocked: false,
    verse: "Proverbios 16:9",
    xp: 100, // Logro avanzado
  },
  {
    icon: "/Iconos/Atalaya.webp",
    name: "Atalaya",
    description: "Agrega 25 anuncios",
    unlocked: false,
    verse: "Ezequiel 33:6",
    xp: 200, // Logro experto
  },
  {
    icon: "/Iconos/Cronista.webp",
    name: "Cronista de Dios",
    description: "Agrega 25 fechas",
    unlocked: false,
    verse: "Salmo 90:12",
    xp: 200, // Logro experto
  },
  {
    icon: "/Iconos/Escriba.webp",
    name: "Escriba",
    description: "Modifica 10 anuncios",
    unlocked: false,
    verse: "Jeremías 30:2",
    xp: 50, // Logro intermedio
  },
  {
    icon: "/Iconos/ObreroDiligente.webp",
    name: "Obrero Diligente",
    description: "Modifica 10 fechas",
    unlocked: false,
    verse: "Colosenses 3:23",
    xp: 50, // Logro intermedio
  },
  {
    icon: "/Iconos/Limpiador.webp",
    name: "Limpiador",
    description: "Elimina 5 anuncios",
    unlocked: false,
    verse: "Salmo 51:10",
    xp: 20, // Logro básico
  },
  {
    icon: "/Iconos/Purificador.webp",
    name: "Purificador",
    description: "Elimina 5 fechas",
    unlocked: false,
    verse: "1 Juan 1:9",
    xp: 20, // Logro básico
  },
  {
    icon: "/Iconos/Celebrador.webp",
    name: "Celebrador de la Vida",
    description: "Agrega una fecha con icono de cumpleaños",
    unlocked: false,
    verse: "Salmo 118:24",
    xp: 50, // Logro especial
  },
  {
    icon: "/Iconos/Varon.webp",
    name: "Varón de Valor",
    description: "Agrega una fecha con icono de reunión de varones",
    unlocked: false,
    verse: "Josué 1:9",
    xp: 50, // Logro especial
  },
  {
    icon: "/Iconos/Mujer.webp",
    name: "Mujer Virtuosa",
    description: "Agrega una fecha con icono de reunión de damas",
    unlocked: false,
    verse: "Proverbios 31:10",
    xp: 50, // Logro especial
  },
  {
    icon: "/Iconos/DadorAlegre.webp",
    name: "Dador Alegre",
    description: "Agrega una fecha con icono de canasta de amor",
    unlocked: false,
    verse: "2 Corintios 9:7",
    xp: 50, // Logro especial
  },
  {
    icon: "/Iconos/EnMemoriaDeEl.webp",
    name: "En Memoria de Él",
    description: "Agrega una fecha con icono de cena del Señor",
    unlocked: false,
    verse: "1 Corintios 11:24",
    xp: 50, // Logro especial
  },
  {
    icon: "/Iconos/Semilla de mostaza.webp",
    name: "Semilla de Mostaza",
    description: "Alcanza el nivel 3",
    unlocked: false,
    verse: "Mateo 13:31-32",
    xp: 30, // Logro inicial de progresión
  },
  {
    icon: "/Iconos/Siervo fiel.webp",
    name: "Siervo Fiel",
    description: "Alcanza el nivel 5",
    unlocked: false,
    verse: "Mateo 25:21",
    xp: 50, // Logro de progresión
  },
  {
    icon: "/Iconos/Resplandor.webp",
    name: "Resplandor Divino",
    description: "Alcanza el nivel 7",
    unlocked: false,
    verse: "Daniel 12:3",
    xp: 70, // Logro de progresión intermedio
  },
  {
    icon: "/Iconos/BuenMayordomo.webp",
    name: "Buen Mayordomo",
    description: "Alcanza el nivel 9",
    unlocked: false,
    verse: "1 Corintios 4:2",
    xp: 90, // Logro de progresión avanzado
  },
  {
    icon: "/Iconos/Bronce.webp",
    name: "Medalla de Bronce",
    description: "Alcanza el nivel máximo del rango Bronce (nivel 10)",
    unlocked: false,
    verse: "1 Corintios 9:25",
    xp: 100, // Logro de rango
  },
  {
    icon: "/Iconos/Plata.webp",
    name: "Medalla de Plata",
    description: "Alcanza el nivel máximo del rango Plata (nivel 10)",
    unlocked: false,
    verse: "Proverbios 25:11",
    xp: 150, // Logro de rango
  },
  {
    icon: "/Iconos/Oro.webp",
    name: "Medalla de Oro",
    description: "Alcanza el nivel máximo del rango Oro (nivel 10)",
    unlocked: false,
    verse: "Job 23:10",
    xp: 200, // Logro de rango
  },
  {
    icon: "/Iconos/Diamante.webp",
    name: "Diamante",
    description: "Alcanza el nivel máximo del rango Diamante (nivel 10)",
    unlocked: false,
    verse: "Zacarías 9:16",
    xp: 250, // Logro de rango
  },
  {
    icon: "/Iconos/Corona.webp",
    name: "Corredor por la Corona",
    description: "Visita la página de ranking global",
    unlocked: false,
    verse: "1 Corintios 9:24",
    xp: 30, // Logro de sistema
  },
  {
    icon: "/Iconos/RachaInicial.webp",
    name: "Racha Inicial",
    description: "Mantén una racha de 2 semanas consecutivas",
    unlocked: false,
    verse: "Hebreos 10:36",
    xp: 40, // Logro de streak básico
  },
  {
    icon: "/Iconos/Constancia.webp",
    name: "Constancia",
    description: "Mantén una racha de 3 semanas consecutivas",
    unlocked: false,
    verse: "Gálatas 6:9",
    xp: 60, // Logro de streak intermedio
  },
  {
    icon: "/Iconos/Perseverancia.webp",
    name: "Perseverancia",
    description: "Mantén una racha de 5 semanas consecutivas",
    unlocked: false,
    verse: "Santiago 1:12",
    xp: 100, // Logro de streak avanzado
  },
  {
    icon: "/Iconos/ArmoniaPerfecta.webp",
    name: "Armonía Perfecta",
    description: "Mantén ambas rachas simultáneamente por 2 semanas",
    unlocked: false,
    verse: "Eclesiastés 3:1",
    xp: 80, // Logro de streak especial
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
      darkFrom: "dark:from-blue-500",
      darkTo: "dark:to-blue-700",
      darkShadow: "dark:shadow-blue-700/30",
    },
  },
  {
    name: "Niveles",
    achievements: [19, 20, 21, 22, 23, 24, 25, 26], // Logros relacionados con nivel y rangos
    colors: {
      from: "from-purple-400",
      to: "to-purple-600",
      shadow: "shadow-purple-500/20",
      darkFrom: "dark:from-purple-500",
      darkTo: "dark:to-purple-700",
      darkShadow: "dark:shadow-purple-700/30",
    },
  },
  {
    name: "Sistema",
    achievements: [0, 1, 2, 27, 28, 29, 30, 31], // Logros básicos del sistema y rachas
    colors: {
      from: "from-amber-400",
      to: "to-amber-600",
      shadow: "shadow-amber-500/20",
      darkFrom: "dark:from-amber-500",
      darkTo: "dark:to-amber-700",
      darkShadow: "dark:shadow-amber-700/30",
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

    // Crear una copia del achievement para evitar problemas de reactividad
    const achievementCopy = JSON.parse(JSON.stringify(achievements.value[index]));
    achievementCopy.unlocked = true;
    achievements.value[index] = achievementCopy;
    
    latestAchievement.value = {...achievementCopy};
    showAchievement.value = true;
    hasNewAchievement.value = true;

    // Notificar al componente padre
    emit("achievement-unlocked");

    // Conceder XP específico del logro
    const xpToAward = achievementCopy.xp || 10;
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

// Función para verificar el logro de visitar ranking
const checkRankingVisitAchievement = () => {
  console.log("Logros.vue - checkRankingVisitAchievement llamado");
  console.log("Estado del logro 27 (Explorador de Rangos):", achievements.value[27]);
  
  // Verificar que el usuario esté autenticado
  const user = auth_api.getCurrentUser();
  if (!user?.uid) {
    console.log("Usuario no autenticado, no se puede verificar el logro");
    return;
  }
  
  // Verificar que el estado de los logros esté cargado (buscar si hay al menos un logro definido)
  if (!achievements.value || achievements.value.length === 0) {
    console.log("Estado de logros no cargado aún, omitiendo verificación");
    return;
  }
  
  // Verificar que el logro específico existe
  if (!achievements.value[27]) {
    console.warn("No se encontró el logro con índice 27");
    return;
  }
  
  // Verificar que el logro no esté ya desbloqueado
  if (achievements.value[27].unlocked) {
    console.log("El logro 'Explorador de Rangos' ya está desbloqueado");
    return;
  }
  
  // Verificar en localStorage si ya se ha desbloqueado previamente
  const savedAchievements = localStorage.getItem(`achievements_${user.uid}`);
  if (savedAchievements) {
    try {
      const parsedAchievements = JSON.parse(savedAchievements);
      if (parsedAchievements[27] && parsedAchievements[27].unlocked) {
        console.log("El logro 'Explorador de Rangos' ya está desbloqueado según localStorage");
        return;
      }
    } catch (error) {
      console.error("Error al parsear logros desde localStorage:", error);
    }
  }
  
  console.log("Desbloqueando logro 'Explorador de Rangos'");
  unlockAchievement(27); // Explorador de Rangos - Visita la página de ranking
};

// Función para verificar logros de streaks
const checkStreakAchievements = (streakData) => {
  if (!streakData) return;
  
  console.log("Verificando logros de streaks con datos:", streakData);
  
  // Obtener el máximo streak actual de ambos tipos
  const maxAnunciosStreak = streakData.anuncios?.current || 0;
  const maxFechasStreak = streakData.fechas?.current || 0;
  const maxCurrentStreak = Math.max(maxAnunciosStreak, maxFechasStreak);
  
  // Verificar logros basados en el streak más alto
  if (maxCurrentStreak >= 2) {
    unlockAchievement(28); // Racha Inicial - 2 semanas
  }
  if (maxCurrentStreak >= 3) {
    unlockAchievement(29); // Constancia - 3 semanas
  }
  if (maxCurrentStreak >= 5) {
    unlockAchievement(30); // Perseverancia - 5 semanas
  }
  
  // Verificar logro de armonía perfecta (ambos streaks de al menos 2 semanas simultáneamente)
  if (maxAnunciosStreak >= 2 && maxFechasStreak >= 2) {
    // Verificar que ambos estén activos esta semana
    const ambosActivos = (streakData.anuncios?.weeklyGoalMet || false) && 
                         (streakData.fechas?.weeklyGoalMet || false);
    if (ambosActivos) {
      unlockAchievement(31); // Armonía Perfecta - Ambos streaks simultáneamente por 2 semanas
    }
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
const handleAchievementClick = async (achievementId, achievement) => {
  // Si el logro está desbloqueado, mostrar el modal con detalles completos
  if (achievement && achievement.unlocked) {
    // Cerramos el modal si estuviera abierto
    showModal.value = false;
    
    // Esperamos a que Vue actualice el DOM
    await nextTick();
    
    // Creamos una copia profunda del objeto para evitar problemas de reactividad
    const achievementCopy = JSON.parse(JSON.stringify(achievement));
    
    // Preparar el objeto del logro para el modal, incluyendo su ID
    selectedAchievement.value = {
      ...achievementCopy,
      id: achievementId,
    };
    
    // Esperamos otro tick para asegurarnos que el objeto se ha actualizado
    await nextTick();
    
    // Abrimos el modal
    showModal.value = true;
  } else {
    // Si el logro está bloqueado, mostrar/ocultar el tooltip
    toggleTooltip(null, achievementId);
  }
};

// Función para cerrar el modal de logros desbloqueados
const closeModal = async () => {
  showModal.value = false;
  await nextTick();
  // Limpiar el achievement seleccionado después de cerrar el modal
  selectedAchievement.value = {};
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
  checkRankingVisitAchievement,
  checkStreakAchievements,
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
    darkFrom: "dark:from-amber-500",
    darkTo: "dark:to-amber-700",
    darkShadow: "dark:shadow-amber-700/30",
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce {
  animation: bounce 2s ease forwards;
  animation-iteration-count: 1;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
