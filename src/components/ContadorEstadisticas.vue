<template>
  <div style="display: none;"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { auth_api } from "../lib/api.ts";
import { useStatsStore } from "../stores/useStatsStore";

const statsStore = useStatsStore();
let unsubscribeAuth = null;

onMounted(() => {
  unsubscribeAuth = auth_api.onAuthStateChange((user) => {
    statsStore.cargar(user?.uid || "invitado");
  });
});

onBeforeUnmount(() => {
  if (unsubscribeAuth) unsubscribeAuth();
});
</script>
