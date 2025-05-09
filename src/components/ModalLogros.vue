<template>
  <div
    v-if="show"
    class="fixed inset-0 z-[100] flex items-center justify-center"
  >
    <!-- Fondo oscuro -->
    <div class="absolute inset-0 bg-black/60" @click="closeModal"></div>

    <!-- Contenido del modal -->
    <div
      class="relative w-11/12 max-w-md rounded-xl overflow-hidden shadow-2xl transform transition-all"
      :class="isDarkMode ? 'bg-gray-800' : 'bg-white'"
    >
      <!-- Header con borde de color según categoría -->
      <div
        class="h-2 w-full"
        :class="[
          achievement?.unlocked
            ? `bg-gradient-to-r ${getModalColors().from} ${getModalColors().to}`
            : isDarkMode
            ? 'bg-gray-700'
            : 'bg-gray-200',
        ]"
      ></div>

      <!-- Botón de cierre -->
      <button
        @click="closeModal"
        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10"
        :class="
          isDarkMode
            ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-800'
        "
        type="button"
      >
        <i class="fas fa-times text-xl"></i>
      </button>

      <!-- Contenido principal -->
      <div class="p-6 relative">
        <!-- Icono y nombre -->
        <div class="flex flex-col items-center mb-6">
          <div
            class="flex items-center justify-center mb-4 w-20 h-20 rounded-full bg-gradient-to-br shadow-lg"
            :class="[
              achievement?.unlocked
                ? `${getModalColors().from} ${getModalColors().to} ${
                    getModalColors().shadow
                  }`
                : isDarkMode
                ? 'bg-gray-700 shadow-gray-800/50'
                : 'bg-gray-100 shadow-gray-200/50',
            ]"
          >
            <span class="text-4xl">{{ achievement?.icon }}</span>
          </div>

          <h2
            class="text-xl font-bold text-center"
            :class="isDarkMode ? 'text-white' : 'text-gray-800'"
          >
            {{ achievement?.name }}
          </h2>

          <p
            class="text-sm mt-1"
            :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ achievement?.description }}
          </p>
        </div>

        <!-- Versículo -->
        <div
          class="mt-4 p-4 rounded-lg"
          :class="[isDarkMode ? 'bg-gray-700/50' : verseBgColor]"
        >
          <div class="flex items-center mb-2">
            <span
              class="text-lg mr-2"
              :class="[isDarkMode ? verseTextColorDark : verseTextColor]"
            >
              📖
            </span>
            <span
              class="font-medium"
              :class="[isDarkMode ? verseTextColorDark : verseTextColor]"
            >
              {{ achievement?.verse }}
            </span>
          </div>

          <p
            class="text-sm italic"
            :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
          >
            {{ verseText }}
          </p>
        </div>

        <!-- XP y fecha de desbloqueo (si se desea agregar) -->
        <div
          class="mt-4 text-center text-sm"
          :class="isDarkMode ? 'text-green-400' : 'text-green-600'"
        >
          <p>+{{ achievement?.xp }} XP</p>
        </div>

        <!-- Número de logro -->
        <div
          class="absolute bottom-2 right-2 text-sm font-semibold"
          :class="[
            achievement?.unlocked
              ? isDarkMode
                ? getNumberTextColorDark()
                : getNumberTextColor()
              : isDarkMode
              ? 'text-gray-600'
              : 'text-gray-400',
          ]"
        >
          No. {{ getAchievementNumber() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  achievement: {
    type: Object,
    default: () => ({}),
  },
  show: {
    type: Boolean,
    default: false,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const isDarkMode = computed(() => props.darkMode);

// Texto del versículo (en una implementación real, esto podría obtenerse de una API de Biblia)
const verseText = ref("");

// Colores para el cuadro de versículos
const verseBgColor = computed(() => {
  const base = getModalColors().base;
  if (base === "amber") return "bg-amber-50";
  if (base === "blue") return "bg-blue-50";
  if (base === "purple") return "bg-purple-50";
  return "bg-gray-50";
});

const verseTextColor = computed(() => {
  const base = getModalColors().base;
  if (base === "amber") return "text-amber-600";
  if (base === "blue") return "text-blue-600";
  if (base === "purple") return "text-purple-600";
  return "text-gray-600";
});

const verseTextColorDark = computed(() => {
  const base = getModalColors().base;
  if (base === "amber") return "text-amber-400";
  if (base === "blue") return "text-blue-400";
  if (base === "purple") return "text-purple-400";
  return "text-gray-400";
});

// Obtener texto del versículo (simulado)
watch(
  () => props.achievement?.verse,
  (newVerse) => {
    if (newVerse) {
      // Aquí podrías integrar una API de Biblia real
      // Por ahora usamos textos simulados
      const versiculos = {
        "Salmo 23:1": '"El Señor es mi pastor, nada me faltará."',
        "2 Corintios 5:17":
          '"De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas."',
        "Isaías 64:8":
          '"Ahora pues, Señor, tú eres nuestro padre; nosotros barro, y tú el que nos formaste; así que obra de tus manos somos todos nosotros."',
        "Isaías 52:7":
          '"¡Cuán hermosos son sobre los montes los pies del que trae alegres nuevas, del que anuncia la paz, del que trae nuevas del bien, del que publica salvación, del que dice a Sion: Tu Dios reina!"',
        "Proverbios 25:25":
          '"Como el agua fría al alma sedienta, así son las buenas nuevas de lejanas tierras."',
        "Eclesiastés 3:1":
          '"Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora."',
        "Marcos 16:15":
          '"Y les dijo: Id por todo el mundo y predicad el evangelio a toda criatura."',
        "Proverbios 16:9":
          '"El corazón del hombre piensa su camino; mas Jehová endereza sus pasos."',
        "Ezequiel 33:6":
          '"Pero si el atalaya viere venir la espada y no tocare la trompeta, y el pueblo no se apercibiere, y viniendo la espada, hiriere a alguno de ellos, él fue sorprendido en su pecado, pero demandaré su sangre de mano del atalaya."',
        "Salmo 90:12":
          '"Enséñanos de tal modo a contar nuestros días, que traigamos al corazón sabiduría."',
        "Jeremías 30:2":
          '"Así habló Jehová Dios de Israel, diciendo: Escríbete en un libro todas las palabras que te he hablado."',
        "Colosenses 3:23":
          '"Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres."',
        "Salmo 51:10":
          '"Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí."',
        "1 Juan 1:9":
          '"Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad."',
        "Salmo 118:24":
          '"Este es el día que hizo Jehová; nos gozaremos y alegraremos en él."',
        "Josué 1:9":
          '"Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas."',
        "Proverbios 31:10":
          '"Mujer virtuosa, ¿quién la hallará? Porque su estima sobrepasa largamente a la de las piedras preciosas."',
        "2 Corintios 9:7":
          '"Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre."',
        "1 Corintios 11:24":
          '"y habiendo dado gracias, lo partió, y dijo: Tomad, comed; esto es mi cuerpo que por vosotros es partido; haced esto en memoria de mí."',
        "Mateo 13:31-32":
          '"El reino de los cielos es semejante al grano de mostaza, que un hombre tomó y sembró en su campo; el cual a la verdad es la más pequeña de todas las semillas; pero cuando ha crecido, es la mayor de las hortalizas, y se hace árbol, de tal manera que vienen las aves del cielo y hacen nidos en sus ramas."',
        "Mateo 25:21":
          '"Y su señor le dijo: Bien, buen siervo y fiel; sobre poco has sido fiel, sobre mucho te pondré; entra en el gozo de tu señor."',
        "1 Corintios 4:2":
          '"Ahora bien, se requiere de los administradores, que cada uno sea hallado fiel."',
        "1 Corintios 9:25":
          '"Todo aquel que lucha, de todo se abstiene; ellos, a la verdad, para recibir una corona corruptible, pero nosotros, una incorruptible."',
        "Proverbios 25:11":
          '"Manzana de oro con figuras de plata es la palabra dicha como conviene."',
        "Job 23:10":
          '"Mas él conoce mi camino; me probará, y saldré como oro."',
        "Zacarías 9:16":
          '"Y los salvará en aquel día Jehová su Dios como rebaño de su pueblo; porque como piedras de diadema serán enaltecidos en su tierra."',
        "Apocalipsis 2:10":
          '"No temas en nada lo que vas a padecer. He aquí, el diablo echará a algunos de vosotros en la cárcel, para que seáis probados, y tendréis tribulación por diez días. Sé fiel hasta la muerte, y yo te daré la corona de la vida."',
        "Daniel 12:3":
          '"Los entendidos resplandecerán como el resplandor del firmamento; y los que enseñan la justicia a la multitud, como las estrellas a perpetua eternidad."',
      };

      verseText.value = versiculos[newVerse] || "Versículo no disponible.";
    } else {
      verseText.value = "";
    }
  },
  { immediate: true }
);

// Método para obtener los colores del modal según la categoría del logro
const getModalColors = () => {
  // Verificar si el logro está desbloqueado
  if (!props.achievement?.unlocked) {
    return {
      from: "from-gray-400",
      to: "to-gray-600",
      shadow: "shadow-gray-500/20",
      base: "gray",
    };
  }

  // Determinar la categoría por el índice del logro (similar a getAchievementColors)
  const categories = [
    // Categoria Contenido (Blue)
    {
      indices: [3, 4, 6, 8, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      colors: {
        from: "from-blue-400",
        to: "to-blue-600",
        shadow: "shadow-blue-500/20",
        base: "blue",
      },
    },
    // Categoria Niveles (Purple)
    {
      indices: [19, 20, 21, 22, 23, 24, 25, 26],
      colors: {
        from: "from-purple-400",
        to: "to-purple-600",
        shadow: "shadow-purple-500/20",
        base: "purple",
      },
    },
    // Categoria Sistema (Amber)
    {
      indices: [0, 1, 2],
      colors: {
        from: "from-amber-400",
        to: "to-amber-600",
        shadow: "shadow-amber-500/20",
        base: "amber",
      },
    },
  ];

  // Obtener el índice del logro actual
  const achievementId = props.achievement?.id;

  // Buscar la categoría que contiene este logro
  for (const category of categories) {
    if (category.indices.includes(achievementId)) {
      return category.colors;
    }
  }

  // Si no se encuentra en ninguna categoría, devolver colores por defecto
  return {
    from: "from-amber-400",
    to: "to-amber-600",
    shadow: "shadow-amber-500/20",
    base: "amber",
  };
};

// Obtener el número del logro basado en su categoría
const getAchievementNumber = () => {
  if (!props.achievement) return "";

  const id = props.achievement.id;

  // Definir las categorías con sus índices
  const categories = [
    { name: "Sistema", indices: [0, 1, 2] },
    {
      name: "Contenido",
      indices: [3, 4, 6, 8, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
    { name: "Niveles", indices: [19, 20, 21, 22, 23, 24, 25, 26] },
  ];

  // Encontrar la categoría a la que pertenece el logro
  for (const category of categories) {
    if (category.indices.includes(id)) {
      // Obtener el índice dentro de la categoría (posición + 1)
      const position = category.indices.indexOf(id) + 1;
      return position;
    }
  }

  return "";
};

// Obtener el color del texto para el número basado en la categoría
const getNumberTextColor = () => {
  const base = getModalColors().base;
  if (base === "amber") return "text-amber-600";
  if (base === "blue") return "text-blue-600";
  if (base === "purple") return "text-purple-600";
  return "text-gray-600";
};

// Obtener el color del texto para el número en modo oscuro
const getNumberTextColorDark = () => {
  const base = getModalColors().base;
  if (base === "amber") return "text-amber-400";
  if (base === "blue") return "text-blue-400";
  if (base === "purple") return "text-purple-400";
  return "text-gray-400";
};

// Cerrar el modal
const closeModal = () => {
  emit("close");
  console.log("Modal cerrado"); // Para debug
};
</script>
