<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
            Administración
          </h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              class="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        <nav class="space-y-2">
          <a
            href="/admin/eventos"
            :class="[
              'flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700',
              currentPath === '/admin/eventos'
                ? 'text-teal-500 dark:text-teal-400'
                : 'text-gray-700 dark:text-gray-200',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Administrar Anuncios
          </a>

          <a
            href="/admin/fechas"
            :class="[
              'flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700',
              currentPath === '/admin/fechas'
                ? 'text-teal-500 dark:text-teal-400'
                : 'text-gray-700 dark:text-gray-200',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Administrar Fechas
          </a>

          <a
            href="/cambiopass"
            :class="[
              'flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700',
              currentPath === '/cambiopass'
                ? 'text-teal-500 dark:text-teal-400'
                : 'text-gray-700 dark:text-gray-200',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            Cambiar Contraseña
          </a>

          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminSidebar",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      currentPath: "",
    };
  },
  methods: {
    handleLogout() {
      window.location.href = "/logout";
    },
    updateCurrentPath() {
      this.currentPath = window.location.pathname;
    },
  },
  mounted() {
    this.updateCurrentPath();
    window.addEventListener("popstate", this.updateCurrentPath);
  },
  beforeUnmount() {
    window.removeEventListener("popstate", this.updateCurrentPath);
  },
};
</script>

<style scoped>
a {
  transition: color 0.3s ease;
}
</style>
