<template>
  <div ref="header" class="bg-white/70 fixed w-full z-20">
    <div id="progress" class="h-1.5 shadow" :style="progressStyle"></div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

export default {
  name: "ProgressBar",
  props: {
    color: {
      type: String,
      default: "#4dc0b5", // Color por defecto
    },
  },
  setup(props) {
    const scroll = ref(0);
    const header = ref(null);

    const progressStyle = computed(() => ({
      background: `linear-gradient(to right, ${props.color} ${scroll.value}%, transparent 0)`,
    }));

    const updatePosition = () => {
      const navbar = document.querySelector(".navbar"); // Ajustar selector en el navbar
      if (navbar && header.value) {
        const navbarHeight = navbar.offsetHeight;
        header.value.style.top = `${navbarHeight}px`;
      }
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      scroll.value = (scrollTop / (scrollHeight - clientHeight)) * 100;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", updatePosition);
      updatePosition(); // Posición inicial
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updatePosition);
    });

    return { progressStyle, header };
  },
};
</script>
