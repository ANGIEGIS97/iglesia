AdminEventList con checked
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
import NotificacionXP from "../NotificacionXP.vue";

// Declaración para TypeScript: extender la interfaz Window
declare global {
  interface Window {
    actualizarContadorEstadisticas?: () => void;
    actualizarContador?: (tipo: string, accion: string) => void;
  }
}

const eventList = ref<Evento[]>([]);
const error = ref("");
const formMode = ref<"closed" | "create" | "edit">("closed");
const editingEvent = ref<Evento | null>(null);
const isLoading = ref(true);
const userName = ref("");
const userProfiles = ref<{ [key: string]: UserProfile }>({});
const selectedEvents = ref<string[]>([]);
const isAllSelected = ref(false);

// Notificaciones XP
const showXpNotification = ref(false);
const xpAmount = ref(0);
const xpMessage = ref("");
const tipoXP = ref("evento");
const accionXP = ref("agregados");

// Función para mostrar notificación XP
const showXpNotif = (
  amount: number,
  message: string,
  tipo: string = "evento",
  accion: string = "agregados"
) => {
  xpAmount.value = amount;
  xpMessage.value = message;
  tipoXP.value = tipo;
  accionXP.value = accion;
  showXpNotification.value = true;

  console.log(`AdminEventList - showXpNotif: tipo=${tipo}, accion=${accion}`);

  // Actualizar experiencia en el sidebar si está disponible
  const sidebarComponent = document.querySelector("admin-sidebar");
  if (sidebarComponent && "awardXp" in sidebarComponent) {
    (sidebarComponent as any).awardXp(amount);
  } else {
    // Si no existe aún el componente, guardar el XP en localStorage
    const user = auth_api.getCurrentUser();
    if (user?.uid) {
      const tempXpKey = `tempXp_${user.uid}`;
      const currentXp = localStorage.getItem(tempXpKey)
        ? parseInt(localStorage.getItem(tempXpKey) || "0")
        : 0;
      localStorage.setItem(tempXpKey, (currentXp + amount).toString());
    }
  }

  // Actualizar contador manualmente para mayor seguridad
  actualizarContadorManualmente(tipo, accion);

  // Actualizar contadores mediante función global
  if (window.actualizarContadorEstadisticas) {
    setTimeout(() => window.actualizarContadorEstadisticas(), 500);
  }

  // Ocultar después de 3 segundos
  setTimeout(() => {
    showXpNotification.value = false;
  }, 3000);
};

// Función para actualizar el contador manualmente
const actualizarContadorManualmente = (tipo: string, accion: string) => {
  // Verificar si existe la función global para actualizar contadores
  if (window.actualizarContador) {
    window.actualizarContador(tipo, accion);
    console.log(
      `Contador actualizado para ${tipo}.${accion} usando función global en AdminEventList`
    );
    return;
  }

  // Método de respaldo en caso de que la función global no esté disponible
  console.warn(
    "La función global actualizarContador no está disponible, usando método local"
  );

  const contadorKey = "estadisticasContador";
  let contador = JSON.parse(localStorage.getItem(contadorKey) || "{}");

  // Inicializar contador si no existe
  if (!contador) contador = {};

  // Estructura: { eventos: { agregados: 0, eliminados: 0, modificados: 0 }, fechas: { agregados: 0, eliminados: 0, modificados: 0 } }
  if (!contador.eventos)
    contador.eventos = { agregados: 0, eliminados: 0, modificados: 0 };
  if (!contador.fechas)
    contador.fechas = { agregados: 0, eliminados: 0, modificados: 0 };

  // Incrementar el contador correspondiente
  if (tipo === "evento" || tipo === "eventos") {
    contador.eventos[accion] = (contador.eventos[accion] || 0) + 1;
  } else if (tipo === "fecha" || tipo === "fechas") {
    contador.fechas[accion] = (contador.fechas[accion] || 0) + 1;
  }

  // Guardar en localStorage
  localStorage.setItem(contadorKey, JSON.stringify(contador));
  console.log("Contador actualizado manualmente en AdminEventList:", contador);
};

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
    console.error("Error al cargar los eventos:", err);
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
    // Otorgar XP al crear un nuevo anuncio
    showXpNotif(30, "¡Nuevo anuncio creado!", "evento", "agregados");
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
    // Otorgar XP al actualizar un anuncio
    showXpNotif(20, "¡Anuncio actualizado!", "evento", "modificados");
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
    // Otorgar XP al eliminar un anuncio
    showXpNotif(10, "¡Anuncio eliminado!", "evento", "eliminados");
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

// Selección de eventos
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedEvents.value = [];
  } else {
    selectedEvents.value = eventList.value.map((e) => e.id);
  }
  isAllSelected.value = !isAllSelected.value;
};

const deleteSelected = async () => {
  if (selectedEvents.value.length === 0) return;

  if (
    !confirm(
      `¿Estás seguro de que deseas eliminar ${selectedEvents.value.length} anuncios seleccionados?`
    )
  )
    return;

  try {
    error.value = "";
    const selectedCount = selectedEvents.value.length; // Guardar la cantidad antes de reiniciar
    for (const id of selectedEvents.value) {
      await eventos.delete(id);
    }
    await loadEvents();
    selectedEvents.value = [];
    isAllSelected.value = false;
    // Otorgar XP por eliminación masiva
    const xpAmountForSelection = selectedCount === 1 ? 10 : 7 * selectedCount;
    const message = `¡${selectedCount} anuncio${
      selectedCount !== 1 ? "s" : ""
    } eliminado${selectedCount !== 1 ? "s" : ""}!`;
    showXpNotif(xpAmountForSelection, message, "evento", "eliminados");
  } catch (err: any) {
    console.error("Error al eliminar eventos:", err);
    error.value = err.message || "Error al eliminar los eventos";
    if (err.message.includes("No hay sesión activa")) {
      error.value =
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    }
  }
};

onMounted(() => {
  loadEvents();
  loadUserProfile();
});
</script>

<template>
  <div class="space-y-6 mt-24">
    <!-- Notificación XP -->
    <NotificacionXP
      :show="showXpNotification"
      :amount="xpAmount"
      :message="xpMessage"
      :tipo="tipoXP"
      :accion="accionXP"
    />

    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0"
    >
      <div class="flex items-center gap-4">
        <!-- Título -->
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
      </div>
      <div class="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
        <!-- Botón de eliminar seleccionados -->
        <transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <button
            v-if="selectedEvents.length > 0"
            @click="deleteSelected"
            class="w-full sm:w-auto px-4 py-2 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md flex items-center justify-center gap-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 order-2 sm:order-1"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Eliminar {{ selectedEvents.length }} seleccionados
          </button>
        </transition>
        <button
          @click="formMode = 'create'"
          class="w-full sm:w-auto px-6 py-2.5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 shadow-md flex items-center justify-center gap-2 text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 order-1 sm:order-2"
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
      @delete="() => handleDelete(editingEvent?.id)"
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
        <!-- Checkbox para selección -->
        <div class="absolute top-3 left-3 z-[5]">
          <input
            type="checkbox"
            :checked="selectedEvents.includes(evento.id)"
            @change="e => (e.target as HTMLInputElement).checked ? selectedEvents.push(evento.id) : selectedEvents.splice(selectedEvents.indexOf(evento.id), 1)"
            class="form-checkbox h-5 w-5 text-teal-600 rounded-full border-gray-300 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 opacity-60 hover:opacity-100 transition-opacity duration-200"
          />
        </div>
        <!-- Numeración -->
        <div
          class="absolute top-3 right-3 z-[5] bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md"
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
