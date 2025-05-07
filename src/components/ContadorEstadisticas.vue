<template>
  <div>
    <!-- Botón para abrir/cerrar estadísticas en estilo de navegación -->
    <a
      @click.prevent="toggleEstadisticas"
      :class="[
        'flex items-center px-4 py-[10px] rounded-lg transition-all duration-200 border-l-4 w-full',
        showEstadisticas
          ? isDarkMode
            ? 'bg-teal-500/20 text-teal-400 border-teal-500'
            : 'bg-teal-50 text-teal-600 border-teal-500'
          : isDarkMode
          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white border-transparent'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-transparent',
      ]"
    >
      <i
        class="fas fa-chart-bar w-5 h-5 mr-3"
        :class="
          showEstadisticas
            ? isDarkMode
              ? 'text-teal-400'
              : 'text-teal-600'
            : ''
        "
      ></i>
      <span>Estadísticas</span>
      <i
        class="fas ml-auto transition-transform duration-200"
        :class="[
          showEstadisticas ? 'fa-chevron-up' : 'fa-chevron-down',
          showEstadisticas
            ? isDarkMode
              ? 'text-teal-400'
              : 'text-teal-600'
            : isDarkMode
            ? 'text-gray-300'
            : 'text-gray-700',
        ]"
      ></i>
    </a>

    <!-- Contenido de las estadísticas -->
    <div v-if="showEstadisticas" class="mt-2 mb-2">
      <div
        class="rounded-lg border"
        :class="
          isDarkMode
            ? 'bg-gray-700/30 border-gray-600/50'
            : 'bg-white border-gray-200'
        "
      >
        <!-- Tabs -->
        <div class="flex items-center justify-between">
          <div class="flex w-full">
            <button
              @click="activeTab = 'eventos'"
              :class="[
                'py-2 px-4 text-sm font-medium transition-colors duration-200 w-1/2 text-center',
                activeTab === 'eventos'
                  ? isDarkMode
                    ? 'border-b-2 border-teal-400 text-teal-400'
                    : 'border-b-2 border-teal-600 text-teal-600'
                  : isDarkMode
                  ? [
                      'text-gray-400 hover:text-gray-300 border-b-2 border-gray-600 border-opacity-50',
                    ]
                  : [
                      'text-gray-500 hover:text-gray-700 border-b-2 border-gray-200',
                    ],
              ]"
            >
              Anuncios
            </button>
            <button
              @click="activeTab = 'fechas'"
              :class="[
                'py-2 px-4 text-sm font-medium transition-colors duration-200 w-1/2 text-center',
                activeTab === 'fechas'
                  ? isDarkMode
                    ? 'border-b-2 border-teal-400 text-teal-400'
                    : 'border-b-2 border-teal-600 text-teal-600'
                  : isDarkMode
                  ? [
                      'text-gray-400 hover:text-gray-300 border-b-2 border-gray-600 border-opacity-50',
                    ]
                  : [
                      'text-gray-500 hover:text-gray-700 border-b-2 border-gray-200',
                    ],
              ]"
            >
              Fechas
            </button>
          </div>
          <button
            v-if="showResetButton"
            @click="reiniciarContadores"
            class="p-1.5 rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            :title="'Reiniciar contadores'"
          >
            <svg
              class="w-4 h-4"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="p-2">
          <!-- Eventos Tab -->
          <div v-if="activeTab === 'eventos'" class="space-y-1">
            <div class="grid grid-cols-3 gap-2">
              <div
                class="p-2 rounded-lg text-center cursor-pointer"
                :class="isDarkMode ? 'bg-green-800/40' : 'bg-green-100'"
                @click="handleStatClick('agregados')"
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
                class="p-2 rounded-lg text-center cursor-pointer"
                :class="isDarkMode ? 'bg-yellow-800/40' : 'bg-yellow-100'"
                @click="handleStatClick('modificados')"
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
                class="p-2 rounded-lg text-center cursor-pointer"
                :class="isDarkMode ? 'bg-red-800/40' : 'bg-red-100'"
                @click="handleStatClick('eliminados')"
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
const activeTab = ref("eventos"); // Default active tab
const showResetButton = ref(false); // Estado para mostrar/ocultar el botón
const clickSequence = ref([]); // Array para guardar la secuencia de clicks

const estadisticas = ref({
  eventos: { agregados: 0, eliminados: 0, modificados: 0 },
  fechas: { agregados: 0, eliminados: 0, modificados: 0 },
});
const userId = ref(null);

// Función para manejar los clicks en las estadísticas
const handleStatClick = (tipo) => {
  clickSequence.value.push(tipo);

  // Verificar si la secuencia es correcta: agregados -> modificados -> eliminados
  if (clickSequence.value.length === 3) {
    if (
      clickSequence.value[0] === "agregados" &&
      clickSequence.value[1] === "modificados" &&
      clickSequence.value[2] === "eliminados"
    ) {
      showResetButton.value = true;
    }
    // Reiniciar la secuencia después de 3 clicks
    clickSequence.value = [];
  }
};

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

    // Ocultar el botón después de reiniciar
    showResetButton.value = false;
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

// Exponer los contadores globalmente
const getEventosAgregados = () => estadisticas.value.eventos.agregados;
const getFechasAgregadas = () => estadisticas.value.fechas.agregados;

// Exponer funciones para reiniciar contadores específicos
const reiniciarContadorEventos = () => {
  estadisticas.value.eventos = { agregados: 0, eliminados: 0, modificados: 0 };
  saveEstadisticas();
};

const reiniciarContadorFechas = () => {
  estadisticas.value.fechas = { agregados: 0, eliminados: 0, modificados: 0 };
  saveEstadisticas();
};

// Función auxiliar para guardar estadísticas
const saveEstadisticas = () => {
  const contadorKey = `estadisticasContador_${userId.value}`;
  localStorage.setItem(contadorKey, JSON.stringify(estadisticas.value));
  window.dispatchEvent(new CustomEvent("statisticsUpdated"));
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

  // Exponer métodos globalmente
  window.getEventosAgregados = getEventosAgregados;
  window.getFechasAgregadas = getFechasAgregadas;
  window.reiniciarContadorEventos = reiniciarContadorEventos;
  window.reiniciarContadorFechas = reiniciarContadorFechas;

  // Limpiar el intervalo cuando el componente se desmonte
  onBeforeUnmount(() => {
    clearInterval(intervalo);
    window.removeEventListener("storage", handleStorageChange);
    authUnsub(); // Cancelar subscripción a cambios de auth
    delete window.actualizarContadorEstadisticas;
    delete window.actualizarContador;
    // Limpiar métodos globales
    delete window.getEventosAgregados;
    delete window.getFechasAgregadas;
    delete window.reiniciarContadorEventos;
    delete window.reiniciarContadorFechas;
  });
});
</script>
