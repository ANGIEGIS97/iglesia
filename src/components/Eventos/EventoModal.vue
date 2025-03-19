<template>
  <div
    v-if="evento"
    @click="cerrarSiEsFondo"
    class="fixed inset-0 backdrop-blur-sm bg-gray-900/50 flex items-center justify-center z-50"
  >
    <div
      :class="[
        'max-w-xl w-full relative p-[2px] dark:bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg shadow-xl animate-gradient animate__animated animate__fadeInDown',
      ]"
    >
      <div class="bg-white dark:bg-slate-600/85 rounded-lg">
        <div
          :class="[
            'p-4 rounded-t-lg flex justify-between items-center',
            'dark:bg-transparent',
            evento.infoIconoTexto === 'Cumpleaños' ? 'bg-yellow-500' : '',
            evento.infoIconoTexto === 'Canasta de amor' ? 'bg-red-500' : '',
            evento.infoIconoTexto === 'Cena del Señor' ? 'bg-red-700' : '',
            evento.infoIconoTexto === 'Reunión de damas' ? 'bg-pink-500' : '',
            evento.infoIconoTexto === 'Domingo misionero' ? 'bg-green-500' : '',
            evento.infoIconoTexto === 'Culto de oración' ? 'bg-violet-500' : '',
            evento.infoIconoTexto === 'Reunión de varones' ? 'bg-blue-500' : '',
            evento.infoIconoTexto === 'Reunión de jovenes'
              ? 'bg-indigo-500'
              : '',
            evento.infoIconoTexto === 'Noches navideñas' ? 'bg-red-400' : '',
            evento.infoIconoTexto === 'Reuniones caseras'
              ? 'bg-orange-500'
              : '',
            ![
              'Cumpleaños',
              'Canasta de amor',
              'Cena del Señor',
              'Reunión de damas',
              'Domingo misionero',
              'Culto de oración',
              'Reunión de varones',
              'Reunión de jovenes',
              'Noches navideñas',
              'Reuniones caseras',
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
                alt="Banner del evento"
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
              <p class="mb-2" v-if="tiempoRestante">
                <strong>Tiempo restante:</strong> {{ tiempoRestante }}
              </p>
              <p class="mb-2">
                <strong>{{ isUrl(evento.lugar) ? "Link" : "Lugar" }}: </strong>
                <template v-if="isUrl(evento.lugar)">
                  <a
                    :href="evento.lugar"
                    target="_blank"
                    class="text-blue-500 dark:text-white hover:text-blue-700 dark:hover:text-teal-200 underline"
                  >
                    <template v-if="evento.lugar.includes('tinyurl.com')">
                      Ubicación Google Maps
                    </template>
                    <template v-else>
                      {{ evento.lugar }}
                    </template>
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
              <!-- Removed días restantes section -->
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
        alt="Banner ampliado del evento"
        class="w-full max-w-[90%] max-h-[90%] object-contain"
      />
    </div>
  </div>
</template>

<script>
import "animate.css";
import confetti from "canvas-confetti";

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
      tiempoRestante: "",
      intervalId: null,
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
    calcularTiempoRestante() {
      if (
        !this.evento ||
        !this.evento.hora ||
        !this.evento.dia ||
        !this.evento.mes
      ) {
        this.tiempoRestante = "";
        return;
      }

      const [horas, minutos] = this.evento.hora.split(":");
      const fecha = new Date();
      fecha.setMonth(this.obtenerNumeroMes(this.evento.mes) - 1);
      fecha.setDate(parseInt(this.evento.dia));
      fecha.setHours(parseInt(horas), parseInt(minutos), 0);

      // Crear fecha actual en zona horaria de Bogota
      const ahora = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
      );

      if (fecha < ahora) {
        this.tiempoRestante = "Evento finalizado";
        return;
      }

      const diferencia = fecha - ahora;
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horasRestantes = Math.floor(
        (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutosRestantes = Math.floor(
        (diferencia % (1000 * 60 * 60)) / (1000 * 60)
      );

      let mensaje = "";
      if (dias > 0) {
        mensaje = `${dias} días, ${horasRestantes} horas`;
        if (minutosRestantes > 0) mensaje += ` y ${minutosRestantes} minutos`;
      } else if (horasRestantes > 0) {
        mensaje = `${horasRestantes} horas`;
        if (minutosRestantes > 0) mensaje += ` y ${minutosRestantes} minutos`;
      } else if (minutosRestantes > 0) {
        mensaje = `${minutosRestantes} minutos`;
      } else {
        mensaje = "Menos de un minuto";
      }

      this.tiempoRestante = mensaje;
    },
    obtenerNumeroMes(nombreMes) {
      const meses = {
        enero: 1,
        febrero: 2,
        marzo: 3,
        abril: 4,
        mayo: 5,
        junio: 6,
        julio: 7,
        agosto: 8,
        septiembre: 9,
        octubre: 10,
        noviembre: 11,
        diciembre: 12,
      };
      return meses[nombreMes.toLowerCase()] || 1;
    },
    isUrl(str) {
      if (!str) return false;
      // Agregar soporte para URLs que empiezan con www.
      if (str.startsWith("www.")) {
        str = "http://" + str;
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
    lanzarConfeti() {
      // Basic confetti burst
      confetti({
        particleCount: 60,
        spread: 40,
        origin: { y: 0.6 },
      });

      // Side bursts
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.6 },
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 },
        });
      }, 100);
    },
  },
  mounted() {
    document.body.classList.add("modal-open");
    this.calcularTiempoRestante();
    this.intervalId = setInterval(this.calcularTiempoRestante, 60000);

    // Lanzar confeti solo si es un cumpleaños y tiene icono activo
    if (
      this.evento &&
      this.evento.infoAdiccional &&
      this.evento.infoIconoTexto === "Cumpleaños"
    ) {
      setTimeout(() => {
        this.lanzarConfeti();
      }, 500);
    }
  },
  beforeUnmount() {
    document.body.classList.remove("modal-open");
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
