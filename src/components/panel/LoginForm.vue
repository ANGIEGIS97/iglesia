<script setup lang="ts">
import { ref} from "vue";
import { auth_api, usuarios } from "../../lib/api";
import AccountSelector from "./AccountSelector.vue";

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
const showPassword = ref(false);
const rememberMe = ref(false);
const showAccountSelector = ref(false);
let temporizador: ReturnType<typeof setInterval> | null = null;

const emit = defineEmits(["login-success", "close", "auth-state-change"]);

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
  // Verificar si hay cuentas guardadas
  const hasSavedAccounts = checkForSavedAccounts();
  
  if (hasSavedAccounts) {
    showAccountSelector.value = true;
  } else {
    isOpen.value = true;
  }
};

const checkForSavedAccounts = (): boolean => {
  try {
    // Verificar si hay al menos una cuenta guardada
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("rememberUser_")) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error al verificar cuentas guardadas:", error);
    return false;
  }
};

const closeModal = () => {
  isOpen.value = false;
  showAccountSelector.value = false;
  // Limpiar el formulario y estado
  if (!rememberMe.value) {
    username.value = "";
    password.value = "";
  }
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

const guardarPerfilUsuario = async (userProfile: any) => {
  if (!userProfile?.uid) return;
  
  try {
    const profile = await usuarios.getById(userProfile.uid);
    if (profile?.data && typeof window !== "undefined") {
      try {
        // Guardar el nombre para mostrar en la sesión actual
        localStorage.setItem("userDisplayName", profile.data.displayName || "");
        
        if (rememberMe.value) {
          // Guardar con un prefijo para identificar múltiples cuentas
          const userKey = `rememberUser_${userProfile.uid}`;
          localStorage.setItem(userKey, username.value);
          localStorage.setItem(`rememberPassword_${username.value}`, password.value);
          
          // Guardar el nombre para mostrar asociado a este usuario
          if (profile.data.displayName) {
            localStorage.setItem(`displayName_${username.value}`, profile.data.displayName);
          }
          
          // También guardar el email si está disponible
          if (profile.data.email) {
            localStorage.setItem(`email_${username.value}`, profile.data.email);
          }
        }
      } catch (error) {
        console.error("Error guardando en localStorage:", error);
      }
    }
  } catch (err) {
    console.error("Error al guardar perfil en localStorage:", err);
  }
};

const guardarToken = (token: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error guardando token en localStorage:", error);
    }
  }
};

const manejarLoginExitoso = (response: any) => {
  isSuccess.value = true;
  intentosFallidos.value = 0;
  animateProgress();
  
  guardarToken(response.data.token);

  setTimeout(() => {
    emit("login-success", response.data);
    closeModal();
  }, 1000);
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
      password: sanitizarEntrada(password.value)
    });

    // Obtener el perfil del usuario y guardarlo en localStorage
    const userProfile = await auth_api.getCurrentUser();
    await guardarPerfilUsuario(userProfile);
    
    manejarLoginExitoso(response);
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

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSelectAccount = async (response: any) => {
  await updateAuthState();
  emit("login-success", response);
  closeModal();
};

const handleUseAnotherAccount = () => {
  showAccountSelector.value = false;
  isOpen.value = true;
  username.value = "";
  password.value = "";
  rememberMe.value = false;
};

const handleAccountSelection = async (account) => {
  showAccountSelector.value = false;
  await updateAuthState();
};

// Función para actualizar el estado de autenticación
const updateAuthState = async () => {
  const token = localStorage.getItem('token');
  const user = auth_api.getCurrentUser();
  if (user && token) {
    emit('auth-state-change', { authenticated: true, user });
  }
};

defineExpose({ openModal, closeModal });
</script>

<template>
  <!-- Selector de cuentas -->
  <AccountSelector 
    :is-open="showAccountSelector" 
    @close="closeModal" 
    @select-account="handleSelectAccount"
    @use-another="handleUseAnotherAccount"
  />

  <!-- Overlay del modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
  >
    <!-- Modal -->
    <div
      class="relative bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full m-4 border border-white/20 animate-fadeIn"
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
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="username"
              type="text"
              id="username"
              placeholder="Ingrese su usuario"
              class="w-full pl-10 pr-3 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div class="mb-6">
          <label
            class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            for="password"
          >
            Contraseña
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="Ingrese su contraseña"
              class="w-full pl-10 pr-10 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button 
                type="button" 
                @click="togglePasswordVisibility" 
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center mb-6">
          <div class="relative flex items-center">
            <input 
              type="checkbox" 
              id="remember" 
              v-model="rememberMe"
              class="w-4 h-4 appearance-none border border-gray-300 rounded bg-white checked:bg-teal-500 checked:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 transition-colors duration-200"
            />
            <svg class="absolute w-3 h-3 text-white pointer-events-none left-0.5 top-0.5" viewBox="0 0 20 20" fill="currentColor" style="display: none;" :style="{ display: rememberMe ? 'block' : 'none' }">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <label for="remember" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Recuérdame
          </label>
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

<style scoped>
/* Animaciones para el formulario de login */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate3d(0, -20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s both;
}
</style>
