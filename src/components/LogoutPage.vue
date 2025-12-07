<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { auth_api } from "../lib/api";

const countdown = ref(3);
const progress = ref(100);
let timer: NodeJS.Timeout;

const clearAuthState = () => {
  // Limpiar el estado de autenticación
  localStorage.removeItem("token");
  sessionStorage.clear();

  // Limpiar cualquier otra información de usuario que puedas tener almacenada
  try {
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
  } catch (e) {
    console.error("Error al limpiar IndexedDB:", e);
  }
};

onMounted(async () => {
  // Primero hacer el logout
  try {
    await auth_api.logout();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // Limpiar el estado de todas formas
    clearAuthState();
  }
  
  // Luego iniciar la cuenta regresiva
  startCountdown();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const startCountdown = () => {
  const totalTime = 3000; // 3 seconds
  const interval = 100; // update every 100ms for smoother sync
  let elapsed = 0;

  timer = setInterval(() => {
    elapsed += interval;
    
    // Actualizar la barra de progreso
    progress.value = Math.max(0, 100 - (elapsed / totalTime) * 100);
    
    // Actualizar el countdown basado en el tiempo restante
    const secondsRemaining = Math.ceil((totalTime - elapsed) / 1000);
    countdown.value = secondsRemaining;
    
    // Cuando el tiempo se agota, redirigir
    if (elapsed >= totalTime) {
      clearInterval(timer);
      window.location.replace("/");
    }
  }, interval);
};

const redirectToHome = () => {
  window.location.replace("/");
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4 relative overflow-hidden"
  >
    <!-- Decorative background elements -->
    <div
      class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
    >
      <div
        class="absolute -top-24 -left-24 w-96 h-96 bg-azul/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/2 right-0 w-64 h-64 bg-morado/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-1/3 w-80 h-80 bg-amarillo/5 rounded-full blur-3xl"
      ></div>
    </div>

    <div
      class="relative max-w-md w-full p-8 text-center"
    >
      <!-- Imagen central -->
      <div class="flex justify-center mb-8 relative">
        <img
          src="/desconectado.png"
          alt="Sesión cerrada"
          class="w-40 h-40 object-contain relative z-10"
        />
      </div>

      <!-- Mensaje de desconexión -->
      <div class="space-y-3 mb-8">
        <h2
          class="text-3xl font-montserrat font-bold text-gray-900 dark:text-white tracking-tight"
        >
          ¡Hasta pronto!
        </h2>
        <p class="text-lg font-asap text-gray-600 dark:text-gray-300">
          Has cerrado sesión correctamente
        </p>
      </div>

      <!-- Indicador de progreso y redirección -->
      <div class="space-y-4">
        <div class="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-100 ease-linear"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        
        <p class="text-sm font-asap text-gray-500 dark:text-gray-400 animate-pulse">
          Regresando al inicio en <span class="font-bold text-azul dark:text-amarillo">{{ countdown }}</span> segundos...
        </p>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <button
          @click="redirectToHome"
          class="text-sm text-gray-500 hover:text-azul dark:text-gray-400 dark:hover:text-white transition-colors font-asap flex items-center justify-center gap-2 mx-auto group"
        >
          <span>Ir al inicio ahora</span>
          <i class="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>
    </div>
    
    <div class="mt-8 text-center">
      <p class="text-xs text-gray-400 dark:text-gray-500 font-asap">
        Iglesia Bautista Su Gracia es Mayor
      </p>
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
