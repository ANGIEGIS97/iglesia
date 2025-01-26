<script setup lang="ts">
import { ref } from "vue";
import { auth } from "../../lib/api";

const username = ref("");
const password = ref("");
const error = ref("");

const handleSubmit = async () => {
  try {
    const response = await auth.login({
      username: username.value,
      password: password.value,
    });
    localStorage.setItem("token", response.data.token);

    // Redirigir a la página de administración de eventos después de iniciar sesión
    window.location.href = "/admin/eventos";
  } catch (err: any) {
    error.value = err.response?.data?.mensaje || "Error al iniciar sesión";
  }
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-32"
  >
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Iniciar Sesión</h2>

    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Usuario
      </label>
      <input
        v-model="username"
        type="text"
        id="username"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Contraseña
      </label>
      <input
        v-model="password"
        type="password"
        id="password"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>

    <div v-if="error" class="mb-4 text-red-500 text-sm">
      {{ error }}
    </div>

    <button
      type="submit"
      class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Iniciar Sesión
    </button>
  </form>
</template>
