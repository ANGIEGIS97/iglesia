<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { auth_api } from "../lib/api";

const countdown = ref(3);
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

onMounted(() => {
  // Iniciar la cuenta regresiva directamente
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      window.location.replace("/");
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const handleLogout = async () => {
  try {
    // Usar auth_api para cerrar sesión
    await auth_api.logout();

    // Iniciar la cuenta regresiva
    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        // Forzar recarga completa para limpiar el estado de la aplicación
        window.location.replace("/");
      }
    }, 1000);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // En caso de error, limpiar el estado de todas formas y redirigir
    clearAuthState();
    window.location.replace("/");
  }
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
  >
    <div class="max-w-md w-full text-center space-y-8">
      <!-- Imagen central -->
      <div class="flex justify-center">
        <img
          src="/desconectado.png"
          alt="Sesión cerrada"
          class="w-48 h-48 object-contain"
        />
      </div>

      <!-- Mensaje de desconexión -->
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
        ¡Hasta pronto!
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Has cerrado sesión correctamente
      </p>

      <!-- Botón con cuenta regresiva -->
      <div class="mt-4">
        <button
          disabled
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
        >
          Regresando a inicio en {{ countdown }} segundos
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
