<template>
  <Transition name="fade">
    <button
      v-show="isVisible"
      @click="scrollToTop"
      class="fixed bottom-[85px] right-5 z-20 border-2 border-teal-400 py-3 px-4 rounded-lg text-teal-500 hover:bg-teal-400/50 hover:text-white transition-colors duration-300"
      aria-label="Volver arriba"
    >
      <i class="fas fa-cross"></i>
    </button>
  </Transition>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "BackToTop",
  setup() {
    const isVisible = ref(false);

    const toggleVisibility = () => {
      isVisible.value = window.scrollY > 20;
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    onMounted(() => {
      window.addEventListener("scroll", toggleVisibility);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", toggleVisibility);
    });

    return {
      isVisible,
      scrollToTop,
    };
  },
};
</script>

<style scoped>
@import url("https://use.fontawesome.com/releases/v5.11.2/css/all.css");

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
