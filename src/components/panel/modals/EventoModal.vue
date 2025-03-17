<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from "vue";
import "animate.css";
import { geminiService } from "../../../lib/gemini";
import { unsplashService } from "../../../lib/unsplash";

const props = defineProps({
  event: {
    type: Object,
    default: () => ({
      titulo: "",
      descripcion: "",
      eslogan: "",
      linkBoton: "",
      image: "/imagenes/default.png",
    }),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const formData = ref({ ...props.event });
const selectedImageOption = ref("");
const customImageUrl = ref("");
const defaultImageUrl =
  "https://i.ibb.co/bM0Y4b9K/Captura-de-pantalla-2025-02-12-125243.png";

// Sugerencias para textos de botones
const buttonSuggestions = ref<string[]>([]);
const isGeneratingSuggestions = ref(false);

const imageOptions = [
  {
    value: "default",
    label: "1- Imagen predeterminada",
    url: defaultImageUrl,
  },
  {
    value: "biblia1",
    label: "2- Imagen biblia 1",
    url: "https://i.ibb.co/9Td3wVk/ben-white-W8-Qqn1-Pm-QH0-unsplash.jpg",
  },
  {
    value: "biblia2",
    label: "3- Imagen biblia 2",
    url: "https://i.ibb.co/KW60XdT/aaron-burden-9zs-HNt5-Opq-E-unsplash.jpg",
  },
  {
    value: "biblia3",
    label: "4- Imagen biblia 3",
    url: "https://i.ibb.co/b786r8G/biblia.jpg",
  },
  {
    value: "damas",
    label: "5- Imagen damas",
    url: "https://i.ibb.co/MBTgMV7/damas.jpg",
  },
  {
    value: "misionero",
    label: "6- Imagen misionero",
    url: "https://i.ibb.co/nCJpgjQ/misionero.jpg",
  },
  { value: "custom", label: "7- Imagen personalizada" },
];

const showModal = ref(false);
const isGeneratingDescription = ref(false);
const isGeneratingImage = ref(false);

const generateDescription = async () => {
  if (!formData.value.titulo) {
    alert("Por favor, ingresa un título primero");
    return;
  }

  try {
    isGeneratingDescription.value = true;
    const prompt = `Como escritor cristiano, genera una descripción breve y cautivadora (máximo 35 palabras) para un evento de iglesia titulado: "${formData.value.titulo}".
    La descripción debe:
    - Reflejar valores y principios cristianos
    - Incluir referencias bíblicas sutiles si es apropiado
    - Motivar la participación de la congregación
    - Mantener un tono espiritual y edificante`;

    const description = await geminiService.generateContent(prompt);
    formData.value.descripcion = description;
  } catch (error) {
    console.error("Error al generar la descripción:", error);
    alert("No se pudo generar la descripción. Por favor, intenta nuevamente.");
  } finally {
    isGeneratingDescription.value = false;
  }
};

// Función para generar sugerencias de textos para botones
const generateButtonSuggestions = async () => {
  if (!formData.value.titulo && !formData.value.descripcion) {
    alert("Por favor, ingresa un título o descripción primero");
    return;
  }

  try {
    isGeneratingSuggestions.value = true;
    const prompt = `Como escritor cristiano, genera 4 sugerencias breves (máximo 3 palabras cada una) para el texto de un botón de llamada a la acción para un evento de iglesia con la siguiente información:
    
    Título: "${formData.value.titulo || "Sin título"}"
    Descripción: "${formData.value.descripcion || "Sin descripción"}"
    
    Las sugerencias deben:
    - Ser motivadoras y atractivas
    - Reflejar valores cristianos
    - Invitar a la acción
    - Ser concisas (máximo 3 palabras)
    
    Devuelve solo las 4 sugerencias separadas por punto y coma (;) sin explicaciones adicionales.`;

    const response = await geminiService.generateContent(prompt);
    buttonSuggestions.value = response
      .split(";")
      .map((text) => text.trim())
      .filter((text) => text);
  } catch (error) {
    console.error("Error al generar sugerencias de botones:", error);
    alert("No se pudo generar sugerencias. Por favor, intenta nuevamente.");
  } finally {
    isGeneratingSuggestions.value = false;
  }
};

// Función para aplicar una sugerencia al texto del botón
const applyButtonSuggestion = (suggestion: string) => {
  formData.value.eslogan = suggestion;
};

const generateImage = async () => {
  if (!formData.value.titulo && !formData.value.descripcion) {
    alert("Por favor, ingresa un título o descripción primero");
    return;
  }

  try {
    isGeneratingImage.value = true;
    const searchQuery = formData.value.titulo || formData.value.descripcion;
    console.log("Iniciando generación de imagen para:", searchQuery);

    const imageUrl = await unsplashService.searchImage(searchQuery);
    console.log("URL de imagen obtenida:", imageUrl);

    if (!imageUrl) {
      throw new Error("No se pudo obtener la URL de la imagen");
    }

    formData.value.image = imageUrl;
    selectedImageOption.value = "custom";
    customImageUrl.value = imageUrl;
  } catch (error) {
    console.error("Error completo al generar la imagen:", error);
    alert(`Error al generar la imagen: ${error.message}`);
  } finally {
    isGeneratingImage.value = false;
  }
};

watch(
  () => props.isOpen,
  (newValue) => {
    console.log("EventoModal - isOpen cambiado a:", newValue);
    if (newValue) {
      showModal.value = true;
      document.body.classList.add("modal-open");
    } else {
      showModal.value = false;
      document.body.classList.remove("modal-open");
    }
  }
);

watch(
  () => props.event,
  (newEvent) => {
    console.log("EventoModal - event recibido:", newEvent);
    formData.value = { ...newEvent };

    if (newEvent.image) {
      const predefinedImage = imageOptions.find(
        (option) => option.url === newEvent.image
      );
      if (predefinedImage) {
        selectedImageOption.value = predefinedImage.value;
      } else {
        selectedImageOption.value = "custom";
        customImageUrl.value = newEvent.image;
      }
    } else {
      selectedImageOption.value = "default";
      formData.value.image = defaultImageUrl;
      customImageUrl.value = "";
    }
  },
  { immediate: true, deep: true }
);

watch([selectedImageOption, customImageUrl], () => {
  if (selectedImageOption.value === "custom") {
    formData.value.image = customImageUrl.value || defaultImageUrl;
  } else {
    const selected = imageOptions.find(
      (option) => option.value === selectedImageOption.value
    );
    formData.value.image = selected?.url || defaultImageUrl;
  }
});

// Observar cambios en título y descripción para sugerir regenerar sugerencias
watch([() => formData.value.titulo, () => formData.value.descripcion], () => {
  // Limpiar sugerencias cuando cambia el contexto
  buttonSuggestions.value = [];
});

const handleSubmit = async () => {
  try {
    // Asegurarse de que la imagen tenga un valor válido
    if (!formData.value.image || formData.value.image === "") {
      formData.value.image = defaultImageUrl;
    }

    // Si es una URL personalizada, validar que sea una URL válida
    if (selectedImageOption.value === "custom" && customImageUrl.value) {
      try {
        new URL(customImageUrl.value);
      } catch (e) {
        alert("La URL de la imagen no es válida");
        return;
      }
    }

    // Formatear los datos antes de enviar
    const dataToSubmit = {
      titulo: formData.value.titulo?.trim() || "",
      descripcion: formData.value.descripcion?.trim() || "",
      eslogan: formData.value.eslogan?.trim() || "",
      linkBoton: formData.value.linkBoton?.trim() || "",
      image: formData.value.image,
      fecha: new Date().toISOString(),
    };

    emit("submit", dataToSubmit);
  } catch (error: any) {
    console.error("Error al procesar el formulario:", error);
    alert(error.message || "Error al procesar el formulario");
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      ></div>
      <div
        v-if="showModal"
        class="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl transform border border-gray-200 dark:border-gray-700 animate__animated animate__fadeInDown animate__faster"
      >
        <!-- Modal header -->
        <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ isEdit ? "Editar Anuncio" : "Nuevo Anuncio" }}
            </h3>
            <button
              @click="$emit('cancel')"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
            >
              <svg
                class="h-6 w-6"
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
        </div>
        <!-- Modal content -->
        <div class="p-6 bg-white dark:bg-gray-800 rounded-b-lg">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <div class="relative">
                <input
                  v-model="formData.titulo"
                  type="text"
                  id="titulo"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer"
                  placeholder=" "
                />
                <label
                  for="titulo"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Título (Opcional)
                </label>
              </div>
            </div>

            <div>
              <div class="relative">
                <textarea
                  v-model="formData.descripcion"
                  id="descripcion"
                  rows="4"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer pr-9"
                  placeholder=" "
                ></textarea>
                <label
                  for="descripcion"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Descripción (Opcional)
                </label>
                <button
                  type="button"
                  @click="generateDescription"
                  :disabled="isGeneratingDescription || !formData.titulo"
                  class="absolute right-2 top-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {{ isGeneratingDescription ? "Generando..." : "IA" }}
                </button>
              </div>
            </div>

            <div>
              <div class="relative">
                <select
                  v-model="selectedImageOption"
                  id="imagen"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer dark:bg-gray-700"
                >
                  <option
                    v-for="option in imageOptions"
                    :key="option.value"
                    :value="option.value"
                    class="dark:bg-gray-700 dark:text-gray-300"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <label
                  for="imagen"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Imagen
                </label>
                <button
                  type="button"
                  @click="generateImage"
                  :disabled="
                    isGeneratingImage ||
                    (!formData.titulo && !formData.descripcion)
                  "
                  class="absolute right-2 top-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {{ isGeneratingImage ? "Generando..." : "Sugerir" }}
                </button>
              </div>

              <!-- Preview of selected image -->
              <div class="mt-4 flex justify-center">
                <img
                  :src="formData.image"
                  alt="Vista previa"
                  class="h-48 w-full object-cover rounded-lg shadow-md"
                />
              </div>

              <!-- Custom image URL input -->
              <div v-if="selectedImageOption === 'custom'" class="mt-4">
                <div class="relative">
                  <input
                    v-model="customImageUrl"
                    type="text"
                    id="customUrl"
                    class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer"
                    placeholder=" "
                  />
                  <label
                    for="customUrl"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    URL de la imagen
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div class="relative">
                <input
                  v-model="formData.eslogan"
                  type="text"
                  id="eslogan"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer pr-20"
                  placeholder=" "
                />
                <label
                  for="eslogan"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Eslogan (Opcional)
                </label>
                <button
                  type="button"
                  @click="generateButtonSuggestions"
                  :disabled="
                    isGeneratingSuggestions ||
                    (!formData.titulo && !formData.descripcion)
                  "
                  class="absolute right-2 top-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {{ isGeneratingSuggestions ? "Generando..." : "Sugerir" }}
                </button>
              </div>

              <!-- Sugerencias de textos para botones -->
              <div
                v-if="buttonSuggestions.length > 0"
                class="mt-2 flex flex-wrap gap-2"
              >
                <button
                  v-for="(suggestion, index) in buttonSuggestions"
                  :key="index"
                  type="button"
                  @click="applyButtonSuggestion(suggestion)"
                  class="px-3 py-1 text-xs bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors duration-200"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>

            <div>
              <div class="relative">
                <input
                  v-model="formData.linkBoton"
                  type="text"
                  id="linkBoton"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer"
                  placeholder=" "
                />
                <label
                  for="linkBoton"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Link del Eslogan (Opcional)
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="submit"
                class="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
              >
                {{ isEdit ? "Actualizar" : "Crear" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  height: 100%;
}

body.modal-open {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.animate__animated {
  animation-fill-mode: both;
}

.animate__fadeInDown {
  animation-name: fadeInDown;
  animation-duration: 0.5s;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
}
</style>
