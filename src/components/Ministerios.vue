<template>
  <section
    class="bg-white dark:bg-slate-700 py-10 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white overflow-hidden w-full"
    id="ministerios"
  >
    <div
      class="container mx-auto px-2 py-4 lg:px-32 transition duration-300 ease-in-out"
    >
      <div
        class="flex flex-wrap w-full mb-20 flex-col items-center text-center"
      >
        <h1
          class="sm:text-3xl text-2xl font-medium mb-2 text-gray-800 dark:text-white"
        >
          Ministerios y servicios
        </h1>
        <p
          class="lg:w-1/2 w-full leading-relaxed text-justify text-lg dark:text-gray-400"
        >
          Los Ministerios y Servicios son fundamentales para fomentar la
          adoración y el crecimiento espiritual de los miembros de la iglesia. A
          través de diversos ministerios como la enseñanza bíblica, la
          adoración, la evangelización y el servicio comunitario, se busca
          impactar vidas y fortalecer la fe en Cristo.
        </p>
      </div>
      <div class="flex flex-wrap mx-auto">
        <div
          v-for="ministerio in ministerios"
          :key="ministerio.titulo"
          class="xl:w-1/3 md:w-1/2 w-full p-2 sm:p-3 tarjeta"
        >
          <img
            class="w-full h-auto rounded-t-lg object-cover"
            :src="ministerio.image"
            :alt="ministerio.titulo"
          />
          <div
            class="dark:p-0.5 dark:pt-0 dark:border-0 border border-gray-200 rounded-b-lg border-t-0 bg-gray-100 dark:bg-gradient-to-tr from-teal-400 to-blue-800 dark:border-slate-600 animate-gradient"
          >
            <div
              class="h-full w-full dark:bg-slate-600/90 rounded-b-md transition duration-300 ease-in-out"
            >
              <div class="p-4 sm:p-6">
                <h2
                  class="text-lg text-gray-900 titulo-font mb-2 dark:text-white font-semibold"
                >
                  {{ ministerio.titulo }}
                </h2>
                <p
                  class="leading-relaxed text-base mb-2 text-justify text-gray-700 dark:text-white"
                >
                  {{ ministerio.descripcion }}
                </p>
                <div
                  class="flex flex-wrap border-t justify-start gap-1 sm:gap-2 border-gray-300 p-2"
                >
                  <span
                    v-for="verse in ministerio.versiculos"
                    :key="verse"
                    class="border border-teal-600 rounded-lg text-xs sm:text-sm px-2 sm:px-3 py-1 flex-shrink-0 text-teal-600 dark:text-teal-white dark:text-white dark:border-teal-400 hover:bg-teal-600 hover:text-white transition duration-300 cursor-pointer"
                  >
                    {{ verse }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Ministerios",
  data() {
    return {
      ministerios: [
        {
          titulo: "Varones",
          image: "/ministerios/varones.jpg",
          descripcion:
            "Dos hombres recorriendo juntos el camino, compartiendo una amistad y un propósito: guiar al otro hacia un encuentro íntimo con Cristo. Con cada paso, sus corazones se abren, las dudas se disipan y el amor se fortalece. Unidos en esta travesía espiritual, descubren la belleza de una relación profunda con el Salvador.",
          versiculos: ["Salmo 1:1", "Santiago 1:12"],
        },
        {
          titulo: "Mujeres",
          image: "/ministerios/damas.jpg",
          descripcion:
            "El ministerio para las mujeres es un lugar donde las líderes siervas sirven a las mujeres y al mismo tiempo, las enseñan a servir a otros de una forma bíblica. Aunque tengamos tiempos de entretenimiento, no es un club social, sino un lugar donde aprendemos a hacer todo para la gloria de Dios.",
          versiculos: ["Proverbios 31:30", "1 Pedro 3:2-4"],
        },
        {
          titulo: "Niños",
          image: "/ministerios/ninos.jpg",
          descripcion:
            "El ministerio de Niños está orientado a trabajar, educar y formar niños en el conocimiento de la Palabra de Dios; con enseñanzas y actividades de acuerdo a su edad. Es por eso que nos esforzamos por crear una atmósfera llena de diversión, risas y presencia de Dios.",
          versiculos: [
            "Deuteronomio 6:6-7",
            "Mateo 19:14",
            "Proverbios 22:6",
            "2 Timoteo 3:15",
          ],
        },
        {
          titulo: "Misioneros",
          image: "/ministerios/misioneros.jpg",
          descripcion:
            "Se llama misionero a aquella persona cuyo objetivo principal es el anuncio del evangelio mediante obras y palabras entre aquellos que no creen.",
          versiculos: ["Romanos 10:14-15", "Hechos 20:24", "Marcos 16:15"],
        },
        {
          titulo: "Evangelismo",
          image: "/ministerios/evangelismo.jpg",
          descripcion:
            "Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.",
          versiculos: [
            "Hechos 13:47",
            "Marcos 16:15",
            "Hechos 20:24",
            "Salmo 105:1",
          ],
        },
        {
          titulo: "Reuniones Caseras",
          image: "/ministerios/reuniones-Caseras.jpg",
          descripcion:
            '"Y perseveraban en la doctrina de los apóstoles, en la comunión unos con otros, en el partimiento del pan y en las oraciones… perseveraban unidos cada día en el templo, y partiendo el pan en las casas comían juntos con alegría y sencillez de corazón"',
          versiculos: ["Hechos 2:42,46"],
        },
        {
          titulo: "Jóvenes",
          image: "/ministerios/jovenes.jpg",
          descripcion:
            "Un ministerio de jóvenes saludable busca estar sujeto a la visión de su iglesia. Se interesa por conocer lo que Dios ha colocado en el corazón de sus pastores, quienes tienen la tarea y compromiso de guiar a la iglesia.",
          versiculos: [
            "Salmos 71:5",
            "1 Timoteo 4:12",
            "Tito 1:6-8",
            "Salmos 119:9",
          ],
        },
      ],
    };
  },
};
</script>
