<template>
  <BaseModal :open="isOpen" title="Cambiar Contraseña" @close="closeModal">
    <form @submit.prevent="handleSubmit" class="p-6 pt-4">
        <!-- Old Password Field -->
        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="oldPassword"
          >
            Contraseña Actual
          </label>
          <div class="relative">
            <input
              v-model="formData.oldPassword"
              :type="showOldPassword ? 'text' : 'password'"
              id="oldPassword"
              class="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <button
              type="button"
              @click="showOldPassword = !showOldPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <i class="material-icons text-xl">
                {{ showOldPassword ? "visibility_off" : "visibility" }}
              </i>
            </button>
          </div>
          <p v-if="errors.oldPassword" class="mt-1 text-red-500 text-sm">
            {{ errors.oldPassword }}
          </p>
        </div>

        <!-- New Password Field -->
        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="newPassword"
          >
            Nueva Contraseña
          </label>
          <div class="relative">
            <input
              v-model="formData.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              id="newPassword"
              class="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <i class="material-icons text-xl">
                {{ showNewPassword ? "visibility_off" : "visibility" }}
              </i>
            </button>
          </div>
          <p v-if="errors.newPassword" class="mt-1 text-red-500 text-sm">
            {{ errors.newPassword }}
          </p>
        </div>

        <!-- Confirm New Password Field -->
        <div class="mb-6">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="confirmPassword"
          >
            Confirmar Nueva Contraseña
          </label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              class="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <i class="material-icons text-xl">
                {{ showConfirmPassword ? "visibility_off" : "visibility" }}
              </i>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="mt-1 text-red-500 text-sm">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="message?.type === 'error'" class="mb-4 text-red-500 text-sm">
          {{ message.text }}
        </div>

        <!-- Submit Button with Progressive Color Change -->
        <div class="relative">
          <button
            type="submit"
            class="w-full font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-colors duration-300 relative text-white"
            :class="[
              isSuccess ? 'text-white' : 'bg-teal-500 hover:bg-teal-600',
            ]"
            :disabled="isLoading || isSuccess"
          >
            <div class="relative z-10">
              {{
                isLoading
                  ? "Cambiando contraseña..."
                  : isSuccess
                  ? "Contraseña actualizada"
                  : "Cambiar Contraseña"
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

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { auth_api } from "../lib/api";
import BaseModal from "./common/BaseModal.vue";

const isOpen = ref(false);
const formData = reactive({
  oldPassword: "",
  newPassword: "",
});

const confirmPassword = ref("");
const errors = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const isLoading = ref(false);
const isSuccess = ref(false);
const progress = ref(0);
const message = ref<{ type: "success" | "error"; text: string } | null>(null);

// Add states for password visibility
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const progressWidth = computed(() => `${progress.value}%`);

const validateForm = () => {
  let isValid = true;
  errors.oldPassword = "";
  errors.newPassword = "";
  errors.confirmPassword = "";

  if (!formData.oldPassword) {
    errors.oldPassword = "La contraseña actual es requerida";
    isValid = false;
  }

  if (!formData.newPassword) {
    errors.newPassword = "La nueva contraseña es requerida";
    isValid = false;
  } else if (formData.newPassword.length < 6) {
    errors.newPassword = "La contraseña debe tener al menos 6 caracteres";
    isValid = false;
  } else if (formData.newPassword === formData.oldPassword) {
    errors.newPassword = "La nueva contraseña debe ser diferente a la actual";
    isValid = false;
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = "Por favor confirma tu nueva contraseña";
    isValid = false;
  } else if (formData.newPassword !== confirmPassword.value) {
    errors.confirmPassword = "Las contraseñas no coinciden";
    isValid = false;
  }

  return isValid;
};

const openModal = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  document.body.classList.add("modal-open");
  isOpen.value = true;
};

const closeModal = () => {
  document.body.classList.remove("modal-open");
  isOpen.value = false;
  // Limpiar el formulario y estado
  formData.oldPassword = "";
  formData.newPassword = "";
  confirmPassword.value = "";
  errors.oldPassword = "";
  errors.newPassword = "";
  errors.confirmPassword = "";
  isSuccess.value = false;
  progress.value = 0;
  message.value = null;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  message.value = null;
  progress.value = 0;

  try {
    await auth_api.changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    // Set success state immediately
    isSuccess.value = true;

    // Trigger success animation
    const animationDuration = 1000; // 1 second
    const steps = 100;
    const stepDuration = animationDuration / steps;

    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        progress.value = i;
      }, i * stepDuration);
    }

    // Cerrar el modal después de un éxito
    setTimeout(() => {
      closeModal();
    }, 1000);
  } catch (error: any) {
    message.value = {
      type: "error",
      text: error.response?.data?.mensaje || "Error al cambiar la contraseña",
    };

    isSuccess.value = false;
    progress.value = 0;
  } finally {
    isLoading.value = false;
  }
};

defineExpose({ openModal, closeModal });
</script>

<style scoped>
:global(body.modal-open) {
  overflow: hidden;
}
</style>
