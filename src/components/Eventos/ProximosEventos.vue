<template>
  <div
    class="bg-gray-100 dark:bg-slate-600 pb-10 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white"
  >
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out"
    >
      <div class="flex flex-col mb-2 px-3">
        <div class="flex items-center gap-3 mb-2">
          <i class="fas fa-calendar-alt text-3xl text-teal-500"> </i>
          <h2 class="text-3xl font-semibold dark:text-white">
            Próximos eventos
          </h2>
        </div>
        <p class="text-gray-600 dark:text-gray-300 ml-1">
          Mantente al día con nuestras próximas actividades y servicios
        </p>
      </div>

      <!-- Estado de carga -->
      <div
        v-if="cargando"
        class="flex flex-col justify-center items-center h-64"
      >
        <div class="loader mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300">Cargando eventos...</p>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="text-red-500 text-center py-8">
        {{ error }}
      </div>

      <!-- Contenido principal -->
      <div v-else>
        <div class="relative">
          <swiper
            :modules="modulos"
            :slides-per-view="2"
            :space-between="4"
            :pagination="{ clickable: true }"
            :navigation="false"
            :grab-cursor="false"
            class="mySwiper custom-swiper rounded-lg overflow-hidden"
            :breakpoints="{
              '420': {
                slidesPerView: 2,
                spaceBetween: 7,
              },
              '768': {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              '1020': {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }"
          >
            <swiper-slide v-for="evento in eventos" :key="evento.fecha">
              <div
                class="p-[1px] rounded-lg mb-10 mx-auto group relative overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  class="absolute inset-0 dark:bg-gradient-to-tr from-blue-500 to-teal-500 rounded-lg animate-gradient opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <div
                  class="bg-white dark:bg-slate-600/85 rounded-lg shadow flex flex-col h-[340px] md:h-[330px] relative z-10 backdrop-blur-sm"
                >
                  <div class="flex-grow py-2 px-2 sm:px-6">
                    <div class="flex items-center justify-center p-4">
                      <div
                        :class="[
                          'relative text-3xl font-bold text-black border py-2 px-6 rounded-md shadow-md bg-white folded-corner',
                          evento.infoIconoTexto === 'Cumpleaños'
                            ? 'border-t-yellow-500'
                            : '',
                          evento.infoIconoTexto === 'Canasta de amor'
                            ? 'border-t-red-500'
                            : '',
                          evento.infoIconoTexto === 'Cena del Señor'
                            ? 'border-t-red-700'
                            : '',
                          evento.infoIconoTexto === 'Reunión de damas'
                            ? 'border-t-pink-500'
                            : '',
                          evento.infoIconoTexto === 'Domingo misionero'
                            ? 'border-t-green-500'
                            : '',
                          evento.infoIconoTexto === 'Culto de oración'
                            ? 'border-t-violet-500'
                            : '',
                          evento.infoIconoTexto === 'Reunión de varones'
                            ? 'border-t-blue-500'
                            : '',
                          evento.infoIconoTexto === 'Reunión de jovenes'
                            ? 'border-t-indigo-500'
                            : '',
                          evento.infoIconoTexto === 'Noches navideñas'
                            ? 'border-t-red-400'
                            : '',
                          evento.infoIconoTexto === 'Reuniones caseras'
                            ? 'border-t-orange-500'
                            : '',
                          evento.infoIconoTexto !== 'Cumpleaños' &&
                          evento.infoIconoTexto !== 'Canasta de amor' &&
                          evento.infoIconoTexto !== 'Cena del Señor' &&
                          evento.infoIconoTexto !== 'Reunión de damas' &&
                          evento.infoIconoTexto !== 'Domingo misionero' &&
                          evento.infoIconoTexto !== 'Culto de oración' &&
                          evento.infoIconoTexto !== 'Reunión de varones' &&
                          evento.infoIconoTexto !== 'Reunión de jovenes' &&
                          evento.infoIconoTexto !== 'Noches navideñas' &&
                          evento.infoIconoTexto !== 'Reuniones caseras'
                            ? 'border-t-teal-500'
                            : '',
                          'border-t-4',
                          'transition-transform duration-300 group-hover:scale-105',
                        ]"
                      >
                        <div
                          class="absolute top-1 left-3 w-1.5 h-1.5 bg-black rounded-full"
                        ></div>
                        <div
                          class="absolute top-1 right-3 w-1.5 h-1.5 bg-black rounded-full"
                        ></div>
                        <div class="text-center">{{ evento.dia }}</div>
                        <div class="text-sm text-gray-600 text-center">
                          {{ evento.mes }}
                        </div>
                        <InfoIcono
                          :show="evento.infoAdiccional"
                          size="small"
                          :texto="evento.infoIconoTexto"
                        />
                      </div>
                    </div>
                    <h3
                      class="font-semibold mb-2 text-[14px] xl:text-xl flex items-center truncate dark:text-white"
                    >
                      {{ evento.titulo }}
                      <svg
                        v-if="evento.banner !== null"
                        class="ml-2 w-4 h-4 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </h3>
                    <p
                      class="text-sm text-gray-600 mb-2 flex items-center dark:text-white"
                    >
                      <i class="fas fa-clock mr-2"></i
                      >{{ obtenerDiaSemana(evento.fecha) }},
                      {{ formatTime(evento.hora) }}
                    </p>
                    <p
                      class="text-[13px] sm:text-sm text-gray-600 dark:text-white mb-2 flex"
                    >
                      <i
                        :class="{
                          'fas fa-map-marker-alt': !isUrl(evento.lugar),
                          'fas fa-link': isUrl(evento.lugar),
                        }"
                        class="mr-2 mt-1 flex-shrink-0"
                      ></i>
                      <template v-if="isUrl(evento.lugar)">
                        <a
                          :href="
                            evento.lugar.startsWith('www.')
                              ? 'https://' + evento.lugar
                              : evento.lugar
                          "
                          target="_blank"
                          rel="noopener noreferrer"
                          class="mr-[2px] sm:mr-[6px] break-all text-blue-500 dark:text-white hover:underline"
                        >
                          <template v-if="evento.lugar.includes('tinyurl.com')">
                            Ubicación Google Maps
                          </template>
                          <template v-else>
                            {{ evento.lugar }}
                          </template>
                        </a>
                      </template>
                      <span v-else class="mr-[2px] sm:mr-[6px] break-all">
                        {{ evento.lugar }}
                      </span>
                    </p>
                    <p
                      class="text-sm font-semibold text-gray-600 mb-2 dark:text-white"
                    >
                      <i class="fas fa-hourglass-half mr-2"></i>
                      {{
                        evento.diasRestantes === 0
                          ? "Hoy"
                          : evento.diasRestantes === 1
                          ? "1 día restante"
                          : `${evento.diasRestantes} días restantes`
                      }}
                    </p>
                  </div>
                  <div class="mt-auto pb-3 px-2 sm:px-6">
                    <button
                      @click="abrirModal(evento)"
                      class="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-all duration-300 dark:bg-teal-500 dark:hover:bg-teal-700 transform hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <span>Detalles</span>
                      <i
                        class="fas fa-arrow-right text-sm transition-transform group-hover:translate-x-1"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <EventoModal
        v-if="eventoSeleccionado"
        :evento="eventoSeleccionado"
        @cerrar="cerrarModal"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import InfoIcono from "./InfoIcono.vue";
import EventoModal from "./EventoModal.vue";
import { fechas } from "../../lib/api";

export default {
  components: {
    Swiper,
    SwiperSlide,
    InfoIcono,
    EventoModal,
  },
  setup() {
    const eventos = ref([]);
    const eventoSeleccionado = ref(null);
    const cargando = ref(true);
    const error = ref(null);

    const abrirModal = (evento) => {
      eventoSeleccionado.value = evento;
    };

    const cerrarModal = () => {
      eventoSeleccionado.value = null;
    };

    const obtenerDiaSemana = (fecha) => {
      const dias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      // Aseguramos que la fecha esté en la zona horaria de Bogotá
      const fechaBogota =
        fecha instanceof Date ? fecha : new Date(fecha + "T00:00:00-05:00");
      return dias[fechaBogota.getDay()];
    };

    const formatTime = (time) => {
      if (!time) return "";
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "pm" : "am";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    };

    const isUrl = (str) => {
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
    };

    const generarServiciosDominicales = (inicio, fin) => {
      const servicios = [];
      // Aseguramos que la fecha inicial esté en la zona horaria de Bogotá
      let fecha = new Date(
        inicio.toLocaleString("en-US", { timeZone: "America/Bogota" })
      );
      fecha.setDate(fecha.getDate() + ((7 - fecha.getDay()) % 7));

      let iteraciones = 0;
      const maxIteraciones = 5; // Máximo de 5 domingos
      const finTime = fin.getTime();
      while (fecha.getTime() <= finTime && iteraciones < maxIteraciones) {
        const esPrimerDomingo = fecha.getDate() <= 7;
        const fechaServicio = new Date(
          fecha.toLocaleString("en-US", { timeZone: "America/Bogota" })
        );
        servicios.push({
          fecha: fechaServicio,
          titulo: "Servicio dominical",
          hora: "10:00",
          lugar: "Salón Comunal Asovivir",
          descripcion: esPrimerDomingo
            ? "Cena del Señor"
            : "Servicio dominical semanal.",
          infoAdicional: true,
          banner: null,
          dia: fechaServicio.getDate().toString().padStart(2, "0"),
          mes: fechaServicio.toLocaleString("es-CO", { month: "long" }),
          diaSemana: "Domingo",
        });
        fecha.setDate(fecha.getDate() + 7);
        iteraciones++;
      }
      return servicios;
    };

    const modificarServicioDominical = (fecha, modificaciones) => {
      const index = eventos.value.findIndex(
        (e) =>
          e.fecha.getTime() === fecha.getTime() &&
          e.titulo === "Servicio dominical"
      );
      if (index !== -1) {
        eventos.value[index] = { ...eventos.value[index], ...modificaciones };
      }
    };

    onMounted(async () => {
      try {
        cargando.value = true;

        // Configuramos la fecha actual en la zona horaria de Bogotá
        const hoy = new Date(
          new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
        );
        hoy.setHours(0, 0, 0, 0);

        const finPeriodo = new Date(
          hoy.toLocaleString("en-US", { timeZone: "America/Bogota" })
        );
        finPeriodo.setDate(finPeriodo.getDate() + 27);

        // Generamos los servicios dominicales
        const serviciosDominicales = generarServiciosDominicales(
          hoy,
          finPeriodo
        );

        // Asignamos inicialmente los servicios dominicales
        eventos.value = serviciosDominicales;

        try {
          // Cargamos los eventos de la API
          const response = await fechas.getAll();
          const datosAPI = response.data;

          const eventosAPI = datosAPI.map((evento) => {
            // Convertimos la fecha a la zona horaria de Bogotá
            const fechaEvento = new Date(evento.fecha + "T00:00:00-05:00");
            return {
              ...evento,
              fecha: fechaEvento,
              dia: fechaEvento.getDate().toString().padStart(2, "0"),
              mes: fechaEvento.toLocaleString("es-CO", { month: "long" }),
              diaSemana: obtenerDiaSemana(fechaEvento),
            };
          });

          // Combinamos los eventos
          eventos.value = [...serviciosDominicales, ...eventosAPI]
            .filter((evento) => {
              const fechaEvento = new Date(evento.fecha);
              return fechaEvento >= hoy && fechaEvento <= finPeriodo;
            })
            .sort((a, b) => {
              // Primero ordenamos por fecha
              const fechaComparacion =
                new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
              if (fechaComparacion !== 0) return fechaComparacion;

              // Si las fechas son iguales, los servicios dominicales van primero
              if (
                a.titulo === "Servicio dominical" &&
                b.titulo !== "Servicio dominical"
              )
                return -1;
              if (
                a.titulo !== "Servicio dominical" &&
                b.titulo === "Servicio dominical"
              )
                return 1;

              // Si ninguno es servicio dominical o ambos lo son, ordenar por hora
              return a.hora.localeCompare(b.hora);
            });

          // Calculamos los días restantes
          eventos.value.forEach((evento) => {
            const fechaEvento = new Date(evento.fecha);
            fechaEvento.setHours(0, 0, 0, 0);

            const diferenciaTiempo = fechaEvento.getTime() - hoy.getTime();
            evento.diasRestantes = Math.floor(
              diferenciaTiempo / (1000 * 60 * 60 * 24)
            );
          });
        } catch (apiError) {
          console.warn(
            "No se pudieron cargar los eventos de la API, usando solo servicios dominicales:",
            apiError
          );
        }
      } catch (err) {
        console.error("Error al procesar los eventos:", err);
        error.value =
          "Ocurrió un error al procesar los eventos. Por favor, intente más tarde.";
      } finally {
        cargando.value = false;
      }
    });

    return {
      modulos: [Pagination, Navigation],
      eventos,
      eventoSeleccionado,
      abrirModal,
      cerrarModal,
      cargando,
      error,
      obtenerDiaSemana,
      modificarServicioDominical,
      formatTime,
      isUrl,
    };
  },
};
</script>

<style scoped>
.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  to {
    transform: rotate(1turn);
  }
}

.folded-corner {
  position: relative;
  transition: all 0.3s ease;
}

.folded-corner:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.folded-corner::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-radius: 0 0 5px 0;
  border-width: 0 0 17px 17px;
  border-color: transparent transparent #e0e0e0 transparent;
  box-shadow: -2px -2px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

.custom-swiper {
  padding: 20px 10px;
}

.swiper-slide {
  transition: transform 0.3s ease;
}

.swiper-slide:hover {
  transform: translateY(-5px);
}
</style>
