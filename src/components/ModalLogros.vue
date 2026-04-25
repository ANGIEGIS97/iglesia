<template>
  <BaseModal
    :open="show"
    backdrop-class="bg-black/70"
    z-class="z-[999]"
    :panel-class="panelClass"
    @close="closeModal"
  >
    <template #header="{ close, labelId }">
      <!-- Header: banda de color según categoría + botón de cierre flotante -->
      <div
        class="h-2 w-full"
        :class="[
          achievement?.unlocked
            ? `bg-linear-to-r ${getModalColors().from} ${getModalColors().to}`
            : isDarkMode
            ? 'bg-gray-700'
            : 'bg-gray-200',
        ]"
      ></div>

      <button
        @click="close"
        class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-10"
        :class="
          isDarkMode
            ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-800'
        "
        type="button"
        aria-label="Cerrar"
      >
        <i class="fas fa-times text-xl"></i>
      </button>

      <span :id="labelId" class="sr-only">{{ achievement?.name || "Detalle de logro" }}</span>
    </template>

    <template #default>
      <!-- Contenido principal -->
      <div class="p-6 relative">
        <!-- Icono y nombre -->
        <div class="flex flex-col items-center mb-6">
          <div
            class="flex items-center justify-center mb-4 w-20 h-20 rounded-full bg-linear-to-br shadow-lg"
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
            <img
              :src="modalIconSrc || achievement?.icon"
              :alt="achievement?.name || 'Logro'"
              class="w-14 h-14 object-contain"
              @error="onModalIconError"
            />
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
          :class="[
            isDarkMode
              ? `border ${getDarkVerseBorder()} ${getDarkVerseBg()}`
              : verseBgColor,
          ]"
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

        <!-- Footer con XP y número de logro -->
        <div class="flex justify-between items-center mt-4">
          <!-- XP en círculo en la esquina inferior izquierda -->
          <div class="flex items-center justify-center" v-if="achievement?.xp">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center bg-green-500"
            >
              <span class="text-xs font-medium text-white">XP</span>
            </div>
            <span
              class="ml-1 font-medium text-sm text-green-600"
              :class="isDarkMode ? 'text-green-400' : 'text-green-600'"
            >
              +{{ achievement?.xp }}
            </span>
          </div>

          <!-- Número de logro -->
          <div
            class="text-sm font-semibold"
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
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import BaseModal from "./common/BaseModal.vue";

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

const panelClass = computed(
  () =>
    `relative w-11/12 max-w-md rounded-xl overflow-hidden shadow-2xl transform transition-all ${
      isDarkMode.value ? "bg-gray-800" : "bg-white"
    }`,
);

// Estado local para manejar fallback del icono
const modalIconSrc = ref("");
watch(
  () => props.achievement?.icon,
  (newIcon) => {
    modalIconSrc.value = newIcon || "";
  },
  { immediate: true }
);
const onModalIconError = () => {
  modalIconSrc.value = "/svg/flama.svg";
};

// Ensure the modal is properly initialized
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await nextTick();
    // Force a DOM update
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
}, { immediate: true });

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
        "1 Corintios 9:24":
          '"¿No sabéis que los que corren en el estadio, todos a la verdad corren, pero uno solo se lleva el premio? Corred de tal manera que lo obtengáis."',
        "Hebreos 10:36":
          '"Porque os es necesaria la paciencia, para que habiendo hecho la voluntad de Dios, obtengáis la promesa."',
        "Gálatas 6:9":
          '"No nos cansemos, pues, de hacer bien; porque a su tiempo segaremos, si no desmayamos."',
        "Santiago 1:12":
          '"Bienaventurado el varón que soporta la tentación; porque cuando haya resistido la prueba, recibirá la corona de vida, que Dios ha prometido a los que le aman."',
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
      indices: [0, 1, 2, 27],
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
    { name: "Sistema", indices: [0, 1, 2, 27, 28, 29, 30, 31] },
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

// Obtener el color del borde para el versículo en modo oscuro
const getDarkVerseBorder = () => {
  if (!props.achievement?.unlocked) return "border-gray-600";

  const base = getModalColors().base;
  if (base === "amber") return "border-amber-500/70";
  if (base === "blue") return "border-blue-500/70";
  if (base === "purple") return "border-purple-500/70";
  return "border-gray-600";
};

// Obtener el color del fondo para el versículo en modo oscuro
const getDarkVerseBg = () => {
  if (!props.achievement?.unlocked) return "bg-gray-700/50";

  const base = getModalColors().base;
  if (base === "amber") return "bg-amber-900/20";
  if (base === "blue") return "bg-blue-900/20";
  if (base === "purple") return "bg-purple-900/20";
  return "bg-gray-700/50";
};

// Cerrar el modal
const closeModal = () => {
  emit("close");
};
</script>
