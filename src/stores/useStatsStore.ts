import { defineStore } from "pinia";
import { ref } from "vue";
import { auth_api } from "../lib/api";
import { storage } from "../lib/storage";
import { publish } from "../lib/eventBus";

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
  let unsubscribeAuth: (() => void) | null = null;

  function _cargarDesdeStorage() {
    if (!uid.value) return;
    const stored = storage.stats.get(uid.value);
    if (stored && stored.eventos && stored.fechas) {
      estadisticas.value = stored;
    }
  }

  function cargar(userId: string) {
    uid.value = userId;
    _cargarDesdeStorage();
  }

  // Recarga desde localStorage antes de incrementar para evitar race conditions
  // entre islands de Astro que comparten datos vía localStorage.
  function incrementar(tipo: string, accion: TipoAccion) {
    if (!uid.value) return;
    _cargarDesdeStorage();

    const key = (tipo === "evento" || tipo === "eventos") ? "eventos" : "fechas";
    estadisticas.value[key][accion] = (estadisticas.value[key][accion] || 0) + 1;

    storage.stats.set(uid.value, estadisticas.value);
    publish("statisticsUpdated", undefined);
  }

  function reiniciar() {
    estadisticas.value = crearVacias();
    if (uid.value) {
      storage.stats.set(uid.value, estadisticas.value);
      publish("statisticsUpdated", undefined);
    }
  }

  function dispose() {
    unsubscribeAuth?.();
    unsubscribeAuth = null;
  }

  if (typeof window !== "undefined" && !unsubscribeAuth) {
    unsubscribeAuth = auth_api.onAuthStateChange((user: any) => {
      cargar(user?.uid || "invitado");
    });
  }

  if (import.meta.env.DEV && typeof window !== "undefined") {
    import("../lib/debug/statsDebug").then(({ installStatsDebug }) => {
      installStatsDebug({
        get estadisticas() { return estadisticas.value; },
        get uid() { return uid.value; },
        cargar,
        incrementar,
        reiniciar,
      });
    });
  }

  return { estadisticas, uid, cargar, incrementar, reiniciar, dispose };
});
