<template>
  <Teleport to="body">
    <div
      v-if="open"
      :class="[
        'fixed inset-0 flex items-center justify-center',
        zClass ?? 'z-[60]',
        backdropClass ?? 'bg-black/30 backdrop-blur-sm',
      ]"
      @click.self="emitClose"
    >
      <div
        ref="panelRef"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="labelId"
        :class="panelClass ?? defaultPanelClass"
        @click.stop
      >
        <slot name="header" :close="emitClose" :labelId="labelId">
          <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 :id="labelId" class="text-xl font-bold text-gray-800 dark:text-white">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button
              type="button"
              @click="emitClose"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </slot>

        <slot :close="emitClose" :labelId="labelId" />
        <slot name="footer" :close="emitClose" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed, toRef } from "vue";
import { useBodyScrollLock } from "../../composables/useBodyScrollLock";
import "animate.css";

const props = defineProps<{
  open: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  panelClass?: string;
  backdropClass?: string;
  zClass?: string;
}>();

useBodyScrollLock(toRef(props, "open"));

const panelRef = ref<HTMLElement | null>(null);
const labelId = `modal-title-${Math.random().toString(36).slice(2)}`;

const sizeClass = computed(() => {
  const map: Record<string, string> = {
    sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl",
  };
  return map[props.size ?? "md"];
});

const defaultPanelClass = computed(
  () => `relative bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl w-full m-4 border border-white/20 animate__animated animate__fadeInDown ${sizeClass.value}`,
);

const FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function trapFocus(e: KeyboardEvent) {
  if (!panelRef.value || e.key !== "Tab") return;
  const nodes = Array.from(panelRef.value.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!nodes.length) return;
  if (e.shiftKey) {
    if (document.activeElement === nodes[0]) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
  } else {
    if (document.activeElement === nodes[nodes.length - 1]) { e.preventDefault(); nodes[0].focus(); }
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") emitClose();
  trapFocus(e);
}

const emit = defineEmits<{ close: [] }>();
const emitClose = () => emit("close");

watch(() => props.open, async (open) => {
  if (open) {
    document.addEventListener("keydown", onKey);
    await nextTick();
    panelRef.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  } else {
    document.removeEventListener("keydown", onKey);
  }
});

onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<style scoped>
.animate__animated { --animate-duration: 0.3s; }
</style>
