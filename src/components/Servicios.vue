<template>
  <section
    class="bg-gray-100 dark:bg-slate-700 py-10 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white"
    id="servicio"
  >
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out"
    >
      <div
        class="flex flex-wrap w-full mb-12 flex-col items-center text-center"
      >
        <h1
          class="sm:text-4xl text-3xl font-bold mb-4 text-gray-800 dark:text-white relative inline-block"
        >
          Servicios
          <span
            class="absolute bottom-0 left-1/4 right-1/4 h-1 bg-teal-500 rounded-full"
          ></span>
        </h1>
        <p
          class="lg:w-2/3 w-full leading-relaxed text-center text-lg dark:text-gray-300 max-w-3xl mx-auto"
        >
          Nuestros servicios dominicales son momentos especiales donde
          experimentamos la presencia de Dios a través de la adoración, la
          enseñanza bíblica y la comunión. Cada domingo nos reunimos para crecer
          juntos en fe y conocimiento, fortaleciéndonos mutuamente como familia
          en Cristo.
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

        <div
          class="p-[1px] dark:bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg"
        >
          <div
            class="bg-gray-50 rounded-lg dark:bg-slate-600 dark:text-white p-4"
          >
            <h3
              class="text-xl md:text-2xl text-center flex items-center justify-center"
            >
              <i class="fas fa-calendar-alt mr-2"></i>
              Iglesia Bautista su Gracia es Mayor les invita al servicio de
              predicación todos los domingos a las 10:00am
            </h3>
            <p
              class="text-lg text-center mt-4 flex items-center justify-center"
            >
              <i class="fas fa-map-marker-alt mr-2"></i>
              En el salón comunal Asovivir de Bosa
            </p>
          </div>
        </div>
        <blockquote
          class="border-l-4 border-teal-400 italic my-8 pl-6 text-lg dark:text-white bg-gray-50 dark:bg-slate-800 p-4 rounded-r-lg shadow flex items-start"
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
</style>
