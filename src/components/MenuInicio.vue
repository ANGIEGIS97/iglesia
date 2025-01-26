<template>
  <!-- Barra de navegación principal -->
  <nav
    class="bg-gray-800 fixed w-full z-30 top-0 start-0 border-b border-gray-600 navbar selection:bg-teal-500 selection:text-white"
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
            class="h-16 transition-transform duration-300 ease-in-out group-hover:scale-105"
            alt="Logo iglesia"
          />
          <div
            class="absolute inset-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"
          ></div>
        </div>
        <span
          class="self-center text-md font-semibold whitespace-nowrap text-white text-center transition-colors duration-300 ease-in-out group-hover:text-teal-500"
          >Iglesia Bautista <br />
          Su Gracia es Mayor</span
        >
      </a>

      <!-- Contenedor de botones (modo oscuro y hamburguesa) -->
      <div class="flex md:order-2 md:space-x-0 rtl:space-x-reverse">
        <!-- Botón de login/admin -->
        <div class="relative mr-2">
          <a
            v-if="!isAuthenticated"
            href="/login"
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
          </a>

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
          class="h-10 w-10 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 float-right"
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

        <!-- Botón de hamburguesa para móviles -->
        <button
          @click.stop="toggleMenu"
          type="button"
          ref="hamburgerButton"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600 relative"
          aria-controls="navbar-sticky"
          :aria-expanded="menuVisible"
          id="boton-prueba"
        >
          <span class="sr-only">{{
            menuVisible ? "Cerrar menu principal" : "Abrir menu principal"
          }}</span>

          <!-- Contenedor para los iconos con posición absoluta -->
          <div class="relative w-5 h-5">
            <!-- Ícono de hamburguesa -->
            <svg
              class="w-5 h-5 absolute transition-all duration-300 ease-in-out text-teal-500"
              :class="
                menuVisible
                  ? 'opacity-0 rotate-90 scale-0'
                  : 'opacity-100 rotate-0 scale-100'
              "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>

            <!-- Ícono de X -->
            <svg
              class="w-5 h-5 absolute transition-all duration-300 ease-in-out text-teal-500"
              :class="
                menuVisible
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 rotate-90 scale-0'
              "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </button>
      </div>

      <!-- Menú de navegación -->
      <div
        ref="navbarSticky"
        :class="[
          'items-center justify-between w-full md:flex md:w-auto md:order-1',
          'absolute md:static top-full left-0 right-0',
          'pb-6 md:pb-0 p-4 sm:p-0',
          'backdrop-filter backdrop-blur-lg bg-gray-800 bg-opacity-100 sm:bg-transparent',
          { hidden: !menuVisible, block: menuVisible },
        ]"
        id="navbar-sticky"
      >
        <!-- Lista de enlaces de navegación -->
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 nav-menu"
        >
          <!-- Inicio -->
          <li>
            <a
              href="/#inicio"
              @click="closeMenu"
              class="ease-in duration-150 block py-2 px-3 text-white rounded md:hover:bg-transparent md:hover:text-teal-400 md:p-0 md:dark:hover:text-teal-400 hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Inicio
            </a>
          </li>

          <!-- Anuncios y eventos -->
          <li>
            <a
              href="/#anuncios"
              @click="closeMenu"
              class="ease-in duration-150 block py-2 px-3 text-white rounded md:hover:bg-transparent md:hover:text-teal-400 md:p-0 md:dark:hover:text-teal-400 hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Anuncios y Eventos
            </a>
          </li>

          <!-- Conócenos (versión móvil) -->
          <li class="md:hidden">
            <button
              @click="toggleConocenos"
              class="w-full text-left ease-in duration-150 flex justify-between items-center py-2 px-3 text-white rounded hover:bg-gray-700 dark:hover:text-white"
            >
              Conócenos
              <svg
                :class="{ 'rotate-180': conocenosVisible }"
                class="w-4 h-4 ml-2 transition-transform duration-200"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <ul v-show="conocenosVisible" class="pl-4">
              <li>
                <a
                  href="/#pastor"
                  @click="closeMenu"
                  class="block py-2 px-3 text-white hover:bg-gray-700 dark:hover:text-white"
                >
                  Pastor
                </a>
              </li>
              <li>
                <a
                  href="/#servicio"
                  @click="closeMenu"
                  class="block py-2 px-3 text-white hover:bg-gray-700 dark:hover:text-white"
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="/#ministerios"
                  @click="closeMenu"
                  class="block py-2 px-3 text-white hover:bg-gray-700 dark:hover:text-white"
                >
                  Ministerios
                </a>
              </li>
            </ul>
          </li>

          <!-- Enlaces para la versión de escritorio -->
          <li class="hidden md:block">
            <a
              href="/#pastor"
              class="ease-in duration-150 block py-2 px-3 text-white rounded md:hover:bg-transparent md:hover:text-teal-400 md:p-0 md:dark:hover:text-teal-400 hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Pastor
            </a>
          </li>
          <li class="hidden md:block">
            <a
              href="/#servicio"
              class="ease-in duration-150 block py-2 px-3 text-white rounded md:hover:bg-transparent md:hover:text-teal-400 md:p-0 md:dark:hover:text-teal-400 hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Servicios
            </a>
          </li>
          <li class="hidden md:block">
            <a
              href="/#ministerios"
              class="ease-in duration-150 block py-2 px-3 text-white rounded md:hover:bg-transparent md:hover:text-teal-400 md:p-0 md:dark:hover:text-teal-400 hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Ministerios
            </a>
          </li>

          <!-- Confesión de fe -->
          <li>
            <a
              href="/confesion"
              @click="closeMenu"
              class="ease-in duration-150 block py-2 px-3 text-white rounded md:hover:bg-transparent md:hover:text-teal-400 md:p-0 md:dark:hover:text-teal-400 hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Confesión de fe
            </a>
          </li>

          <!-- Preguntas frecuentes -->
          <li>
            <a
              href="/preguntas"
              @click="closeMenu"
              class="ease-in duration-150 block py-2 px-3 text-white rounded md:hover:bg-transparent md:hover:text-teal-400 md:p-0 md:dark:hover:text-teal-400 hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              Preguntas frecuentes
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Admin Sidebar -->
  <AdminSidebar :isOpen="adminMenuVisible" @close="closeAdminMenu" />

  <!-- Componente de barra de progreso -->
  <BarraProgreso />
</template>

<script>
import BarraProgreso from "./BarraProgreso.vue";
import AdminSidebar from "./AdminSidebar.vue";
import { checkAuth } from "../middleware/auth";

export default {
  components: {
    BarraProgreso,
    AdminSidebar,
  },
  name: "MenuInicio",
  data() {
    return {
      menuVisible: false,
      conocenosVisible: false,
      adminMenuVisible: false,
      isAuthenticated: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
      document.body.classList.toggle("overflow-hidden", this.menuVisible);
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
    closeMenu() {
      this.menuVisible = false;
      document.body.classList.remove("overflow-hidden");
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
      const menu = this.$refs.navbarSticky;
      const hamburgerButton = this.$refs.hamburgerButton;
      const adminMenu = this.$el.querySelector(".relative"); // Para el menú de admin

      if (
        menu &&
        !menu.contains(event.target) &&
        !hamburgerButton.contains(event.target)
      ) {
        this.closeMenu();
      }

      if (adminMenu && !adminMenu.contains(event.target)) {
        this.closeAdminMenu();
      }
    },
    toggleConocenos() {
      this.conocenosVisible = !this.conocenosVisible;
    },
    checkAuthStatus() {
      this.isAuthenticated = checkAuth();
    },
  },
  mounted() {
    this.loadDarkModePreference();
    this.checkAuthStatus();
    document.addEventListener("click", this.handleDocumentClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
  },
};
</script>
