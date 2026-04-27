type Tipo = "eventos" | "fechas";
type Accion = "agregados" | "eliminados" | "modificados";

interface StoreSurface {
  readonly estadisticas: Record<Tipo, Record<Accion, number>>;
  readonly uid: string;
  cargar: (uid: string) => void;
  incrementar: (tipo: string, accion: Accion) => void;
  reiniciar: () => void;
}

const STORAGE_PREFIX = "estadisticasContador_";

export function installStatsDebug(store: StoreSurface) {
  if (typeof window === "undefined") return;

  const unwrap = <T>(v: T): T => JSON.parse(JSON.stringify(v));

  const api = {
    show() {
      console.log(`uid: ${store.uid || "(sin sesión)"}`);
      console.table(unwrap(store.estadisticas));
    },
    raw() {
      return {
        uid: store.uid,
        estadisticas: unwrap(store.estadisticas),
      };
    },
    listAll() {
      const result: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k?.startsWith(STORAGE_PREFIX)) continue;
        try {
          result[k.slice(STORAGE_PREFIX.length)] = JSON.parse(localStorage.getItem(k)!);
        } catch { /* ignorar entrada corrupta */ }
      }
      console.table(result);
      return result;
    },
    reset() {
      store.reiniciar();
      console.log("✅ Stats reiniciadas");
    },
    set(tipo: Tipo, accion: Accion, value: number) {
      if (!store.uid) {
        console.warn("⚠️ Sin uid — espera a que cargue auth");
        return;
      }
      store.estadisticas[tipo][accion] = value;
      localStorage.setItem(STORAGE_PREFIX + store.uid, JSON.stringify(store.estadisticas));
      window.dispatchEvent(new CustomEvent("statisticsUpdated"));
      console.log(`✅ ${tipo}.${accion} = ${value}`);
    },
    inc(tipo: Tipo, accion: Accion) {
      store.incrementar(tipo, accion);
      console.log(`✅ ${tipo}.${accion} +1 → ${store.estadisticas[tipo][accion]}`);
    },
    help() {
      console.log(
        [
          "statsDebug API:",
          "  .show()                    → console.table del estado actual",
          "  .raw()                     → objeto crudo (uid + estadisticas)",
          "  .listAll()                 → stats de todos los uid en localStorage",
          "  .reset()                   → reinicia las stats del usuario actual",
          "  .inc(tipo, accion)         → incrementa +1 (tipo: eventos|fechas, accion: agregados|eliminados|modificados)",
          "  .set(tipo, accion, valor)  → fija un valor (útil para probar logros, ej: set('eventos','agregados',100))",
          "  .help()                    → esta ayuda",
        ].join("\n"),
      );
    },
  };

  (window as any).statsDebug = api;
  console.log("🛠️ statsDebug disponible — ejecuta statsDebug.help()");
}
