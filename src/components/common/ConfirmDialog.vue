<template>
  <div
    v-if="confirmState.open"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="_cancel()"
  >
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-message"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6 border border-white/20 animate__animated animate__fadeInDown"
      @click.stop
      @keydown.esc="_cancel()"
    >
      <p id="confirm-message" class="text-gray-800 dark:text-white text-base mb-6">
        {{ confirmState.message }}
      </p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="_cancel()"
          class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {{ confirmState.cancelLabel }}
        </button>
        <button
          type="button"
          @click="_accept()"
          class="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
          :class="confirmState.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'"
        >
          {{ confirmState.confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from "../../composables/useConfirm";
import "animate.css";

const { confirmState, _accept, _cancel } = useConfirm();
</script>

<style scoped>
.animate__animated { --animate-duration: 0.2s; }
</style>
