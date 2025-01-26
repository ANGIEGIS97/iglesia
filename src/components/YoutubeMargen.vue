<template>
    <div class="container mx-auto px-4 sm:px-6 lg:px-32">
      <h2 class="text-3xl font-bold mb-6">Últimos sermones</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(sermon, index) in sermones"
          :key="index"
          class="bg-white rounded-lg overflow-hidden shadow-lg"
        >
          <img
            :src="sermon.image"
            :alt="sermon.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2">{{ sermon.title }}</h3>
            <p class="text-gray-600 text-sm mb-2">
              {{ sermon.author }} | {{ sermon.date }}
            </p>
            <div
              class="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded mb-2 inline-block"
            >
              {{ sermon.verse }}
            </div>
            <p class="text-gray-700 text-sm">{{ sermon.excerpt }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sermones: [
          {
            title: "Dudas legítimas vs. incredulidad pedante",
            author: "Alejandro Peluffo",
            date: "21/07/2024",
            verse: "LUCAS 7:18-35",
            excerpt:
              "Porque vino Juan el Bautista, que ni comía pan ni bebía vino, y decís: Demonio tiene. Vino el Hijo del Hombre, que come y bebe, y decís: Este es un hombre comilón y bebedor de vino, amigo de publicanos y de pecadores. Mas la sabiduría es justificada por todos sus hijos.",
            image: "path/to/image1.jpg",
          },
          {
            title: "Esperando activamente la venida del Señor",
            author: "Alejandro Peluffo",
            date: "14/07/2024",
            verse: "MATEO 25:14-30",
            excerpt:
              "Después de mucho tiempo vino el señor de aquellos siervos, y arregló cuentas con ellos... Porque al que tiene, le será dado, y tendrá más; y al que no tiene, aun lo que tiene le será quitado...",
            image: "path/to/image2.jpg",
          },
          {
            title:
              "El dominio malvado pero transitorio de las potencias mundiales (Parte 2)",
            author: "Jonathan Willoughby",
            date: "07/07/2024",
            verse: "DANIEL 11:20-45",
            excerpt:
              "Pero noticias del oriente y del norte lo atemorizarán, y saldrá con gran ira para destruir y matar a muchos. Y plantará las tiendas de su palacio entre los mares y el monte glorioso y santo; mas llegará a su fin, y no tendrá quien le ayude.",
            image: "path/to/image3.jpg",
          },
        ],
      };
    },
  };
  </script>
  