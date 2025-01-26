<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-center">
      Videos por Lista de Reproducción
    </h1>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else-if="loading" class="text-center">Cargando...</div>
    <div v-else>
      <select
        v-model="selectedPlaylistId"
        @change="fetchVideosFromPlaylist"
        class="mb-4 p-2 border rounded"
      >
        <option value="">Selecciona una lista de reproducción</option>
        <option
          v-for="playlist in playlists"
          :key="playlist.id"
          :value="playlist.id"
        >
          {{ playlist.title }}
        </option>
      </select>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="video in videos"
          :key="video.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
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
            <p class="text-gray-600 text-sm">{{ video.description }}</p>
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
      playlists: [],
      selectedPlaylistId: "",
      videos: [],
      error: null,
      loading: true,
    };
  },
  created() {
    this.fetchPlaylists();
  },
  methods: {
    async fetchPlaylists() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?key=${this.apiKey}&channelId=${this.channelId}&part=snippet&maxResults=50`
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        this.playlists = data.items.map((item) => ({
          id: item.id,
          title: item.snippet.title,
        }));
        this.loading = false;
      } catch (err) {
        this.error = `Error al obtener las listas de reproducción: ${err.message}`;
        this.loading = false;
      }
    },
    async fetchVideosFromPlaylist() {
      if (!this.selectedPlaylistId) return;

      this.loading = true;
      this.videos = [];
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?key=${this.apiKey}&playlistId=${this.selectedPlaylistId}&part=snippet&maxResults=50`
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        this.videos = data.items.map((item) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
        }));
      } catch (err) {
        this.error = `Error al obtener los videos: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
