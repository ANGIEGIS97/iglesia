// Event bus pub/sub global, compartido entre todos los islands de Vue de Astro
// en la misma página vía `window`. Cada island instancia su propio módulo de
// Vue, pero todos comparten el mismo `window`, así que aquí guardamos un único
// registro de suscriptores en `window.__appBus`.

type Handler<T = unknown> = (payload: T) => void;
type BusRegistry = Map<string, Set<Handler>>;

declare global {
  interface Window {
    __appBus?: BusRegistry;
  }
}

function getRegistry(): BusRegistry {
  if (typeof window === "undefined") return new Map();
  if (!window.__appBus) window.__appBus = new Map();
  return window.__appBus;
}

export function publish<T>(event: string, payload: T): void {
  const handlers = getRegistry().get(event);
  if (!handlers) return;
  handlers.forEach((h) => {
    try {
      (h as Handler<T>)(payload);
    } catch (err) {
      console.error(`[bus] handler de "${event}" lanzó error:`, err);
    }
  });
}

export function subscribe<T>(event: string, handler: Handler<T>): () => void {
  const registry = getRegistry();
  if (!registry.has(event)) registry.set(event, new Set());
  registry.get(event)!.add(handler as Handler);
  return () => {
    registry.get(event)?.delete(handler as Handler);
  };
}
