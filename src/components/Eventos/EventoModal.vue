<template>
  <div
    v-if="evento"
    @click="cerrarSiEsFondo"
    class="fixed inset-0 backdrop-blur-sm bg-gray-900/50 flex items-center justify-center z-50"
  >
    <div
      class="max-w-xl w-full relative p-[2px] dark:bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-xl animate-gradient"
    >
      <div class="bg-white dark:bg-slate-600/85 rounded-lg">
        <div
          class="bg-teal-500 dark:bg-transparent p-4 rounded-t-lg flex justify-between items-center"
        >
          <h2 class="text-xl sm:text-2xl font-bold text-white">
            {{ evento.titulo }}
          </h2>
          <button
            @click="cerrar"
            class="text-white hover:text-gray-200 transition duration-300"
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
        <div class="p-6 dark:text-white">
          <div class="flex flex-col md:flex-row">
            <div
              v-if="evento.banner !== null"
              class="md:w-1/2 mb-4 md:mb-0 md:mr-4 flex justify-center relative"
            >
              <img
                :src="evento.banner"
                alt="Imagen del evento"
                class="w-2/3 h-auto rounded-lg cursor-pointer"
                @click="abrirImagenAmpliada"
              />
              <!-- Icono de expansión -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 absolute top-2 right-2 text-white bg-teal-500 rounded-full p-1 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                @click="abrirImagenAmpliada"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 4a6 6 0 104.472 10.312l5.2 5.2a1 1 0 001.414-1.414l-5.2-5.2A6 6 0 0010 4z"
                />
              </svg>
            </div>
            <div
              :class="{
                'md:w-1/2': evento.banner !== null,
                'w-full': evento.banner === null,
              }"
            >
              <p class="mb-2">
                <strong>Fecha:</strong> {{ evento.dia }} de
                {{ evento.mes }}
              </p>
              <p class="mb-2"><strong>Hora:</strong> {{ evento.hora }}</p>
              <p class="mb-2">
                <strong>{{ evento.lugar ? "Lugar" : "Link" }}:</strong>
                {{ evento.lugar || evento.link }}
              </p>
              <p class="mb-2">
                <strong>Descripción:</strong>
                {{ evento.descripcion }}
              </p>
              <p class="text-teal-500 dark:text-white">
                <strong>Días restantes:</strong>
                {{
                  evento.diasRestantes === 0
                    ? "Hoy"
                    : evento.diasRestantes === 1
                    ? "1 día"
                    : `${evento.diasRestantes} días`
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal para la imagen ampliada -->
    <div
      v-if="imagenAmpliada"
      @click="cerrarImagenAmpliada"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60"
    >
      <img
        :src="evento.banner"
        alt="Imagen ampliada del evento"
        class="w-full max-w-[90%] max-h-[90%] object-contain"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    evento: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imagenAmpliada: false,
    };
  },
  methods: {
    cerrar() {
      document.body.classList.remove("modal-open");
      this.$emit("cerrar");
    },
    cerrarSiEsFondo(event) {
      if (event.target === event.currentTarget) {
        this.cerrar();
      }
    },
    abrirImagenAmpliada() {
      this.imagenAmpliada = true;
    },
    cerrarImagenAmpliada() {
      this.imagenAmpliada = false;
    },
  },
  mounted() {
    document.body.classList.add("modal-open");
  },
  beforeUnmount() {
    document.body.classList.remove("modal-open");
  },
};
</script>

<style>
.modal-open {
  overflow: hidden;
}
</style>
