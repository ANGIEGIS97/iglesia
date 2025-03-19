<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  eventos,
  usuarios,
  auth_api,
  type UserProfile,
  type EventoAPI,
  type Evento,
} from "../../lib/api.ts";
import EventoModal from "./modals/EventoModal.vue";

const eventList = ref<Evento[]>([]);
const error = ref("");
const formMode = ref<"closed" | "create" | "edit">("closed");
const editingEvent = ref<Evento | null>(null);
const isLoading = ref(true);
const userName = ref("");
const userProfiles = ref<{ [key: string]: UserProfile }>({});

const loadUserProfiles = async (events: Evento[]) => {
  const userIds = new Set<string>();
  events.forEach((event) => {
    if (event.createdBy) userIds.add(event.createdBy);
    if (event.updatedBy) userIds.add(event.updatedBy);
  });

  for (const userId of userIds) {
    try {
      const response = await usuarios.getById(userId);
      userProfiles.value[userId] = response.data;
    } catch (err) {
      console.error(`Error al cargar el perfil del usuario ${userId}:`, err);
    }
  }
};

const loadEvents = async () => {
  try {
    const response = await eventos.getAll();
    // Ordenar los eventos por fecha en orden descendente
    eventList.value = (response.data as EventoAPI[])
      .map((item) => ({
        id: item.id,
        titulo: item.titulo || "",
        descripcion: item.descripcion || "",
        eslogan: item.eslogan,
        linkBoton: item.linkBoton,
        image: item.image,
        fecha: item.fecha,
        createdAt: item.createdAt,
        createdBy: item.createdBy,
        updatedAt: item.updatedAt,
        updatedBy: item.updatedBy,
      }))
      .sort((a, b) => {
        const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0;
        const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0;
        return fechaB - fechaA;
      });

    await loadUserProfiles(eventList.value);
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
    console.error("Error al eliminar evento:", err);
    error.value = err.message || "Error al eliminar el evento";
    if (err.message.includes("No hay sesión activa")) {
      error.value =
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    }
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

const loadUserProfile = async () => {
  const currentUser = auth_api.getCurrentUser();
  if (currentUser) {
    const response = await usuarios.getById(currentUser.uid);
    userName.value = response.data.displayName;
  }
};

onMounted(() => {
  loadEvents();
  loadUserProfile();
});
</script>

<template>
  <div class="space-y-6 mt-24">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0"
    >
      <div>
        <h2
          class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent flex items-center gap-2"
        >
          Administrar Anuncios
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gestiona los anuncios y eventos especiales
        </p>
      </div>
      <button
        @click="formMode = 'create'"
        class="w-full sm:w-auto px-6 py-2.5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md flex items-center justify-center gap-2 text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Nuevo Anuncio
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

    <EventoModal
      :event="editingEvent || {}"
      :isEdit="formMode === 'edit'"
      :isOpen="formMode !== 'closed'"
      @submit="
        formMode === 'edit' ? handleUpdate($event) : handleCreate($event)
      "
      @cancel="closeForm"
    />

    <div v-if="isLoading" class="text-center py-4 dark:text-white">
      Cargando anuncios...
    </div>

    <div v-else-if="eventList.length === 0" class="text-center py-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <p class="text-xl font-semibold text-gray-600 dark:text-gray-400">
        No hay anuncios disponibles
      </p>
      <p class="text-gray-500 dark:text-gray-500 mt-2">
        Haz clic en "Nuevo Anuncio" para crear uno.
      </p>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div
        v-for="(evento, index) in eventList"
        :key="evento.id"
        class="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 relative"
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
              class="w-full h-[200px] object-cover rounded-md"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-50 rounded-md flex flex-col justify-center p-4 text-white"
            >
              <h3 class="sm:text-xl text-[16px] font-bold mb-1">
                {{ evento.titulo }}
              </h3>
              <p
                class="text-sm mb-2 admin-event-description"
                v-html="evento.descripcion"
              ></p>
              <div v-if="evento.eslogan || evento.linkBoton" class="text-sm">
                <a
                  v-if="evento.linkBoton"
                  :href="evento.linkBoton"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="border border-white bg-transparent text-white px-2 rounded hover:bg-white hover:bg-opacity-20 transition duration-300 font-vivaldi text-xl inline-block"
                >
                  {{ evento.eslogan || "Ver más" }}
                </a>
                <span
                  v-else
                  style="font-family: 'Vivaldi', cursive !important"
                  class="font-vivaldi text-2xl text-white"
                  >{{ evento.eslogan }}</span
                >
              </div>
            </div>
          </div>

          <div v-else class="flex-grow">
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {{ evento.titulo }}
            </h3>
            <p
              class="text-gray-600 dark:text-gray-400 mb-3 admin-event-description"
              v-html="evento.descripcion"
            ></p>

            <div
              v-if="evento.eslogan || evento.linkBoton"
              class="text-sm text-gray-500 dark:text-gray-400 mb-3"
            >
              <p
                v-if="evento.eslogan && !evento.linkBoton"
                style="font-family: 'Vivaldi', cursive !important"
                class="font-vivaldi text-2xl text-teal-600 dark:text-teal-400"
              >
                {{ evento.eslogan }}
              </p>
              <p v-else-if="evento.eslogan">Eslogan: {{ evento.eslogan }}</p>
              <p v-if="evento.linkBoton">Link: {{ evento.linkBoton }}</p>
            </div>
          </div>

          <!-- Información de creación y modificación -->
          <div
            class="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-2 space-y-1 border-t border-gray-200 dark:border-gray-600 pt-2"
          >
            <div class="flex flex-wrap items-center gap-x-4">
              <div
                v-if="evento.createdBy && userProfiles[evento.createdBy]"
                class="flex items-center"
              >
                <span class="font-medium mr-1">Agregado por:</span>
                <span class="text-teal-600 dark:text-teal-400">
                  {{ userProfiles[evento.createdBy].displayName || "Usuario" }}
                </span>
              </div>
              <div
                v-if="evento.updatedBy && userProfiles[evento.updatedBy]"
                class="flex items-center"
              >
                <span class="font-medium mr-1">Modificado por:</span>
                <span class="text-teal-600 dark:text-teal-400">
                  {{ userProfiles[evento.updatedBy].displayName || "Usuario" }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex space-x-2 mt-auto">
            <button
              @click="startEdit(evento)"
              class="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
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

<style>
@font-face {
  font-family: "Vivaldi";
  src: url("/fonts/vivaldi.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.font-vivaldi {
  font-family: "Vivaldi", cursive !important;
}

/* Estilos para las etiquetas strong en las descripciones de eventos */
.admin-event-description :deep(strong) {
  @apply font-bold text-teal-600 dark:text-teal-400;
}

/* Para descripciones sobre imagen (fondo oscuro) */
.bg-black .admin-event-description :deep(strong) {
  @apply text-yellow-300 font-extrabold;
}
</style>
