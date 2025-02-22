<template>
  <div>
    <!-- Hero -->
    <div class="relative h-screen overflow-hidden">
      <div
        ref="parallaxBackground"
        class="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        :style="{ backgroundImage: `url(${heroImage})` }"
      ></div>
      <div
        class="absolute inset-0 bg-black opacity-25 dark:opacity-45 transition-opacity duration-300 ease-in-out"
      ></div>
      <div class="relative h-full flex items-center justify-center z-10">
        <div class="text-center text-white p-5 selection:bg-teal-500">
          <div v-if="displayName && !isLoading">
            <h1 class="text-4xl sm:text-5xl font-bold mb-4">
              {{ saludo }}, {{ displayName }}
            </h1>
            <p class="text-xl sm:text-2xl">
              Nos alegra tenerte aquí. Este es un lugar de fe, comunidad y
              crecimiento espiritual.
            </p>
          </div>

          <div v-else-if="!isLoading">
            <h1 class="text-4xl sm:text-5xl font-bold mb-4">
              Bienvenido a nuestra iglesia
            </h1>
            <p class="text-xl sm:text-2xl">
              Un lugar de fe, comunidad y crecimiento espiritual
            </p>
          </div>

          <div v-if="isLoading">
            <h1 class="text-4xl sm:text-5xl font-bold mb-4 opacity-0">
              Bienvenido
            </h1>
            <p class="text-xl sm:text-2xl opacity-0">
              Un lugar de fe, comunidad y crecimiento espiritual
            </p>
          </div>
        </div>
      </div>
      <!-- Scroll/Swipe Indicator -->
      <div class="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <div class="scroll-indicator">
          <!-- Indicador para móviles (deslizar) -->
          <div class="sm:hidden flex flex-col items-center">
            <span class="text-white text-sm mb-2">Deslizar</span>
            <svg
              class="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              ></path>
            </svg>
          </div>
          <!-- Indicador para pantallas más grandes (mouse) -->
          <div class="hidden sm:flex flex-col items-center">
            <span class="text-white text-sm mb-2">Bajar</span>
            <div class="mouse">
              <div class="mouse-wheel"></div>
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
      heroImage: "https://i.ibb.co/vCWvVYb/principal.jpg",
      displayName: "",
      unsubscribe: null,
      authUnsubscribe: null,
      nombresFemeninos: ["Angie", "Ana", "Maria", "Laura", "Sofia", "Isabella"],
      isLoading: true,
      previousDisplayName: "",
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
  },
  async mounted() {
    this.initializeFromLocalStorage();
    window.addEventListener("scroll", this.handleScroll);

    // Suscribirse a cambios en el estado de autenticación
    this.authUnsubscribe = auth_api.onAuthStateChange((user) => {
      if (user) {
        this.setupProfileSubscription();
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
  },
};
</script>

<style scoped>
.overflow-hidden {
  overflow: hidden;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInOut 2s infinite;
}

/* Mouse container */
.mouse {
  width: 26px;
  height: 40px;
  border: 2px solid #fff;
  border-radius: 20px;
  position: relative;
}

/* Mouse wheel */
.mouse-wheel {
  width: 3px;
  height: 8px;
  background-color: #fff;
  border-radius: 25%;
  position: absolute;
  top: 7px;
  left: 50%;
  transform: translateX(-50%);
  animation: mouse-wheel 2s ease infinite;
}

@keyframes mouse-wheel {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(7px);
  }
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Animación deslizar */
@keyframes swipeAnimation {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.sm\:hidden svg {
  animation: swipeAnimation 2s infinite;
}
</style>
