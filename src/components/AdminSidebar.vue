<template>
  <div>
    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50',
        'transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
            Administración
          </h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              class="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Perfil del Usuario -->
        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg"
              :style="{ backgroundColor: getUserColor(displayName) }"
            >
              {{ getUserInitial(displayName) }}
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ displayName || "Usuario" }}
              </h3>
              <button
                @click="openProfileModal"
                class="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
              >
                Editar perfil
              </button>
            </div>
          </div>
        </div>

        <nav class="space-y-2">
          <a
            href="/admin/eventos"
            @click.prevent="handleNavigation('/admin/eventos')"
            :class="[
              'flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700',
              currentPath === '/admin/eventos'
                ? 'text-teal-500 dark:text-teal-400'
                : 'text-gray-700 dark:text-gray-200',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              :stroke="
                currentPath === '/admin/eventos'
                  ? 'rgb(20 184 166)'
                  : 'currentColor'
              "
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Administrar Anuncios
          </a>

          <a
            href="/admin/fechas"
            @click.prevent="handleNavigation('/admin/fechas')"
            :class="[
              'flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700',
              currentPath === '/admin/fechas'
                ? 'text-teal-500 dark:text-teal-400'
                : 'text-gray-700 dark:text-gray-200',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              :stroke="
                currentPath === '/admin/fechas'
                  ? 'rgb(20 184 166)'
                  : 'currentColor'
              "
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Administrar Fechas
          </a>

          <button
            @click="openChangePassword"
            :class="[
              'flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left',
              'text-gray-700 dark:text-gray-200',
            ]"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            Cambiar Contraseña
          </button>

          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              class="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </div>

    <!-- Modal de Cambio de Contraseña -->
    <CambioContrasena ref="cambioContrasenaRef" />

    <!-- Modal de Perfil -->
    <ProfileModal
      :is-open="showProfileModal"
      :current-display-name="displayName"
      @close="showProfileModal = false"
      @update="handleProfileUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import CambioContrasena from "./CambioContrasena.vue";
import ProfileModal from "./ProfileModal.vue";
import { auth_api, usuarios } from "../lib/api.ts";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const currentPath = ref("");
const cambioContrasenaRef = ref(null);
const displayName = ref("");
const showProfileModal = ref(false);
let unsubscribeAuth = null;
let unsubscribeProfile = null;

// Función para obtener la inicial del nombre de usuario
const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

// Función para generar un color basado en el nombre de usuario
const getUserColor = (name) => {
  const colors = [
    "#2196F3", // Azul
    "#4CAF50", // Verde
    "#F44336", // Rojo
    "#9C27B0", // Púrpura
    "#FF9800", // Naranja
    "#009688", // Verde azulado
    "#E91E63", // Rosa
    "#673AB7", // Violeta
  ];

  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const openProfileModal = () => {
  showProfileModal.value = true;
  emit("close");
};

const handleProfileUpdate = (newDisplayName) => {
  displayName.value = newDisplayName;
};

const handleNavigation = (path) => {
  emit("close");
  window.location.href = path;
};

const handleLogout = async () => {
  try {
    await auth_api.logout();
    // Redirigir a la página de despedida después del logout exitoso
    window.location.replace("/logout");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // En caso de error, forzar la redirección de todas formas
    window.location.replace("/logout");
  }
};

const openChangePassword = () => {
  cambioContrasenaRef.value?.openModal();
  emit("close");
};

const updateCurrentPath = () => {
  currentPath.value = window.location.pathname;
};

const updateUserProfile = async () => {
  const user = auth_api.getCurrentUser();
  if (user?.uid) {
    try {
      // Obtener perfil inicial
      const profile = await usuarios.getById(user.uid);
      displayName.value = profile.data.displayName || "";

      // Limpiar suscripción anterior si existe
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }

      // Suscribirse a cambios en el perfil
      unsubscribeProfile = usuarios.subscribeToProfile(user.uid, (profile) => {
        displayName.value = profile.displayName || "";
      });
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
    }
  } else {
    displayName.value = "";
    if (unsubscribeProfile) {
      unsubscribeProfile();
      unsubscribeProfile = null;
    }
  }
};

onMounted(async () => {
  updateCurrentPath();
  window.addEventListener("popstate", updateCurrentPath);

  // Cargar perfil inicial
  await updateUserProfile();

  // Suscribirse a cambios de autenticación
  unsubscribeAuth = auth_api.onAuthStateChange(async (user) => {
    if (user) {
      await updateUserProfile();
    } else {
      displayName.value = "";
      // Limpiar la suscripción del perfil si existe
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", updateCurrentPath);
  // Limpiar todas las suscripciones
  if (unsubscribeAuth) {
    unsubscribeAuth();
    unsubscribeAuth = null;
  }
  if (unsubscribeProfile) {
    unsubscribeProfile();
    unsubscribeProfile = null;
  }
});
</script>

<style scoped>
a {
  transition: color 0.3s ease;
}
</style>
