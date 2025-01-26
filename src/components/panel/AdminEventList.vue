<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { eventos } from "../../lib/api.ts";
import EventForm from "./EventForm.vue";

const eventList = ref([]);
const error = ref("");
const formMode = ref<"closed" | "create" | "edit">("closed");
const editingEvent = ref(null);
const isLoading = ref(false);

const loadEvents = async () => {
  try {
    isLoading.value = true;
    const response = await eventos.getAll();
    // Ordenar los eventos por ID en orden descendente
    eventList.value = response.data.sort((a, b) => b.id - a.id);
  } catch (err) {
    error.value = "Error al cargar los eventos";
  } finally {
    isLoading.value = false;
  }
};

const handleCreate = async (eventData) => {
  try {
    error.value = "";
    await eventos.create(eventData);
    formMode.value = "closed";
    await loadEvents();
  } catch (err: any) {
    error.value = err.response?.data?.mensaje || "Error al crear el evento";
  }
};

const handleUpdate = async (eventData) => {
  if (!editingEvent.value?.id) {
    error.value = "ID del evento no encontrado";
    return;
  }

  try {
    error.value = "";
    const updatedData = {};

    // Solo incluir campos que han sido cambiados
    for (const key in eventData) {
      if (
        eventData[key] !== null &&
        eventData[key] !== undefined &&
        eventData[key] !== ""
      ) {
        updatedData[key] = eventData[key];
      }
    }

    // Si no se cambiaron campos, no hacer la llamada a la API
    if (Object.keys(updatedData).length === 0) {
      error.value = "No se realizaron cambios";
      return;
    }

    await eventos.update(editingEvent.value.id, updatedData);
    formMode.value = "closed";
    editingEvent.value = null;
    await loadEvents();
  } catch (err: any) {
    error.value =
      err.response?.data?.mensaje || "Error al actualizar el evento";
  }
};

const handleDelete = async (id) => {
  if (!confirm("¿Estás seguro de que deseas eliminar este evento?")) return;

  try {
    error.value = "";
    await eventos.delete(id);
    await loadEvents();
  } catch (err: any) {
    error.value = err.response?.data?.mensaje || "Error al eliminar el evento";
  }
};

const startEdit = (evento) => {
  editingEvent.value = { ...evento };
  formMode.value = "edit";
};

const closeForm = () => {
  formMode.value = "closed";
  editingEvent.value = null;
};

// Watch for changes in formMode to handle scroll
watch(formMode, (newMode) => {
  if (newMode !== "closed") {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }
});

onMounted(() => {
  loadEvents();
});
</script>

<template>
  <div class="container mx-auto px-1 py-8 mt-24">
    <div class="sticky top-0 z-10 pb-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          Administrar Anuncios
        </h2>
        <button
          v-if="formMode === 'closed'"
          @click="formMode = 'create'"
          class="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm"
        >
          Agregar Anuncio
        </button>
      </div>

      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      >
        <span class="block sm:inline">{{ error }}</span>
        <span
          class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
          @click="error = ''"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      </div>
    </div>

    <EventForm
      :event="editingEvent || {}"
      :isEdit="formMode === 'edit'"
      :isOpen="formMode !== 'closed'"
      @submit="
        formMode === 'edit' ? handleUpdate($event) : handleCreate($event)
      "
      @cancel="closeForm"
    />

    <div v-if="isLoading" class="text-center py-4">Cargando anuncios...</div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div
        v-for="(evento, index) in eventList"
        :key="evento.id"
        class="bg-white p-2 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative"
      >
        <div
          class="absolute top-4 right-4 z-[5] bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md"
        >
          {{ index + 1 }}
        </div>
        <div class="flex flex-col h-full">
          <div v-if="evento.image" class="mb-2 relative">
            <img
              :src="evento.image"
              :alt="evento.titulo"
              class="w-full h-48 object-cover rounded-md"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-50 rounded-md flex flex-col justify-center p-4 text-white"
            >
              <h3 class="text-xl font-bold mb-2">{{ evento.titulo }}</h3>
              <p class="text-sm mb-4">{{ evento.descripcion }}</p>
              <div v-if="evento.textoBoton || evento.linkBoton" class="text-sm">
                <a
                  v-if="evento.linkBoton"
                  :href="evento.linkBoton"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                >
                  {{ evento.textoBoton || "Ver más" }}
                </a>
                <span v-else class="text-white">{{ evento.textoBoton }}</span>
              </div>
            </div>
          </div>

          <div v-else class="flex-grow">
            <h3 class="text-xl font-bold text-gray-800 mb-2">
              {{ evento.titulo }}
            </h3>
            <p class="text-gray-600 mb-3">{{ evento.descripcion }}</p>

            <div
              v-if="evento.textoBoton || evento.linkBoton"
              class="text-sm text-gray-500 mb-3"
            >
              <p v-if="evento.textoBoton">
                Texto del botón: {{ evento.textoBoton }}
              </p>
              <p v-if="evento.linkBoton">Link: {{ evento.linkBoton }}</p>
            </div>
          </div>

          <div class="flex space-x-2 mt-auto">
            <button
              @click="startEdit(evento)"
              class="flex-1 px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
            >
              Editar
            </button>
            <button
              @click="handleDelete(evento.id)"
              class="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
