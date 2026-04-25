<template>
  <BaseModal :open="isOpen" title="Editar Perfil" @close="closeModal">
    <form @submit.prevent="handleSubmit" class="p-6 pt-4">
        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="displayName"
          >
            Nombre de usuario
          </label>
          <input
            type="text"
            id="displayName"
            v-model="formData.displayName"
            :placeholder="currentDisplayName || 'Ingresa tu nombre de usuario'"
            :readonly="!!currentDisplayName"
            class="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            :class="{ 'cursor-not-allowed opacity-75': !!currentDisplayName }"
            required
          />
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="mb-4 text-red-500 text-sm">
          {{ error }}
        </div>

        <div class="relative">
          <button
            type="submit"
            class="w-full font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-colors duration-300 relative text-white"
            :class="[
              isSuccess ? 'text-white' : 'bg-teal-500 hover:bg-teal-600',
            ]"
            :disabled="isLoading || isSuccess || !!currentDisplayName"
          >
            <div class="relative z-10">
              {{
                isLoading
                  ? "Guardando..."
                  : isSuccess
                  ? "Guardado exitosamente"
                  : !!currentDisplayName
                  ? "No se puede modificar"
                  : "Guardar cambios"
              }}
            </div>
            <div
              class="absolute inset-0 bg-green-400 dark:bg-green-500 transition-all duration-1000 ease-out"
              :style="{ clipPath: `inset(0 ${100 - progress}% 0 0)` }"
            ></div>
          </button>
        </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { auth_api, usuarios } from "../lib/api";
import BaseModal from "./common/BaseModal.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  currentDisplayName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "update"]);

const formData = reactive({
  displayName: props.currentDisplayName,
});

// Watcher para mantener sincronizado el displayName
watch(
  () => props.currentDisplayName,
  (newValue) => {
    formData.displayName = newValue;
  }
);

const isLoading = ref(false);
const isSuccess = ref(false);
const progress = ref(0);
const error = ref("");

const closeModal = () => {
  emit("close");
  error.value = "";
  isSuccess.value = false;
  progress.value = 0;
};

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    error.value = "";
    progress.value = 0;

    const user = auth_api.getCurrentUser();

    if (!user) {
      throw new Error("No hay sesión activa");
    }

    await usuarios.update(user.uid, {
      displayName: formData.displayName,
      updatedAt: new Date(),
    });

    isSuccess.value = true;

    // Animación de progreso
    const animationDuration = 1000;
    const steps = 100;
    const stepDuration = animationDuration / steps;

    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        progress.value = i;
      }, i * stepDuration);
    }

    // Cerrar el modal después de la animación
    setTimeout(() => {
      emit("update", formData.displayName);
      closeModal();
    }, animationDuration);
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    error.value =
      "Error al actualizar el perfil. Por favor, intenta nuevamente.";
    isSuccess.value = false;
    progress.value = 0;
  } finally {
    isLoading.value = false;
  }
};
</script>
