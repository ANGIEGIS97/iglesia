<template>
  <div
    class="relative min-h-52 sm:min-h-64 overflow-hidden flex items-center justify-center"
  >
    <!-- Fondo con efecto parallax -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-fixed bg-white opacity-50"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>

    <!-- Contenido -->
    <div class="relative z-10 text-center">
      <a
        href="https://www.facebook.com/iglesiabautistabosa/"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition duration-300text-lg"
      >
        <svg
          class="w-6 h-6 mr-2 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        </svg>
        Síguenos en Facebook
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      backgroundImage:
        "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };
  },
};
</script>
