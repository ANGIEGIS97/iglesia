<template>
  <form
    @submit.prevent="handleSubmit"
    class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-32"
  >
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Cambiar Contraseña</h2>

    <!-- Old Password Field -->
    <div class="mb-4">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="oldPassword"
      >
        Contraseña Actual
      </label>
      <div class="relative">
        <input
          v-model="formData.oldPassword"
          :type="showOldPassword ? 'text' : 'password'"
          id="oldPassword"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          @click="showOldPassword = !showOldPassword"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
        class="block text-gray-700 text-sm font-bold mb-2"
        for="newPassword"
      >
        Nueva Contraseña
      </label>
      <div class="relative">
        <input
          v-model="formData.newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          id="newPassword"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          @click="showNewPassword = !showNewPassword"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
        class="block text-gray-700 text-sm font-bold mb-2"
        for="confirmPassword"
      >
        Confirmar Nueva Contraseña
      </label>
      <div class="relative">
        <input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          id="confirmPassword"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
        class="w-full font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden transition-colors duration-300 relative text-white"
        :class="[isSuccess ? 'text-white' : 'bg-blue-500']"
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
          class="absolute inset-0 bg-green-400 transition-all duration-1000 ease-out"
          :style="{ clipPath: `inset(0 ${100 - progress}% 0 0)` }"
        ></div>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { auth } from "../lib/api";

// Verificar autenticación al montar el componente
onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }
});

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

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  message.value = null;
  progress.value = 0;

  try {
    await auth.changePassword({
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
  } catch (error: any) {
    // Simplificar para mostrar solo un mensaje de error
    if (error.response?.status === 401) {
      if (error.response?.data?.mensaje?.includes("token")) {
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        // Mostrar solo un mensaje de error
        message.value = {
          type: "error",
          text: "La contraseña es incorrecta",
        };
      }
    } else {
      message.value = {
        type: "error",
        text: "La contraseña es incorrecta",
      };
    }

    // Reset success state and progress in case of error
    isSuccess.value = false;
    progress.value = 0;
  } finally {
    isLoading.value = false;
  }
};
</script>
