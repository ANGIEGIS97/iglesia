<template>
  <section
    class="px-4 sm:px-6 2xl:px-80 py-8 sm:py-12 transition duration-300 ease-in-out selection:bg-teal-500 selection:text-white bg-gray-100 dark:bg-slate-700"
  >
    <article>
      <!-- Header -->
      <div class="flex flex-col mb-10 items-center text-center">
        <p class="text-teal-500 font-bold tracking-[0.2em] text-sm mb-2 uppercase">#Nosotros</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Sobre <span class="text-outline">Nosotros</span>
        </h1>
      </div>

      <!-- Navigation Pills -->
      <div class="mb-8 overflow-x-auto pb-2">
        <div class="flex gap-2 min-w-max justify-center flex-wrap">
          <button
            v-for="event in events"
            :key="event.id"
            @click="activeEvent = event.id"
            :class="[
              'pill-button',
              activeEvent === event.id ? 'pill-active' : 'pill-inactive'
            ]"
          >
            <span class="pill-date">{{ event.date }}</span>
            <span class="pill-separator">•</span>
            <span class="pill-title">{{ event.title }}</span>
          </button>
        </div>
      </div>

      <!-- Content Area with Transition -->
      <transition name="fade-slide" mode="out-in">
        <div :key="activeEvent" class="content-container">
          <p class="content-text">
            {{ currentEventContent }}
          </p>
        </div>
      </transition>
    </article>
  </section>
</template>

<script>
export default {
  data() {
    return {
      activeEvent: 'inicio',
      events: [
        {
          id: 'inicio',
          date: '2021',
          title: 'Los Inicios',
          icon: '🙏',
          content: 'La fundación de nuestra Iglesia fue posible gracias a la misericordia de Dios, el cual usó a la Iglesia Bautista Emanuel De Perdomo, Iglesia Bautista Gracia En Abundancia, e Iglesia Bautista Esperanza De Soacha. Después de tres años de estar orando como iglesias, Dios como respuesta a estas oraciones dispone el lugar para el desarrollo de su obra en la UNIDAD DE PLANEAMIENTO ZONAL (UPZ) Bosa Centro. El desarrollo de la obra empezó con estudios bíblicos a través de la plataforma Zoom (esto debido a la pandemia mundial COVID-19) en el año 2021 los días sábados, dando como resultado las primeras familias que se convirtieron al cristianismo, así como hermanos que se ubicaban en la localidad de Bosa.'
        },
        {
          id: 'encomendacion',
          date: '6 Feb 2022',
          title: 'Encomendación',
          icon: '✝️',
          content: 'Para el liderazgo de la iglesia, Dios por medio del Pastor Marco Orjuela (pastor Iglesia Bautista Emanuel De Perdomo), Héctor Lopez (pastor Iglesia Bautista Gracia En Abundancia), Julián Martínez (pastor Iglesia Bautista Esperanza De Soacha), y Daniel Mee (misionero ABWE-Asociación Bautista para la Evangelización Mundial) encomendaron al pastor Oscar Páez, quien tras ser elegido por llamado de Dios, realizó el establecimiento de la congregación. Luego de un servicio de encomendación el día 06 de febrero de 2022 hecho por todas las Iglesias madres, el equipo comenzó a liderar el crecimiento de la congregación.'
        },
        {
          id: 'fundacion',
          date: '13 Feb 2022',
          title: 'Fundación',
          icon: '⛪',
          content: 'La Iglesia Bautista de Bosa SU GRACIA ES MAYOR fue fundada el 13 de febrero de 2022 en la localidad de Bosa. Dado que sabemos que la Iglesia local es el cuerpo reunido de las personas que confesaron y pusieron la fe en nuestro señor Jesucristo, comenzaron a solicitar un lugar presencial para congregarse. Se empezó con las reuniones presenciales el día 13 de febrero de 2022 en salón comunal Piamonte, pero a través de los meses Dios nos guió al salón comunal ASOVIVIR, lugar donde nos encontramos actualmente.'
        },
        {
          id: 'mision',
          date: 'Actualidad',
          title: 'Nuestra Misión',
          icon: '🌟',
          content: 'La iglesia nació con el firme propósito de difundir el mensaje bíblico de Jesucristo a través de la predicación expositiva, evangelismo, discipulado y misiones, además de servir a la comunidad, apoyada por un grupo de iglesias madres de la Federación Bautista Independiente De Colombia. Nuestra iglesia ha crecido con la misión de seguir los principios y enseñanzas establecidos por medio de nuestro señor Jesucristo, a través de su palabra (2 Tim 3:16) ofreciendo un espacio para el estudio de la palabra de Dios, la oración, la comunión, y crecimiento espiritual para las personas en Bosa (Mat 28:19-20). La Iglesia Bautista De Bosa Su Gracia Es Mayor es una iglesia con el propósito de evangelizar, desarrollar la gran comisión, así como un lugar donde encontrarás una familia.'
        }
      ]
    };
  },
  computed: {
    activeEventIndex() {
      return this.events.findIndex(e => e.id === this.activeEvent);
    },
    currentEventContent() {
      const event = this.events.find(e => e.id === this.activeEvent);
      return event ? event.content : '';
    }
  }
};
</script>

<style scoped>
.text-outline {
  -webkit-text-stroke: 1.5px black;
  color: transparent;
}
.dark .text-outline {
  -webkit-text-stroke: 1.5px white;
}

/* Pills Navigation */
.pill-button {
  @apply flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer;
  @apply border font-normal text-sm;
}

.pill-active {
  @apply bg-teal-500 border-teal-500;
  @apply text-white;
}

.pill-inactive {
  @apply bg-transparent border-gray-300 dark:border-gray-600;
  @apply text-gray-600 dark:text-gray-400;
  @apply hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400;
}

.pill-date {
  @apply text-xs font-medium uppercase tracking-wide;
}

.pill-separator {
  @apply opacity-50;
}

.pill-title {
  @apply text-sm font-normal;
}

/* Content */
.content-container {
  @apply mb-4;
}

.content-text {
  @apply text-justify text-lg text-gray-700 dark:text-gray-200 leading-relaxed font-serif;
  @apply first-letter:text-7xl first-letter:text-teal-600 dark:first-letter:text-teal-400;
  @apply first-letter:mr-3 first-letter:float-left first-letter:font-bold;
}

/* Verse */
.verse-container {
  @apply flex flex-wrap border-t justify-start gap-2 border-gray-300 dark:border-gray-600 p-4 mt-8;
}

.verse-tag {
  @apply border-2 border-teal-600 rounded-lg text-sm px-3 py-1 flex-shrink-0;
  @apply text-teal-600 dark:border-teal-400 dark:text-white;
  @apply hover:bg-teal-600 hover:text-white transition duration-300 cursor-pointer;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
