<script setup lang="ts">
import { ref, onMounted } from 'vue';

const countdown = ref(10);
const redirecting = ref(false);

onMounted(() => {
  // Eliminar el token al montar el componente
  localStorage.removeItem("token");
  
  // Iniciar la cuenta regresiva
  redirecting.value = true;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      window.location.href = "/";
    }
  }, 1000);
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
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