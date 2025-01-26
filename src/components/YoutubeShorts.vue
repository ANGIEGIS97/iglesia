<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-center">Videos del canal</h1>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else>
      <div v-if="selectedVideo" class="mb-6">
        <iframe
          :src="'https://www.youtube.com/embed/' + selectedVideo"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
          class="w-full h-64 md:h-96"
        ></iframe>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="video in videos"
          :key="video.id"
          class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          @click="selectVideo(video.id)"
        >
          <img
            :src="video.thumbnail"
            :alt="video.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="text-xl font-semibold mb-2 truncate">
              {{ video.title }}
            </h3>
            <p class="text-gray-600 text-sm line-clamp-3">
              {{ video.description }}
            </p>
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
      apiKey: "AIzaSyCqHZk1vP6pAVMIuPWpzdzfB92SCLbF-d4",
      channelId: "UCPP7f0ZyCyZo8I_qgwFqveQ",
      videos: [],
      error: null,
      selectedVideo: null,
    };
  },
  created() {
    this.fetchVideos();
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet&type=video&order=date&maxResults=30`
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        this.videos = data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
        }));
      } catch (err) {
        this.error = `Error al obtener los datos: ${err.message}`;
      }
    },
    selectVideo(videoId) {
      this.selectedVideo = videoId;
    },
  },
};
</script>
