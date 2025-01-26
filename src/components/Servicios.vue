<template>
  <section
    class="px-4 sm:px-6 2xl:px-72 py-10 mt-4 bg-gray-100 dark:bg-slate-700 dark:border-slate-600 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white"
    id="servicio"
  >
    <article>
      <h1
        class="text-gray-800 text-center text-2xl sm:text-3xl font-medium dark:text-white flex items-center justify-center mb-6 sm:mb-1"
      >
        <i class="fas fa-church mr-2"></i> Servicio
      </h1>

      <!-- Carrusel para pantallas pequeñas -->
      <div class="md:hidden">
        <swiper
          :slides-per-view="1"
          :space-between="10"
          :pagination="{ clickable: true }"
          :navigation="true"
          :modules="modules"
        >
          <swiper-slide v-for="(image, index) in images" :key="index">
            <img
              :src="image.src"
              :alt="image.alt"
              class="w-full shadow-1-strong rounded mb-4 hover:scale-[1.01]"
            />
          </swiper-slide>
        </swiper>
      </div>

      <!-- Grid para pantallas medianas y grandes -->
      <div
        class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-0 sm:p-8"
      >
        <div v-for="(column, colIndex) in imageColumns" :key="colIndex">
          <img
            v-for="(image, imgIndex) in column"
            :key="imgIndex"
            :src="image.src"
            :alt="image.alt"
            class="w-full shadow-1-strong rounded mb-4 hover:scale-[1.01]"
          />
        </div>
      </div>

      <div
        class="p-[1px] dark:bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg mx-0 sm:mx-8"
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
          <p class="text-lg text-center mt-4 flex items-center justify-center">
            <i class="fas fa-map-marker-alt mr-2"></i>
            En el salón comunal Asovivir de Bosa
          </p>
        </div>
      </div>
      <blockquote
        class="border-l-4 border-teal-400 italic my-8 pl-6 text-lg dark:text-white bg-gray-50 dark:bg-slate-800 p-4 rounded-r-lg shadow flex items-start mx-0 sm:mx-8"
      >
        <i class="fas fa-quote-left text-teal-400 mr-4 text-2xl"></i>
        <div id="dailyVersesWrapper"></div>
      </blockquote>
    </article>
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
