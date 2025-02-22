<template>
  <div class="space-y-6 mt-24">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-0"
    >
      <div>
        <h1
          class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent"
        >
          Administrar Fechas
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gestiona las fechas importantes
        </p>
      </div>
      <div class="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
        <!-- Menú de acciones masivas - Solo visible en escritorio -->
        <transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <div
            v-if="selectedFechas.length > 0"
            class="hidden md:flex items-center gap-2 order-2 sm:order-1"
          >
            <span
              class="text-sm text-gray-600 dark:text-gray-300 hidden lg:inline"
              >{{ selectedFechas.length }} seleccionados</span
            >
            <button
              @click="deleteSelected"
              class="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm font-medium flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
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
              Eliminar seleccionados
            </button>
          </div>
        </transition>
        <button
          @click="openModal()"
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
          Nueva Fecha
        </button>
      </div>
    </div>

    <!-- Notificación de Error -->
    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
      <span
        class="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
        @click="errorMessage = ''"
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

    <!-- Lista de Fechas -->
    <div v-if="isLoading" class="text-center py-4 dark:text-white">
      Cargando fechas...
    </div>

    <div v-else-if="fechas.length === 0" class="text-center py-8">
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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p class="text-xl font-semibold text-gray-600 dark:text-gray-400">
        No hay fechas disponibles
      </p>
      <p class="text-gray-500 dark:text-gray-500 mt-2">
        Haz clic en "Nueva Fecha" para crear una.
      </p>
    </div>

    <div
      v-else
      class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
    >
      <!-- Vista de tabla para tablet y desktop -->
      <table
        class="hidden md:table min-w-full divide-y divide-gray-200 dark:divide-gray-900 dark:text-white"
      >
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              class="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-8"
            >
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </th>
            <th
              class="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              #
            </th>
            <th
              class="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Fecha
            </th>
            <th
              class="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Título
            </th>
            <th
              class="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Hora
            </th>
            <th
              class="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Lugar/Link
            </th>
            <th
              class="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Detalles
            </th>
            <th
              class="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Días
            </th>
            <th
              class="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Agregado por
            </th>
            <th
              class="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Modificado por
            </th>
            <th
              class="px-3 md:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody
          class="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-900"
        >
          <tr
            v-for="(fecha, index) in fechas"
            :key="fecha.id"
            class="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <td class="px-3 md:px-4 lg:px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                v-model="selectedFechas"
                :value="fecha.id"
                class="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </td>
            <td class="px-3 md:px-4 lg:px-6 py-4 whitespace-nowrap font-medium">
              {{ index + 1 }}
            </td>
            <td class="px-3 md:px-4 lg:px-6 py-4 whitespace-nowrap">
              {{ formatDate(fecha.fecha) }}
            </td>
            <td class="px-3 md:px-4 lg:px-6 py-4 max-w-[200px] truncate">
              {{ fecha.titulo }}
              <div class="lg:hidden text-sm text-gray-500">
                {{ fecha.hora }} - {{ fecha.lugar }}
              </div>
            </td>
            <td class="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-4">
              {{ fecha.hora }}
            </td>
            <td
              class="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-4 max-w-[200px] truncate"
            >
              {{ fecha.lugar }}
            </td>
            <td class="px-3 md:px-4 lg:px-6 py-4">
              <div class="flex items-center space-x-2">
                <span v-if="fecha.banner" title="Tiene banner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span
                  v-if="fecha.infoIconoTexto"
                  :class="`inline-flex items-center justify-center w-5 h-5 rounded-full ${getColorClass(
                    fecha.infoIconoTexto
                  )}`"
                  :title="fecha.infoIconoTexto"
                >
                  <img
                    v-if="fecha.infoAdiccional === '1'"
                    :src="`/insignias/${getIconFileName(fecha.infoIconoTexto)}`"
                    :alt="fecha.infoIconoTexto"
                    class="w-4 h-4"
                  />
                </span>
              </div>
            </td>
            <td class="px-3 md:px-4 lg:px-6 py-4 whitespace-nowrap">
              <span :class="getDiasRestantesClass(fecha.fecha)">
                {{ getDiasRestantes(fecha.fecha) }}
              </span>
            </td>
            <td
              class="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
            >
              {{ fecha.createdBy }}
            </td>
            <td
              class="hidden lg:table-cell px-3 md:px-4 lg:px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
            >
              {{ fecha.updatedBy || "-" }}
            </td>
            <td class="px-3 md:px-4 lg:px-6 py-4">
              <div class="flex space-x-2">
                <button
                  @click="openModal(fecha)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span class="hidden lg:inline">Editar</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 lg:hidden"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteFecha(fecha.id)"
                  class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <span class="hidden lg:inline">Eliminar</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 lg:hidden"
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
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Vista de tarjetas para móvil -->
      <div class="md:hidden">
        <div
          class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden"
        >
          <ul class="divide-y-2 divide-gray-200 dark:divide-gray-900">
            <li
              v-for="(fecha, index) in fechas"
              :key="fecha.id"
              class="relative overflow-hidden touch-pan-y"
              @touchstart="handleTouchStart($event, fecha.id)"
              @touchmove="handleTouchMove($event, fecha.id)"
              @touchend="handleTouchEnd(fecha.id)"
            >
              <!-- Acciones de deslizamiento -->
              <div
                class="absolute inset-y-0 left-0 w-16 bg-blue-500 flex items-center justify-center transform transition-transform duration-200"
                :style="{
                  transform: `translateX(${
                    -100 + (activeCard === fecha.id ? swipeX : 0)
                  }%)`,
                }"
              >
                <button
                  class="text-white flex items-center justify-center"
                  @click="openModal(fecha)"
                >
                  <img src="/svg/editar.svg" alt="Editar" class="w-7 h-7" />
                </button>
              </div>
              <div
                class="absolute inset-y-0 right-0 w-16 bg-red-500 flex items-center justify-center transform transition-transform duration-200"
                :style="{
                  transform: `translateX(${
                    100 + (activeCard === fecha.id ? swipeX : 0)
                  }%)`,
                }"
              >
                <button
                  class="text-white flex items-center justify-center"
                  @click="deleteFecha(fecha.id)"
                >
                  <img src="/svg/eliminar.svg" alt="Eliminar" class="w-7 h-7" />
                </button>
              </div>
              <div
                class="relative bg-white dark:bg-gray-700 transform transition-transform duration-200"
                :style="{
                  transform: `translateX(${
                    activeCard === fecha.id ? swipeX : 0
                  }px)`,
                }"
              >
                <div
                  class="p-4 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition duration-150 ease-in-out"
                >
                  <div class="flex flex-col space-y-2">
                    <div class="flex justify-between items-start">
                      <div class="flex items-center space-x-2">
                        <span
                          class="text-sm font-medium text-gray-500 dark:text-gray-400"
                          >#{{ index + 1 }}</span
                        >
                        <h3
                          class="text-lg font-semibold text-gray-900 dark:text-white"
                        >
                          {{ fecha.titulo }}
                        </h3>
                      </div>
                      <div class="flex flex-col items-end text-sm">
                        <span class="text-gray-500 dark:text-gray-400">
                          {{ formatDate(fecha.fecha) }}
                        </span>
                        <span
                          :class="getDiasRestantesClass(fecha.fecha)"
                          class="mt-1"
                        >
                          {{ getDiasRestantes(fecha.fecha) }}
                        </span>
                      </div>
                    </div>
                    <div
                      class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <div class="flex items-center">
                        <svg
                          class="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {{ fecha.hora }}
                      </div>
                      <div class="flex items-center">
                        <svg
                          class="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {{ fecha.lugar }}
                      </div>
                    </div>
                    <div
                      class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600/80 group-hover:border-gray-200 dark:group-hover:border-gray-500"
                    >
                      <div class="flex items-center space-x-2">
                        <span
                          v-if="fecha.banner"
                          title="Tiene banner"
                          class="text-green-500 dark:text-green-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </span>
                        <span
                          v-if="fecha.infoIconoTexto"
                          :class="`inline-flex items-center justify-center w-4 h-4 rounded-full ${getColorClass(
                            fecha.infoIconoTexto
                          )}`"
                          :title="fecha.infoIconoTexto"
                        >
                          <img
                            v-if="fecha.infoAdiccional === '1'"
                            :src="`/insignias/${getIconFileName(
                              fecha.infoIconoTexto
                            )}`"
                            :alt="fecha.infoIconoTexto"
                            class="w-2.5 h-2.5"
                          />
                        </span>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          <div v-if="fecha.updatedBy">
                            Modificado por: {{ fecha.updatedBy }}
                          </div>
                          <div v-else>Agregado por: {{ fecha.createdBy }}</div>
                        </div>
                      </div>
                      <!-- Indicadores de deslizamiento -->
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            :class="
                              activeCard === fecha.id && swipeX < 0
                                ? 'text-red-500'
                                : 'text-gray-400 dark:text-gray-400'
                            "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 transition-colors duration-200"
                            :class="
                              activeCard === fecha.id && swipeX < 0
                                ? 'text-red-500'
                                : 'text-gray-400 dark:text-gray-400'
                            "
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
                        </div>
                        <div class="flex items-center space-x-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 transition-colors duration-200"
                            :class="
                              activeCard === fecha.id && swipeX > 0
                                ? 'text-blue-500'
                                : 'text-gray-400 dark:text-gray-400'
                            "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            :class="
                              activeCard === fecha.id && swipeX > 0
                                ? 'text-blue-500'
                                : 'text-gray-400 dark:text-gray-400'
                            "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal para Agregar/Editar -->
    <FechaModal
      :show-modal="showModal"
      :editing-fecha="editingFecha"
      @close="closeModal"
      @save="saveFecha"
    />
  </div>
</template>

<script>
import { fechas } from "../../lib/api";
import FechaModal from "./modals/FechaModal.vue";

export default {
  name: "AdminFechasList",
  components: {
    FechaModal,
  },
  data() {
    return {
      fechas: [],
      showModal: false,
      editingFecha: null,
      errorMessage: "",
      activeCard: null,
      swipeX: 0,
      swipeStartX: 0,
      isLoading: true,
      selectedFechas: [],
      isAllSelected: false,
    };
  },
  async created() {
    await this.loadFechas();
  },
  methods: {
    async loadFechas() {
      try {
        this.isLoading = true;
        const response = await fechas.getAll();
        this.fechas = this.sortFechas(response.data);
      } catch (error) {
        console.error("Error al cargar fechas:", error);
        this.errorMessage = "Error al cargar las fechas";
      } finally {
        this.isLoading = false;
      }
    },
    sortFechas(fechas) {
      return fechas.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaA - fechaB;
      });
    },
    openModal(fecha = null) {
      this.editingFecha = fecha;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.editingFecha = null;
    },
    async saveFecha(fechaData) {
      try {
        if (this.editingFecha) {
          await fechas.update(this.editingFecha.id, fechaData);
        } else {
          await fechas.create(fechaData);
        }
        await this.loadFechas();
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar fecha:", error);
        this.errorMessage = "Error al guardar la fecha";
      }
    },
    async deleteFecha(id) {
      if (window.confirm("¿Estás seguro de que deseas eliminar esta fecha?")) {
        try {
          await fechas.delete(id);
          await this.loadFechas();
        } catch (error) {
          console.error("Error al eliminar fecha:", error);
          this.errorMessage = error.message || "Error al eliminar la fecha";
          if (error.message.includes("No hay sesión activa")) {
            this.errorMessage =
              "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
          }
        }
      }
    },
    formatDate(date) {
      // Crear la fecha en la zona horaria de Bogotá
      const fechaBogota = new Date(date + "T00:00:00-05:00");
      return fechaBogota.toLocaleDateString("es-CO", {
        timeZone: "America/Bogota",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    getColorClass(value) {
      const iconOptions = [
        { value: "Cumpleaños", colorClass: "bg-yellow-500" },
        { value: "Canasta de amor", colorClass: "bg-red-500" },
        { value: "Cena del Señor", colorClass: "bg-red-700" },
        { value: "Reunión de damas", colorClass: "bg-pink-500" },
        { value: "Reunión de varones", colorClass: "bg-blue-500" },
        { value: "Reunión de jovenes", colorClass: "bg-teal-500" },
        { value: "Domingo misionero", colorClass: "bg-green-500" },
        { value: "Culto de oración", colorClass: "bg-violet-500" },
      ];
      const option = iconOptions.find((opt) => opt.value === value);
      return option ? option.colorClass : "";
    },
    getDiasRestantes(fecha) {
      // Obtener fecha actual en Bogotá
      const hoyBogota = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
      );
      hoyBogota.setHours(0, 0, 0, 0);

      // Convertir la fecha del evento a la zona horaria de Bogotá
      const fechaEvento = new Date(fecha + "T00:00:00-05:00");
      fechaEvento.setHours(0, 0, 0, 0);

      const diferencia = fechaEvento.getTime() - hoyBogota.getTime();
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

      if (diferencia < 0) return "Evento pasado";
      if (diferencia === 0 || dias === 0) return "Hoy";
      if (dias === 1) return "Mañana";
      return `${dias} días`;
    },
    getDiasRestantesClass(fecha) {
      // Obtener fecha actual en Bogotá
      const hoyBogota = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
      );
      hoyBogota.setHours(0, 0, 0, 0);

      // Convertir la fecha del evento a la zona horaria de Bogotá
      const fechaEvento = new Date(fecha + "T00:00:00-05:00");
      fechaEvento.setHours(0, 0, 0, 0);

      const diferencia = fechaEvento.getTime() - hoyBogota.getTime();
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

      if (diferencia < 0) return "text-gray-500 dark:text-gray-400";
      if (dias <= 7) return "text-red-600 dark:text-red-400 font-semibold";
      if (dias <= 30) return "text-yellow-600 dark:text-yellow-400";
      return "text-green-600 dark:text-green-400";
    },
    handleTouchStart(event, id) {
      this.activeCard = id;
      this.swipeX = 0;
      this.swipeStartX = event.touches[0].clientX;
    },
    handleTouchMove(event, id) {
      if (this.activeCard !== id) return;
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.swipeStartX;
      this.swipeX = Math.max(Math.min(deltaX, 100), -100);
    },
    handleTouchEnd(id) {
      if (this.activeCard !== id) return;
      if (Math.abs(this.swipeX) > 25) {
        if (this.swipeX > 0) {
          this.openModal(this.fechas.find((f) => f.id === id));
        } else {
          this.deleteFecha(id);
        }
      }
      this.activeCard = null;
      this.swipeX = 0;
    },
    toggleSelectAll() {
      this.selectedFechas = this.isAllSelected
        ? []
        : this.fechas.map((f) => f.id);
      this.isAllSelected = !this.isAllSelected;
    },
    async deleteSelected() {
      if (
        window.confirm(
          "¿Estás seguro de que deseas eliminar las fechas seleccionadas?"
        )
      ) {
        try {
          this.isLoading = true;
          await Promise.all(this.selectedFechas.map((id) => fechas.delete(id)));

          await this.loadFechas();

          this.selectedFechas = [];
          this.isAllSelected = false;
        } catch (error) {
          console.error("Error al eliminar fechas seleccionadas:", error);
          this.errorMessage = "Error al eliminar las fechas seleccionadas";
        } finally {
          this.isLoading = false;
        }
      }
    },
    getIconFileName(value) {
      const iconOptions = [
        { value: "Cumpleaños", icon: "cumple.svg" },
        { value: "Canasta de amor", icon: "canasta-de-amor.svg" },
        { value: "Cena del Señor", icon: "cena-del-senor.svg" },
        { value: "Reunión de damas", icon: "reunion-de-damas.svg" },
        { value: "Reunión de varones", icon: "reunion-de-varones.svg" },
        { value: "Reunión de jovenes", icon: "reunion-de-jovenes.svg" },
        { value: "Domingo misionero", icon: "domingo-misionero.svg" },
        { value: "Culto de oración", icon: "culto-de-oracion.svg" },
      ];
      const option = iconOptions.find((opt) => opt.value === value);
      return option ? option.icon : "default.svg";
    },
  },
};
</script>
