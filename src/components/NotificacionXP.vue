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
import { defineProps, onMounted } from "vue";

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
  tipo: {
    type: String,
    default: "",
  },
  accion: {
    type: String,
    default: "",
  },
});

onMounted(() => {
  if (props.show && props.tipo && props.accion) {
    console.log("NotificacionXP actualiza contador:", props.tipo, props.accion);

    // Usar la función global para actualizar el contador
    if (window.actualizarContador) {
      window.actualizarContador(props.tipo, props.accion);
      console.log(
        `Contador actualizado para ${props.tipo}.${props.accion} usando función global`
      );
    } else {
      console.warn(
        "La función global actualizarContador no está disponible, intentando actualizar directamente"
      );

      // Verificar si actualizarContadorEstadisticas está disponible como respaldo
      if (window.actualizarContadorEstadisticas) {
        window.actualizarContadorEstadisticas();
      }
    }
  } else {
    console.warn("NotificacionXP no actualizó el contador:", {
      show: props.show,
      tipo: props.tipo,
      accion: props.accion,
    });
  }
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
