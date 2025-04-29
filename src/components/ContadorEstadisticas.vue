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
      <!-- Eventos -->
      <div class="space-y-1">
        <h3
          class="text-sm font-semibold"
          :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          Eventos
        </h3>
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
              class="text-xs"
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
              class="text-xs"
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
              class="text-xs"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
            >
              Eliminados
            </div>
          </div>
        </div>
      </div>

      <!-- Fechas -->
      <div class="space-y-1">
        <h3
          class="text-sm font-semibold"
          :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'"
        >
          Fechas
        </h3>
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
              class="text-xs"
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
              class="text-xs"
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
              class="text-xs"
              :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'"
            >
              Eliminadas
            </div>
          </div>
        </div>
      </div>

      <!-- Botón para reiniciar contadores -->
      <div class="flex justify-end mt-3">
        <button
          @click="reiniciarContadores"
          class="text-xs px-2 py-1 rounded"
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

const props = defineProps({
  darkMode: {
    type: Boolean,
    default: true,
  },
});

const isDarkMode = computed(() => props.darkMode);
const showEstadisticas = ref(false);
const estadisticas = ref({
  eventos: { agregados: 0, eliminados: 0, modificados: 0 },
  fechas: { agregados: 0, eliminados: 0, modificados: 0 },
});

// Cargar estadísticas desde localStorage
const cargarEstadisticas = () => {
  console.log("Cargando estadísticas...");
  const contadorKey = "estadisticasContador";
  const datosGuardados = localStorage.getItem(contadorKey);

  if (datosGuardados) {
    try {
      const datos = JSON.parse(datosGuardados);
      console.log("Datos cargados:", datos);

      // Asegurarse de que la estructura es correcta
      if (datos.eventos && datos.fechas) {
        estadisticas.value = datos;
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  }
};

// Reiniciar contadores
const reiniciarContadores = () => {
  if (confirm("¿Estás seguro de que deseas reiniciar todos los contadores?")) {
    estadisticas.value = {
      eventos: { agregados: 0, eliminados: 0, modificados: 0 },
      fechas: { agregados: 0, eliminados: 0, modificados: 0 },
    };

    // Guardar en localStorage
    localStorage.setItem(
      "estadisticasContador",
      JSON.stringify(estadisticas.value)
    );
    console.log("Contadores reiniciados");
  }
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
  if (event.key === "estadisticasContador") {
    console.log("Cambio detectado en estadisticasContador");
    cargarEstadisticas();
  }
};

onMounted(() => {
  console.log("ContadorEstadisticas montado");
  cargarEstadisticas();

  // Escuchar cambios en localStorage de otras pestañas
  window.addEventListener("storage", handleStorageChange);

  // También establecer un intervalo para verificar cambios en la misma pestaña
  const intervalo = setInterval(cargarEstadisticas, 5000);

  // Exponer función para forzar la actualización
  window.actualizarContadorEstadisticas = cargarEstadisticas;

  // Limpiar el intervalo cuando el componente se desmonte
  onBeforeUnmount(() => {
    clearInterval(intervalo);
    window.removeEventListener("storage", handleStorageChange);
    delete window.actualizarContadorEstadisticas;
  });
});
</script>
