carrusel


<template>
  <section class="bg-gris">
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out font-asap"
    >
      <div class="flex flex-col mb-6 px-3">
        <p class="text-teal-500 font-bold tracking-[0.2em] text-sm mb-2 uppercase">#Entérate</p>
        <h2 class="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Nuestros <span class="text-outline">Anuncios</span>
        </h2>
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
          delay: 7000,
          disableOnInteraction: false,
        }"
        :keyboard="{ enabled: true, onlyInViewport: true, pageUpDown: true }"
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
            <FavoritoOverlay v-if="slide.favorito" />
            <!-- Sin overlay ni textos -->
          </div>

          <!-- Plantilla 1: Estilo clásico (estilo con fondo oscuro y texto centrado) -->
          <div v-else-if="slide.estilo === 'clasico'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <FavoritoOverlay v-if="slide.favorito" />
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
                  class="estilo-clasico text-md sm:text-2xl mb-2 sm:mb-6 px-4 sm:px-24 text-center text-white sm:leading-relaxed animate-fade-in-up delay-100"
                  style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5)"
                  v-html="slide.descripcion"
                ></p>
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

          <!-- Plantilla 2: Estilo enmarcado (estilo con borde blanco alrededor del contenido) -->
          <div v-else-if="slide.estilo === 'enmarcado'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <FavoritoOverlay v-if="slide.favorito" />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
            >
              <div
                class="bg-transparent border-2 sm:border-4 border-white w-[90%] sm:w-4/5 h-[90%] sm:h-4/5 flex flex-col items-center justify-center p-3 sm:p-6 text-center sm:pr-16 overflow-hidden"
              >
                <p
                  v-if="slide.titulo"
                  class="text-white text-xs sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-widest mb-1 sm:mb-4 font-light px-2"
                >
                  {{ slide.titulo }}
                </p>
                <h3
                  v-if="slide.descripcion && !hasLists(slide.descripcion)"
                  class="estilo-enmarcado text-white font-asap text-base sm:text-3xl md:text-3xl lg:text-5xl mb-2 sm:mb-6 animate-fade-in-up px-2 font-normal line-clamp-7 sm:line-clamp-none"
                  v-html="processHtml(slide.descripcion).text"
                ></h3>
                <div 
                  v-if="slide.descripcion && hasLists(slide.descripcion)" 
                  class="estilo-enmarcado px-4 sm:px-12 text-left text-white animate-fade-in-up max-w-2xl mx-auto">
                  <!-- Renderizar el texto antes de las listas -->
                  <p v-if="processHtml(slide.descripcion).text" class="text-base sm:text-2xl mb-2 sm:mb-4 text-center" v-html="processHtml(slide.descripcion).text"></p>
                  <!-- Renderizar las listas personalizadas -->
                  <div v-for="(list, listIndex) in processHtml(slide.descripcion).lists" :key="listIndex" class="custom-bullet-list text-sm sm:text-xl mb-4">
                    <div v-for="(item, itemIndex) in list.items" :key="itemIndex" class="custom-bullet-item">
                      <div class="custom-bullet "></div>
                      <div class="custom-bullet-content" v-html="item"></div>
                    </div>
                  </div>
                </div>
                <p
                  v-if="slide.eslogan"
                  class="text-white text-sm sm:text-xl md:text-xl lg:text-2xl uppercase tracking-wider animate-fade-in-up delay-100 px-2"
                >
                  {{ slide.eslogan }}
                </p>
                <p
                  v-if="slide.referencia"
                  class="text-white text-xs sm:text-xl md:text-xl lg:text-2xl mt-2 sm:mt-8 tracking-wider animate-fade-in-up delay-200"
                >
                  {{ slide.referencia }}
                </p>
              </div>
            </div>
          </div>

          <!-- Plantilla 3: Estilo natural (estilo con texto alineado a la derecha) -->
          <div v-else-if="slide.estilo === 'natural'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <FavoritoOverlay v-if="slide.favorito" />
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
                  class="estilo-natural text-white text-sm sm:text-3xl mb-2 sm:mb-4"
                  v-html="slide.descripcion"
                ></p>
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

          <!-- Plantilla 4: Estilo luminoso (estilo con texto centrado y efectos de luz) -->
              <div v-else-if="slide.estilo === 'luminoso'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <FavoritoOverlay v-if="slide.favorito" />
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
                  class="estilo-luminoso text-white text-sm sm:text-2xl mb-2 sm:mb-4"
                  v-html="slide.descripcion"
                ></p>
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

          <!-- Plantilla 5: Estilo Espíritu (estilo con recuadro oscuro en el centro) -->
          <div v-else-if="slide.estilo === 'espiritu'" class="relative">
            <img
              :src="slide.image"
              :alt="`Slide ${index + 1}`"
              class="w-full h-[250px] sm:h-[600px] rounded-lg mb-10 object-cover"
            />
            <FavoritoOverlay v-if="slide.favorito" />
            <div
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div class="w-full max-w-4xl flex flex-col items-center">
                <!-- Contenedor central con fondo turquesa -->
                <div
                  class="relative w-[80%] sm:w-[60%] h-[60%] sm:h-[70%] flex flex-col items-center justify-center"
                >
                  <!-- Franja vertical turquesa -->
                  <div
                    class="absolute inset-0 bg-teal-400 bg-opacity-80 flex flex-col items-center justify-center"
                  >
                    <!-- Texto central con fondo negro -->
                    <div
                      class="bg-black bg-opacity-50 text-white p-2 sm:p-4 text-center mx-4 sm:mx-8 mb-4 rounded-lg border border-white"
                    >
                      <p
                        v-if="slide.descripcion"
                        class="estilo-espiritu text-sm sm:text-xl"
                        v-html="slide.descripcion"
                      ></p>
                    </div>
                  </div>
                </div>
                <div
                  class="absolute bottom-[4%] sm:bottom-[15%] w-full text-center"
                >
                  <p
                    class="font-dancingScript text-white text-4xl sm:text-7xl drop-shadow-lg"
                  >
                    {{ slide.eslogan }}
                  </p>
                </div>
                <!-- Referencia en la esquina -->
                <div class="absolute top-3 left-4 sm:top-8 sm:left-8">
                  <p class="text-white text-base sm:text-2xl drop-shadow-xl">
                    {{ slide.titulo }}
                    <span class="text-teal-400 mt-1 drop-shadow-xl">{{
                      slide.referencia
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
        <div v-if="slides.length > 1" class="swiper-button-next custom-swiper-button">
          <i class="fas fa-chevron-right"></i>
        </div>
        <div v-if="slides.length > 1" class="swiper-button-prev custom-swiper-button">
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
import { Navigation, Pagination, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import { eventos } from "../../lib/api";
import anunciosData from "./anuncios.json"; // Importamos el JSON
import FavoritoOverlay from "./FavoritoOverlay.vue";

// Función mejorada para procesar HTML y convertir listas en componentes Vue
const processHtmlContent = (html) => {
  if (!html) return { text: "", lists: [] };

  // Paso 1: Extraer las listas del HTML
  const listRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  const lists = [];
  let listMatch;
  let processedHtml = html;
  let listCounter = 0;

  // Reemplazar cada lista con un marcador
  while ((listMatch = listRegex.exec(html)) !== null) {
    const listId = `list-placeholder-${listCounter}`;
    const fullListTag = listMatch[0];
    const listContent = listMatch[1];
    
    // Extraer los elementos de la lista
    const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    const items = [];
    let itemMatch;
    
    while ((itemMatch = itemRegex.exec(listContent)) !== null) {
      items.push(itemMatch[1].trim());
    }
    
    if (items.length > 0) {
      lists.push({
        id: listId,
        items: items
      });
      
      // Reemplazar la lista con un marcador
      processedHtml = processedHtml.replace(fullListTag, `<div id="${listId}"></div>`);
      listCounter++;
    }
  }

  // Paso 2: Sanitizar el resto del HTML (sin listas)
  // Permitir etiquetas strong, p, br y span con atributos de estilo para colores
  let sanitized = processedHtml.replace(/<(?!\/?(strong|p|br|span)\b)[^>]*>/gi, "");
  
  // Filtrar los atributos de span para permitir solo estilos de color
  const spanRegex = /<span\s+([^>]*)>/gi;
  sanitized = sanitized.replace(spanRegex, (match, attrs) => {
    // Si contiene style="color: ...", mantenerlo
    if (attrs.includes('style') && attrs.includes('color')) {
      // Extraer solo el atributo de estilo de color
      const styleRegex = /style\s*=\s*['"]\s*color\s*:\s*([^;'"]+)['"]*/i;
      const styleMatch = attrs.match(styleRegex);
      if (styleMatch) {
        return `<span style="color: ${styleMatch[1]}">`;
      }
    }
    // Si no tiene estilo de color, eliminar la etiqueta span
    return '';
  });

  // Función auxiliar para cerrar etiquetas faltantes
  const closeMissingTags = (text, tagName) => {
    if (tagName.toLowerCase() === "br") return text;

    const openTagRegex = new RegExp(`<${tagName}\\b[^>]*>`, "gi");
    const closeTagRegex = new RegExp(`<\/${tagName}>`, "gi");
    let openTags = (text.match(openTagRegex) || []).length;
    let closeTags = (text.match(closeTagRegex) || []).length;
    let result = text;
    if (openTags > closeTags) {
      for (let i = 0; i < openTags - closeTags; i++) {
        result += `</${tagName}>`;
      }
    }
    return result;
  };

  sanitized = closeMissingTags(sanitized, "strong");
  sanitized = closeMissingTags(sanitized, "p");
  sanitized = closeMissingTags(sanitized, "span");

  // Limpieza de etiquetas adyacentes
  sanitized = sanitized.replace(/<\/strong>\s*<strong>/g, " "); // Combina strongs adyacentes
  sanitized = sanitized.replace(/<\/p>\s*<p>/g, "</p><p>"); // Mantiene <p> juntos
  sanitized = sanitized.replace(/<\/span>\s*<span\s+style="color:\s*([^"]+)">/g, (match, color) => ` </span><span style="color: ${color}">`); // Mantiene spans de color separados

  // Eliminar párrafos vacíos
  sanitized = sanitized.replace(/<p>\s*<\/p>/gi, "");

  return {
    text: sanitized,
    lists: lists
  };
};

export default {
  components: {
    Swiper,
    SwiperSlide,
    FavoritoOverlay,
  },
  setup() {
    const slides = ref([]);
    const error = ref("");
    const isLoading = ref(true);
    const modules = [Navigation, Pagination, Autoplay, EffectFade, Keyboard];

    // Estilos disponibles para asignar aleatoriamente
    const estilosDisponibles = [
      "clasico",
      "enmarcado",
      "natural",
      "luminoso",
      "espiritu",
    ];

    // Función para verificar si un slide solo tiene imagen (sin textos)
    const isImageOnly = (slide) => {
      return (
        !slide.titulo &&
        !slide.descripcion &&
        !slide.eslogan &&
        !slide.referencia
      );
    };
    
    // Función para verificar si el contenido tiene listas
    const hasLists = (content) => {
      if (!content) return false;
      return content.includes('<ul') && content.includes('<li');
    };
    
    // Obtener valor numérico de fecha para ordenar (soporta string, Date o Timestamp de Firestore)
    const toMillis = (value) => {
      if (!value) return 0;
      // Firestore Timestamp
      if (value && typeof value.toDate === "function") {
        try {
          return value.toDate().getTime();
        } catch (e) {
          return 0;
        }
      }
      // String o Date
      const t = new Date(value).getTime();
      return isNaN(t) ? 0 : t;
    };
    
    // Función para procesar el HTML y extraer listas
    const processHtml = (html) => {
      return processHtmlContent(html);
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
            descripcion: anuncio.descripcion, // Mantener descripción original para procesamiento
            eslogan: anuncio.textoBoton || anuncio.eslogan,
            linkBoton: anuncio.linkBoton || "#",
            referencia: anuncio.referencia || "",
            favorito: anuncio.favorito === true,
            // Campos de fecha opcionales para ordenamiento si están presentes en el JSON
            fecha: anuncio.fecha || null,
            createdAt: anuncio.createdAt || null,
            updatedAt: anuncio.updatedAt || null,
            estilo: determinarEstilo(
              isOnlyImage,
              hasLink,
              anuncio.estilo,
              anuncio.linkBoton,
              anuncio.descripcion
            ),
            source: "local",
          };
        });

        // Función para determinar el estilo basado en las condiciones
        function determinarEstilo(
          esSoloImagen,
          tieneEnlace,
          estiloDefinido,
          linkBoton,
          descripcion
        ) {
          if (esSoloImagen) return "none";
          if (tieneEnlace) return "clasico";
          // Si hay listas (viñetas) en la descripción, usar siempre el estilo enmarcado
          if (descripcion && hasLists(descripcion)) return "enmarcado";
          return estiloDefinido || getRandomStyle(linkBoton);
        }

        try {
          // Intentar cargar anuncios de la API
          const response = await eventos.getAll();
          const apiSlides = response.data
            .filter((evento) => evento.visible !== false) // Filtrar solo anuncios visibles
            .map((evento) => {
              const hasLink = evento.linkBoton && evento.linkBoton !== "#";
              const isOnlyImage =
                !evento.titulo &&
                !evento.descripcion &&
                !(evento.textoBoton || evento.eslogan) &&
                !evento.referencia;

              return {
                image: evento.image,
                titulo: evento.titulo,
                descripcion: evento.descripcion, // Mantener descripción original para procesamiento
                eslogan: evento.textoBoton || evento.eslogan,
                linkBoton: evento.linkBoton || "#",
                referencia: evento.referencia || "",
                favorito: evento.favorito === true,
                // Incluir campos de fecha para ordenar
                fecha: evento.fecha || null,
                createdAt: evento.createdAt || null,
                updatedAt: evento.updatedAt || null,
                order: evento.order ?? 0, // Incluir el campo order
                estilo: determinarEstilo(
                  isOnlyImage,
                  hasLink,
                  evento.estilo,
                  evento.linkBoton,
                  evento.descripcion
                ),
                source: "api",
              };
            });

          // Si hay anuncios de Firebase, usar solo esos (ordenados por fecha)
          // Si hay anuncios de Firebase, usar solo esos. Si no, usar los locales
          if (apiSlides.length > 0) {
            // Ordenar los anuncios de la API por el campo order (ascendente)
            slides.value = apiSlides.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          } else {
            // No hay anuncios en Firebase, usar los locales
            slides.value = localSlides;
          }
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
      hasLists,
      processHtml,
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

/* Estilos para las etiquetas strong en las descripciones */
:deep(strong) {
  @apply font-bold text-teal-300 underline decoration-teal-400 decoration-2 underline-offset-2;
}

/* Para el estilo "espiritu" queremos un color diferente de resaltado */
.estilo-espiritu :deep(strong) {
  @apply text-teal-300 font-extrabold decoration-yellow-400;
}

/* Para el estilo "enmarcado" */
.estilo-enmarcado :deep(strong) {
  @apply text-white font-black bg-teal-600/50 px-1 py-0.5 rounded no-underline;
}

/* Para el estilo "natural" */
.estilo-natural :deep(strong) {
  @apply text-yellow-100 font-semibold italic no-underline;
}

/* Para el estilo "luminoso" */
.estilo-luminoso :deep(strong) {
  @apply text-teal-200 font-extrabold animate-pulse-soft no-underline;
}


/* Estilos para listas personalizadas en las descripciones de anuncios */
.custom-bullet-list {
  @apply pl-0 mb-2 text-left space-y-2;
}

.custom-bullet-item {
  @apply flex items-start mb-1 text-left;
}

.custom-bullet {
  @apply w-2 h-2 rounded-full bg-white mt-2 mr-2 flex-shrink-0;
}

.custom-bullet-content {
  @apply flex-1;
}

.text-outline {
  -webkit-text-stroke: 1.5px black;
  color: transparent;
}
.dark .text-outline {
  -webkit-text-stroke: 1.5px white;
}

</style>
