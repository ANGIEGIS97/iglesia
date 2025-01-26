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
        <h1 class="text-4xl md:text-6xl font-bold text-white">Donaciones</h1>
        <p class="text-[#fcd299] text-xl max-w-3xl mt-6">
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
          <p class="text-[#6e2b62] text-xl italic mb-2 md:mt-32 sm:mt-12 mt-12">
            "Cada uno dé como propuso en su corazón: no con tristeza, ni por
            necesidad, porque Dios ama al dador alegre."
          </p>
          <p class="text-[#001e62] font-semibold">2 Corintios 9:7</p>
        </div>

        <!-- Donation Info -->
        <div class="bg-white rounded-lg shadow-xl p-6 mb-12">
          <p class="text-[#001e62] text-lg mb-8">
            ¡Gracias por hacer parte del crecimiento del Reino de Dios! Para
            poder realizar tu donación primero selecciona el medio que se ajuste
            más, luego continúa con los pasos indicados. Recuerda que la
            información que proporciones es confidencial y no será compartida
            con terceros.
          </p>

          <!-- Payment Options -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button
              class="flex items-center justify-center space-x-2 bg-[#001e62] text-white py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all"
            >
              <span class="material-icons">language</span>
              <span>Pagos en línea</span>
            </button>
            <button
              class="flex items-center justify-center space-x-2 bg-[#dde5ed] text-[#001e62] py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all"
            >
              <span class="material-icons">payments</span>
              <span>Pagos en efectivo</span>
            </button>
            <button
              class="flex items-center justify-center space-x-2 bg-[#dde5ed] text-[#001e62] py-4 px-6 rounded-lg hover:bg-opacity-90 transition-all"
            >
              <span class="material-icons">account_balance</span>
              <span>Consignaciones</span>
            </button>
          </div>
        </div>

        <!-- Certificate Info -->
        <div class="text-center text-[#001e62]">
          <p class="text-lg">
            Solicita tu
            <span class="font-semibold">certificado de donaciones</span> al
            correo
            <a
              href="mailto:certificaciones@example.org"
              class="text-[#a50034] hover:underline"
            >
              correo@gmail.com
            </a>
            con tu Ciudad, Nombre completo, Número de Identificación, Correo
            electrónico y teléfono de contacto.
          </p>
        </div>
        <!-- Info -->
        <div class="bg-[#fcd299] p-4 text-center mt-12 rounded-lg">
          <p class="text-[#6e2b62]">
            Su donación es importante para nosotros. Si tiene alguna pregunta,
            no dude en contactarnos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic can be added here if needed
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
  background-color: #001e62;
  background-image: linear-gradient(90deg, #001e62, #6e2b62);
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
