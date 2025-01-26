<template>
  <div class="px-4 sm:px-14 2xl:px-80 py-10 mt-20">
    <h1
      class="text-3xl text-center sm:text-left sm:text-4xl font-serif mb-4 dark:text-white"
    >
      Confesión de fe
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
        class="dark:p-0.5 dark:pt-0 dark:border-0 border-2 border-gray-200 rounded-lg bg-gray-100 dark:bg-gradient-to-tr from-teal-500 to-blue-500 dark:border-slate-600 overflow-hidden animate-gradient"
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
          pregunta: "1. De las Escrituras",
          respuesta:
            "Creemos en la autoridad y la suficiencia de la Santa Biblia que consta de los sesenta y seis libros del Antiguo y Nuevo Testamentos como originalmente escritos; que la Biblia fue inspirada verbalmente en todas sus partes y es el producto de hombres controlados por el Espíritu Santo y por lo tanto es infalible e inerrante en todos los asuntos sobre los cuales habla. Creemos que la Biblia es el centro verdadero de la unidad cristiana y que constituye la norma suprema por la que las conductas, creencias y opiniones de los hombres serán juzgadas.",
          versiculos: ["2 Timoteo 3:16-17", "2 Pedro 1:19-21"],
          isOpen: false,
        },
        {
          pregunta: "2. Del Dios verdadero",
          respuesta:
            "Creemos que existe solamente un Dios vivo y verdadero, Espíritu infinito, Creador y Gobernador supremo del cielo y de la tierra; inefablemente glorioso en santidad y digno de todo honor, toda confianza y todo amor; que en la unidad de la Deidad existen tres personas: el Padre, el Hijo y el Espíritu Santo, que son iguales en todas las perfecciones divinas y que desempeñan oficios distintos pero armoniosos en la gran obra de la redención.",
          versiculos: [
            "Éxodo 20:2-3",
            "1 Corintios 8:6",
            "Mateo 28:19",
            "2 Corintios 13:14",
            "Apocalipsis 4:11",
          ],
          isOpen: false,
        },
        {
          pregunta: "3. Jesucristo",
          respuesta:
            "Creemos que el Hijo de Dios es una persona divina, igual con Dios el Padre y Dios el Espíritu Santo en esencia; que cuando llegó la plenitud del tiempo, tomó sobre sí la naturaleza del hombre, aunque sin pecado, siendo engendrado por el Espíritu Santo de una manera milagrosa, nacido de María, una virgen, como ningún otro hombre ha nacido o puede nacer de una mujer; de manera que, dos naturalezas completas, perfectas y distintas se unieron inseparablemente en una persona, pero sin cambiarlas, combinarlas, ni confundirlas. Esta persona es verdaderamente Dios y verdaderamente hombre; y sin embargo, un solo Cristo, el único Mediador entre Dios y los seres humanos.",
          versiculos: [
            "Juan 1:1,14",
            "Juan 8:58",
            "Gálatas 4:4",
            "Mateo 1:18-25",
            "Lucas 1:35",
            "Hebreos 2:14",
            "Hebreos 4:15",
            "Filipenses 2:5-11",
            "1 Timoteo 2:5",
          ],
          isOpen: false,
        },
        {
          pregunta: "4. El Espíritu Santo",
          respuesta:
            "Creemos que el Espíritu Santo es una persona divina, igual con Dios el Padre y Dios el Hijo en esencia; que Él fue activo en la creación; que en su relación con el mundo incrédulo restringirá el mal hasta que el propósito de Dios se haya cumplido y que Él convence de pecado, de justicia y de juicio; que Él da testimonio de la verdad del Evangelio en su proclamación; que Él es el Autor del nuevo nacimiento; que El sella, dota, guía, enseña, testifica, santifica y ayuda al creyente. Creemos que la Biblia no apoya la autenticidad de los dones de revelación o los dones milagrosos hoy día, como son el don de la profecía, el don de las lenguas, la interpretación de lenguas, el don de hacer milagros y el don de sanación y rechazamos un enfoque en las experiencias como autoridad para la vida cristiana.",
          versiculos: [
            "Juan 14:16-17",
            "Mateo 28:19",
            "Hebreos 9:14",
            "Juan 14:26",
            "Lucas 1:35",
            "Génesis 1:1-3",
            "Juan 16:8-11",
            "Hechos 5:30-32",
            "Juan 3:5-6",
            "Efesios 1:13-14",
            "Marcos 1:8",
            "Juan 1:33",
            "Hechos 11:16",
            "Lucas 24:49",
            "Romanos 8:14,16,26-27",
            "1 Corintios 12:8-10,13,28-30",
            "1 Corintios 14:1-40",
            "2 Corintios 12:12",
            "Hebreos 2:2-4",
          ],
          isOpen: false,
        },
        {
          pregunta: "5. El diablo, o Satanás",
          respuesta:
            "Creemos en la realidad y personalidad de Satanás, el diablo; que éste fue creado por Dios como ángel, pero que por orgullo y rebeldía se convirtió en el enemigo de su Creador; que se convirtió en el dios malvado de este mundo, el gobernante de todos los poderes de las tinieblas; y que finalmente será arrojado al lago de fuego en donde sufrirá eternamente por su maldad.",
          versiculos: [
            "Ezequiel 28:12-17",
            "Mateo 4:1-11",
            "2 Corintios 4:4",
            "Apocalipsis 20:10",
          ],
          isOpen: false,
        },
        {
          pregunta: "6. La creación",
          respuesta:
            "Creemos la narración bíblica acerca de la creación del universo físico, de los ángeles y del hombre; que este relato no es ni alegoría, ni mito, sino un relato literal e histórico de los actos creativos directos e inmediatos de Dios sin ningún tipo de proceso evolutivo; que el hombre fue creado por una obra directa de Dios y no de formas ya existentes de la vida; y que todos los hombres descienden de Adán y Eva, los primeros padres de la raza humana entera.",
          versiculos: ["Génesis 1-2", "Colosenses 1:16-17", "Juan 1:3"],
          isOpen: false,
        },
        {
          pregunta: "7. La caída del hombre",
          respuesta:
            "Creemos que el hombre fue creado en inocencia a imagen y semejanza de Dios, bajo la ley de su Creador, pero por su transgresión voluntaria, Adán cayó de su estado de inocencia y felicidad, y todos los seres humanos pecaron en él y como resultado todos son totalmente depravados, partícipes de la naturaleza caída de Adán y son pecadores por naturaleza y por práctica y por lo tanto están bajo la condenación justa, sin defensa ni excusa.",
          versiculos: [
            "Génesis 3:1-6",
            "Romanos 3:10-19",
            "Romanos 5:12,19",
            "Romanos 1:18,32",
          ],
          isOpen: false,
        },
        {
          pregunta: "8. La salvación",
          respuesta:
            "Creemos que la salvación de los pecadores es divinamente iniciada y enteramente por la gracia a través de la mediación de Jesucristo, el Hijo de Dios, quien siendo designado por el Padre, voluntariamente tomó nuestra naturaleza, pero sin pecado, y honró la ley divina con su obediencia personal, lo cual lo hizo apto para ser nuestro Salvador; que por el derramamiento de su sangre en su muerte Él completamente satisfizo las justas demandas del Dios santo y justo con relación al pecado; que su sacrificio no consistía en darnos un ejemplo por su muerte como un mártir, sino que era una sustitución voluntaria de sí mismo en Lugar del pecador, el Justo muriendo por los injustos; que Cristo el Señor cargó con nuestros pecados en su cuerpo sobre el madero; que después de haber resucitado de los muertos ahora está entronizado en el cielo y une en su persona maravillosa los sentimientos más tiernos con la perfección divina; que Él está en todos los sentidos apto para ser el Salvador adecuado, compasivo y completamente suficiente. Creemos que la fe en el Señor Jesucristo es la única condición de la salvación. El arrepentimiento es un cambio de mente y propósito hacia Dios obrado por el Espíritu Santo y es una parte integral de la fe salvadora.",
          versiculos: [
            "Jonás 2:9",
            "Efesios 1:4-6",
            "Efesios 2:8",
            "Hechos 15:11",
            "Romanos 3:24-25",
            "Juan 3:16",
            "Filipenses 2:7-8",
            "Hebreos 2:14-17",
            "Isaías 53:4-7",
            "1 Juan 4:10",
            "1 Corintios 15:3",
            "2 Corintios 5:21",
            "1 Pedro 2:24",
          ],
          isOpen: false,
        },
        {
          pregunta: "9. La gracia y el nuevo nacimiento",
          respuesta:
            "Creemos que para ser salvos, los pecadores tienen que nacer de nuevo; que el nuevo nacimiento es una nueva creación en Cristo Jesús; que es instantáneo y no un proceso; que en el nuevo nacimiento la persona muerta en sus delitos y pecados llega a ser partícipe de la naturaleza divina y recibe la vida eterna, un don gratuito de Dios; que la nueva creación es una obra de nuestro Dios soberano de una manera que sobrepasa nuestra comprensión; es una obra hecha únicamente por el poder del Espíritu Santo en conexión con la verdad divina, con el fin de conseguir nuestra obediencia voluntaria al evangelio; que su evidencia apropiada se manifiesta en los santos frutos de arrepentimiento, fe y una nueva vida.",
          versiculos: [
            "Juan 3:3-8",
            "2 Corintios 5:17",
            "1 Juan 5:1",
            "Hechos 16:20-33",
            "2 Pedro 1:4",
            "Romanos 6:23",
            "Efesios 2:1,5",
            "Colosenses 2:13",
          ],
          isOpen: false,
        },
        {
          pregunta: "10. La justificación",
          respuesta:
            "Creemos que la justificación es el acto judicial de Dios por el cual El declara justo al creyente con base en la justicia imputada de Cristo; que se concede, no por ninguna obra de justicia que nosotros hubiéramos hecho, sino únicamente por medio de la fe en el sacrificio del Redentor.",
          versiculos: [
            "Romanos 3:24",
            "Romanos 4:5",
            "Romanos 5:1,9",
            "Gálatas 2:16",
            "Filipenses 3:9",
          ],
          isOpen: false,
        },
        {
          pregunta: "11. La santificación",
          respuesta:
            "Creemos que la santificación es el acto divino de apartar al creyente para Dios de las siguientes tres maneras: en primer lugar, es un acto de Dios, basado en la redención en Cristo, que establece al creyente en una posición de santidad en el momento en que confía en el Salvador; en segundo lugar, es un proceso continuo en el cristiano en donde el Espíritu Santo aplica la Palabra de Dios a su vida para conformarlo más a la imagen de Cristo; en tercer lugar, es la realización final de este proceso en la venida del Señor.",
          versiculos: [
            "Hebreos 10:10-14",
            "Hebreos 3:1",
            "Juan 17:17",
            "2 Corintios 3:18",
            "1 Corintios 1:2,30",
            "Efesios 5:25-27",
            "1 Tesalonicenses 4:3-4",
            "1 Tesalonicenses 5:23-24",
            "1 Juan 3:2",
            "Judas 24-25",
            "Apocalipsis 22:11",
          ],
          isOpen: false,
        },
        {
          pregunta: "12. La seguridad de los creyentes",
          respuesta:
            "Creemos que todos los que verdaderamente han nacido de nuevo son guardados por Dios el Padre para Jesucristo de modo que no pueden caer ni total ni definitivamente del estado de gracia, sino que ciertamente perseverarán en Cristo hasta el fin, y serán salvos por toda la eternidad.",
          versiculos: [
            "Filipenses 1:6",
            "Juan 10:28-29",
            "Romanos 8:35-39",
            "Judas 1",
            "1 Pedro 1:3-9",
            "2 Pedro 1:4-11",
          ],
          isOpen: false,
        },
        {
          pregunta: "13. La iglesia",
          respuesta:
            "Creemos que una iglesia local es una congregación organizada de creyentes bautizados (sumergidos) en agua y unidos por un pacto de fe y la comunión del evangelio; que observan las ordenanzas de Cristo; que se rigen por sus leyes; que usan los dones, derechos y privilegios que les han sido concedidos por su Palabra; que sus oficiales son pastores (ancianos) y diáconos, cuyos requisitos, autoridad y deberes están claramente definidos en las Escrituras. Creemos que la verdadera misión de la iglesia es dar testimonio de Cristo a todos los seres humanos en toda oportunidad. Sostenemos que la iglesia local tiene el derecho absoluto de gobernar sus asuntos, libre de la injerencia de cualquier jerarquía de individuos u organizaciones; y que el único Superintendente es Cristo por el Espíritu Santo; que es bíblico que las iglesias verdaderas se colaboren para contender por la fe y para el progreso del evangelio; que cada iglesia local es autónoma en cuanto a la medida y el método de su cooperación; que en todos los asuntos de la membresía, de la organización, del gobierno, de la disciplina y de las ofrendas, la voluntad de la propia iglesia local es definitiva. Creemos en la unidad de todos los creyentes verdaderos de la Iglesia, que es el Cuerpo de Cristo.",
          versiculos: [
            "1 Corintios 11:2",
            "Hechos 20:17-28",
            "1 Timoteo 3:1-13",
            "Hechos 2:41-42",
            "1 Corintios 12:12-13",
            "Efesios 1:22-23",
            "Efesios 3:1-6",
            "Efesios 4:11",
            "Efesios 5:23",
            "Colosenses 1:18",
          ],
          isOpen: false,
        },
        {
          pregunta: "14. El bautismo y la Cena del Señor",
          respuesta:
            "Creemos que el bautismo cristiano es la inmersión de un creyente en agua una sola vez en el nombre del Padre y del Hijo y del Espíritu Santo para testificar en un solemne y hermoso emblema de nuestra identificación con el Salvador crucificado, sepultado y resucitado, por quien hemos muerto al pecado y resucitado a una vida nueva; que el bautismo se administra bajo la autoridad de la iglesia local y que es un requisito para gozar de los privilegios de la membresía de la iglesia. Creemos que la Cena del Señor es la conmemoración de su muerte hasta que Él venga y que antes de participar de la Cena, uno debe examinarse solemnemente.",
          versiculos: [
            "Hechos 8:36,38-39",
            "Juan 3:23",
            "Romanos 6:3-5",
            "Mateo 28:18-20",
            "Hechos 2:41-42",
          ],
          isOpen: false,
        },
        {
          pregunta: "15. La separación",
          respuesta:
            "Creemos en la necesidad de obedecer los mandamientos bíblicos de separarnos para Dios de la mundanalidad y la apostasía eclesiástica.",
          versiculos: [
            "2 Corintios 6:14-7:1",
            "1 Tesalonicenses 1:9-10",
            "1 Timoteo 6:3-5",
            "Romanos 16:17",
            "2 Juan 1:9-11",
          ],
          isOpen: false,
        },
        {
          pregunta: "16. El gobierno civil",
          respuesta:
            "Creemos que el gobierno civil es establecido por Dios para el bienestar y el buen orden de la sociedad humana; que debemos orar por los gobernantes, honrarlos y obedecerlos, salvo en aquellos asuntos opuestos a la voluntad de nuestro Señor Jesucristo, quien es el único Señor de la conciencia y el Rey de reyes que viene.",
          versiculos: [
            "Romanos 13:1-7",
            "2 Samuel 23:3",
            "Éxodo 18:21-22",
            "Hechos 23:5",
            "Mateo 22:21",
            "Hechos 5:29",
            "Hechos 4:19-20",
            "Daniel 3:17-18",
          ],
          isOpen: false,
        },
        {
          pregunta: "17. Israel",
          respuesta:
            "Creemos en la elección soberana de Israel como pueblo perpetuo del pacto de Dios; que ahora está dispersa la nación a causa de su desobediencia y su rechazo de Cristo; y que será reunida en la Tierra Santa y, después de cumplirse la obra de la iglesia, se salvará como nación en la Segunda Venida de Cristo.",
          versiculos: ["Génesis 13:14-17", "Romanos 11:1-32", "Ezequiel 37"],
          isOpen: false,
        },
        {
          pregunta: "18. El Arrebatamiento y los acontecimientos posteriores",
          respuesta:
            "Creemos en el Rapto Pretribulacional de la Iglesia, un evento que puede ocurrir en cualquier momento; que en ese momento los muertos en Cristo serán resucitados en cuerpos glorificados y los que estén vivos en Cristo recibirán cuerpos glorificados sin experimentar la muerte; y que todos serán arrebatados para reunirse con el Señor en el aire antes de los siete años de la Tribulación. Creemos que la Tribulación, que sigue el Arrebatamiento de la Iglesia, culminará con el regreso Premilenial de Cristo en poder y gran gloria para sentarse en el trono de David y para establecer su reino sobre esta tierra.",
          versiculos: [
            "1 Tesalonicenses 4:13-18",
            "1 Corintios 15:42-44,51-54",
            "Filipenses 3:20-21",
            "Apocalipsis 3:10",
            "Daniel 9:25-27",
            "Mateo 24:29-31",
            "Lucas 1:30-33",
            "Isaías 9:6-7",
            "Isaías 11:1-9",
            "Hechos 2:29-30",
            "Apocalipsis 20:1-4,6",
          ],
          isOpen: false,
        },
        {
          pregunta: "19. Los justos y los malvados",
          respuesta:
            "Creemos que hay una diferencia radical y esencial entre los justos y los malvados; que sólo aquellos que son justificados por la fe en nuestro Señor Jesucristo y santificados por el Espíritu de nuestro Dios son verdaderamente justos ante El, mientras que todos los que siguen en la rebeldía y la incredulidad son malvados ante Él y bajo la maldición; y esta distinción se mantiene entre ellos, tanto en la muerte como después de ella-en la felicidad eterna de los salvos y el sufrimiento eterno consciente de los perdidos en el lago de fuego.",
          versiculos: [
            "Malaquías 3:18",
            "Génesis 18:23",
            "Romanos 6:17-18",
            "1 Juan 5:19",
            "Romanos 7:6",
            "Romanos 6:23",
            "Proverbios 14:32",
            "Lucas 16:25",
            "Mateo 25:34-41",
            "Juan 8:21",
            "Apocalipsis 20:14-15",
          ],
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
