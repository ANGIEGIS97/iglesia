<template>
  <section
    class="bg-white dark:bg-slate-700 py-10 transition duration-300 ease-in-out"
    id="pastor"
  >
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out"
    >
      <div
        class="grid grid-cols-1 lg:grid-cols-2 selection:bg-teal-500 selection:text-white"
      >
        <div class="relative z-10 lg:py-16">
          <div class="relative h-64 sm:h-80 lg:h-[600px]">
            <img
              alt="Pastor Oscar Páez"
              src="https://i.ibb.co/3ByrqHS/pastor2.jpg"
              class="absolute inset-0 h-full w-full object-cover rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105"
            />
          </div>
        </div>
        <div
          class="relative flex items-center sm:bg-gray-100 lg:rounded-r-lg sm:dark:bg-slate-600 transition duration-300 ease-in-out"
        >
          <span
            class="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-gray-100 rounded-l-lg dark:bg-slate-600 transition duration-300 ease-in-out"
          ></span>
          <div class="p-0 py-4 s sm:p-16 lg:p-14">
            <h2
              class="sm:text-4xl text-3xl font-bold text-center text-gray-800 dark:text-white mb-6"
            >
              Pastor Oscar Páez
            </h2>
            <div
              class="mt-4 text-gray-700 text-justify text-[16px] leading-relaxed space-y-4 dark:text-gray-300"
            >
              <p
                class="first-letter:text-7xl first-letter:text-teal-600 first-letter:mr-3 first-letter:float-left dark:first-letter:text-teal-400"
              >
                La Iglesia Bautista su Gracia es Mayor fue fundada en 2022 en
                Bogotá, en la localidad de Bosa, bajo la dirección del Pastor
                Principal, Oscar Páez.
              </p>
              <p>
                Desde entonces, el Pastor ha liderado la iglesia enfocándose en:
              </p>
              <ul class="list-disc list-inside ml-4 space-y-2">
                <li>Difundir el amor de Dios y la fe en Cristo</li>
                <li>Enseñanza bíblica</li>
                <li>Liderazgo espiritual</li>
                <li>Atención pastoral</li>
                <li>Administración de la iglesia</li>
              </ul>
              <p>
                Su pasión por predicar la Palabra de Dios ha inspirado a los
                miembros y ha resultado en un crecimiento tanto numérico como
                espiritual de la congregación.
              </p>
              <p>
                La Iglesia Bautista, bajo su liderazgo, se adhiere a una
                declaración de fe basada en las Escrituras, creyendo en la
                Trinidad, la salvación por gracia mediante la fe en Cristo, la
                autoridad de la Biblia y la comisión de compartir el evangelio
                globalmente.
              </p>
              <p>
                La iglesia sigue un sistema de gobierno congregacional, donde
                las decisiones importantes se toman mediante votación directa de
                los miembros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#pastor {
  animation: fadeIn 1s ease-out;
}
</style>
