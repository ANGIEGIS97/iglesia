bienvenida




<template>
  <div>
    <!-- Hero Section -->
    <div class="relative h-screen overflow-hidden">
      <!-- Parallax Background -->
      <div
        ref="parallaxBackground"
        class="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        :style="{ backgroundImage: `url(${heroImage})` }"
      ></div>
      
      <!-- Gradient Overlay for Better Readability -->
      <div class="absolute inset-0 bg-black opacity-45 dark:opacity-65 transition-opacity duration-300 ease-in-out"></div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <!-- Main Content -->
      <div class="relative h-full flex items-center justify-center z-10 px-4 pt-0 sm:pt-0">
        <div class="text-center text-white max-w-4xl selection:bg-teal-500 -mt-16 sm:mt-0">
          <!-- Authenticated User View -->
          <div v-if="displayName && !isLoading" class="hero-content">
            <!-- Eyebrow Tag -->
            <div class="inline-block mb-6 animate-fade-in-down">
              <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs font-semibold tracking-wider uppercase">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                </svg>
                Bienvenido
              </span>
            </div>
            
            <!-- Main Heading -->
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up leading-tight">
              <span class="text-gradient">{{ displayName }}</span>
            </h1>
            
            <!-- Subtitle -->
            <p class="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-light leading-relaxed mb-8 animate-fade-in-up-delayed max-w-3xl mx-auto">
              Nos alegra tenerte aquí.
            </p>
            
            <!-- Bible Verse (Solo para miembros) -->
            <div class="inline-block animate-fade-in-up-more-delayed">
              <blockquote class="text-sm sm:text-base text-gray-300 italic border-l-4 border-white pl-4 py-2 bg-black/20 backdrop-blur-sm rounded-r-lg">
                <div id="dailyVersesWrapper" class="verse-content"></div>
              </blockquote>
            </div>
          </div>

          <!-- Guest User View -->
          <div v-else-if="!isLoading" class="hero-content">
            <!-- Eyebrow Tag -->
            <div class="inline-block mb-6 animate-fade-in-down">
              <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-semibold tracking-wider uppercase">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                Bienvenido
              </span>
            </div>
            
            <!-- Main Heading -->
            <div class="mb-6 animate-fade-in-up flex justify-center">
              <img 
                src="/logoiglesia2.webp" 
                alt="Iglesia Bautista Su Gracia es Mayor" 
                class="h-32 sm:h-40 lg:h-48 w-auto object-contain drop-shadow-2xl"
              />
            </div>
            
            <!-- Subtitle -->
            <p class="text-[18px] sm:text-2xl lg:text-3xl text-gray-200 font-light leading-relaxed mb-8 animate-fade-in-up-delayed max-w-3xl mx-auto">
              Un lugar de 
              <span class="rotating-word-wrapper">
                <span 
                  class="rotating-word text-white font-semibold"
                  :key="currentWordIndex"
                >
                  {{ rotatingWords[currentWordIndex] }}
                  <span class="word-underline"></span>
                </span>
              </span>
            </p>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="hero-content">
            <div class="space-y-4">
              <div class="h-8 w-48 bg-white/10 rounded-full mx-auto animate-pulse"></div>
              <div class="h-16 w-96 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
              <div class="h-12 w-80 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Scroll Indicator -->
      <div class="absolute bottom-20 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <div class="scroll-indicator-container">
          <!-- Mobile Indicator (Swipe) -->
          <div class="sm:hidden flex flex-col items-center gap-3">
            <span class="text-white text-xs font-semibold tracking-widest uppercase bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">Deslizar</span>
            <div class="swipe-icon">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                ></path>
              </svg>
            </div>
          </div>
          
          <!-- Desktop Indicator (Mouse) -->
          <div class="hidden sm:flex flex-col items-center gap-3">
            <span class="text-white text-xs font-semibold tracking-widest uppercase bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">Explorar</span>
            <div class="mouse-container">
              <div class="mouse">
                <div class="mouse-wheel"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usuarios, auth_api } from "../lib/api";

export default {
  data() {
    return {
      heroImage: "/bienvenida2.webp",
      displayName: "",
      unsubscribe: null,
      authUnsubscribe: null,
      nombresFemeninos: ["Angie", "Ana", "Maria", "Laura", "Sofia", "Isabella"],
      isLoading: true,
      previousDisplayName: "",
      rotatingWords: ["fe", "comunidad", "crecimiento espiritual"],
      currentWordIndex: 0,
      wordRotationInterval: null,
    };
  },
  computed: {
    saludo() {
      const nombre = this.displayName || this.previousDisplayName;
      if (this.nombresFemeninos.includes(nombre)) {
        return "Bienvenida";
      } else {
        return "Bienvenido";
      }
    },
  },
  methods: {
    handleScroll() {
      const parallaxBackground = this.$refs.parallaxBackground;
      if (parallaxBackground) {
        const scrollPosition = window.pageYOffset;
        const limit = parallaxBackground.offsetHeight;
        if (scrollPosition <= limit) {
          parallaxBackground.style.transform = `translateY(${
            scrollPosition * 0.5
          }px)`;
        }
      }
    },
    initializeFromLocalStorage() {
      try {
        if (typeof window !== "undefined") {
          const storedName = localStorage.getItem("userDisplayName");
          if (storedName) {
            this.displayName = storedName;
            this.isLoading = false;
          }
        }
      } catch (error) {
        console.error("Error accediendo a localStorage:", error);
      }
    },
    async setupProfileSubscription() {
      const user = auth_api.getCurrentUser();
      if (user) {
        try {
          // Primero intentamos obtener el perfil directamente
          const profile = await usuarios.getById(user.uid);
          this.previousDisplayName = this.displayName;
          this.displayName = profile.data.displayName;
          // Actualizamos el localStorage con el nuevo valor
          if (profile.data.displayName && typeof window !== "undefined") {
            try {
              localStorage.setItem("userDisplayName", profile.data.displayName);
            } catch (error) {
              console.error("Error guardando en localStorage:", error);
            }
          }

          // Luego nos suscribimos a los cambios
          this.unsubscribe = usuarios.subscribeToProfile(
            user.uid,
            (profile) => {
              this.previousDisplayName = this.displayName;
              this.displayName = profile.displayName;
              // Actualizamos el localStorage cuando cambie el perfil
              if (profile.displayName && typeof window !== "undefined") {
                try {
                  localStorage.setItem("userDisplayName", profile.displayName);
                } catch (error) {
                  console.error("Error guardando en localStorage:", error);
                }
              }
            }
          );
        } catch (error) {
          console.error("Error al obtener el perfil:", error);
        } finally {
          this.isLoading = false;
        }
      } else {
        this.previousDisplayName = this.displayName;
        this.displayName = "";
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("userDisplayName");
          } catch (error) {
            console.error("Error removiendo de localStorage:", error);
          }
        }
        this.isLoading = false;
      }
    },
    loadDailyVerseScript() {
      // Limpiar el contenedor del versículo
      const verseContainer = document.getElementById('dailyVersesWrapper');
      if (verseContainer) {
        verseContainer.innerHTML = '';
      }

      // Remover scripts anteriores de DailyVerses para evitar duplicados
      const existingScripts = document.querySelectorAll('script[src*="dailyverses.net"]');
      existingScripts.forEach(script => script.remove());

      // Crear y agregar el nuevo script
      const script = document.createElement("script");
      script.src = "https://dailyverses.net/get/random.js?language=nvi&t=" + Date.now();
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    },
    startWordRotation() {
      this.wordRotationInterval = setInterval(() => {
        this.currentWordIndex = (this.currentWordIndex + 1) % this.rotatingWords.length;
      }, 2500); // Cambia cada 2.5 segundos
    },
  },
  async mounted() {
    this.initializeFromLocalStorage();
    window.addEventListener("scroll", this.handleScroll);
    this.loadDailyVerseScript();
    this.startWordRotation();

    // Suscribirse a cambios en el estado de autenticación
    this.authUnsubscribe = auth_api.onAuthStateChange(async (user) => {
      if (user) {
        await this.setupProfileSubscription();
        // Recargar el versículo cuando el usuario inicie sesión
        // Usar nextTick para asegurar que el DOM esté actualizado
        this.$nextTick(() => {
          // Verificar que el contenedor existe antes de cargar el script
          const verseContainer = document.getElementById('dailyVersesWrapper');
          if (verseContainer) {
            this.loadDailyVerseScript();
          } else {
            // Si aún no existe, intentar de nuevo después de un breve delay
            setTimeout(() => {
              this.loadDailyVerseScript();
            }, 100);
          }
        });
      } else {
        this.displayName = "";
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("userDisplayName");
          } catch (error) {
            console.error("Error removiendo de localStorage:", error);
          }
        }
        if (this.unsubscribe) {
          this.unsubscribe();
        }
        this.isLoading = false;
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    // Limpiar todas las suscripciones
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
    // Limpiar el intervalo de rotación de palabras
    if (this.wordRotationInterval) {
      clearInterval(this.wordRotationInterval);
    }
  },
};
</script>

<style scoped>
/* Gradient Text Effect */
.text-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Outlined Text for Hero */
.text-outline-hero {
  -webkit-text-stroke: 2px white;
  color: transparent;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.dark .text-outline-hero {
  -webkit-text-stroke: 2px #ffffff;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

/* Fade In Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

.animate-fade-in-up-delayed {
  animation: fadeInUp 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

.animate-fade-in-up-more-delayed {
  animation: fadeInUp 0.8s ease-out 0.6s forwards;
  opacity: 0;
}

/* Floating Decorative Elements */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes floatDelayed {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-30px, 30px) scale(0.9);
  }
  66% {
    transform: translate(20px, -20px) scale(1.1);
  }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: floatDelayed 25s ease-in-out infinite;
}

/* Scroll Indicator Container */
.scroll-indicator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInOut 2s ease-in-out infinite;
}

/* Mouse Container */
.mouse-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Mouse Styling */
.mouse {
  width: 28px;
  height: 45px;
  border: 2.5px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

/* Mouse Wheel Animation */
.mouse-wheel {
  width: 4px;
  height: 10px;
  background: linear-gradient(to bottom, #ffffff, #f0f0f0);
  border-radius: 25%;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: mouse-wheel 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
}

@keyframes mouse-wheel {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(12px);
  }
}

/* Swipe Icon Animation */
.swipe-icon {
  animation: swipeAnimation 2s ease-in-out infinite;
}

@keyframes swipeAnimation {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(10px);
    opacity: 1;
  }
}

/* Fade In/Out for Scroll Indicator */
@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-outline-hero {
    -webkit-text-stroke: 1.5px white;
  }
  
  .dark .text-outline-hero {
    -webkit-text-stroke: 1.5px #ffffff;
  }
}

/* Ensure smooth transitions */
.hero-content {
  transition: all 0.3s ease-in-out;
}

/* Loading state pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Estilos para el versículo dinámico */
.verse-content {
  color: #d1d5db; /* text-gray-300 */
  font-style: italic;
}

.verse-content :deep(a) {
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  display: block;
  margin-top: 0.25rem;
  font-style: normal;
}

.verse-content :deep(a:hover) {
  color: #f0f0f0;
  text-decoration: underline;
}

/* Rotating Word Animation */
.rotating-word-wrapper {
  display: inline-block;
  position: relative;
  text-align: center;
  vertical-align: baseline;
}

.rotating-word {
  display: inline-block;
  position: relative;
  animation: wordFadeIn 0.4s ease-in-out;
}

/* Subrayado animado */
.word-underline {
  position: absolute;
  bottom: -4px;
  left: 0;
  height: 3px;
  width: 0;
  background: #ffffff;
  border-radius: 2px;
  animation: expandUnderline 2.5s ease-in-out;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

@keyframes wordFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes expandUnderline {
  0% {
    width: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    width: 100%;
    opacity: 1;
  }
  90% {
    width: 100%;
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}

/* Responsive adjustments for rotating words */
@media (max-width: 640px) {
  .word-underline {
    height: 2px;
    bottom: -2px;
  }
}

</style>
