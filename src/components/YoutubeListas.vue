<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-center">
      Listas de reproducción del canal
    </h1>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <img
          :src="playlist.thumbnail"
          :alt="playlist.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2 truncate">
            {{ playlist.title }}
          </h3>
          <p class="text-gray-600 text-sm">{{ playlist.videoCount }} videos</p>
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
      error: null,
    };
  },
  created() {
    this.fetchPlaylists();
  },
  methods: {
    async fetchPlaylists() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,contentDetails&maxResults=10`
        );
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        this.playlists = data.items.map((item) => ({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          videoCount: item.contentDetails.itemCount,
        }));
      } catch (err) {
        this.error = `Error al obtener los datos: ${err.message}`;
      }
    },
  },
};
</script>
