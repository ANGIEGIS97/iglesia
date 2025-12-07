<template>
  <section
    class="bg-gray-100 dark:bg-slate-800 pb-10 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white"
    id="ubicacion"
  >
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out"
    >
      <div
        class="flex flex-wrap w-full mb-12 flex-col items-center text-center"
      >
        <div class="flex flex-col mb-2 px-3 items-center">
          <p class="text-teal-500 font-bold tracking-[0.2em] text-sm mb-2 uppercase">#Visítanos</p>
          <h1 class="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-4 text-center">
             Nuestra <span class="text-outline">Ubicación</span>
          </h1>
        </div>
        <p
          class="lg:w-2/3 w-full leading-relaxed text-center text-lg dark:text-gray-300 max-w-3xl mx-auto"
        >
          Nos congregamos en un lugar de comunión fraternal, donde todos son
          bienvenidos para adorar a Dios y crecer en Su gracia, edificándonos en
          amor y unidad.
        </p>
      </div>
      <div class="h-80 border-2 border-teal-500 p-2 rounded-lg">
        <iframe
          title="Ubicación del Salón Comunal de Asovivir"
          aria-label="Mapa mostrando la ubicación del Salón Comunal de Asovivir"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15907.669082240025!2d-74.1925392!3d4.60883!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb722505c69c6b9ee!2sSal%C3%B3n%20Comunal%20de%20Asovivir!5e0!3m2!1ses!2sco!4v1670274439288!5m2!1ses!2sco"
          class="w-full h-full"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-outline {
  -webkit-text-stroke: 1.5px black;
  color: transparent;
}
.dark .text-outline {
  -webkit-text-stroke: 1.5px white;
}
</style>
