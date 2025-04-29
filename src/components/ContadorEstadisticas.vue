<template>
  <div
    :class="[
      'p-3 rounded-lg border',
      isDarkMode
        ? 'bg-gray-700/30 border-gray-600/50'
        : 'bg-white border-gray-200',
    ]"
  >
    <button
      @click="toggleEstadisticas"
      class="w-full text-sm font-semibold mb-2 flex items-center justify-between"
      :class="isDarkMode ? 'text-teal-400' : 'text-teal-600'"
    >
      <div class="flex items-center">
        <span class="mr-1">📊</span> Estadísticas
      </div>
      <svg
        class="w-4 h-4 transition-transform"
        :class="showEstadisticas ? 'rotate-180' : ''"
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

    <div v-if="showEstadisticas" class="mt-2 space-y-3">
      <!-- Tabs -->
      <div class="flex border-b" :class="isDarkMode ? 'border-gray-600' : 'border-gray-200'">
        <button 
          @click="activeTab = 'eventos'" 
          class="py-2 px-4 text-sm font-medium transition-colors duration-200"
          :class="[
            activeTab === 'eventos' 
              ? isDarkMode 
                ? 'border-b-2 border-teal-400 text-teal-400' 
                : 'border-b-2 border-teal-600 text-teal-600'
              : isDarkMode 
                ? 'text-gray-400 hover:text-gray-300' 
                : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          Anuncios
        </button>
        <button 
          @click="activeTab = 'fechas'" 
          class="py-2 px-4 text-sm font-medium transition-colors duration-200"
          :class="[
            activeTab === 'fechas' 
              ? isDarkMode 
                ? 'border-b-2 border-teal-400 text-teal-400' 
                : 'border-b-2 border-teal-600 text-teal-600'
              : isDarkMode 
                ? 'text-gray-400 hover:text-gray-300' 
                : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          Fechas
        </button>
      </div>

      <!-- Tab Content -->
      <div class="mt-3">
        <!-- Eventos Tab -->
        <div v-if="activeTab === 'eventos'" class="space-y-1">
          <div class="grid grid-cols-3 gap-2">
            <div
              class="p-2 rounded-lg text-center"
              :class="isDarkMode ? 'bg-green-800/40' : 'bg-green-100'"
            >
              <div
                class="text-xl font-bold"
                :class="isDarkMode ? 'text-green-400' : 'text-green-700'"
              >
                {{ estadisticas.eventos.agregados }}
              </div>
              <div
                class="text-[10px]"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
              >
                Agregados
              </div>
            </div>
            <div
              class="p-2 rounded-lg text-center"
              :class="isDarkMode ? 'bg-yellow-800/40' : 'bg-yellow-100'"
            >
              <div
                class="text-xl font-bold"
                :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-700'"
              >
                {{ estadisticas.eventos.modificados }}
              </div>
              <div
                class="text-[10px]"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
              >
                Modificados
              </div>
            </div>
            <div
              class="p-2 rounded-lg text-center"
              :class="isDarkMode ? 'bg-red-800/40' : 'bg-red-100'"
            >
              <div
                class="text-xl font-bold"
                :class="isDarkMode ? 'text-red-400' : 'text-red-700'"
              >
                {{ estadisticas.eventos.eliminados }}
              </div>
              <div
                class="text-[10px]"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
              >
                Eliminados
              </div>
            </div>
          </div>
        </div>

        <!-- Fechas Tab -->
        <div v-if="activeTab === 'fechas'" class="space-y-1">
          <div class="grid grid-cols-3 gap-2">
            <div
              class="p-2 rounded-lg text-center"
              :class="isDarkMode ? 'bg-green-800/40' : 'bg-green-100'"
            >
              <div
                class="text-xl font-bold"
                :class="isDarkMode ? 'text-green-400' : 'text-green-700'"
              >
                {{ estadisticas.fechas.agregados }}
              </div>
              <div
                class="text-[10px]"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
              >
                Agregadas
              </div>
            </div>
            <div
              class="p-2 rounded-lg text-center"
              :class="isDarkMode ? 'bg-yellow-800/40' : 'bg-yellow-100'"
            >
              <div
                class="text-xl font-bold"
                :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-700'"
              >
                {{ estadisticas.fechas.modificados }}
              </div>
              <div
                class="text-[10px]"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
              >
                Modificadas
              </div>
            </div>
            <div
              class="p-2 rounded-lg text-center"
              :class="isDarkMode ? 'bg-red-800/40' : 'bg-red-100'"
            >
              <div
                class="text-xl font-bold"
                :class="isDarkMode ? 'text-red-400' : 'text-red-700'"
              >
                {{ estadisticas.fechas.eliminados }}
              </div>
              <div
                class="text-[10px]"
                :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
              >
                Eliminadas
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón para reiniciar contadores -->
      <div class="flex justify-end mt-3">
        <button
          @click="reiniciarContadores"
          class="text-[10px] px-2 py-1 rounded"
          :class="
            isDarkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
        >
          Reiniciar contadores
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
import { auth_api } from "../lib/api.ts";

const props = defineProps({
  darkMode: {
    type: Boolean,
    default: true,
  },
});

const isDarkMode = computed(() => props.darkMode);
const showEstadisticas = ref(false);
const activeTab = ref('eventos'); // Default active tab
const estadisticas = ref({
  eventos: { agregados: 0, eliminados: 0, modificados: 0 },
  fechas: { agregados: 0, eliminados: 0, modificados: 0 },
});
const userId = ref(null);

// Cargar estadísticas desde localStorage con ID de usuario
const cargarEstadisticas = () => {
  console.log("Cargando estadísticas...");

  // Obtener el usuario actual
  const currentUser = auth_api.getCurrentUser();
  userId.value = currentUser?.uid || "invitado";

  // Usar el ID de usuario para la clave de localStorage
  const contadorKey = `estadisticasContador_${userId.value}`;
  const datosGuardados = localStorage.getItem(contadorKey);

  if (datosGuardados) {
    try {
      const datos = JSON.parse(datosGuardados);
      console.log("Datos cargados para usuario", userId.value, ":", datos);

      // Asegurarse de que la estructura es correcta
      if (datos.eventos && datos.fechas) {
        estadisticas.value = datos;
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  } else {
    console.log("No se encontraron estadísticas para el usuario", userId.value);
    // Restablecer a valores predeterminados si no hay datos guardados
    estadisticas.value = {
      eventos: { agregados: 0, eliminados: 0, modificados: 0 },
      fechas: { agregados: 0, eliminados: 0, modificados: 0 },
    };
  }
};

// Reiniciar contadores
const reiniciarContadores = () => {
  if (confirm("¿Estás seguro de que deseas reiniciar todos los contadores?")) {
    estadisticas.value = {
      eventos: { agregados: 0, eliminados: 0, modificados: 0 },
      fechas: { agregados: 0, eliminados: 0, modificados: 0 },
    };

    // Guardar en localStorage con ID de usuario
    const contadorKey = `estadisticasContador_${userId.value}`;
    localStorage.setItem(contadorKey, JSON.stringify(estadisticas.value));
    console.log("Contadores reiniciados para usuario", userId.value);

    // Disparar evento personalizado para notificar que las estadísticas han cambiado
    window.dispatchEvent(new CustomEvent("statisticsUpdated"));
  }
};

// Actualizar contadores desde componentes externos
const actualizarContador = (tipo, accion) => {
  // Cargar la versión más reciente antes de actualizar
  cargarEstadisticas();

  // Ahora actualizar el contador específico
  if (tipo === "evento" || tipo === "eventos") {
    estadisticas.value.eventos[accion] =
      (estadisticas.value.eventos[accion] || 0) + 1;
  } else if (tipo === "fecha" || tipo === "fechas") {
    estadisticas.value.fechas[accion] =
      (estadisticas.value.fechas[accion] || 0) + 1;
  }

  // Guardar los cambios
  const contadorKey = `estadisticasContador_${userId.value}`;
  localStorage.setItem(contadorKey, JSON.stringify(estadisticas.value));
  console.log(
    "Contador actualizado para usuario",
    userId.value,
    ":",
    estadisticas.value
  );

  // Disparar evento personalizado para notificar que las estadísticas han cambiado
  window.dispatchEvent(new CustomEvent("statisticsUpdated"));
};

// Toggle para mostrar/ocultar las estadísticas
const toggleEstadisticas = () => {
  showEstadisticas.value = !showEstadisticas.value;
  if (showEstadisticas.value) {
    cargarEstadisticas();
  }
};

// Suscribirse a cambios en localStorage
const handleStorageChange = (event) => {
  if (event.key === `estadisticasContador_${userId.value}`) {
    console.log(
      "Cambio detectado en estadísticasContador para usuario",
      userId.value
    );
    cargarEstadisticas();
  }
};

// Suscribirse a cambios de autenticación
const handleAuthChange = (user) => {
  const newUserId = user?.uid || "invitado";
  if (userId.value !== newUserId) {
    userId.value = newUserId;
    console.log("Cambio de usuario detectado:", userId.value);
    cargarEstadisticas();
  }
};

onMounted(() => {
  console.log("ContadorEstadisticas montado");

  // Obtener el ID de usuario actual
  const user = auth_api.getCurrentUser();
  userId.value = user?.uid || "invitado";
  console.log("Usuario actual:", userId.value);

  // Cargar estadísticas iniciales
  cargarEstadisticas();

  // Escuchar cambios en localStorage de otras pestañas
  window.addEventListener("storage", handleStorageChange);

  // Escuchar cambios de autenticación
  const authUnsub = auth_api.onAuthStateChange(handleAuthChange);

  // También establecer un intervalo para verificar cambios en la misma pestaña
  const intervalo = setInterval(cargarEstadisticas, 5000);

  // Exponer función para forzar la actualización
  window.actualizarContadorEstadisticas = cargarEstadisticas;

  // Exponer función para actualizar contadores desde otros componentes
  window.actualizarContador = actualizarContador;

  // Limpiar el intervalo cuando el componente se desmonte
  onBeforeUnmount(() => {
    clearInterval(intervalo);
    window.removeEventListener("storage", handleStorageChange);
    authUnsub(); // Cancelar subscripción a cambios de auth
    delete window.actualizarContadorEstadisticas;
    delete window.actualizarContador;
  });
});
</script>