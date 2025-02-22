<template>
  <div class="container mx-auto px-4 py-8 lg:px-32">
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else>
      <!-- Video destacado -->
      <div v-if="videos.length > 0" class="mb-8">
        <div
          class="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div>
            <img
              :src="videos[0].thumbnail"
              :alt="videos[0].title"
              class="w-full h-full object-cover rounded-lg"
            />
            <div
              class="absolute inset-0 flex items-center justify-center"
            ></div>
          </div>
          <div class="md:w-1/2 p-6">
            <h2 class="text-2xl font-bold mb-4">{{ videos[0].title }}</h2>
            <p class="text-gray-600 mb-4">{{ videos[0].description }}</p>
            <p class="text-sm text-gray-500">{{ videos[0].date }}</p>
          </div>
        </div>
      </div>

      <!-- Carrusel de videos -->
      <h3 class="text-xl font-bold mb-4">Últimos videos</h3>
      <swiper
        :slides-per-view="4"
        :space-between="30"
        :navigation="true"
        :pagination="{ clickable: true }"
        :breakpoints="{
          '420': {
            slidesPerView: 2,
            spaceBetween: 7,
          },
          '768': {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          '1020': {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }"
      >
        <swiper-slide v-for="video in videos.slice(1)" :key="video.id">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              :src="video.thumbnail"
              :alt="video.title"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h4 class="text-sm sm:text-lg font-semibold mb-2 truncate">
                {{ video.title }}
              </h4>
              <p class="text-gray-600 text-sm mb-2">{{ video.author }}</p>
              <p class="text-gray-500 text-xs">{{ video.date }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      apiKey: "",
      channelId: "UCPP7f0ZyCyZo8I_qgwFqveQ",
      videos: [],
      error: null,
    };
  },
  created() {
    this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet&type=video&order=date&maxResults=7`
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        this.videos = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          author: item.snippet.channelTitle,
          date: new Date(item.snippet.publishedAt).toLocaleDateString(),
        }));
      } catch (err) {
        this.error = `Error al obtener los datos: ${err.message}`;
      }
    },
  },
};
</script>
