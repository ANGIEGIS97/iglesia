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
          <!-- Imagen solo (sin estilos ni opacidad) -->
          <div v-if="isImageOnly(slide)" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <!-- Sin overlay ni textos -->
          </div>

          <!-- Plantilla 1: Estilo clásico -->
          <div v-else-if="slide.estilo === 'clasico'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <div
              v-if="slide.titulo || slide.descripcion || slide.eslogan"
              class="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-50 rounded-lg"
            >
              <div
                class="w-full max-w-4xl sm:px-6 text-center sm:space-y-6 sm:pr-16"
              >
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
                <a
                  v-if="slide.eslogan"
                  :class="[
                    'font-vivaldi text-white text-2xl sm:text-4xl transition duration-300',
                    slide.linkBoton && slide.linkBoton !== '#'
                      ? 'px-2 sm:px-4 sm:py-1 border border-white rounded-md bg-transparent hover:bg-white/10 cursor-pointer'
                      : '',
                    'mt-2 sm:mt-8 inline-block',
                  ]"
                  @click="handleButtonClick(slide.linkBoton)"
                >
                  {{ slide.eslogan }}
                </a>
                <p
                  v-if="slide.referencia"
                  class="text-white text-lg sm:text-xl mt-4 animate-fade-in-up delay-200"
                >
                  {{ slide.referencia }}
                </p>
              </div>
            </div>
          </div>

          <!-- Plantilla 2: Estilo enmarcado (como la primera imagen) -->
          <div v-else-if="slide.estilo === 'enmarcado'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
            >
              <div
                class="bg-transparent border-2 sm:border-4 border-white w-[90%] sm:w-4/5 h-[90%] sm:h-4/5 flex flex-col items-center justify-center p-3 sm:p-6 text-center sm:pr-16 overflow-hidden"
              >
                <p
                  v-if="slide.titulo"
                  class="text-white text-xs sm:text-3xl uppercase tracking-widest mb-1 sm:mb-4 font-light px-2"
                >
                  {{ slide.titulo }}
                </p>
                <h3
                  v-if="slide.descripcion"
                  class="text-white font-asap text-base sm:text-5xl mb-2 sm:mb-6 animate-fade-in-up px-2 font-semibold line-clamp-7 sm:line-clamp-none"
                >
                  {{ slide.descripcion }}
                </h3>
                <p
                  v-if="slide.eslogan"
                  class="text-white text-sm sm:text-2xl uppercase tracking-widest animate-fade-in-up delay-100 px-2"
                >
                  {{ slide.eslogan }}
                </p>
                <p
                  v-if="slide.referencia"
                  class="text-white text-xs sm:text-2xl mt-2 sm:mt-8 tracking-widest animate-fade-in-up delay-200"
                >
                  {{ slide.referencia }}
                </p>
              </div>
            </div>
          </div>

          <!-- Plantilla 3: Estilo natural (como la segunda imagen) -->
          <div v-else-if="slide.estilo === 'natural'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <div
              class="absolute inset-0 flex items-center justify-end pr-4 sm:pr-24 bg-black bg-opacity-50 rounded-lg"
            >
              <div
                class="w-[70%] sm:w-3/5 text-right p-3 sm:p-0 rounded-lg sm:rounded-none"
              >
                <p
                  v-if="slide.titulo"
                  class="text-white text-xs sm:text-2xl uppercase tracking-wide mb-1 sm:mb-2"
                >
                  {{ slide.titulo }}
                </p>
                <p
                  v-if="slide.descripcion"
                  class="text-white text-sm sm:text-3xl mb-2 sm:mb-4"
                >
                  {{ slide.descripcion }}
                </p>
                <p
                  v-if="slide.eslogan"
                  class="text-white font-dancingScript text-xl sm:text-5xl italic mb-3 sm:mb-6 animate-fade-in-up"
                >
                  {{ slide.eslogan }}
                </p>
                <div
                  v-if="slide.referencia"
                  class="border border-white inline-block px-2 sm:px-4 py-0.5 sm:py-1"
                >
                  <p class="text-white text-xs sm:text-lg">
                    {{ slide.referencia }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Plantilla 4: Estilo luminoso (como la tercera imagen) -->
          <div v-else-if="slide.estilo === 'luminoso'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <div
              class="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-50 rounded-lg"
            >
              <div class="w-full max-w-2xl px-4 sm:pr-16">
                <p
                  v-if="slide.titulo"
                  class="text-white text-xs sm:text-xl uppercase tracking-wider mb-1 sm:mb-2"
                >
                  {{ slide.titulo }}
                </p>
                <p
                  v-if="slide.descripcion"
                  class="text-white text-sm sm:text-2xl mb-2 sm:mb-4"
                >
                  {{ slide.descripcion }}
                </p>
                <p
                  v-if="slide.eslogan"
                  class="text-white text-2xl sm:text-6xl font-bold mb-4 sm:mb-8 animate-pulse-soft"
                >
                  {{ slide.eslogan }}
                </p>
                <p
                  v-if="slide.referencia"
                  class="text-white text-xs sm:text-xl mt-3 sm:mt-6"
                >
                  {{ slide.referencia }}
                </p>
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

    // Estilos disponibles para asignar aleatoriamente
    const estilosDisponibles = ["clasico", "enmarcado", "natural", "luminoso"];

    // Función para verificar si un slide solo tiene imagen (sin textos)
    const isImageOnly = (slide) => {
      return (
        !slide.titulo &&
        !slide.descripcion &&
        !slide.eslogan &&
        !slide.referencia
      );
    };

    // Función para obtener un estilo aleatorio o forzar el estilo clásico si hay un link
    const getRandomStyle = (hasLink) => {
      // Si tiene un link, forzamos el estilo clásico
      if (hasLink && hasLink !== "#") {
        return "clasico";
      }

      // Si no tiene link, asignamos un estilo aleatorio
      const randomIndex = Math.floor(Math.random() * estilosDisponibles.length);
      return estilosDisponibles[randomIndex];
    };

    const loadEvents = async () => {
      try {
        // Cargar anuncios del JSON local
        const localSlides = anunciosData.anuncios.map((anuncio) => {
          const hasLink = anuncio.linkBoton && anuncio.linkBoton !== "#";
          const isOnlyImage =
            !anuncio.titulo &&
            !anuncio.descripcion &&
            !(anuncio.textoBoton || anuncio.eslogan) &&
            !anuncio.referencia;

          return {
            image: anuncio.image,
            titulo: anuncio.titulo,
            descripcion: anuncio.descripcion,
            eslogan: anuncio.textoBoton || anuncio.eslogan,
            linkBoton: anuncio.linkBoton || "#",
            referencia: anuncio.referencia || "",
            // Si es solo imagen, no aplicamos estilo
            // Si tiene link, forzamos el estilo clásico
            // Si tiene un estilo definido y no es solo imagen ni tiene link, lo respetamos
            // Si no tiene estilo definido, asignamos uno aleatorio
            estilo: isOnlyImage
              ? "none"
              : hasLink
              ? "clasico"
              : anuncio.estilo || getRandomStyle(anuncio.linkBoton),
            source: "local",
          };
        });

        try {
          // Intentar cargar anuncios de la API
          const response = await eventos.getAll();
          const apiSlides = response.data.map((evento) => {
            const hasLink = evento.linkBoton && evento.linkBoton !== "#";
            const isOnlyImage =
              !evento.titulo &&
              !evento.descripcion &&
              !(evento.textoBoton || evento.eslogan) &&
              !evento.referencia;

            return {
              image: evento.image,
              titulo: evento.titulo,
              descripcion: evento.descripcion,
              eslogan: evento.textoBoton || evento.eslogan,
              linkBoton: evento.linkBoton || "#",
              referencia: evento.referencia || "",
              // Si es solo imagen, no aplicamos estilo
              // Si tiene link, forzamos el estilo clásico
              // Si tiene un estilo definido y no es solo imagen ni tiene link, lo respetamos
              // Si no tiene estilo definido, asignamos uno aleatorio
              estilo: isOnlyImage
                ? "none"
                : hasLink
                ? "clasico"
                : evento.estilo || getRandomStyle(evento.linkBoton),
              source: "api",
            };
          });

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
      isImageOnly,
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
  background: #14b8a6;
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

@keyframes pulse-soft {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-soft {
  animation: pulse-soft 2s ease-in-out infinite;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

/* Agregar la fuente Vivaldi */
@font-face {
  font-family: "Vivaldi";
  src: url("/fonts/vivaldi.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.font-vivaldi {
  font-family: "Vivaldi", cursive;
}

/* Agregar fuente Dancing Script para el estilo natural */
@font-face {
  font-family: "Dancing Script";
  src: url("/fonts/dancingScript.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.font-dancingScript {
  font-family: "Dancing Script", cursive;
}

/* Agregar fuente script para el estilo natural */
@font-face {
  font-family: "Script";
  src: url("/fonts/script.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.font-script {
  font-family: "Script", cursive;
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
