<template>
  <section
    class="bg-gray-100 dark:bg-slate-800 py-10 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white"
    id="servicio"
  >
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out"
    >
      <div
        class="flex flex-wrap w-full mb-12 flex-col items-center text-center"
      >
        <div class="flex flex-col mb-2 px-3 items-center">
          <p class="text-teal-500 font-bold tracking-[0.2em] text-sm mb-2 uppercase">#Horarios</p>
          <h1 class="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-4 text-center">
             Nuestros <span class="text-outline">Servicios</span>
          </h1>
        </div>
        <p
          class="lg:w-2/3 w-full leading-relaxed text-center text-lg dark:text-gray-300 max-w-3xl mx-auto"
        >
          Nos congregamos cada domingo para adorar a Dios, recibir Su Palabra y
          fortalecer nuestra fe, edificándonos unos a otros como cuerpo de
          Cristo en amor y unidad.
        </p>
      </div>

      <article>
        <!-- Carrusel para pantallas pequeñas -->
        <div class="md:hidden mb-4">
          <swiper
            :slides-per-view="1"
            :space-between="10"
            :pagination="{ clickable: true }"
            :navigation="true"
            :modules="modules"
            class="w-full h-full rounded-lg"
          >
            <swiper-slide
              v-for="(image, index) in images"
              :key="index"
              class="aspect-[4/3]"
            >
              <div class="relative w-full h-full">
                <img
                  :src="image.src"
                  :alt="'Servicio ' + (index + 1)"
                  class="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-lg"
                ></div>
              </div>
            </swiper-slide>
          </swiper>
        </div>

        <!-- Grid para pantallas medianas y grandes -->
        <div class="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="relative mb-4"
          >
            <img
              :src="image.src"
              :alt="'Servicio ' + (index + 1)"
              class="w-full aspect-[4/3] object-cover shadow-lg rounded-lg transition-all duration-300 hover:scale-[1.02]"
            />
            <div
              class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-lg"
            ></div>
          </div>
        </div>

    <!-- Contenedor con borde gradiente -->
        <div
          class="relative mt-10 overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-teal-400 via-blue-400 to-blue-500 dark:from-teal-500 dark:via-blue-500 dark:to-purple-500 transition-all duration-300"
        >
          <!-- Contenido interno -->
          <div
            class="relative bg-white dark:bg-slate-700 rounded-2xl overflow-hidden"
          >
            <!-- Gradiente de fondo sutil -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-purple-500/5 dark:from-teal-500/10 dark:via-blue-500/10 dark:to-purple-500/10"
            ></div>
            
            <div class="relative p-4">
              <div class="text-center space-y-4">
                <!-- Título principal -->
                <div class="flex items-center justify-center gap-3 flex-wrap">
                  <h3
                    class="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white leading-tight max-w-3xl"
                  >
                    Iglesia Bautista su Gracia es Mayor
                  </h3>
                </div>
                
                <!-- Información del servicio -->
                <div class="space-y-4">
                  <p class="text-lg md:text-xl text-gray-700 dark:text-gray-200 font-medium">
                    Les invita al servicio de predicación
                  </p>
                  
                  <div class="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 dark:text-gray-300">
                    <!-- Horario -->
                    <div class="flex items-center gap-2 ">
                      <i class="fas fa-clock text-teal-500 dark:text-teal-400"></i>
                      <span class="font-semibold text-gray-800 dark:text-white">Domingos 10:00 AM</span>
                    </div>
                    
                    <!-- Ubicación -->
                    <div class="flex items-center gap-2 ">
                      <i class="fas fa-map-marker-alt text-teal-500 dark:text-teal-400"></i>
                      <span class="font-semibold text-gray-800 dark:text-white">Salón Comunal Asovivir de Bosa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <blockquote
          class="border-l-4 border-teal-400 italic my-8 pl-6 text-lg dark:text-white bg-gray-50 dark:bg-slate-600 p-4 rounded-r-lg shadow flex items-start"
        >
          <i class="fas fa-quote-left text-teal-400 mr-4 text-2xl"></i>
          <div id="dailyVersesWrapper"></div>
        </blockquote>
      </article>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modules: [Pagination, Navigation],
      images: [
        { src: "/servicios/servicio.webp", alt: "Servicio 0" },
        { src: "/servicios/servicio1.webp", alt: "Servicio 1" },
        { src: "/servicios/servicio2.webp", alt: "Servicio 2" },
        { src: "/servicios/servicio3.webp", alt: "Servicio 3" },
        { src: "/servicios/servicio4.webp", alt: "Servicio 4" },
        { src: "/servicios/servicio5.webp", alt: "Servicio 5" },
      ],
    };
  },
  computed: {
    imageColumns() {
      const columns = [[], [], []];
      this.images.forEach((image, index) => {
        columns[index % 3].push(image);
      });
      return columns;
    },
  },
  mounted() {
    this.loadDailyVerseScript();
    this.loadFontAwesome();
  },
  methods: {
    loadDailyVerseScript() {
      const script = document.createElement("script");
      script.src = "https://dailyverses.net/get/random.js?language=nvi";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    },
    loadFontAwesome() {
      const link = document.createElement("link");
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    },
  },
};
</script>

<style scoped>
:deep(.swiper-pagination-bullet) {
  background-color: #14b8a6;
  opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #14b8a6;
  opacity: 1;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #14b8a6;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 50%;
  width: 15px;
  height: 15px;
}

:deep(.swiper-button-next)::after,
:deep(.swiper-button-prev)::after {
  font-size: 15px;
  font-weight: bold;
}

:deep(.swiper) {
  padding: 2px;
}

#servicio {
  position: relative;
  z-index: 1;
}

.text-outline {
  -webkit-text-stroke: 1.5px black;
  color: transparent;
}
.dark .text-outline {
  -webkit-text-stroke: 1.5px white;
}
</style>
