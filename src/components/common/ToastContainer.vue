<template>
  <div class="toast-stack">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast pointer-events-auto rounded-lg shadow-xl border border-white/20"
      :class="toastClass(toast.type)"
    >
      <!-- XP toast -->
      <div v-if="toast.type === 'xp'" class="flex items-center p-3">
        <div class="mr-3 bg-yellow-400 text-teal-800 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shrink-0">
          +{{ toast.amount }}
        </div>
        <div>
          <p class="font-semibold text-sm">¡XP Ganado!</p>
          <p class="text-xs opacity-90">{{ toast.message }}</p>
        </div>
      </div>

      <!-- Success / Error toast -->
      <div v-else class="flex items-center gap-3 p-3">
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <p class="text-sm font-medium">{{ toast.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToastInbox, type ToastType } from "../../composables/useToast";

const { toasts } = useToastInbox();

function toastClass(type: ToastType): string {
  if (type === "xp") return "bg-linear-to-r from-teal-600 to-teal-500 text-white";
  if (type === "success") return "bg-green-600 text-white";
  return "bg-red-600 text-white";
}
</script>

<style>
.toast-stack {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  animation: toast-slide-in-right 0.3s ease-out;
}

@keyframes toast-slide-in-right {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
</style>
