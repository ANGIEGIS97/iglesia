import { defineStore } from "pinia";
import { ref } from "vue";

interface Estadisticas {
  eventos: { agregados: number; eliminados: number; modificados: number };
  fechas: { agregados: number; eliminados: number; modificados: number };
}

type TipoAccion = "agregados" | "eliminados" | "modificados";

function crearVacias(): Estadisticas {
  return {
    eventos: { agregados: 0, eliminados: 0, modificados: 0 },
    fechas: { agregados: 0, eliminados: 0, modificados: 0 },
  };
}

export const useStatsStore = defineStore("stats", () => {
  const estadisticas = ref<Estadisticas>(crearVacias());
  const uid = ref("");

  function _key() {
    return `estadisticasContador_${uid.value}`;
  }

  function _cargarDesdeStorage() {
    const raw = localStorage.getItem(_key());
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.eventos && parsed.fechas) estadisticas.value = parsed;
    } catch { /* mantener valores actuales */ }
  }

  function cargar(userId: string) {
    uid.value = userId;
    _cargarDesdeStorage();
  }

  // Copia exacta del comportamiento de ContadorEstadisticas.actualizarContador:
  // recarga desde localStorage antes de incrementar para evitar race conditions
  function incrementar(tipo: string, accion: TipoAccion) {
    if (!uid.value) return;
    _cargarDesdeStorage();

    const key = (tipo === "evento" || tipo === "eventos") ? "eventos" : "fechas";
    estadisticas.value[key][accion] = (estadisticas.value[key][accion] || 0) + 1;

    localStorage.setItem(_key(), JSON.stringify(estadisticas.value));
    window.dispatchEvent(new CustomEvent("statisticsUpdated"));
  }

  function reiniciar() {
    estadisticas.value = crearVacias();
    if (uid.value) {
      localStorage.setItem(_key(), JSON.stringify(estadisticas.value));
      window.dispatchEvent(new CustomEvent("statisticsUpdated"));
    }
  }

  return { estadisticas, uid, cargar, incrementar, reiniciar };
});
