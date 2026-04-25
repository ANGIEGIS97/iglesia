import { ref, onBeforeUnmount } from "vue";
import { publish, subscribe } from "../lib/eventBus";

export type ToastType = "xp" | "success" | "error";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  amount?: number;
  duration: number;
}

export interface ToastPayload {
  type: ToastType;
  message: string;
  amount?: number;
  duration: number;
}

const TOAST_EVENT = "toast:add";
let _nextId = 0;

export function useToast() {
  return {
    xp: (amount: number, message: string) =>
      publish<ToastPayload>(TOAST_EVENT, { type: "xp", message, amount, duration: 3000 }),
    success: (message: string, duration = 3000) =>
      publish<ToastPayload>(TOAST_EVENT, { type: "success", message, duration }),
    error: (message: string, duration = 4000) =>
      publish<ToastPayload>(TOAST_EVENT, { type: "error", message, duration }),
  };
}

export function useToastInbox() {
  const toasts = ref<Toast[]>([]);

  function remove(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id);
    if (idx !== -1) toasts.value.splice(idx, 1);
  }

  const unsubscribe = subscribe<ToastPayload>(TOAST_EVENT, (payload) => {
    const id = ++_nextId;
    toasts.value.push({ ...payload, id });
    setTimeout(() => remove(id), payload.duration);
  });

  onBeforeUnmount(unsubscribe);

  return { toasts, remove };
}
