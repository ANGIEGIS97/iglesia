<template>
  <div
    v-if="show"
    :class="[
      'absolute -top-2 -right-2 rounded-full flex items-center justify-center',
      sizeClasses,
      texto === 'Canasta de amor' ? 'bg-red-500' : 'bg-blue-500',
      texto === 'Cena del Señor' ? 'bg-red-700' : 'bg-blue-500',
      texto === 'Reunión de damas' ? 'bg-pink-500' : 'bg-blue-500',
      texto === 'Domingo misionero' ? 'bg-green-500' : 'bg-blue-500',
      texto === 'Culto de oración' ? 'bg-violet-500' : 'bg-blue-500',
    ]"
  >
    <!-- Icono para 'Cena del Señor' -->
    <svg
      v-if="texto === 'Cena del Señor'"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      :class="iconSizeClasses"
      ref="tooltip1"
    >
      <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z" />
    </svg>

    <!-- Icono por defecto -->
    <svg
      v-else
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 20 20"
      ref="tooltip1"
      :class="iconSizeClasses"
    >
      <path
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
      />
    </svg>
  </div>
</template>

<script>
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: "small",
      validator: (value) => ["small", "medium", "large"].includes(value),
    },

    texto: {
      type: String,
      default: null,
    },
  },

  mounted() {
    this.$nextTick(() => {
      tippy(this.$refs.tooltip1, {
        content: this.tooltipText,
        placement: "top",
        arrow: true,
      });
    });
  },

  computed: {
    sizeClasses() {
      return {
        "w-5 h-5": this.size === "small",
        "w-6 h-6": this.size === "medium",
        "w-7 h-7": this.size === "large",
      };
    },

    iconSizeClasses() {
      return {
        "w-4 h-4": this.size === "small",
        "w-5 h-5": this.size === "medium",
        "w-6 h-6": this.size === "large",
      };
    },

    tooltipText() {
      return this.texto === null ? "Banner evento disponible" : this.texto;
    },
  },
};
</script>
