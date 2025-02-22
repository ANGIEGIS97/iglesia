<script setup lang="ts">
import { ref } from "vue";
import { auth_api, usuarios } from "../../lib/api";

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const isSuccess = ref(false);
const progress = ref(0);
const isOpen = ref(false);
const intentosFallidos = ref(0);
const bloqueado = ref(false);
const tiempoRestante = ref(0);
const bloqueosPrevios = ref(0);
let temporizador: ReturnType<typeof setInterval> | null = null;

const emit = defineEmits(["login-success", "close"]);

const calcularTiempoBloqueo = (): number => {
  // Tiempo base de 30 segundos
  const tiempoBase = 30;
  // Cada bloqueo previo duplica el tiempo
  return tiempoBase * Math.pow(2, bloqueosPrevios.value);
};

const sanitizarEntrada = (texto: string): string => {
  // Eliminar espacios en blanco al inicio y final
  return (
    texto
      .trim()
      // Escapar caracteres especiales HTML
      .replace(/[&<>"']/g, (match) => {
        const escape: { [key: string]: string } = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return escape[match];
      })
      // Prevenir inyección de SQL básica
      .replace(/[;{}()\\]/g, "")
  );
};

const iniciarBloqueo = () => {
  bloqueado.value = true;
  bloqueosPrevios.value++;
  tiempoRestante.value = calcularTiempoBloqueo();

  temporizador = setInterval(() => {
    tiempoRestante.value--;
    if (tiempoRestante.value <= 0) {
      if (temporizador) clearInterval(temporizador);
      bloqueado.value = false;
      intentosFallidos.value = 0;
    }
  }, 1000);
};

const openModal = () => {
  isOpen.value = true;
  document.body.style.overflow = "hidden"; // Deshabilitar scroll
};

const closeModal = () => {
  isOpen.value = false;
  document.body.style.overflow = ""; // Restaurar scroll
  // Limpiar el formulario y estado
  username.value = "";
  password.value = "";
  error.value = "";
  isSuccess.value = false;
  progress.value = 0;
  intentosFallidos.value = 0;
  bloqueado.value = false;
  // No reiniciamos bloqueosPrevios para mantener el historial
  if (temporizador) clearInterval(temporizador);
  emit("close");
};

const handleBlockedForm = () => {
  const minutos = Math.floor(tiempoRestante.value / 60);
  const segundos = tiempoRestante.value % 60;
  const tiempoFormateado =
    minutos > 0
      ? `${minutos} minutos y ${segundos} segundos`
      : `${segundos} segundos`;
  error.value = `Formulario bloqueado. Espere ${tiempoFormateado}.`;
};

const handleFirebaseError = (err: any) => {
  if (!err?.code) return "Error al iniciar sesión";

  const errorMessages: { [key: string]: string } = {
    "auth/invalid-email": "El correo electrónico no es válido",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
    "auth/user-not-found": "No existe una cuenta con este correo",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/too-many-requests":
      "Demasiados intentos fallidos. Por favor, intente más tarde",
    "auth/network-request-failed":
      "Error de conexión. Verifique su conexión a internet",
  };

  return errorMessages[err.code] || "Error al iniciar sesión";
};

const animateProgress = () => {
  const animationDuration = 1000;
  const steps = 100;
  const stepDuration = animationDuration / steps;

  for (let i = 1; i <= steps; i++) {
    setTimeout(() => {
      progress.value = i;
    }, i * stepDuration);
  }
};

const handleSubmit = async () => {
  if (bloqueado.value) {
    handleBlockedForm();
    return;
  }

  try {
    isLoading.value = true;
    error.value = "";
    progress.value = 0;

    const response = await auth_api.login({
      username: sanitizarEntrada(username.value),
      password: sanitizarEntrada(password.value),
    });

    // Obtener el perfil del usuario y guardarlo en localStorage
    try {
      const userProfile = await auth_api.getCurrentUser();
      if (userProfile?.uid) {
        const profile = await usuarios.getById(userProfile.uid);
        if (profile?.data?.displayName && typeof window !== "undefined") {
          try {
            localStorage.setItem("userDisplayName", profile.data.displayName);
          } catch (error) {
            console.error("Error guardando en localStorage:", error);
          }
        }
      }
    } catch (err) {
      console.error("Error al guardar perfil en localStorage:", err);
    }

    isSuccess.value = true;
    intentosFallidos.value = 0;
    animateProgress();

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("token", response.data.token);
      } catch (error) {
        console.error("Error guardando token en localStorage:", error);
      }
    }

    setTimeout(() => {
      emit("login-success", response.data);
      closeModal();
    }, 1000);
  } catch (err: any) {
    intentosFallidos.value++;
    error.value = handleFirebaseError(err);

    if (intentosFallidos.value >= 3) {
      iniciarBloqueo();
    }

    isSuccess.value = false;
    progress.value = 0;
    console.error("Error de autenticación:", err);
  } finally {
    isLoading.value = false;
  }
};

defineExpose({ openModal, closeModal });
</script>

<template>
  <!-- Overlay del modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
  >
    <!-- Modal -->
    <div
      class="relative bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full m-4 border border-white/20 animate__animated animate__fadeInDown"
    >
      <!-- Header con título y botón de cerrar -->
      <div
        class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">
          Iniciar Sesión
        </h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
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

      <form @submit.prevent="handleSubmit" class="p-6 pt-4">
        <div class="mb-4">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="username"
          >
            Usuario
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div class="mb-6">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="password"
          >
            Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div v-if="error" class="mb-4 text-red-500 text-sm">
          {{ error }}
        </div>

        <div v-if="bloqueado" class="mb-4 text-amber-500 text-sm">
          Tiempo restante para desbloqueo: {{ tiempoRestante }} segundos
        </div>

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
                  ? "Iniciando sesión..."
                  : isSuccess
                  ? "Sesión iniciada"
                  : "Iniciar Sesión"
              }}
            </div>
            <div
              class="absolute inset-0 bg-green-400 dark:bg-green-500 transition-all duration-1000 ease-out"
              :style="{ clipPath: `inset(0 ${100 - progress}% 0 0)` }"
            ></div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
