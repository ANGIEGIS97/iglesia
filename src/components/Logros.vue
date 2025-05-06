<template>
  <div>
    <!-- Botón para abrir/cerrar logros en estilo de navegación -->
    <a
      @click.prevent="toggleAchievements"
      :class="[
        'flex items-center px-4 py-[10px] rounded-lg transition-all duration-200 border-l-4 w-full',
        showAchievements
          ? isDarkMode
            ? 'bg-teal-500/20 text-teal-400 border-teal-500'
            : 'bg-teal-50 text-teal-600 border-teal-500'
          : isDarkMode
          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
      ]"
    >
      <i
        class="fas fa-trophy w-5 h-5 mr-3"
        :class="
          showAchievements
            ? isDarkMode
              ? 'text-teal-400'
              : 'text-teal-600'
            : ''
        "
      ></i>
      <span>Logros ({{ unlockedAchievements }}/{{ totalAchievements }})</span>
      <span class="ml-auto">
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
      </span>
    </a>

    <!-- Contenido de los logros -->
    <div v-if="showAchievements" class="mt-2 w-full">
      <div
        class="p-3 rounded-lg border w-full"
        :class="
          isDarkMode
            ? 'bg-gray-700/30 border-gray-600/50'
            : 'bg-white border-gray-200'
        "
      >
        <div
          class="grid grid-cols-4 gap-2 transition-all duration-300 ease-in-out"
          @click.stop="closeAllTooltips"
        >
          <div
            v-for="(achievement, index) in achievements"
            :key="index"
            @click.stop="(event) => toggleTooltip(event, index)"
            :class="[
              'w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300',
              achievement.unlocked
                ? isDarkMode
                  ? 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-700/30'
                  : 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/20'
                : isDarkMode
                ? 'bg-gray-700/80 hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200',
              'relative group cursor-help',
            ]"
          >
            <span
              :class="[
                'text-xl',
                achievement.unlocked
                  ? 'opacity-100 scale-110 transition-transform duration-300'
                  : isDarkMode
                  ? 'opacity-30 text-gray-400'
                  : 'opacity-40 text-gray-500',
              ]"
              >{{ achievement.icon }}</span
            >

            <!-- Locked overlay -->
            <div
              v-if="!achievement.unlocked"
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

            <!-- Tooltip Unificado -->
            <div
              :class="[
                'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 z-10 transition-all duration-200',
                'pointer-events-none', // Deshabilitar eventos de puntero por defecto para hover
                // Lógica de visibilidad móvil (click) - usando === estricto y verificando explícitamente valores numéricos
                activeTooltipIndex === index
                  ? 'opacity-100 scale-100 md:opacity-0 md:scale-95' // Visible en móvil si activo, oculto en escritorio
                  : 'opacity-0 scale-95', // Oculto si no está activo
                // Lógica de visibilidad escritorio (hover) - prevalece sobre móvil en pantallas md+
                'md:group-hover:opacity-100 md:group-hover:scale-100', // Visible en escritorio al hacer hover
              ]"
              @click.stop
            >
              <div
                class="p-3 rounded-lg shadow-xl text-xs"
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
                  {{ achievement.name }}
                </p>
                <p :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                  {{ achievement.description }}
                </p>
                <div
                  class="mt-1 text-xs"
                  :class="isDarkMode ? 'text-amber-400' : 'text-amber-600'"
                >
                  {{
                    achievement.unlocked
                      ? "📖 " + achievement.verse
                      : "Bloqueado"
                  }}
                  <i v-if="!achievement.unlocked" class="fas fa-lock ml-1"></i>
                </div>
                <div
                  class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45"
                  :class="
                    isDarkMode
                      ? 'bg-gray-800 border-r border-b border-gray-700'
                      : 'bg-white border-r border-b border-gray-200'
                  "
                ></div>
              </div>
            </div>
            <!-- Fin Tooltip Unificado -->
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement Notification -->
    <Teleport to="body">
      <div
        v-if="showAchievement"
        class="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-gray-800 border-2 border-yellow-500 text-white p-6 rounded-lg shadow-lg z-[100] animate-bounce"
      >
        <div class="text-center">
          <div class="text-yellow-400 text-4xl mb-2">🏆</div>
          <h3 class="text-xl font-bold mb-1">¡Nuevo Logro!</h3>
          <p class="text-gray-300 mb-1">{{ latestAchievement.name }}</p>
          <p class="text-amber-400 text-xs mt-1">
            📖 {{ latestAchievement.verse }}
          </p>
        </div>
      </div>
    </Teleport>
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
const showAchievements = ref(false);
const showAchievement = ref(false);
const latestAchievement = ref({});
const hasNewAchievement = ref(false);
// Indice del logro con tooltip activo (para dispositivos móviles)
const activeTooltipIndex = ref(null);

// Nombres de rangos
const rankNames = [
  "Bronce",
  "Plata",
  "Oro",
  "Diamante",
  "Platino"
];

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
  },
  {
    icon: "😇",
    name: "Nueva Criatura",
    description: "Personaliza tu perfil",
    unlocked: false,
    verse: "2 Corintios 5:17",
  },
  {
    icon: "🎨",
    name: "Vasija Renovada",
    description: "Cambia el tema de la interfaz",
    unlocked: false,
    verse: "Isaías 64:8",
  },
  {
    icon: "📜",
    name: "Portador de Buenas Nuevas",
    description: "Agrega tu primer anuncio",
    unlocked: false,
    verse: "Isaías 52:7",
  },
  {
    icon: "📢",
    name: "Mensajero",
    description: "Agrega 3 anuncios",
    unlocked: false,
    verse: "Proverbios 25:25",
  },
  {
    icon: "📅",
    name: "Organizador",
    description: "Agrega 3 fechas",
    unlocked: false,
    verse: "Eclesiastés 3:1",
  },
  {
    icon: "📣",
    name: "Heraldo",
    description: "Agrega 10 anuncios",
    unlocked: false,
    verse: "Marcos 16:15",
  },
  {
    icon: "🗓️",
    name: "Planificador",
    description: "Agrega 10 fechas",
    unlocked: false,
    verse: "Proverbios 16:9",
  },
  {
    icon: "📯",
    name: "Atalaya",
    description: "Agrega 25 anuncios",
    unlocked: false,
    verse: "Ezequiel 33:6",
  },
  {
    icon: "📆",
    name: "Cronista de Dios",
    description: "Agrega 25 fechas",
    unlocked: false,
    verse: "Salmo 90:12",
  },
  {
    icon: "✏️",
    name: "Escriba",
    description: "Modifica 10 anuncios",
    unlocked: false,
    verse: "Jeremías 30:2",
  },
  {
    icon: "🔄",
    name: "Obrero Diligente",
    description: "Modifica 10 fechas",
    unlocked: false,
    verse: "Colosenses 3:23",
  },
  {
    icon: "🗑️",
    name: "Limpiador",
    description: "Elimina 5 anuncios",
    unlocked: false,
    verse: "Salmo 51:10",
  },
  {
    icon: "❌",
    name: "Purificador",
    description: "Elimina 5 fechas",
    unlocked: false,
    verse: "1 Juan 1:9",
  },
  {
    icon: "🎂",
    name: "Celebrador de la Vida",
    description: "Agrega una fecha con icono de cumpleaños",
    unlocked: false,
    verse: "Salmo 118:24",
  },
  {
    icon: "👨🏻",
    name: "Varón de Valor",
    description: "Agrega una fecha con icono de reunión de varones",
    unlocked: false,
    verse: "Josué 1:9",
  },
  {
    icon: "👩🏽",
    name: "Mujer Virtuosa",
    description: "Agrega una fecha con icono de reunión de damas",
    unlocked: false,
    verse: "Proverbios 31:10",
  },
  {
    icon: "⭐",
    name: "Siervo Fiel",
    description: "Alcanza el nivel 5",
    unlocked: false,
    verse: "Mateo 25:21",
  },
  {
    icon: "🌟",
    name: "Buen Mayordomo",
    description: "Alcanza el nivel 9",
    unlocked: false,
    verse: "1 Corintios 4:2",
  },
  {
    icon: "🥇",
    name: "Medalla de Bronce",
    description: "Alcanza el nivel máximo del rango Bronce (nivel 10)",
    unlocked: false,
    verse: "1 Corintios 9:25",
  },
  {
    icon: "🥈",
    name: "Medalla de Plata",
    description: "Alcanza el nivel máximo del rango Plata (nivel 10)",
    unlocked: false,
    verse: "Proverbios 25:11",
  },
  {
    icon: "🥉",
    name: "Medalla de Oro",
    description: "Alcanza el nivel máximo del rango Oro (nivel 10)",
    unlocked: false,
    verse: "Job 23:10",
  },
  {
    icon: "💎",
    name: "Diamante Precioso",
    description: "Alcanza el nivel máximo del rango Diamante (nivel 10)",
    unlocked: false,
    verse: "Zacarías 9:16",
  },
  {
    icon: "✨",
    name: "Platino Celestial",
    description: "Alcanza el nivel máximo del rango Platino (nivel 10)",
    unlocked: false,
    verse: "Apocalipsis 2:10",
  },
]);

const unlockedAchievements = computed(() => {
  return achievements.value.filter((a) => a.unlocked).length;
});

const totalAchievements = computed(() => {
  return achievements.value.length;
});

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

    setTimeout(() => {
      showAchievement.value = false;
    }, 4000);

    // Notificar al componente padre
    emit("achievement-unlocked");

    // Conceder XP por logro
    emit("xp-awarded", 10);

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
    } catch (error) {
      console.error("Error al procesar estadísticas para logros:", error);
    }
  }
};

// Función para verificar logros de nivel
const checkLevelAchievements = (level) => {
  // Logros basados en nivel
  if (level >= 5) {
    unlockAchievement(17); // Siervo Fiel
  }
  if (level >= 9) {
    unlockAchievement(18); // Buen Mayordomo
  }
  if (level >= 100) {
    unlockAchievement(23); // Buen y Fiel Siervo
  }
};

// Función para verificar logros de rango y nivel máximo
const checkRankAchievements = (rank, level) => {
  // Logros basados en rango y nivel máximo (nivel 10 de cada rango)
  if (rank == 1 && level >= 10) {
    unlockAchievement(19); // Medalla de Bronce - Nivel máximo del rango Bronce
  }
  if (rank == 2 && level >= 10) {
    unlockAchievement(20); // Medalla de Plata - Nivel máximo del rango Plata
  }
  if (rank == 3 && level >= 10) {
    unlockAchievement(21); // Medalla de Oro - Nivel máximo del rango Oro
  }
  if (rank == 4 && level >= 10) {
    unlockAchievement(22); // Diamante Precioso - Nivel máximo del rango Diamante
  }
  if (rank == 5 && level >= 10) {
    unlockAchievement(23); // Platino Celestial - Nivel máximo del rango Platino
  }
};

const toggleAchievements = () => {
  showAchievements.value = !showAchievements.value;

  // Si se cierra el panel de logros, resetear cualquier tooltip abierto
  if (!showAchievements.value) {
    activeTooltipIndex.value = null;
  }
};

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

// Función para limpiar datos de logros en localStorage
const clearAchievementsLocalStorage = () => {
  const user = auth_api.getCurrentUser();
  if (!user?.uid) return;

  const userId = user.uid;
  try {
    // Limpiar logros específicos
    localStorage.removeItem(`achievements_${userId}`);
    localStorage.removeItem(`haCreatedoCumpleanos_${userId}`);
    localStorage.removeItem(`haCreatedoReunionVarones_${userId}`);
    localStorage.removeItem(`haCreatedoReunionDamas_${userId}`);
    console.log("Datos de logros eliminados del localStorage");
  } catch (error) {
    console.error("Error al limpiar datos de logros del localStorage:", error);
  }
};

// Función para alternar el tooltip en dispositivos móviles
const toggleTooltip = (event, index) => {
  // Detener propagación para que no llegue al evento global
  event.stopPropagation();

  console.log(
    "Toggle tooltip para índice:",
    index,
    "Actual:",
    activeTooltipIndex.value
  );

  // Verificar si el índice actual es exactamente igual al índice seleccionado
  if (activeTooltipIndex.value === index) {
    // Si es el mismo que ya está activo, lo cerramos
    activeTooltipIndex.value = null;
    console.log("Cerrando tooltip:", index);
  } else {
    // Si es diferente o no hay ninguno activo, activamos este
    activeTooltipIndex.value = index;
    console.log("Abriendo tooltip para índice:", index);
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
</script>

<style scoped>
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
