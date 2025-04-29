tengo este componente vue.js con tailwind, quiero mantener todo el diseno, solo mejora el diseno de la parte donde se muestra los logros


no sirve cambio de interfaz






<template>
  <div>
    <!-- Achievements Panel -->
    <div
      class="mb-4 p-4 rounded-xl border shadow-sm transition-all duration-300 max-w-md mx-auto"
      :class="
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700 shadow-gray-900/20'
          : 'bg-white border-gray-200 shadow-gray-200/50'
      "
    >
      <button
        @click="toggleAchievements"
        class="w-full font-medium mb-3 flex items-center justify-between transition-colors duration-200"
        :class="
          isDarkMode
            ? 'text-amber-400 hover:text-amber-300'
            : 'text-amber-600 hover:text-amber-500'
        "
      >
        <div class="flex items-center gap-2">
          <span class="text-xl">🏆</span>
          <span class="text-base">Logros</span>
          <span
            class="px-2 py-0.5 text-xs rounded-full font-semibold"
            :class="
              isDarkMode
                ? 'bg-gray-700 text-amber-400'
                : 'bg-amber-100 text-amber-700'
            "
          >
            {{ unlockedAchievements }}/{{ totalAchievements }}
          </span>
        </div>
        <svg
          class="w-5 h-5 transition-transform duration-300"
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
        class="grid grid-cols-4 gap-3 transition-all duration-300 ease-in-out"
      >
        <div
          v-for="(achievement, index) in achievements"
          :key="index"
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
                ? 'opacity-40 text-gray-400'
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
              class="text-lg opacity-70"
              :class="isDarkMode ? 'text-gray-500' : 'text-gray-400'"
            >
              🔒
            </div>
          </div>

          <!-- Tooltip -->
          <div
            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 pointer-events-none"
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
                {{ achievement.unlocked ? "✓ Desbloqueado" : "🔒 Bloqueado" }}
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
        </div>
      </div>
    </div>

    <!-- Achievement Notification -->
    <div
      v-if="showAchievement"
      class="fixed top-1/4 left-1/2 transform -translate-x-1/2 p-0 rounded-xl shadow-2xl z-[100] overflow-hidden max-w-[280px] w-full"
      :class="
        isDarkMode
          ? 'bg-gray-800 shadow-amber-600/20'
          : 'bg-white shadow-amber-500/20'
      "
    >
      <div class="relative">
        <!-- Top decoration bar -->
        <div
          class="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600"
        ></div>

        <!-- Content -->
        <div class="p-5 text-center">
          <div class="text-amber-500 text-4xl mb-3 animate-bounce-gentle">
            🏆
          </div>
          <h3
            class="text-xl font-bold mb-1"
            :class="isDarkMode ? 'text-white' : 'text-gray-800'"
          >
            ¡Nuevo Logro!
          </h3>
          <p
            class="text-base"
            :class="isDarkMode ? 'text-amber-400' : 'text-amber-600'"
          >
            {{ latestAchievement.name }}
          </p>
          <p
            class="mt-1 text-sm"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            {{ latestAchievement.description }}
          </p>
          <div
            class="mt-3 text-xs font-medium"
            :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
          >
            +25 XP
          </div>
        </div>

        <!-- Confetti effect -->
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div class="confetti-piece"></div>
          <div class="confetti-piece"></div>
          <div class="confetti-piece"></div>
          <div class="confetti-piece"></div>
          <div class="confetti-piece"></div>
          <div class="confetti-piece"></div>
          <div class="confetti-piece"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, defineExpose } from "vue";
import { auth_api } from "../lib/api.ts";

const props = defineProps({
  darkMode: {
    type: Boolean,
    default: true,
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

    // Notificar al componente padre
    emit("achievement-unlocked");

    // Award XP for achievement
    emit("xp-awarded", 25);
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

// Verificar logros de nivel
const checkLevelAchievements = (level) => {
  if (level >= 5) {
    unlockAchievement(17); // "Siervo Fiel" - Nivel 5
  }
  if (level >= 10) {
    unlockAchievement(18); // "Buen Mayordomo" - Nivel 10
  }
  if (level >= 100) {
    unlockAchievement(19); // "Buen y Fiel Siervo" - Nivel 100
  }
};

const toggleAchievements = () => {
  showAchievements.value = !showAchievements.value;
};

// Cargar logros desde el estado del juego
const loadAchievements = (gameState) => {
  if (
    gameState.achievements &&
    gameState.achievements.length === achievements.value.length
  ) {
    // Si la estructura coincide, cargar directamente
    achievements.value = gameState.achievements;
  } else if (gameState.achievements) {
    // Mantener la nueva estructura pero cargar estados desde el guardado
    const savedAchievements = gameState.achievements;
    if (savedAchievements.length > 0) {
      savedAchievements.forEach((achievement, index) => {
        if (index < achievements.value.length && achievement.unlocked) {
          achievements.value[index].unlocked = true;
        }
      });
    }
  }

  // Verificar logros de nivel
  if (gameState.userLevel) {
    checkLevelAchievements(gameState.userLevel);
  }
};

// Propiedades y métodos expuestos al componente padre
defineExpose({
  unlockAchievement,
  checkAchievementsFromStats,
  checkLevelAchievements,
  loadAchievements,
  achievements,
  hasNewAchievement,
});
</script>

<style scoped>
/* Animación de rebote suave para el icono de logro */
@keyframes bounce-gentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease infinite;
}

/* Animación para las piezas de confeti */
@keyframes confetti-fall {
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 16px;
  background-color: #fcd34d;
  opacity: 0.8;
  animation: confetti-fall 3s ease-in-out forwards;
}

.confetti-piece:nth-child(1) {
  left: 10%;
  background-color: #f59e0b;
  animation-delay: 0.1s;
  animation-duration: 2.5s;
}

.confetti-piece:nth-child(2) {
  left: 30%;
  background-color: #fbbf24;
  animation-delay: 0.3s;
  animation-duration: 2.7s;
}

.confetti-piece:nth-child(3) {
  left: 50%;
  background-color: #f59e0b;
  animation-delay: 0.5s;
  animation-duration: 2.9s;
}

.confetti-piece:nth-child(4) {
  left: 70%;
  background-color: #fcd34d;
  animation-delay: 0.2s;
  animation-duration: 2.6s;
}

.confetti-piece:nth-child(5) {
  left: 90%;
  background-color: #fbbf24;
  animation-delay: 0.4s;
  animation-duration: 2.8s;
}

.confetti-piece:nth-child(6) {
  left: 20%;
  background-color: #f59e0b;
  animation-delay: 0.6s;
  animation-duration: 3s;
}

.confetti-piece:nth-child(7) {
  left: 80%;
  background-color: #fcd34d;
  animation-delay: 0.7s;
  animation-duration: 2.7s;
}

/* Formas variadas para el confeti */
.confetti-piece:nth-child(odd) {
  border-radius: 50%;
  width: 10px;
  height: 10px;
}

.confetti-piece:nth-child(3n) {
  width: 6px;
  height: 12px;
  transform-origin: center;
}
</style>
