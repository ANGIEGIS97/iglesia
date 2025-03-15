<template>
  <section
    class="bg-gray-100 dark:bg-slate-700 py-10 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white"
    id="servicio"
  >
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out"
    >
      <article>
        <h1
          class="text-gray-800 text-center text-2xl sm:text-3xl font-medium dark:text-white flex items-center justify-center mb-6 sm:mb-1"
        >
          <i class="fas fa-church mr-2"></i> Servicio
        </h1>

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
        { src: "https://i.ibb.co/z4bPJTy/servicio.jpg", alt: "Servicio 1" },
        { src: "https://i.ibb.co/12HCWmc/servicio1.jpg", alt: "Servicio 2" },
        { src: "https://i.ibb.co/qjtDbck/servicio2.jpg", alt: "Servicio 3" },
        { src: "https://i.ibb.co/k29KtQn/servicio3.jpg", alt: "Servicio 4" },
        { src: "https://i.ibb.co/2jH8Tsq/servicio4.jpg", alt: "Servicio 5" },
        { src: "https://i.ibb.co/bJ1QPqL/servicio5.jpg", alt: "Servicio 6" },
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
