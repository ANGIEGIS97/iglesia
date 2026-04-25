<template>
  <BaseModal
    :open="!!evento"
    backdrop-class="bg-gray-900/50 backdrop-blur-sm"
    panel-class="max-w-xl w-full m-4 relative p-[2px] dark:bg-linear-to-r from-teal-500 to-blue-500 rounded-lg shadow-xl animate-gradient animate__animated animate__fadeInDown"
    @close="cerrar"
  >
    <template #header><!-- header personalizado dentro del slot por defecto --></template>

    <template #default="{ labelId }">
      <div v-if="evento" class="bg-white dark:bg-slate-600/85 rounded-lg">
        <div
          :class="[
            'p-4 rounded-t-lg flex justify-between items-center',
            'dark:bg-transparent',
            headerColorClass,
          ]"
        >
          <h2 :id="labelId" class="text-xl sm:text-2xl font-bold text-white">
            {{ evento.titulo }}
          </h2>
          <button
            @click="cerrar"
            class="text-white hover:text-gray-200 transition duration-300"
            aria-label="Cerrar"
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
                <strong>Fecha:</strong> {{ evento.dia }} de {{ evento.mes }}
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
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>

  <Teleport to="body">
    <div
      v-if="evento && evento.infoIconoTexto === 'Noches navideñas'"
      class="snow-container pointer-events-none"
    >
      <div
        v-for="i in 50"
        :key="i"
        class="snowflake"
        :style="getSnowflakeStyle()"
      >
        ❄
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="imagenAmpliada && evento"
      @click="cerrarImagenAmpliada"
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-60"
    >
      <img
        :src="evento.banner"
        alt="Banner ampliado del evento"
        class="w-full max-w-[90%] max-h-[90%] object-contain"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import "animate.css";
import confetti from "canvas-confetti";
import BaseModal from "../common/BaseModal.vue";

interface Evento {
  titulo: string;
  dia: string | number;
  mes: string;
  hora: string;
  lugar: string;
  descripcion: string;
  banner: string | null;
  infoIconoTexto: string;
}

const props = defineProps<{ evento: Evento | null }>();
const emit = defineEmits<{ cerrar: [] }>();

const imagenAmpliada = ref(false);
const tiempoRestante = ref("");
let intervalId: ReturnType<typeof setInterval> | null = null;

const headerColorClass = computed(() => {
  const tipo = props.evento?.infoIconoTexto;
  const map: Record<string, string> = {
    "Cumpleaños": "bg-yellow-500",
    "Canasta de amor": "bg-red-500",
    "Cena del Señor": "bg-red-700",
    "Reunión de damas": "bg-pink-500",
    "Domingo misionero": "bg-green-500",
    "Culto de oración": "bg-violet-500",
    "Reunión de varones": "bg-blue-500",
    "Reunión de jovenes": "bg-indigo-500",
    "Noches navideñas": "bg-red-400",
    "Reuniones caseras": "bg-orange-500",
  };
  return tipo && map[tipo] ? map[tipo] : "bg-teal-500";
});

function formatTime(time: string) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "pm" : "am";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

function obtenerNumeroMes(nombreMes: string) {
  const meses: Record<string, number> = {
    enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
    julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
  };
  return meses[nombreMes.toLowerCase()] || 1;
}

function calcularTiempoRestante() {
  const ev = props.evento;
  if (!ev || !ev.hora || !ev.dia || !ev.mes) {
    tiempoRestante.value = "";
    return;
  }

  const [horas, minutos] = ev.hora.split(":");
  const fecha = new Date();
  fecha.setMonth(obtenerNumeroMes(ev.mes) - 1);
  fecha.setDate(parseInt(String(ev.dia)));
  fecha.setHours(parseInt(horas), parseInt(minutos), 0);

  const ahora = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
  );

  if (fecha < ahora) {
    tiempoRestante.value = "Evento finalizado";
    return;
  }

  const diferencia = fecha.getTime() - ahora.getTime();
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horasRestantes = Math.floor(
    (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutosRestantes = Math.floor(
    (diferencia % (1000 * 60 * 60)) / (1000 * 60),
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

  tiempoRestante.value = mensaje;
}

function isUrl(str: string) {
  if (!str) return false;
  let url = str;
  if (url.startsWith("www.")) url = "http://" + url;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function cerrar() {
  document.body.classList.remove("modal-open");
  emit("cerrar");
}

function abrirImagenAmpliada() {
  imagenAmpliada.value = true;
}

function cerrarImagenAmpliada() {
  imagenAmpliada.value = false;
}

function lanzarConfeti() {
  confetti({ particleCount: 60, spread: 40, origin: { y: 0.6 } });
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } });
    confetti({ particleCount: 40, angle: 120, spread: 80, origin: { x: 1, y: 0.6 } });
  }, 100);
}

function getSnowflakeStyle() {
  const left = Math.random() * 100;
  const animationDuration = 5 + Math.random() * 10;
  const animationDelay = Math.random() * 5;
  const fontSize = 10 + Math.random() * 20;
  const opacity = 0.5 + Math.random() * 0.5;
  return {
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`,
    fontSize: `${fontSize}px`,
    opacity,
  };
}

watch(
  () => props.evento,
  (ev) => {
    if (ev) {
      document.body.classList.add("modal-open");
      calcularTiempoRestante();
      if (!intervalId) intervalId = setInterval(calcularTiempoRestante, 60000);
      if (ev.infoIconoTexto === "Cumpleaños") {
        setTimeout(() => lanzarConfeti(), 500);
      }
    } else {
      document.body.classList.remove("modal-open");
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      tiempoRestante.value = "";
      imagenAmpliada.value = false;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (props.evento) {
    document.body.classList.add("modal-open");
    calcularTiempoRestante();
    intervalId = setInterval(calcularTiempoRestante, 60000);
    if (props.evento.infoIconoTexto === "Cumpleaños") {
      setTimeout(() => lanzarConfeti(), 500);
    }
  }
});

onBeforeUnmount(() => {
  document.body.classList.remove("modal-open");
  if (intervalId) clearInterval(intervalId);
});
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

.backdrop-blur-sm {
  transition: all 0.3s ease-in-out;
}

.snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 55;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  top: -20px;
  color: white;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  animation: fall linear infinite;
  user-select: none;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) translateX(0);
  }
  50% {
    transform: translateY(50vh) translateX(20px);
  }
  100% {
    transform: translateY(100vh) translateX(0);
  }
}
</style>
