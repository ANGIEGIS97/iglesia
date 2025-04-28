<template>
  <div
    v-if="show"
    class="fixed top-16 right-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white p-3 rounded-lg shadow-xl z-50 animate-slide-in-right"
  >
    <div class="flex items-center">
      <div
        class="mr-3 bg-yellow-400 text-teal-800 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold"
      >
        +{{ amount }}
      </div>
      <div>
        <p class="font-semibold">¡XP Ganado!</p>
        <p class="text-sm">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
@keyframes slide-in-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}
</style>
