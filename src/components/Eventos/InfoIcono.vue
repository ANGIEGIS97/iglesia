<template>
  <div
    v-if="show"
    :class="[
      'absolute -top-2 -right-2 rounded-full flex items-center justify-center hover:scale-110 transition duration-300 ease-in-out',
      sizeClasses,
      {
        'bg-yellow-500': texto === 'Cumpleaños',
        'bg-red-500': texto === 'Canasta de amor',
        'bg-red-700': texto === 'Cena del Señor',
        'bg-pink-500': texto === 'Reunión de damas',
        'bg-green-500': texto === 'Domingo misionero',
        'bg-violet-500': texto === 'Culto de oración',
        'bg-blue-500': texto === 'Reunión de varones',
        'bg-indigo-500': texto === 'Reunión de jovenes',
        'bg-red-400': texto === 'Noches navideñas',
        'bg-orange-500': texto === 'Reuniones caseras',
        'bg-teal-500': ![
          'Cumpleaños',
          'Canasta de amor',
          'Cena del Señor',
          'Reunión de damas',
          'Domingo misionero',
          'Culto de oración',
          'Reunión de varones',
          'Reunión de jovenes',
          'Noches navideñas',
          'Reuniones caseras',
        ].includes(texto),
      },
    ]"
  >
    <img :src="iconSrc" :class="iconSizeClasses" ref="tooltip1" alt="" />
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
      if (this.texto) {
        tippy(this.$refs.tooltip1, {
          content: this.texto,
          placement: "top",
          arrow: true,
        });
      }
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

    iconSrc() {
      const iconMap = {
        Cumpleaños: "/insignias/cumple.svg",
        "Cena del Señor": "/insignias/cena-del-senor.svg",
        "Culto de oración": "/insignias/culto-de-oracion.svg",
        "Canasta de amor": "/insignias/canasta-de-amor.svg",
        "Reunión de jovenes": "/insignias/reunion-de-jovenes.svg",
        "Domingo misionero": "/insignias/domingo-misionero.svg",
        "Reunión de damas": "/insignias/reunion-de-damas.svg",
        "Reunión de varones": "/insignias/reunion-de-varones.svg",
        "Noches navideñas": "/insignias/noches-navidenas.svg",
        "Reuniones caseras": "/insignias/reuniones-caseras.svg",
      };

      return iconMap[this.texto] || "/insignias/default.svg";
    },

    tooltipText() {
      return this.texto;
    },
  },
};
</script>
