<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from "vue";
import "animate.css";

const props = defineProps({
  event: {
    type: Object,
    default: () => ({
      titulo: "",
      descripcion: "",
      textoBoton: "",
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

const imageOptions = [
  {
    value: "default",
    label: "Imagen predeterminada",
    url: defaultImageUrl,
  },
  {
    value: "biblia1",
    label: "Imagen biblia 1",
    url: "https://i.ibb.co/9Td3wVk/ben-white-W8-Qqn1-Pm-QH0-unsplash.jpg",
  },
  {
    value: "biblia2",
    label: "Imagen biblia 2",
    url: "https://i.ibb.co/KW60XdT/aaron-burden-9zs-HNt5-Opq-E-unsplash.jpg",
  },
  {
    value: "biblia3",
    label: "Imagen biblia 3",
    url: "https://i.ibb.co/b786r8G/biblia.jpg",
  },
  {
    value: "damas",
    label: "Imagen damas",
    url: "https://i.ibb.co/MBTgMV7/damas.jpg",
  },
  {
    value: "misionero",
    label: "Imagen misionero",
    url: "https://i.ibb.co/nCJpgjQ/misionero.jpg",
  },
  { value: "custom", label: "Imagen personalizada" },
];

const showModal = ref(false);

watch(
  () => props.isOpen,
  (newValue) => {
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
      textoBoton: formData.value.textoBoton?.trim() || "",
      linkBoton: formData.value.linkBoton?.trim() || "",
      image: formData.value.image,
      fecha: new Date().toISOString(),
    };

    // Validar que si hay textoBoton también haya linkBoton
    if (dataToSubmit.textoBoton && !dataToSubmit.linkBoton) {
      alert("Si agregas un texto de botón, debes agregar también un enlace");
      return;
    }

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
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer"
                  placeholder=" "
                ></textarea>
                <label
                  for="descripcion"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Descripción (Opcional)
                </label>
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
                  v-model="formData.textoBoton"
                  type="text"
                  id="textoBoton"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer"
                  placeholder=" "
                />
                <label
                  for="textoBoton"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Texto del botón (Opcional)
                </label>
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
                  Link del botón (Opcional)
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
