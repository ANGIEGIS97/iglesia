<template>
  <div class="mask-container">
    <div
      class="mask-box relative w-full h-[350px] sm:h-[520px] overflow-hidden"
    >
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://i.ibb.co/wCrdhqb/donaciones.jpg"
          alt="Worship background"
          class="w-full h-full object-cover opacity-40"
        />
      </div>

      <!-- Content Overlay -->
      <div
        class="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 sm:px-6 lg:px-8 mt-12 sm:mt-20 font-asap"
      >
        <h1 class="text-4xl md:text-6xl font-bold text-white dark:text-white">
          Donaciones
        </h1>
        <p class="text-white text-xl max-w-3xl mt-6 dark:text-gray-100">
          Desde ya le agradecemos. Nuestro buen Dios sea glorificado en todas
          las cosas.
        </p>
      </div>
    </div>
  </div>

  <div class="below-mask-box">
    <div class="box-wrap">
      <div class="max-w-7xl mx-auto px-1 lg:py-16 sm:px-6 lg:px-8 font-asap">
        <!-- Bible Verse -->
        <div class="text-center mb-8">
          <p
            class="text-[#6e2b62] dark:text-teal-500 text-xl italic mb-2 md:mt-32 sm:mt-12 mt-12"
          >
            "Cada uno dé como propuso en su corazón: no con tristeza, ni por
            necesidad, porque Dios ama al dador alegre."
          </p>
          <p class="text-[#001e62] dark:text-teal-300 font-semibold">
            2 Corintios 9:7
          </p>
        </div>

        <!-- Donation Info -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-2 mb-12">
          <p class="text-[#001e62] dark:text-gray-200 text-lg mb-8">
            ¡Gracias por hacer parte del crecimiento del Reino de Dios! Para
            poder realizar tu donación primero selecciona el medio que se ajuste
            más, luego continúa con los pasos indicados. Recuerda que la
            información que proporciones es confidencial y no será compartida
            con terceros.
          </p>

          <!-- Payment Options -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button
              @click="showPaymentInfo('online')"
              class="flex items-center justify-center space-x-2 py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all"
              :class="
                selectedPayment === 'online'
                  ? 'bg-teal-600 dark:bg-teal-500 text-white'
                  : 'bg-[#dde5ed] dark:bg-gray-700 text-[#001e62] dark:text-gray-200'
              "
            >
              <span class="material-icons">language</span>
              <span>Pagos en línea</span>
            </button>
            <button
              @click="showPaymentInfo('cash')"
              class="flex items-center justify-center space-x-2 py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all"
              :class="
                selectedPayment === 'cash'
                  ? 'bg-teal-600 dark:bg-teal-500 text-white'
                  : 'bg-[#dde5ed] dark:bg-gray-700 text-[#001e62] dark:text-gray-200'
              "
            >
              <span class="material-icons">payments</span>
              <span>Pagos en efectivo</span>
            </button>
            <button
              @click="showPaymentInfo('bank')"
              class="flex items-center justify-center space-x-2 py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all"
              :class="
                selectedPayment === 'bank'
                  ? 'bg-teal-600 dark:bg-teal-500 text-white'
                  : 'bg-[#dde5ed] dark:bg-gray-700 text-[#001e62] dark:text-gray-200'
              "
            >
              <span class="material-icons">account_balance</span>
              <span>Consignaciones</span>
            </button>
          </div>

          <!-- Payment Information -->
          <div
            v-if="selectedPayment"
            class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border-l-4"
            :class="borderColorClass"
          >
            <h3 class="text-2xl font-bold mb-4 text-[#001e62] dark:text-white">
              {{ paymentInfo.title }}
            </h3>
            <div class="space-y-4">
              <div
                v-for="(info, index) in paymentInfo.details"
                :key="index"
                class="flex items-start space-x-3"
              >
                <span
                  class="material-icons text-[#001e62] dark:text-white mt-1"
                  >{{ info.icon }}</span
                >
                <div>
                  <h4 class="font-semibold text-[#001e62] dark:text-white">
                    {{ info.title }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-300">
                    {{ info.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificate Info -->
        <div class="text-center text-[#001e62] dark:text-gray-200">
          <p class="text-lg">
            Solicita tu
            <span class="font-semibold">certificado de donaciones</span> al
            correo
            <a
              href="mailto:certificaciones@example.org"
              class="text-[#a50034] dark:text-teal-300 hover:underline"
            >
              correo@gmail.com
            </a>
            con tu Ciudad, Nombre completo, Número de Identificación, Correo
            electrónico y teléfono de contacto.
          </p>
        </div>
        <!-- Info -->
        <div
          class="bg-teal-600 dark:bg-gray-600 p-4 text-center mt-12 rounded-lg"
        >
          <p class="text-white">
            Su donación es importante para nosotros. Si tiene alguna pregunta,
            no dude en contactarnos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const selectedPayment = ref(null);

const paymentInfo = computed(() => {
  switch (selectedPayment.value) {
    case "online":
      return {
        title: "Pagos en Línea",
        details: [
          {
            icon: "credit_card",
            title: "Tarjeta de Crédito/Débito",
            description:
              "Aceptamos todas las tarjetas principales: Visa, MasterCard, American Express",
          },
          {
            icon: "security",
            title: "Pago Seguro",
            description:
              "Todas las transacciones están protegidas con encriptación SSL",
          },
          {
            icon: "receipt_long",
            title: "Comprobante Inmediato",
            description:
              "Recibirás un comprobante de donación en tu correo electrónico",
          },
        ],
      };
    case "cash":
      return {
        title: "Pagos en Efectivo",
        details: [
          {
            icon: "schedule",
            title: "Horario de Atención",
            description: "Lunes a Viernes de 9:00 AM a 5:00 PM",
          },
          {
            icon: "location_on",
            title: "Dirección",
            description: "Calle Principal #123, Ciudad",
          },
          {
            icon: "info",
            title: "Información Adicional",
            description:
              "Por favor traer identificación válida para donaciones mayores a $500",
          },
        ],
      };
    case "bank":
      return {
        title: "Consignaciones Bancarias",
        details: [
          {
            icon: "account_balance",
            title: "Cuenta Bancaria",
            description: "Banco Example - Cuenta Corriente: 1234-5678-9012",
          },
          {
            icon: "business",
            title: "Titular de la Cuenta",
            description: "Iglesia Bautista Su Gracia es Mayor",
          },
          {
            icon: "description",
            title: "Proceso de Verificación",
            description:
              "Enviar comprobante de consignación al correo: donaciones@example.com",
          },
        ],
      };
    default:
      return null;
  }
});

const borderColorClass = computed(() => {
  switch (selectedPayment.value) {
    case "online":
      return "border-teal-500";
    case "cash":
      return "border-teal-500";
    case "bank":
      return "border-teal-500";
    default:
      return "";
  }
});

const showPaymentInfo = (type) => {
  selectedPayment.value = type;
};
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
*,
*::before,
*::after {
  box-sizing: border-box;
}
.mask-container {
  container-type: inline-size;
  --mask-head-size: calc(0.087 * 100cqw);
  --mask-foot-size: calc(0.055 * 100cqw);
}
.mask-box {
  margin-block: calc(-1 * var(--mask-head-size) - 1px)
    calc(-1 * var(--mask-foot-size) - 1px);
  padding-block: calc(var(--mask-head-size) + 1px)
    calc(var(--mask-foot-size) + 1px);
  mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" width="1000" height="87"><g transform="scale(2.2,-1)" transform-origin="60.5% 50%"><path d="M1000 100C500 100 500 64 0 64V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 34 0 34V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 4 0 4V0h1000v100Z"></path></g></svg>'),
    linear-gradient(
      transparent calc(var(--mask-head-size) - 1px),
      black calc(var(--mask-head-size) - 1px),
      black calc(100% - var(--mask-foot-size) + 1px),
      transparent calc(100% - var(--mask-foot-size) + 1px)
    ),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none" width="1000" height="55"><g transform="scale(1.3,1)" transform-origin="0% 50%"><path d="M1000 100C500 100 500 64 0 64V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 34 0 34V0h1000v100Z" opacity=".5"></path><path d="M1000 100C500 100 500 4 0 4V0h1000v100Z"></path></g></svg>');
  mask-repeat: no-repeat;
  mask-position: top, center, bottom;
  mask-size: 100%;
  background-color: #0d9488;
  background-image: linear-gradient(90deg, #470d94, #14b8a6);
}
.above-mask-box {
  padding-bottom: var(--mask-head-size);
  display: block;
  background: #404;
}
.below-mask-box {
  padding-top: var(--mask-foot-size);
  display: block;
}
.box-wrap {
  padding: 30px;
  color: #fff;
}
</style>
