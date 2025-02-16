<template>
  <!-- Barra de navegación principal -->
  <nav
    class="bg-gray-800 fixed w-full z-50 top-0 start-0 border-b border-gray-600 navbar selection:bg-teal-500 selection:text-white"
    style="list-style-type: none"
  >
    <!-- Contenedor principal de la barra de navegación -->
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2"
    >
      <!-- Logo y nombre de la iglesia -->
      <a
        href="/"
        class="group flex items-center space-x-3 rtl:space-x-reverse relative overflow-hidden rounded-lg"
      >
        <div class="relative">
          <img
            src="https://i.ibb.co/HtyYRq5/logo.png"
            class="h-14 transition-transform duration-300 ease-in-out group-hover:scale-105"
            alt="Logo iglesia"
          />
          <div
            class="absolute inset-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"
          ></div>
        </div>
        <span
          class="self-center text-[14px] font-semibold whitespace-nowrap text-white text-center transition-colors duration-300 ease-in-out group-hover:text-teal-500"
          >Iglesia Bautista <br />
          Su Gracia es Mayor</span
        >
      </a>

      <!-- Menú de navegación (visible solo en desktop) -->
      <div class="hidden md:flex items-center justify-between flex-grow">
        <div class="relative p-[2px] rounded-lg mx-auto">
          <div class="bg-gray-800 md:bg-transparent rounded-lg">
            <ul class="flex font-medium space-x-8 rtl:space-x-reverse nav-menu px-4 py-2">
              <li>
                <a
                  href="/#inicio"
                  class="ease-in duration-150 text-white hover:text-teal-400"
                >
                  Inicio
                </a>
              </li>

              <li>
                <a
                  href="/#anuncios"
                  class="ease-in duration-150 text-white hover:text-teal-400"
                >
                  Anuncios y Eventos
                </a>
              </li>

              <li>
                <a
                  href="/#pastor"
                  class="ease-in duration-150 text-white hover:text-teal-400"
                >
                  Pastor
                </a>
              </li>

              <li>
                <a
                  href="/#servicio"
                  class="ease-in duration-150 text-white hover:text-teal-400"
                >
                  Servicios
                </a>
              </li>

              <li>
                <a
                  href="/#ministerios"
                  class="ease-in duration-150 text-white hover:text-teal-400"
                >
                  Ministerios
                </a>
              </li>

              <li>
                <a
                  href="/confesion"
                  class="ease-in duration-150 text-white hover:text-teal-400"
                >
                  Confesión de fe
                </a>
              </li>

              <li>
                <a
                  href="/preguntas"
                  class="ease-in duration-150 text-white hover:text-teal-400"
                >
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Contenedor de botones -->
      <div class="flex space-x-2 rtl:space-x-reverse items-center">
        <!-- Botón de login/admin -->
        <div class="relative">
          <button
            v-if="!isAuthenticated"
            @click="openLoginModal"
            class="h-10 w-10 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </button>

          <button
            v-else
            @click.stop="toggleAdminMenu"
            class="h-10 w-10 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <svg
              class="w-6 h-6 text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>

        <!-- Botón de modo oscuro -->
        <button
          @click="toggleDarkMode"
          class="h-10 w-10 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center dark-mode-button"
        >
          <!-- Ícono para modo claro -->
          <svg
            class="fill-teal-400 block dark:hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            ></path>
          </svg>
          <!-- Ícono para modo oscuro -->
          <svg
            class="fill-yellow-500 hidden dark:block"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        <!-- Botón de hamburguesa (visible solo en móvil) -->
        <button
          @click="toggleMenu"
          class="h-10 w-10 rounded-lg p-2 hover:bg-gray-700 flex md:hidden items-center justify-center relative group"
        >
          <!-- Icono de menú -->
          <svg
            class="w-6 h-6 text-teal-400 transition-transform duration-300 ease-in-out"
            :class="{ 'scale-0 absolute': isMenuOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <!-- Icono de cerrar -->
          <svg
            class="w-6 h-6 text-teal-400 transition-transform duration-300 ease-in-out absolute"
            :class="{ 'scale-100': isMenuOpen, 'scale-0': !isMenuOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <!-- Menú móvil -->
  <div
    v-show="isMenuOpen"
    class="fixed top-[72px] left-0 right-0 z-40 animate__animated md:hidden p-4 bg-gray-800"
    :class="{ 'animate__slideInDown': isMenuOpen }"
  >
    <div class="relative p-[2px] rounded-lg shadow-xl sm:shadow-none bg-gray-100 dark:bg-gradient-to-r dark:from-teal-500 dark:to-blue-500 dark:animate-gradient">
      <div class="bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg">
        <div class="container mx-auto px-4 py-4">
          <ul class="space-y-4 nav-menu">
            <li v-for="item in menuItems" :key="item.href">
              <a
                :href="item.href"
                @click="closeMenu"
                class="block text-white hover:text-teal-400 transition-colors duration-300"
              >
                {{ item.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Admin Sidebar -->
  <AdminSidebar :isOpen="adminMenuVisible" @close="closeAdminMenu" />

  <!-- Componente de barra de progreso -->
  <BarraProgreso />

  <!-- Login Form -->
  <LoginForm ref="loginForm" @login-success="handleLoginSuccess" />
</template>

<script>
import BarraProgreso from "./BarraProgreso.vue";
import AdminSidebar from "./AdminSidebar.vue";
import LoginForm from "./panel/LoginForm.vue";
import { checkAuth } from "../middleware/auth";
import 'animate.css';

export default {
  components: {
    BarraProgreso,
    AdminSidebar,
    LoginForm,
  },
  name: "MenuInicio",
  data() {
    return {
      adminMenuVisible: false,
      isAuthenticated: false,
      activeSection: '',
      currentPath: '',
      isMenuOpen: false,
      menuItems: [
        { href: '/#inicio', text: 'Inicio' },
        { href: '/#anuncios', text: 'Anuncios y Eventos' },
        { href: '/#pastor', text: 'Pastor' },
        { href: '/#servicio', text: 'Servicios' },
        { href: '/#ministerios', text: 'Ministerios' },
        { href: '/confesion', text: 'Confesión de fe' },
        { href: '/preguntas', text: 'Preguntas frecuentes' }
      ]
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if (this.isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
      this.$nextTick(() => {
        if (this.currentPath === '/') {
          this.handleScroll();
        }
        this.updateActiveLink();
      });
    },
    toggleDarkMode() {
      const isDarkMode = !document.documentElement.classList.contains("dark");
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("darkMode", isDarkMode);
    },
    loadDarkModePreference() {
      const darkMode = localStorage.getItem("darkMode");
      if (darkMode === "true") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    toggleAdminMenu() {
      this.adminMenuVisible = !this.adminMenuVisible;
    },
    closeAdminMenu() {
      this.adminMenuVisible = false;
    },
    handleLogout() {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    handleDocumentClick(event) {
      const adminMenu = this.$el.querySelector(".relative");
      if (adminMenu && !adminMenu.contains(event.target)) {
        this.closeAdminMenu();
      }
    },
    checkAuthStatus() {
      this.isAuthenticated = checkAuth();
    },
    handleScroll() {
      if (this.currentPath === '/') {
        const sections = ['inicio', 'anuncios', 'pastor', 'servicio', 'ministerios'];
        const navLinks = document.querySelectorAll('.nav-menu a[href^="/#"]');
        
        const scrollPosition = window.scrollY + 100;

        sections.forEach(sectionId => {
          const section = document.getElementById(sectionId);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              this.activeSection = sectionId;
              
              navLinks.forEach(link => {
                const href = link.getAttribute('href').substring(2);
                if (href === sectionId) {
                  link.classList.add('text-teal-400');
                  link.classList.remove('text-white');
                } else {
                  link.classList.remove('text-teal-400');
                  link.classList.add('text-white');
                }
              });
            }
          }
        });
      }
    },
    updateActiveLink() {
      const allLinks = document.querySelectorAll('.nav-menu a');
      
      allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === this.currentPath || (this.currentPath === '/' && href === '/')) {
          link.classList.add('text-teal-400');
          link.classList.remove('text-white');
        } else if (!href.startsWith('/#')) {
          link.classList.remove('text-teal-400');
          link.classList.add('text-white');
        }
      });
    },
    updateCurrentPath() {
      this.currentPath = window.location.pathname;
      this.updateActiveLink();
    },
    handleLoginSuccess(data) {
      this.checkAuthStatus();
    },
    openLoginModal() {
      this.$refs.loginForm.openModal();
    },
  },
  mounted() {
    this.loadDarkModePreference();
    this.checkAuthStatus();
    document.addEventListener("click", this.handleDocumentClick);
    
    this.updateCurrentPath();
    
    if (this.currentPath === '/') {
      window.addEventListener('scroll', this.handleScroll);
      this.$nextTick(() => {
        this.handleScroll();
      });
    }

    window.addEventListener('popstate', this.updateCurrentPath);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('popstate', this.updateCurrentPath);
    document.body.style.overflow = '';
  },
};
</script>

<style scoped>
.nav-menu a {
  transition: color 0.3s ease;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Animación para el botón de modo oscuro */
@keyframes rotateMode {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.8);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.dark-mode-button svg {
  animation: rotateMode 0.5s ease-in-out;
}

/* Estilos globales para la transición del modo oscuro */
:root {
  transition: background-color 0.3s ease, color 0.3s ease;
}

:root * {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Aseguramos que el contenido se empuje hacia abajo por la altura de la barra de navegación fija */
:root {
  --nav-height: 72px;
}

body {
  padding-top: var(--nav-height);
}

/* Ajustes para la animación del menú móvil */
.animate__animated {
  --animate-duration: 0.3s;
}

/* Animación del gradiente */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.dark .dark\:animate-gradient {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}
</style>
