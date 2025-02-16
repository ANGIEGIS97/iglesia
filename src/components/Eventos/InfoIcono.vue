<template>
  <div
    v-if="show"
    :class="[
      'absolute -top-2 -right-2 rounded-full flex items-center justify-center hover:scale-110 transition duration-300 ease-in-out',
      sizeClasses,
      {
        'bg-red-500': texto === 'Canasta de amor',
        'bg-red-700': texto === 'Cena del Señor',
        'bg-pink-500': texto === 'Reunión de damas',
        'bg-green-500': texto === 'Domingo misionero',
        'bg-violet-500': texto === 'Culto de oración',
        'bg-teal-500': !['Canasta de amor', 'Cena del Señor', 'Reunión de damas', 'Domingo misionero', 'Culto de oración'].includes(texto)
      }
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

    <!-- Icono para 'Culto de oración' -->
    <svg
      v-else-if="texto === 'Culto de oración'"
      xmlns="http://www.w3.org/2000/svg"
      :class="['icon icon-tabler icon-tabler-rating-12-plus', iconSizeClasses]"
      viewBox="0 0 24 24"
      fill="#ffffff"
      stroke-linecap="round"
      stroke-linejoin="round"
      ref="tooltip1"
    >
      <path
        d="M16,2.75c0,2.163-2.82,4.851-4.225,5.978a1.239,1.239,0,0,1-1.55,0C8.82,7.6,6,4.913,6,2.75A2.634,2.634,0,0,1,8.5,0,2.634,2.634,0,0,1,11,2.75,2.634,2.634,0,0,1,13.5,0,2.634,2.634,0,0,1,16,2.75Zm7.338,9.6-7.7,8.409A10,10,0,0,1,8.262,24H4a4,4,0,0,1-4-4V15a4,4,0,0,1,4-4h7.787a2.218,2.218,0,0,1,2.164,2.685,2.28,2.28,0,0,1-1.94,1.732L7.848,16A1,1,0,0,0,7,17.131H7a1,1,0,0,0,1.131.849l4.252-.6A4.234,4.234,0,0,0,16,13.213a4.081,4.081,0,0,0-.065-.638l3.542-3.737a2.606,2.606,0,0,1,3.671-.157A2.616,2.616,0,0,1,23.338,12.345Z"
      />
    </svg>

    <!-- Icono para 'Canasta de amor' -->
    <svg
      v-else-if="texto === 'Canasta de amor'"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      :class="iconSizeClasses"
      ref="tooltip1"
      style="color: white"
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>

    <!-- Icono para 'Reunión de jovenes' -->
    <svg
      v-else-if="texto === 'Reunión de jovenes'"
      xmlns="http://www.w3.org/2000/svg"
      :class="['icon icon-tabler icon-tabler-rating-12-plus', iconSizeClasses]"
      viewBox="0 0 24 24"
      fill="#ffffff"
      stroke-linecap="round"
      stroke-linejoin="round"
      ref="tooltip1"
    >
      <path
        d="m7.5 13a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm6.5 11h-13a1 1 0 0 1 -1-1v-.5a7.5 7.5 0 0 1 15 0v.5a1 1 0 0 1 -1 1zm3.5-15a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm-1.421 2.021a6.825 6.825 0 0 0 -4.67 2.831 9.537 9.537 0 0 1 4.914 5.148h6.677a1 1 0 0 0 1-1v-.038a7.008 7.008 0 0 0 -7.921-6.941z"
      />
    </svg>

    <!-- Icono para 'Domingo misionero' -->
    <svg
      v-else-if="texto === 'Domingo misionero'"
      xmlns="http://www.w3.org/2000/svg"
      :class="['icon icon-tabler icon-tabler-rating-12-plus', iconSizeClasses]"
      viewBox="0 0 24 24"
      fill="#ffffff"
      stroke-linecap="round"
      stroke-linejoin="round"
      ref="tooltip1"
    >
      <path
        d="M10,17H7.329a2.978,2.978,0,0,1-2.122-.879L.052,10.966C.023,11.308,0,11.651,0,12A12.009,12.009,0,0,0,11,23.949V18A1,1,0,0,0,10,17Z"
      />
      <path
        d="M20.436,3.478l-1.79,1.79A2.516,2.516,0,0,1,16.879,6H15.5a.5.5,0,0,0-.5.5v1A2.5,2.5,0,0,1,12.5,10a.5.5,0,0,0-.5.5V11a1,1,0,0,0,1,1h3a3,3,0,0,1,3,3v.962a.5.5,0,0,0,.146.353l2.625,2.626A11.949,11.949,0,0,0,20.436,3.478Z"
      />
      <path
        d="M17,15.962V15a1,1,0,0,0-1-1H13a3,3,0,0,1-3-3v-.5A2.5,2.5,0,0,1,12.5,8a.5.5,0,0,0,.5-.5v-1A2.5,2.5,0,0,1,15.5,4h1.379a.507.507,0,0,0,.353-.146l1.661-1.661A11.974,11.974,0,0,0,.5,8.587l6.12,6.12A1,1,0,0,0,7.329,15H10a3,3,0,0,1,3,3v5.949a11.962,11.962,0,0,0,7.483-3.469l-2.751-2.751A2.516,2.516,0,0,1,17,15.962Z"
      />
    </svg>

    <!-- Icono para 'Reunión de damas' -->
    <svg
      v-else-if="texto === 'Reunión de damas'"
      xmlns="http://www.w3.org/2000/svg"
      :class="['icon icon-tabler icon-tabler-rating-12-plus', iconSizeClasses]"
      viewBox="0 0 24 24"
      fill="#ffffff"
      stroke-linecap="round"
      stroke-linejoin="round"
      ref="tooltip1"
    >
      <path
        d="M23.535,14.725a1.99,1.99,0,0,0-1.726-.716A10.422,10.422,0,0,0,13,19.951V13.916A6.009,6.009,0,0,0,18,8c0-2.793-1.943-5.152-3.844-7.091A2.865,2.865,0,0,0,13.8.6,16.955,16.955,0,0,0,12,7.966a1,1,0,1,1-2,.068,18.566,18.566,0,0,1,1.846-8,3,3,0,0,0-2,.874C7.943,2.848,6,5.207,6,8a6.009,6.009,0,0,0,5,5.916v6.036a10.421,10.421,0,0,0-8.809-5.943,1.992,1.992,0,0,0-1.726.716,1.971,1.971,0,0,0-.393,1.792C2.111,23.855,11.591,24,11.994,24h.012c.4,0,9.884-.145,11.923-7.483A1.975,1.975,0,0,0,23.535,14.725Z"
      />
    </svg>

    <!-- Icono para 'Reunión de varones' -->
    <svg
      v-else-if="texto === 'Reunión de varones'"
      xmlns="http://www.w3.org/2000/svg"
      :class="['icon icon-tabler icon-tabler-rating-12-plus', iconSizeClasses]"
      viewBox="0 0 24 24"
      fill="#ffffff"
      stroke-linecap="round"
      stroke-linejoin="round"
      ref="tooltip1"
    >
      <path
        d="M12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM5.683,16H1a1,1,0,0,1-1-1A6.022,6.022,0,0,1,5.131,9.084a1,1,0,0,1,1.1,1.266A6.009,6.009,0,0,0,6,12a5.937,5.937,0,0,0,.586,2.57,1,1,0,0,1-.9,1.43ZM17,24H7a1,1,0,0,1-1-1,6,6,0,0,1,12,0A1,1,0,0,1,17,24ZM18,8a4,4,0,1,1,4-4A4,4,0,0,1,18,8ZM6,8a4,4,0,1,1,4-4A4,4,0,0,1,6,8Zm17,8H18.317a1,1,0,0,1-.9-1.43A5.937,5.937,0,0,0,18,12a6.009,6.009,0,0,0-.236-1.65,1,1,0,0,1,1.105-1.266A6.022,6.022,0,0,1,24,15,1,1,0,0,1,23,16Z"
      />
    </svg>

    <!-- Icono para 'Cumpleaños iglesia' -->

    <svg
      v-else-if="texto === 'Cumple'"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      :class="iconSizeClasses"
      ref="tooltip1"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z" />
      <path
        d="M3 14.803c.312 .135 .654 .204 1 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1 -.197"
      />
      <path d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z" />
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

    tooltipText() {
      return this.texto;
    },
  },
};
</script>
