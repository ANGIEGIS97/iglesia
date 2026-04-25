<template>
  <!-- Barra de navegación principal -->
  <nav
    class="bg-gray-800 fixed w-full z-50 top-0 inset-s-0 border-b border-gray-600 navbar selection:bg-teal-500 selection:text-white"
    style="list-style-type: none"
  >
    <!-- Contenedor principal de la barra de navegación -->
    <div
      class="max-w-(--breakpoint-xl) flex flex-wrap items-center justify-between mx-auto p-2"
    >
      <!-- Logo y nombre de la iglesia -->
      <a
        href="/"
        class="flex items-center space-x-3 rtl:space-x-reverse relative overflow-hidden rounded-lg"
      >
        <div class="relative">
          <img src="/logoiglesia2.webp" class="h-14" alt="Logo iglesia" />
        </div>
      </a>

      <!-- Menú de navegación (visible solo en desktop) -->
      <div class="hidden lg:flex items-center justify-between grow">
        <div class="relative p-[2px] rounded-lg mx-auto">
          <div class="bg-gray-800 md:bg-transparent rounded-lg">
            <ul
              class="flex font-medium space-x-8 rtl:space-x-reverse nav-menu px-4 py-2"
            >
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

              <!-- Menú desplegable de Conócenos -->
              <li class="relative">
                <button
                  @click.stop="toggleConocenosMenu"
                  class="flex items-center ease-in duration-150 text-white hover:text-teal-400"
                >
                  Conócenos
                  <svg
                    class="w-4 h-4 ml-2 transition-transform duration-200"
                    :class="{ 'rotate-180': isConocenosOpen }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  v-show="isConocenosOpen"
                  class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-50 dropdown-menu border border-white"
                  style="top: calc(100% + 8px)"
                >
                  <div
                    class="absolute top-[-9px] left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-gray-800"
                  >
                    <div
                      class="absolute inset-0 border-l border-t border-white"
                    ></div>
                  </div>
                  <a
                    href="/#pastor"
                    class="block px-4 py-2 text-white hover:bg-gray-700 hover:text-teal-400 transition-colors duration-200 mt-1"
                    @click="closeConocenosMenu"
                  >
                    Pastor
                  </a>
                  <a
                    href="/#servicio"
                    class="block px-4 py-2 text-white hover:bg-gray-700 hover:text-teal-400 transition-colors duration-200"
                    @click="closeConocenosMenu"
                  >
                    Servicios
                  </a>
                  <a
                    href="/#ministerios"
                    class="block px-4 py-2 text-white hover:bg-gray-700 hover:text-teal-400 transition-colors duration-200"
                    @click="closeConocenosMenu"
                  >
                    Ministerios
                  </a>
                </div>
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

              <li>
                <a
                  href="/donaciones"
                  class="ease-in duration-150 text-white hover:text-teal-400"
                >
                  Donaciones
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
              :class="{ 'fill-current': adminMenuVisible }"
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

        <!-- Botón de hamburguesa (visible solo en móvil y tablet) -->
        <button
          @click="toggleMenu"
          class="h-10 w-10 rounded-lg p-2 hover:bg-gray-700 flex lg:hidden items-center justify-center relative group"
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

  <!-- Overlay para cerrar el menú al hacer clic fuera -->
  <div
    v-if="isMenuOpen"
    class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    @click="closeMenu"
  ></div>

  <!-- Menú móvil -->
  <div
    v-show="isMenuOpen"
    class="fixed top-[72px] left-0 right-0 z-40 animate__animated lg:hidden p-4 bg-gray-800"
    :class="{
      animate__slideInDown: isMenuOpen && !isClosing,
      animate__slideOutUp: isClosing,
    }"
    @animationend="handleAnimationEnd"
  >
    <div
      class="relative p-[2px] rounded-lg shadow-xl sm:shadow-none bg-gray-100 dark:bg-linear-to-r dark:from-teal-500 dark:to-blue-500 dark:animate-gradient"
    >
      <div class="bg-gray-800/90 backdrop-blur-sm rounded-lg">
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
  <AdminSidebar
    :isOpen="adminMenuVisible"
    :darkMode="isDark"
    @close="closeAdminMenu"
    ref="adminSidebarRef"
  />

  <!-- Componente de barra de progreso -->
  <BarraProgreso />

  <!-- Login Form -->
  <LoginForm ref="loginFormRef" @login-success="handleLoginSuccess" />
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import BarraProgreso from "./BarraProgreso.vue";
import AdminSidebar from "./AdminSidebar.vue";
import LoginForm from "./panel/LoginForm.vue";
import { checkAuth } from "../middleware/auth";
import { useDarkMode } from "../composables/useDarkMode";
import "animate.css";

const { isDark, toggle: darkToggle, load: darkLoad } = useDarkMode();

const adminMenuVisible = ref(false);
const isAuthenticated = ref(false);
const activeSection = ref("");
const currentPath = ref("");
const isMenuOpen = ref(false);
const isClosing = ref(false);
const isConocenosOpen = ref(false);
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

const adminSidebarRef = ref<InstanceType<typeof AdminSidebar> | null>(null);
const loginFormRef = ref<InstanceType<typeof LoginForm> | null>(null);

const menuItems = [
  { href: "/#inicio", text: "Inicio" },
  { href: "/#anuncios", text: "Anuncios y Eventos" },
  { href: "/#pastor", text: "Pastor" },
  { href: "/#servicio", text: "Servicios" },
  { href: "/#ministerios", text: "Ministerios" },
  { href: "/confesion", text: "Confesión de fe" },
  { href: "/preguntas", text: "Preguntas frecuentes" },
  { href: "/donaciones", text: "Donaciones" },
];

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  isClosing.value = false;
  document.body.style.overflow = isMenuOpen.value ? "hidden" : "auto";
}

function closeMenu() {
  if (isMenuOpen.value) {
    isClosing.value = true;
    document.body.style.overflow = "auto";
  }
  adminMenuVisible.value = false;
  isConocenosOpen.value = false;
}

function handleAnimationEnd() {
  if (isClosing.value) {
    isMenuOpen.value = false;
    isClosing.value = false;
    document.body.style.overflow = "auto";
  }
}

function toggleDarkMode() {
  darkToggle();
  if (isAuthenticated.value) {
    nextTick(() => {
      const logros = (adminSidebarRef.value as any)?.$refs?.logrosRef;
      if (logros) logros.unlockAchievement(2);
    });
  }
}

function toggleAdminMenu() {
  adminMenuVisible.value = !adminMenuVisible.value;
}

function closeAdminMenu() {
  adminMenuVisible.value = false;
}

function handleDocumentClick(event: MouseEvent) {
  const conocenosButton = document.querySelector(".nav-menu button");
  const dropdownMenu = document.querySelector(".dropdown-menu");
  if (
    conocenosButton &&
    dropdownMenu &&
    !conocenosButton.contains(event.target as Node) &&
    !dropdownMenu.contains(event.target as Node)
  ) {
    isConocenosOpen.value = false;
  }
}

function checkAuthStatus() {
  isAuthenticated.value = checkAuth();
}

function handleScroll() {
  if (currentPath.value !== "/") return;
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const sections = ["inicio", "anuncios", "pastor", "servicio", "ministerios"];
    const scrollPosition = window.scrollY + 100;
    let current = "";
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
        current = id;
      }
    });
    if (current && current !== activeSection.value) {
      activeSection.value = current;
      updateScrollBasedLinks();
    }
  }, 16);
}

function updateScrollBasedLinks() {
  document.querySelectorAll<HTMLAnchorElement>('.nav-menu a[href^="/#"]').forEach((link) => {
    const href = link.getAttribute("href")!.substring(2);
    link.classList.toggle("text-teal-400", href === activeSection.value);
    link.classList.toggle("text-white", href !== activeSection.value);
  });
}

function updateActiveLink() {
  document.querySelectorAll<HTMLAnchorElement>(".nav-menu a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    let isActive = false;
    if (!href.startsWith("/#")) {
      const normHref = href.endsWith("/") ? href.slice(0, -1) : href;
      const normPath = currentPath.value.endsWith("/") ? currentPath.value.slice(0, -1) : currentPath.value;
      isActive =
        normHref === normPath ||
        href === currentPath.value ||
        href + "/" === currentPath.value ||
        href === currentPath.value + "/";
    } else if (href === "/" || href === "/#inicio") {
      isActive = currentPath.value === "/";
    }
    link.classList.toggle("text-teal-400", isActive);
    link.classList.toggle("text-white", !isActive);
  });
  if (currentPath.value === "/") nextTick(handleScroll);
}

function updateCurrentPath() {
  const newPath = window.location.pathname;
  if (newPath !== currentPath.value) {
    currentPath.value = newPath;
    if (currentPath.value !== "/") activeSection.value = "";
    updateActiveLink();
  }
}

function handleLoginSuccess() {
  checkAuthStatus();
  closeMenu();
}

function openLoginModal() {
  (loginFormRef.value as any)?.openModal();
}

function toggleConocenosMenu() {
  isConocenosOpen.value = !isConocenosOpen.value;
}

function closeConocenosMenu() {
  isConocenosOpen.value = false;
}

onMounted(() => {
  darkLoad();
  checkAuthStatus();
  document.body.addEventListener("click", handleDocumentClick);
  updateCurrentPath();
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("popstate", updateCurrentPath);
  if (currentPath.value === "/") nextTick(handleScroll);
});

onBeforeUnmount(() => {
  document.body.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("popstate", updateCurrentPath);
  document.body.style.overflow = "";
  if (scrollTimeout) clearTimeout(scrollTimeout);
});
</script>

<style scoped>
.nav-menu a {
  transition: color 0.3s ease;
}

/* Estilos para el menú desplegable */
.nav-menu .relative > div {
  transform-origin: top;
  transition: all 0.3s ease;
}

.nav-menu button {
  cursor: pointer;
}

.nav-menu .relative > div a {
  transition: all 0.2s ease;
}

.nav-menu .relative > div a:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
  --nav-height: 72px;
  transition: background-color 0.3s ease;
}

body {
  padding-top: var(--nav-height);
}

.animate__animated {
  --animate-duration: 0.3s;
}

.dark .dark\:animate-gradient {
  background-size: 200% 200%;
  animation: gradient 6s ease infinite;
}

/* Estilos para el menú desplegable */
.dropdown-menu {
  position: absolute;
  min-width: 200px;
}

.dropdown-menu::before {
  content: "";
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 9px 9px 9px;
  border-style: solid;
  border-color: transparent transparent white transparent;
  z-index: 1;
}

.dropdown-menu::after {
  content: "";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 8px 8px 8px;
  border-style: solid;
  border-color: transparent transparent #1f2937 transparent;
  z-index: 2;
}

/* Ajuste para el triángulo decorativo */
.dropdown-menu > div:first-child {
  overflow: visible;
  z-index: 3;
}
</style>
