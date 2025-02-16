<template>
  <div
    v-if="evento"
    @click="cerrarSiEsFondo"
    class="fixed inset-0 backdrop-blur-sm bg-gray-900/50 flex items-center justify-center z-50"
  >
    <div
      :class="[
        'max-w-xl w-full relative p-[2px] dark:bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-xl animate-gradient animate__animated animate__fadeInDown'
      ]"
    >
      <div class="bg-white dark:bg-slate-600/85 rounded-lg">
        <div
          :class="[
            'p-4 rounded-t-lg flex justify-between items-center',
            'dark:bg-transparent',
            evento.infoIconoTexto === 'Canasta de amor' ? 'bg-red-500' : '',
            evento.infoIconoTexto === 'Cena del Señor' ? 'bg-red-700' : '',
            evento.infoIconoTexto === 'Reunión de damas' ? 'bg-pink-500' : '',
            evento.infoIconoTexto === 'Domingo misionero' ? 'bg-green-500' : '',
            evento.infoIconoTexto === 'Culto de oración' ? 'bg-violet-500' : '',
            ![
              'Canasta de amor',
              'Cena del Señor',
              'Reunión de damas',
              'Domingo misionero',
              'Culto de oración',
            ].includes(evento.infoIconoTexto)
              ? 'bg-teal-500'
              : '',
          ]"
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
              <p class="mb-2">
                <strong>Hora:</strong> {{ formatTime(evento.hora) }}
              </p>
              <p class="mb-2">
                <strong>{{ isUrl(evento.lugar) ? 'Link' : 'Lugar' }}: </strong>
                <template v-if="isUrl(evento.lugar)">
                  <a :href="evento.lugar" target="_blank" class="text-blue-500 hover:text-blue-700 underline">
                    {{ evento.lugar }}
                  </a>
                </template>
                <template v-else>
                  {{ evento.lugar }}
                </template>
              </p>
              <p class="mb-2">
                <strong>Descripción:</strong>
                {{ evento.descripcion }}
              </p>
              <p class="dark:text-white">
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
import 'animate.css';
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
    formatTime(time) {
      if (!time) return "";
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "pm" : "am";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    },
    isUrl(str) {
      if (!str) return false;
      // Agregar soporte para URLs que empiezan con www.
      if (str.startsWith('www.')) {
        str = 'http://' + str;
      }
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    },
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

.animate__fadeInDown {
  animation-duration: 0.5s !important;
  animation-fill-mode: both !important;
  animation-iteration-count: 1 !important;
}

/* Aseguramos que el fondo tenga su propia transición suave */
.backdrop-blur-sm {
  transition: all 0.3s ease-in-out;
}
</style>
