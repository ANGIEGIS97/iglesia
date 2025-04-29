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

    // Imprimir el estado actual del contador
    const contadorKey = "estadisticasContador";
    let contadorAnterior = JSON.parse(
      localStorage.getItem(contadorKey) || "{}"
    );
    console.log("Estado anterior del contador:", contadorAnterior);

    // Actualizar el contador en localStorage
    let contador = { ...contadorAnterior };

    // Inicializar contador si no existe
    if (!contador) contador = {};

    // Estructura: { eventos: { agregados: 0, eliminados: 0, modificados: 0 }, fechas: { agregados: 0, eliminados: 0, modificados: 0 } }
    if (!contador.eventos)
      contador.eventos = { agregados: 0, eliminados: 0, modificados: 0 };
    if (!contador.fechas)
      contador.fechas = { agregados: 0, eliminados: 0, modificados: 0 };

    // Incrementar el contador correspondiente
    if (props.tipo === "evento" || props.tipo === "eventos") {
      contador.eventos[props.accion] =
        (contador.eventos[props.accion] || 0) + 1;
      console.log(`Incrementando contador de eventos.${props.accion}`);
    } else if (props.tipo === "fecha" || props.tipo === "fechas") {
      contador.fechas[props.accion] = (contador.fechas[props.accion] || 0) + 1;
      console.log(`Incrementando contador de fechas.${props.accion}`);
    } else {
      console.error(`Tipo no reconocido: ${props.tipo}`);
    }

    // Guardar en localStorage
    localStorage.setItem(contadorKey, JSON.stringify(contador));
    console.log("Contador actualizado:", contador);
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
