<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from "vue";

const props = defineProps({
  event: {
    type: Object,
    default: () => ({
      titulo: "",
      descripcion: "",
      textoBoton: "",
      linkBoton: "",
      image: "https://i.ibb.co/hcqMNSY/james-lee-0-YQz7-M2fc-YY-unsplash.jpg",
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
const defaultImageUrl = "https://i.ibb.co/FxQKF5N/fondo-logo.jpg";

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

// Modify the watch to update all form data
watch(
  () => props.event,
  (newEvent) => {
    // Update all form data fields
    formData.value = { ...newEvent };

    // Handle image selection
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

// Update formData.image when selection changes
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

const handleSubmit = () => {
  emit("submit", formData.value);
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed top-[88px] inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overflow-y-auto py-4"
  >
    <div
      class="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-md mx-4 mt-auto mb-auto relative"
    >
      <!-- Modified header section -->
      <div class="bg-gray-200 px-4 py-2 rounded-t-lg">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-black">
            {{ isEdit ? "Editar Anuncio" : "Nuevo Anuncio" }}
          </h3>
          <button
            @click="$emit('cancel')"
            class="text-gray-700 hover:text-black transition duration-300"
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
      <!-- Form content with padding -->
      <div class="p-4">
        <div class="bg-white max-w-xl mx-auto">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Título (Opcional)</label
              >
              <input
                v-model="formData.titulo"
                type="text"
                placeholder="Ingrese el título"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Descripción (Opcional)</label
              >
              <textarea
                v-model="formData.descripcion"
                rows="4"
                placeholder="Ingrese la descripción"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2"
                >Imagen</label
              >
              <select
                v-model="selectedImageOption"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
              >
                <option
                  v-for="option in imageOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
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
                <input
                  v-model="customImageUrl"
                  type="text"
                  placeholder="Ingrese la URL de la imagen"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Texto del botón (Opcional)
              </label>
              <input
                v-model="formData.textoBoton"
                type="text"
                placeholder="Ingrese el texto del botón"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Link del botón (Opcional)
              </label>
              <input
                v-model="formData.linkBoton"
                type="text"
                placeholder="Ingrese el link del botón"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
              />
            </div>
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="$emit('cancel')"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition duration-300 ease-in-out"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
