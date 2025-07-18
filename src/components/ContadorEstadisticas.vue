<template>
  <!-- Componente sin interfaz gráfica - Solo para debugging -->
  <div style="display: none;"></div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { auth_api } from "../lib/api.ts";

const props = defineProps({
  darkMode: {
    type: Boolean,
    default: true,
  },
});

const estadisticas = ref({
  eventos: { agregados: 0, eliminados: 0, modificados: 0 },
  fechas: { agregados: 0, eliminados: 0, modificados: 0 },
});
const userId = ref(null);

const cargarEstadisticas = () => {
  console.log("🔄 Cargando estadísticas...");

  // Obtener el usuario actual
  const currentUser = auth_api.getCurrentUser();
  userId.value = currentUser?.uid || "invitado";

  // Usar el ID de usuario para la clave de localStorage
  const contadorKey = `estadisticasContador_${userId.value}`;
  const datosGuardados = localStorage.getItem(contadorKey);

  if (datosGuardados) {
    try {
      const datos = JSON.parse(datosGuardados);
      console.log("📊 Datos cargados para usuario", userId.value, ":", datos);

      // Asegurarse de que la estructura es correcta
      if (datos.eventos && datos.fechas) {
        estadisticas.value = datos;
      }
    } catch (error) {
      console.error("❌ Error al cargar estadísticas:", error);
    }
  } else {
    console.log("📭 No se encontraron estadísticas para el usuario", userId.value);
    // Restablecer a valores predeterminados si no hay datos guardados
    estadisticas.value = {
      eventos: { agregados: 0, eliminados: 0, modificados: 0 },
      fechas: { agregados: 0, eliminados: 0, modificados: 0 },
    };
  }
};

// Reiniciar contadores
const reiniciarContadores = () => {
  console.log("🔄 Reiniciando todos los contadores...");
  estadisticas.value = {
    eventos: { agregados: 0, eliminados: 0, modificados: 0 },
    fechas: { agregados: 0, eliminados: 0, modificados: 0 },
  };

  // Guardar en localStorage con ID de usuario
  const contadorKey = `estadisticasContador_${userId.value}`;
  localStorage.setItem(contadorKey, JSON.stringify(estadisticas.value));
  console.log("✅ Contadores reiniciados para usuario", userId.value);

  // Disparar evento personalizado para notificar que las estadísticas han cambiado
  window.dispatchEvent(new CustomEvent("statisticsUpdated"));
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
    "📈 Contador actualizado para usuario",
    userId.value,
    ":",
    estadisticas.value
  );

  // Disparar evento personalizado para notificar que las estadísticas han cambiado
  window.dispatchEvent(new CustomEvent("statisticsUpdated"));
};

// Suscribirse a cambios en localStorage
const handleStorageChange = (event) => {
  if (event.key === `estadisticasContador_${userId.value}`) {
    console.log(
      "🔔 Cambio detectado en estadísticasContador para usuario",
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
    console.log("👤 Cambio de usuario detectado:", userId.value);
    cargarEstadisticas();
  }
};

// Comandos de debugging para la consola
const setupDebugCommands = () => {
  // Comando para mostrar todas las estadísticas
  window.showStats = () => {
    cargarEstadisticas();
    console.log("📊 === ESTADÍSTICAS COMPLETAS ===");
    console.log("👤 Usuario:", userId.value);
    console.log("📋 Anuncios:", estadisticas.value.eventos);
    console.log("📅 Fechas:", estadisticas.value.fechas);
    console.log("===============================");
    return estadisticas.value;
  };

  // Comando para mostrar solo estadísticas de anuncios
  window.showAnuncios = () => {
    cargarEstadisticas();
    console.log("📋 === ESTADÍSTICAS DE ANUNCIOS ===");
    console.log("✅ Agregados:", estadisticas.value.eventos.agregados);
    console.log("✏️ Modificados:", estadisticas.value.eventos.modificados);
    console.log("❌ Eliminados:", estadisticas.value.eventos.eliminados);
    console.log("=================================");
    return estadisticas.value.eventos;
  };

  // Comando para mostrar solo estadísticas de fechas
  window.showFechas = () => {
    cargarEstadisticas();
    console.log("📅 === ESTADÍSTICAS DE FECHAS ===");
    console.log("✅ Agregadas:", estadisticas.value.fechas.agregados);
    console.log("✏️ Modificadas:", estadisticas.value.fechas.modificados);
    console.log("❌ Eliminadas:", estadisticas.value.fechas.eliminados);
    console.log("===============================");
    return estadisticas.value.fechas;
  };

  // Comando para reiniciar todos los contadores
  window.resetStats = () => {
    console.log("🔄 Reiniciando estadísticas...");
    reiniciarContadores();
    console.log("✅ Estadísticas reiniciadas");
  };

  // Comando para reiniciar solo contadores de anuncios
  window.resetAnuncios = () => {
    console.log("🔄 Reiniciando contadores de anuncios...");
    estadisticas.value.eventos = { agregados: 0, eliminados: 0, modificados: 0 };
    saveEstadisticas();
    console.log("✅ Contadores de anuncios reiniciados");
  };

  // Comando para reiniciar solo contadores de fechas
  window.resetFechas = () => {
    console.log("🔄 Reiniciando contadores de fechas...");
    estadisticas.value.fechas = { agregados: 0, eliminados: 0, modificados: 0 };
    saveEstadisticas();
    console.log("✅ Contadores de fechas reiniciados");
  };

  // Comando para mostrar ayuda
  window.debugHelp = () => {
    console.log("🔧 === COMANDOS DE DEBUGGING DISPONIBLES ===");
    console.log("📊 showStats()      - Mostrar todas las estadísticas");
    console.log("📋 showAnuncios()   - Mostrar estadísticas de anuncios");
    console.log("📅 showFechas()     - Mostrar estadísticas de fechas");
    console.log("🔄 resetStats()     - Reiniciar todas las estadísticas");
    console.log("🔄 resetAnuncios()  - Reiniciar solo anuncios");
    console.log("🔄 resetFechas()    - Reiniciar solo fechas");
    console.log("❓ debugHelp()      - Mostrar esta ayuda");
    console.log("=========================================");
  };

  // Mostrar comandos disponibles al inicio
  console.log("🔧 Comandos de debugging cargados. Usa debugHelp() para ver todos los comandos.");
};

// Exponer los contadores globalmente (mantener compatibilidad)
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
  console.log("🔧 ContadorEstadisticas (Debug Mode) montado");

  // Obtener el ID de usuario actual
  const user = auth_api.getCurrentUser();
  userId.value = user?.uid || "invitado";
  console.log("👤 Usuario actual:", userId.value);

  // Cargar estadísticas iniciales
  cargarEstadisticas();

  // Configurar comandos de debugging
  setupDebugCommands();

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

  // Exponer métodos globalmente (mantener compatibilidad)
  window.getEventosAgregados = getEventosAgregados;
  window.getFechasAgregadas = getFechasAgregadas;
  window.reiniciarContadorEventos = reiniciarContadorEventos;
  window.reiniciarContadorFechas = reiniciarContadorFechas;

  // Limpiar el intervalo cuando el componente se desmonte
  onBeforeUnmount(() => {
    clearInterval(intervalo);
    window.removeEventListener("storage", handleStorageChange);
    authUnsub(); // Cancelar subscripción a cambios de auth
    
    // Limpiar funciones globales
    delete window.actualizarContadorEstadisticas;
    delete window.actualizarContador;
    delete window.getEventosAgregados;
    delete window.getFechasAgregadas;
    delete window.reiniciarContadorEventos;
    delete window.reiniciarContadorFechas;
    
    // Limpiar comandos de debugging
    delete window.showStats;
    delete window.showAnuncios;
    delete window.showFechas;
    delete window.resetStats;
    delete window.resetAnuncios;
    delete window.resetFechas;
    delete window.debugHelp;
    
    console.log("🔧 Comandos de debugging eliminados");
  });
});
</script>

<style scoped>
/* Sin estilos necesarios ya que no hay interfaz gráfica */
</style>