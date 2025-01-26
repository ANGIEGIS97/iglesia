<template>
  <div
    class="bg-gray-100 dark:bg-slate-600 px-1 sm:px-6 2xl:px-80 pb-10 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white"
  >
    <div class="flex justify-between items-center mb-8 px-3">
      <h2 class="text-3xl font-bold dark:text-white">Próximos eventos</h2>
      <button
        @click="toggleView"
        class="text-2xl text-gray-700 dark:text-teal-500"
      >
        <i :class="isCarouselView ? 'fas fa-list' : 'fas fa-th'"></i>
      </button>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="flex flex-col justify-center items-center h-64">
      <div class="loader mb-4"></div>
      <p class="text-gray-700 dark:text-gray-300">Cargando eventos...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <!-- Contenido principal -->
    <div v-else>
      <!-- Vista de carrusel -->
      <div v-if="isCarouselView" class="relative">
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
              class="p-[1px] rounded-lg mb-10 mx-auto group relative overflow-hidden"
            >
              <div
                class="absolute inset-0 dark:bg-gradient-to-tr from-blue-500 to-teal-500 rounded-lg animate-gradient"
              ></div>
              <div
                class="bg-white dark:bg-slate-600/85 rounded-lg shadow flex flex-col h-[340px] md:h-[330px] relative z-10"
              >
                <div class="flex-grow py-2 px-2 sm:px-6">
                  <div class="flex items-center justify-center p-4">
                    <div
                      :class="[
                        'relative text-3xl font-bold text-black border py-2 px-6 rounded-md shadow-md bg-white folded-corner',
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
                        evento.infoIconoTexto !== 'Canasta de amor' &&
                        evento.infoIconoTexto !== 'Cena del Señor' &&
                        evento.infoIconoTexto !== 'Reunión de damas' &&
                        evento.infoIconoTexto !== 'Domingo misionero' &&
                        evento.infoIconoTexto !== 'Culto de oración'
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </h3>
                  <p
                    class="text-sm text-gray-600 mb-2 flex items-center dark:text-white"
                  >
                    <i class="fas fa-clock mr-2"></i
                    >{{ obtenerDiaSemana(evento.fecha) }}, {{ evento.hora }}
                  </p>
                  <p
                    class="text-[13px] sm:text-sm text-gray-600 dark:text-white mb-2 flex"
                  >
                    <i
                      :class="{
                        'fas fa-map-marker-alt': evento.lugar,
                        'fas fa-link': evento.link,
                      }"
                      class="mr-2 mt-1 flex-shrink-0"
                    ></i>
                    <span class="mr-[2px] sm:mr-[6px] break-all">{{
                      evento.lugar || evento.link
                    }}</span>
                  </p>
                  <p
                    class="text-sm font-semibold text-gray-600 mb-2 dark:text-white"
                  >
                    <i class="fas fa-calendar-plus mr-2"></i>
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
                    class="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300 dark:bg-teal-500 dark:hover:bg-teal-700 transform hover:-translate-y-1"
                  >
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>

      <!-- Vista de lista -->
      <div v-else class="grid grid-cols-1 md:grid-cols-7 gap-4">
        <!-- Evento próximo destacado -->
        <div
          class="md:col-span-4 p-[2px] rounded-lg group relative overflow-hidden"
        >
          <!-- Borde gradiente -->
          <div
            class="absolute inset-0 bg-white dark:bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg animate-gradient"
          ></div>

          <!-- Contenido de la tarjeta -->
          <div
            class="dark:bg-slate-600/85 h-full p-6 rounded-lg shadow-xl relative z-10"
          >
            <div
              class="flex flex-col md:flex-row items-start md:items-center mb-4"
            >
              <div
                :class="[
                  'text-5xl font-bold text-black py-3 px-8 rounded-md shadow-md mr-6 mb-4 md:mb-0 relative bg-white folded-corner',
                  proximoEvento.infoIconoTexto === 'Canasta de amor'
                    ? 'border-t-red-500'
                    : '',
                  proximoEvento.infoIconoTexto === 'Cena del Señor'
                    ? 'border-t-red-700'
                    : '',
                  proximoEvento.infoIconoTexto === 'Reunión de damas'
                    ? 'border-t-pink-500'
                    : '',
                  proximoEvento.infoIconoTexto === 'Domingo misionero'
                    ? 'border-t-green-500'
                    : '',
                  proximoEvento.infoIconoTexto === 'Culto de oración'
                    ? 'border-t-violet-500'
                    : '',
                  proximoEvento.infoIconoTexto !== 'Canasta de amor' &&
                  proximoEvento.infoIconoTexto !== 'Cena del Señor' &&
                  proximoEvento.infoIconoTexto !== 'Reunión de damas' &&
                  proximoEvento.infoIconoTexto !== 'Domingo misionero' &&
                  proximoEvento.infoIconoTexto !== 'Culto de oración'
                    ? 'border-t-teal-500'
                    : '',
                  'border-t-4',
                ]"
              >
                <div class="text-center">{{ proximoEvento.dia }}</div>
                <div class="text-lg text-gray-600 text-center">
                  {{ proximoEvento.mes }}
                </div>
                <!-- Badge -->
                <InfoIcono
                  :show="proximoEvento.infoAdiccional"
                  size="medium"
                  :texto="proximoEvento.infoIconoTexto"
                />
              </div>
              <div class="flex-grow">
                <h2
                  class="font-bold text-xl md:text-2xl mb-2 text-gray-700 flex items-center dark:text-white"
                >
                  {{ proximoEvento.titulo }}
                  <svg
                    v-if="proximoEvento.banner !== null"
                    class="ml-2 w-5 h-5 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </h2>
                <p
                  class="text-base md:text-lg text-gray-600 flex items-center mb-2 dark:text-white"
                >
                  <i class="fas fa-calendar-alt mr-2"></i>
                  {{ obtenerDiaSemana(proximoEvento.fecha) }},
                  {{ proximoEvento.hora }}
                </p>
                <p
                  class="text-base md:text-lg text-gray-600 dark:text-white flex items-center mb-2"
                >
                  <i
                    :class="{
                      'fas fa-map-marker-alt': proximoEvento.lugar,
                      'fas fa-link': proximoEvento.link,
                    }"
                    class="mr-2"
                  ></i>
                  {{ proximoEvento.lugar || proximoEvento.link }}
                </p>
                <p
                  class="text-base md:text-lg my-2 text-gray-700 line-clamp-2 dark:text-white"
                >
                  {{ proximoEvento.descripcion }}
                </p>

                <!-- Banner disponible o no disponible -->
                <div v-if="proximoEvento.banner">
                  <a
                    href="#"
                    @click.prevent="abrirModal(proximoEvento)"
                    class="text-teal-600 hover:text-teal-800 dark:text-white text-sm cursor-pointer flex items-center"
                  >
                    Banner disponible
                    <svg
                      class="ml-2 w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </a>
                </div>
                <div v-else>
                  <a
                    href="#"
                    @click.prevent="abrirModal(proximoEvento)"
                    class="text-red-500 dark:text-white text-sm cursor-pointer flex items-center"
                  >
                    Banner no disponible
                    <svg
                      class="ml-2 w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </a>
                </div>
                <p
                  class="text-base md:text-lg font-semibold text-teal-600 mt-4 dark:text-white flex items-center"
                >
                  <i class="fas fa-hourglass-half mr-2"></i>
                  {{
                    proximoEvento.diasRestantes === 0
                      ? "Hoy"
                      : proximoEvento.diasRestantes === 1
                      ? "1 día restante"
                      : `${proximoEvento.diasRestantes} días restantes`
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de eventos adicionales -->
        <div class="md:col-span-3 space-y-4">
          <div
            v-for="evento in eventosAdicionales"
            :key="evento.fecha"
            class="bg-white p-4 rounded-lg shadow flex items-center justify-between relative overflow-hidden"
          >
            <!-- Borde gradiente -->
            <div
              class="absolute inset-0 p-[2px] rounded-lg dark:bg-gradient-to-r from-teal-500 to-blue-500 animate-gradient"
            >
              <div class="dark:bg-slate-600/85 h-full w-full rounded-lg"></div>
            </div>

            <!-- Contenido de la tarjeta -->
            <div class="flex items-center relative z-10">
              <div
                :class="[
                  'text-2xl font-bold text-black border py-2 px-4 rounded-md shadow-md mr-4 relative bg-white',
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
                  evento.infoIconoTexto !== 'Canasta de amor' &&
                  evento.infoIconoTexto !== 'Cena del Señor' &&
                  evento.infoIconoTexto !== 'Reunión de damas' &&
                  evento.infoIconoTexto !== 'Domingo misionero' &&
                  evento.infoIconoTexto !== 'Culto de oración'
                    ? 'border-t-teal-500'
                    : '',
                  'border-t-4',
                ]"
              >
                <div class="text-center">{{ evento.dia }}</div>
                <div class="text-xs text-gray-600 text-center">
                  {{ evento.mes }}
                </div>
                <!-- Badge -->
                <InfoIcono
                  :show="evento.infoAdiccional"
                  size="small"
                  :texto="evento.infoIconoTexto"
                />
              </div>
              <div>
                <!-- Indicador de banner en el titulo -->
                <h3
                  class="text-sm font-semibold flex items-center dark:text-white"
                >
                  {{ evento.titulo }}
                  <svg
                    v-if="evento.banner !== null"
                    class="ml-2 w-4 h-4 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </h3>
                <p class="text-sm text-gray-600 dark:text-white">
                  {{ obtenerDiaSemana(evento.fecha) }}, {{ evento.hora }} -
                  {{ evento.lugar }}
                </p>
              </div>
            </div>
            <button
              @click="abrirModal(evento)"
              class="bg-teal-500 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition duration-300 text-sm relative z-10 transform hover:-translate-y-1"
            >
              Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
    <EventoModal
      v-if="eventoSeleccionado"
      :evento="eventoSeleccionado"
      @cerrar="cerrarModal"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import InfoIcono from "./InfoIcono.vue";
import EventoModal from "./EventoModal.vue";

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
    const isCarouselView = ref(true);

    const toggleView = () => {
      isCarouselView.value = !isCarouselView.value;
    };

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
      return dias[fecha.getDay()];
    };

    const proximoEvento = computed(() => {
      return eventos.value[0] || null;
    });

    const eventosAdicionales = computed(() => {
      return eventos.value.slice(1, 4);
    });

    const generarServiciosDominicales = (inicio, fin) => {
      const servicios = [];
      let fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + ((7 - fecha.getDay()) % 7));

      while (fecha <= fin) {
        const esPrimerDomingo = fecha.getDate() <= 7;
        servicios.push({
          fecha: new Date(fecha),
          titulo: "Servicio dominical",
          hora: "10:00 am — 1:00 pm",
          lugar: "Salón Comunal Asovivir",
          descripcion: esPrimerDomingo
            ? "Cena del Señor"
            : "Servicio dominical semanal.",
          infoAdicional: true,
          banner: null,
          dia: fecha.getDate().toString().padStart(2, "0"),
          mes: fecha.toLocaleString("es-CO", { month: "long" }),
          diaSemana: "Domingo",
        });
        fecha.setDate(fecha.getDate() + 7);
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
        const respuesta = await fetch("/eventos.json");
        if (!respuesta.ok) {
          throw new Error("Error al obtener los eventos");
        }
        const datosAPI = await respuesta.json();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const finPeriodo = new Date(hoy);
        finPeriodo.setDate(finPeriodo.getDate() + 27); //Cantidad dias en el calendario

        const serviciosDominicales = generarServiciosDominicales(
          hoy,
          finPeriodo
        );

        const eventosAPI = datosAPI.map((evento) => {
          const [year, month, day] = evento.fecha.split("-").map(Number);
          const fechaEvento = new Date(year, month - 1, day, 0, 0, 0, 0);
          return {
            ...evento,
            fecha: fechaEvento,
            dia: fechaEvento.getDate().toString().padStart(2, "0"),
            mes: fechaEvento.toLocaleString("es-CO", { month: "long" }),
            diaSemana: obtenerDiaSemana(fechaEvento),
          };
        });

        eventos.value = [...serviciosDominicales, ...eventosAPI]
          .filter((evento) => {
            return evento.fecha >= hoy && evento.fecha <= finPeriodo;
          })
          .sort((a, b) => a.fecha - b.fecha)
          .reduce((acc, evento) => {
            const index = acc.findIndex(
              (e) => e.fecha.getTime() === evento.fecha.getTime()
            );
            if (index === -1) {
              acc.push(evento);
            } else if (
              !acc[index].infoAdicional ||
              evento.modificarServicioDominical
            ) {
              acc[index] = { ...acc[index], ...evento };
            }
            return acc;
          }, []);

        eventos.value.forEach((evento) => {
          evento.diasRestantes = Math.ceil(
            (evento.fecha - hoy) / (1000 * 60 * 60 * 24)
          );
        });
      } catch (err) {
        console.error("Error al cargar los eventos:", err);
        error.value =
          "No se pudieron cargar los eventos. Por favor, intente más tarde.";
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
      isCarouselView,
      toggleView,
      proximoEvento,
      eventosAdicionales,
      modificarServicioDominical,
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
}
</style>
