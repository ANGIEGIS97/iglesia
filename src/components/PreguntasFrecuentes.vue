<template>
  <div class="px-4 sm:px-14 2xl:px-80 py-10 mt-20">
    <h1
      class="text-3xl text-center sm:text-left sm:text-4xl font-serif mb-4 dark:text-white"
    >
      Preguntas frecuentes
    </h1>
    <p class="text-lg mb-4 dark:text-white">
      Descubra qué esperar al visitarnos
    </p>
    <p class="text-gray-600 mb-4 dark:text-white">
      Conozca más sobre nuestros valores y nuestra historia como iglesia
      visitando la página sobre nosotros.
    </p>
    <a
      href="/#inicio"
      class="bg-teal-500 text-white hover:bg-teal-400 px-6 py-2 rounded mb-8 transition duration-300 ease-in-out transform hover:scale-105 inline-block"
    >
      Sobre nosotros
    </a>
    <div class="space-y-6">
      <div
        v-for="(item, index) in preguntas"
        :key="index"
        class="dark:p-0.5 dark:pt-0 dark:border-0 border-2 border-gray-200 rounded-lg bg-gray-100 dark:bg-gradient-to-tr from-teal-400 to-blue-800 dark:border-slate-600 overflow-hidden animate-gradient"
      >
        <div
          class="h-full w-full dark:bg-slate-600/90 rounded-md transition duration-300 ease-in-out"
        >
          <div
            class="h-1 bg-teal-500 transition-all duration-300 ease-in-out"
            :style="{ width: item.isOpen ? '100%' : '0%' }"
          ></div>
          <button
            @click="toggleItem(index)"
            class="w-full text-left flex items-start p-4 focus:outline-none"
          >
            <span
              class="text-sm sm:text-lg font-medium dark:text-white flex-grow mr-4"
            >
              {{ item.pregunta }}
            </span>
            <div class="flex-shrink-0 w-5 mt-1">
              <svg
                :class="{ 'rotate-180': item.isOpen }"
                class="w-5 h-5 transition-transform duration-200 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </button>
          <div
            v-if="item.isOpen"
            class="p-4 transition-all duration-300 ease-in-out"
          >
            <p class="dark:text-white">{{ item.respuesta }}</p>
            <div
              v-if="item.versiculos"
              class="flex flex-wrap border-t justify-start gap-2 border-gray-300 dark:border-gray-500 p-4 mt-6"
            >
              <span
                v-for="(versiculo, vIndex) in item.versiculos"
                :key="vIndex"
                class="border-2 border-teal-600 rounded-lg text-xs sm:text-sm px-3 py-1 flex-shrink-0 text-teal-600 dark:text-teal-white dark:border-teal-400 dark:text-white hover:bg-teal-600 hover:text-white transition duration-300 cursor-pointer"
              >
                {{ versiculo }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preguntas: [
        {
          pregunta: "1. ¿Cómo se alcanza la salvación?",
          respuesta:
            "La salvación es un don de la gracia de Dios, no es por obras religiosas que podamos hacer. Debemos creer en Jesucristo y recibirlo como nuestro salvador.",
          versiculos: [
            "Efesios 1:8-10",
            "Hechos 13:48",
            "Tito 3:4-7",
            "Efesios 2:8-10",
          ],
          isOpen: false,
        },
        {
          pregunta: "2. ¿Creen en el cielo y en el infierno?",
          respuesta:
            "La Biblia dice que son los únicos lugares después de la muerte. El Cielo es para los salvos y el infierno para los condenados.",
          versiculos: ["Mateo 25:31-46", "Mateo 23:33"],
          isOpen: false,
        },
        {
          pregunta: "3. ¿Cuál es la diferencia entre orar y rezar?",
          respuesta:
            "Orar es conversar con Dios. Nos dirigimos a él como a nuestro Padre, contrariamente, rezar se ha convertido en repeticiones de fórmulas religiosas sin sentido. La oración conocida como el Padre nuestro es realmente una oración modelo.",
          versiculos: ["Mateo 6:5-15"],
          isOpen: false,
        },
        {
          pregunta: "4. ¿Qué sacramentos aceptan?",
          respuesta:
            "No tenemos sacramentos. Celebramos dos ordenanzas: La cena del Señor y el bautismo de creyentes.",
          versiculos: ["Hechos 2:36-38", "1 Corintios 11:23-26"],
          isOpen: false,
        },
        {
          pregunta: "5. Creen en la virgen María?",
          respuesta:
            "Sí, pero según la enseñanza de la Biblia. María fue el vaso de honra que Dios usó para la encarnación de su Hijo, pero en ningún momento fue nombrada mediadora entre Dios y los hombres, respetamos su memoria pero no es objeto de adoración.",
          versiculos: ["1 Timoteo 2:5-6", "Lucas 1:46-48"],
          isOpen: false,
        },
        {
          pregunta: "6. ¿Por qué no se confiesan?",
          respuesta:
            "Nuestra confesión de pecados es directamente a Dios por medio de Jesucristo nuestro único mediador y salvador.",
          versiculos: ["Hebreos 4:14-16"],
          isOpen: false,
        },
        {
          pregunta:
            "7. ¿Tienen una sede y/o un líder mundial como otras religiones?",
          respuesta:
            "No. Nuestra sede es el local donde nos congregamos y nuestro único jefe es el Señor Jesucristo, y nuestros guías son los pastores que Él ha designado para representarlo. Hacemos parte de la Federación de Iglesias Bautistas de Colombia, pero como iglesia local somos autónomos en todo.",
          versiculos: ["Efesios 4:11-16"],
          isOpen: false,
        },
        {
          pregunta:
            "8. Se dice que ustedes los bautistas no creen en el poder actual del Espíritu Santo ¿por qué?",
          respuesta:
            "Es falso. Necesitamos de la obra del Espíritu Santo para ser regenerados, sin esta obra poderosa y milagrosa nadie puede llegar a ser cristiano. Además, el Espíritu Santo actúa en los creyentes, santificándolos diariamente. El cuerpo del creyente es templo del Espíritu Santo.",
          versiculos: [
            "Romanos 8:9",
            "2 Tesalonicenses 2:13",
            "1 Corintios 3:16",
          ],
          isOpen: false,
        },
        {
          pregunta: "9. ¿Cuál es su posición frente al celibato?",
          respuesta:
            "La Biblia enseña que los pastores pueden casarse y tener hijos. El apóstol Pablo enseñó que el abstenerse de mujer y quedarse soltero es un don especial.",
          versiculos: ["1 Corintios 7:7-9"],
          isOpen: false,
        },
        {
          pregunta: "10. ¿El diezmo es obligatorio?",
          respuesta:
            "No, el diezmo no es obligatorio, es voluntario en respuesta a la gracia de Dios. Hay suficientes pasajes bíblicos que nos enseñan su práctica. Bajo la economía de la gracia, se espera que todo creyente aporte de corazón dispuesto, no por norma impuesta, sino presentando el ejemplo del Señor Jesucristo.",
          versiculos: [
            "Levítico 27:30-35",
            "Números 18:21",
            "Malaquías 3",
            "Lucas 11:42",
            "Lucas 18:12",
            "2 Corintios 9:7",
            "2 Corintios 8:9",
            "1 Corintios 16:2",
          ],
          isOpen: false,
        },
        {
          pregunta:
            "11. Hay muchos pastores millonarios ¿la religión es un negocio?",
          respuesta:
            "No debería serlo. Lamentablemente, muchos pastores han convertido la Iglesia en una empresa lucrativa y un negocio para sí mismos. No son iglesias del Señor Jesucristo quienes lo hacen. Por otra parte, las iglesias deben ser responsables de sostener generosamente a sus pastores.",
          versiculos: ["2 Pedro 2:1-3", "1 Timoteo 5:17-18"],
          isOpen: false,
        },
      ],
    };
  },
  methods: {
    toggleItem(index) {
      this.preguntas[index].isOpen = !this.preguntas[index].isOpen;
    },
  },
};
</script>
