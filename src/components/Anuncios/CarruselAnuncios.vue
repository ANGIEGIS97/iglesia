<template>
  <section class="bg-gris">
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out font-asap"
    >
    <div class="flex flex-col mb-2 px-3">
      <div class="flex items-center gap-3 mb-2">
        <i class="fas fa-bullhorn text-3xl text-teal-500"></i>
        <h2 class="text-3xl font-semibold dark:text-white">Anuncios</h2>
      </div>
    </div>

      <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>
      <div
        v-else-if="isLoading"
        class="flex flex-col justify-center items-center h-64"
      >
        <div class="loader mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300">Cargando anuncios...</p>
      </div>
      <swiper
        v-else-if="slides.length"
        :slides-per-view="1"
        :space-between="30"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnMobile: true,
        }"
        :pagination="{ clickable: true }"
        :modules="modules"
        :loop="true"
        :grab-cursor="true"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
        :effect="'creative'"
        :fade-effect="{ crossFade: true }"
        class="custom-swiper rounded-lg overflow-hidden"
      >
        <swiper-slide v-for="(slide, index) in slides" :key="index">
          <div class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <div
              v-if="slide.titulo || slide.descripcion || slide.textoBoton"
              class="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-50 rounded-lg"
            >
              <div class="w-full max-w-4xl sm:px-6 text-center sm:space-y-6">
                <h3
                  v-if="slide.titulo"
                  class="text-2xl sm:text-5xl font-asap font-bold mb-2 sm:mb-4 text-center animate-fade-in-up text-white"
                >
                  {{ slide.titulo }}
                </h3>
                <p
                  v-if="slide.descripcion"
                  class="text-md sm:text-2xl mb-2 sm:mb-6 px-4 sm:px-24 text-center text-white sm:leading-relaxed animate-fade-in-up delay-100"
                  style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5)"
                >
                  {{ slide.descripcion }}
                </p>
                <button
                  v-if="slide.textoBoton"
                  class="bg-teal-500 transition duration-300 transform hover:-translate-y-1 text-white font-bold py-2 px-4 rounded-lg text-sm sm:text-base"
                  @click="handleButtonClick(slide.linkBoton)"
                >
                  {{ slide.textoBoton }}
                </button>
              </div>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-button-next custom-swiper-button">
          <i class="fas fa-chevron-right"></i>
        </div>
        <div class="swiper-button-prev custom-swiper-button">
          <i class="fas fa-chevron-left"></i>
        </div>
      </swiper>

      <div v-else class="text-center py-4">No hay anuncios disponibles</div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import { eventos } from "../../lib/api";
import anunciosData from "./anuncios.json"; // Importamos el JSON

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const slides = ref([]);
    const error = ref("");
    const isLoading = ref(true);
    const modules = [Navigation, Pagination, Autoplay, EffectFade];

    const loadEvents = async () => {
      try {
        // Cargar anuncios del JSON local
        const localSlides = anunciosData.anuncios.map((anuncio) => ({
          image: anuncio.image,
          titulo: anuncio.titulo,
          descripcion: anuncio.descripcion,
          textoBoton: anuncio.textoBoton,
          linkBoton: anuncio.linkBoton || "#",
          source: "local",
        }));

        try {
          // Intentar cargar anuncios de la API
          const response = await eventos.getAll();
          const apiSlides = response.data.map((evento) => ({
            image: evento.image,
            titulo: evento.titulo,
            descripcion: evento.descripcion,
            textoBoton: evento.textoBoton,
            linkBoton: evento.linkBoton || "#",
            source: "api",
          }));

          // Combinar y ordenar ambos conjuntos de anuncios
          slides.value = [...apiSlides, ...localSlides].sort((a, b) =>
            a.source === "api" ? -1 : 1
          );
        } catch (apiError) {
          console.error("Error al cargar anuncios de la API:", apiError);
          // Si falla la API, usar solo los anuncios locales
          slides.value = localSlides;
        }
      } catch (err) {
        error.value = "Error al cargar los anuncios";
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };

    const handleButtonClick = (link) => {
      if (link && link !== "#") {
        window.location.href = link;
      }
    };

    onMounted(loadEvents);

    return {
      slides,
      error,
      isLoading,
      modules,
      handleButtonClick,
    };
  },
};
</script>

<style lang="postcss">
.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #14b8a6;;
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

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.custom-swiper {
  .custom-swiper-button {
    @apply text-white bg-teal-500 rounded-full w-12 h-12 flex items-center justify-center opacity-75 transition-all duration-300;
    &:hover {
      @apply opacity-100 scale-110;
    }
    &::after {
      content: none;
    }
    @apply hidden sm:flex;
  }

  .swiper-button-next {
    @apply right-6;
  }
  .swiper-button-prev {
    @apply left-6;
  }
  .swiper-pagination-bullet {
    @apply bg-teal-700;
    width: 10px;
    height: 10px;
  }
  .swiper-pagination-bullet-active {
    @apply bg-teal-500;
    width: 12px;
    height: 12px;
  }
}
</style>
