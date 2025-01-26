<template>
  <section
    class="px-4 sm:px-6 2xl:px-80 py-10 sm:py-14 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white"
  >
    <article>
      <h1
        class="text-gray-800 dark:text-white text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-8"
      >
        Sobre nosotros
      </h1>
      <p
        class="text-justify my-6 first-letter:text-7xl first-letter:text-black dark:first-letter:text-teal-400 first-letter:mr-3 first-letter:float-left text-lg text-gray-700 dark:text-gray-200 leading-relaxed font-serif"
      >
        {{ displayText }}
      </p>
      <button
        @click="toggleReadMore"
        class="mt-4 text-teal-600 dark:text-teal-400 hover:underline focus:outline-none"
      >
        {{ isExpanded ? "Leer menos" : "Leer más" }}
      </button>
      <div
        class="flex flex-wrap border-t justify-start gap-2 border-gray-300 dark:border-gray-600 p-4 mt-6"
      >
        <span
          class="border-2 border-teal-600 rounded-lg text-sm px-3 py-1 flex-shrink-0 text-teal-600 dark:text-teal-white dark:border-teal-400 dark:text-white hover:bg-teal-600 hover:text-white transition duration-300 cursor-pointer"
        >
          Salmo 119:160
        </span>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  data() {
    return {
      fullText:
        "La Iglesia Bautista de Bosa SU GRACIA ES MAYOR fue fundada el 13 de febrero de 2022 en la localidad de Bosa. La iglesia nació con el firme propósito de difundir el mensaje bíblico de Jesucristo a través de la predicación expositiva, evangelismo, discipulado y misiones, además de servir a la comunidad, apoyada por un grupo de iglesias madres de la Federación Bautista Independiente De Colombia. La fundación de nuestra Iglesia fue posible gracias a la misericordia de Dios, el cual uso a la Iglesia Bautista Emanuel De Perdomo, Iglesia Bautista Gracia En Abundancia, Iglesia Bautista Esperanza De Soacha, los cuales después de tres años de estar orando como iglesias, Dios como respuesta a estas oraciones dispone el lugar para el desarrollo de su obra en la UNIDAD DE PLANEAMIENTO ZONAL (UPZ) Bosa Centro. El desarrollo de la obra empezó con estudios bíblicos a través de la plataforma zoom (esto debido a la pandemia mundial COVID-19) en el año 2021 los días sábados, dando como resultado las primeras familias que se convirtieron al cristianismo, así como hermanos que se ubicaban en la localidad de bosa. Dado que sabemos que la Iglesia local es el cuerpo reunido de las personas que confesaron y pusieron la fe en nuestro señor Jesucristo, comenzaron a solicitar un lugar presencial para congregarse, razón por la que se empezó con las reuniones presenciales el día 13 de febrero de 2022 en salón comunal Piamonte pero que a través de los meses Dios nos guio al salón comunal ASOVIVIR, lugar donde nos encontramos actualmente. Para el liderazgo de la iglesia Dios por medio del Pastor Marco Orjuela (pastor Iglesia Bautista Emanuel De Perdomo), Héctor Lopez (pastor Iglesia Bautista Gracia En Abundancia), Julián Martínez (pastor Iglesia Bautista Esperanza De Soacha), Daniel mee (misionero ABWE-Asociación Bautista para la Evangelización Mundial) encomendaron al pastor Oscar Páez (Pastor Iglesia Bautista Emanuel De Perdomo), quien, tras ser elegido por llamado de Dios, realizo el establecimiento de la congregación. El pastor Oscar Páez junto con su esposa Tatiana, el pastor Daniel Mee junto con su esposa Jennifer y su familia, misioneros de Estados Unidos que desempeñaron un papel crucial en la creación de nuestra iglesia, Diana Quiroga, Angélica Triviño, Stiven Quintero, Yenny Merentes luego de un servicio de encomendación el día 06 de febrero de 2022  hecho por todas las Iglesias madres, han liderado el crecimiento de la congregación desde sus inicios. Nuestra iglesia ha crecido con la misión de seguir los principios y enseñanzas establecidos por medio de nuestro señor Jesucristo, a través de su palabra (2 tim 3:16) ofreciendo un espacio para el estudio de la palabra de Dios, la oración, la comunión,  y crecimiento espiritual para las personas en Bosa (mat 28: 19-20).  La Iglesia Bautista De Bosa Su Gracia Es Mayor, es una iglesia con el propósito de ser una iglesia que evangelice, que desarrolle la gran comisión, así como un lugar donde encontraras una familia.",
      isExpanded: false,
    };
  },
  computed: {
    displayText() {
      if (this.isExpanded) {
        return this.fullText;
      } else {
        return this.fullText.slice(0, 300) + "...";
      }
    },
  },
  methods: {
    toggleReadMore() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>
