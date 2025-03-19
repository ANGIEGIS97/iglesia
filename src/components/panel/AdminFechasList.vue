<template>
  <div>
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

      <!-- Indicador de carga para generación de anuncio -->
      <div
        v-if="isGeneratingAnuncio"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
        >
          <div class="flex flex-col items-center">
            <div
              class="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"
            ></div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Generando anuncio
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-center">
              {{ generatingStep }}
            </p>
          </div>
        </div>
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
        <div class="overflow-x-auto">
          <table
            class="hidden md:table min-w-full divide-y divide-gray-200 dark:divide-gray-900 dark:text-white overflow-x-auto"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="pl-3 pr-1 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-8"
                >
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                  />
                </th>
                <th
                  class="px-1 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-6"
                >
                  #
                </th>
                <th
                  class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[90px]"
                >
                  Fecha
                </th>
                <th
                  class="px-2 py-4 max-w-[200px] md:max-w-[250px] lg:max-w-[300px] truncate"
                >
                  Título
                </th>
                <th
                  class="hidden lg:table-cell px-2 md:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Hora
                </th>
                <th
                  class="hidden lg:table-cell px-2 md:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Lugar/Link
                </th>
                <th
                  class="px-2 md:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Detalles
                </th>
                <th
                  class="px-2 md:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Días
                </th>
                <th
                  class="hidden lg:table-cell px-2 md:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Agregado por
                </th>
                <th
                  class="hidden lg:table-cell px-2 md:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Modificado por
                </th>
                <th
                  class="px-2 md:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Anuncios
                </th>
                <th
                  class="px-2 md:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
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
                <td class="pl-3 pr-1 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    v-model="selectedFechas"
                    :value="fecha.id"
                    class="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                  />
                </td>
                <td class="px-1 py-4 whitespace-nowrap font-medium">
                  {{ index + 1 }}
                </td>
                <td class="px-2 py-4 whitespace-nowrap">
                  {{ formatDate(fecha.fecha) }}
                </td>
                <td
                  class="px-2 py-4 max-w-[200px] md:max-w-[250px] lg:max-w-[300px] truncate"
                >
                  {{ fecha.titulo }}
                  <div class="lg:hidden text-sm text-gray-500">
                    {{ fecha.hora }} - {{ fecha.lugar }}
                  </div>
                </td>
                <td class="hidden lg:table-cell px-2 md:px-3 lg:px-6 py-4">
                  {{ fecha.hora }}
                </td>
                <td
                  class="hidden lg:table-cell px-2 md:px-3 lg:px-6 py-4 max-w-[200px] truncate"
                >
                  <template v-if="isUrl(fecha.lugar)">
                    <a
                      :href="
                        fecha.lugar.startsWith('www.')
                          ? 'https://' + fecha.lugar
                          : fecha.lugar
                      "
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-500 hover:underline"
                    >
                      <template v-if="fecha.lugar.includes('tinyurl.com')">
                        Google Maps
                      </template>
                      <template v-else>
                        {{ fecha.lugar }}
                      </template>
                    </a>
                  </template>
                  <template v-else>
                    {{ fecha.lugar }}
                  </template>
                </td>
                <td class="px-2 md:px-3 lg:px-6 py-4">
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
                        v-if="fecha.infoAdiccional === 1"
                        :src="`/insignias/${getIconFileName(
                          fecha.infoIconoTexto
                        )}`"
                        :alt="fecha.infoIconoTexto"
                        class="w-4 h-4"
                      />
                    </span>
                  </div>
                </td>
                <td class="px-2 md:px-3 lg:px-6 py-4 whitespace-nowrap">
                  <span :class="getDiasRestantesClass(fecha.fecha)">
                    {{ getDiasRestantes(fecha.fecha) }}
                  </span>
                </td>
                <td
                  class="hidden lg:table-cell px-2 md:px-3 lg:px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                >
                  {{ fecha.createdBy }}
                </td>
                <td
                  class="hidden lg:table-cell px-2 md:px-3 lg:px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                >
                  {{ fecha.updatedBy || "-" }}
                </td>
                <td class="px-2 md:px-3 lg:px-6 py-4">
                  <button
                    @click="convertirAAnuncio(fecha)"
                    class="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                    :title="fecha.eventoId ? 'Ver ' : 'Crear'"
                  >
                    <span class="hidden lg:inline">{{
                      fecha.eventoId ? "Ver " : "Crear"
                    }}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 lg:hidden"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        v-if="!fecha.eventoId"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                      <path
                        v-else
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        v-if="fecha.eventoId"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </td>
                <td class="px-2 md:px-3 lg:px-6 py-4">
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
                      @click="duplicarFecha(fecha)"
                      class="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      <span class="hidden lg:inline">Duplicar</span>
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
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
        </div>

        <!-- Vista de tarjetas para móvil -->
        <div class="md:hidden">
          <div
            class="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden"
          >
            <ul class="divide-y-2 divide-gray-200 dark:divide-gray-900">
              <li
                v-for="(fecha, index) in fechas"
                :key="fecha.id"
                class="relative overflow-hidden"
              >
                <div class="relative bg-white dark:bg-gray-700">
                  <div
                    class="p-3 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition duration-150 ease-in-out"
                  >
                    <div class="flex flex-col space-y-2">
                      <div class="flex flex-col">
                        <div class="flex items-center mb-1">
                          <div
                            class="flex items-center space-x-2 flex-shrink min-w-0 max-w-[80%]"
                          >
                            <span
                              class="text-sm font-medium text-gray-500 dark:text-gray-400 flex-shrink-0"
                            >
                              #{{ index + 1 }}
                            </span>
                            <h3
                              class="text-lg font-semibold text-gray-900 dark:text-white truncate"
                            >
                              {{ fecha.titulo }}
                            </h3>
                          </div>
                          <span
                            class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-auto pl-2"
                          >
                            {{ formatDate(fecha.fecha) }}
                          </span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span
                            :class="getDiasRestantesClass(fecha.fecha)"
                            class="text-sm"
                          >
                            {{ getDiasRestantes(fecha.fecha) }}
                          </span>
                          <span
                            class="text-sm text-gray-500 dark:text-gray-400"
                          >
                            {{ fecha.hora }}
                          </span>
                        </div>
                      </div>
                      <div
                        class="flex items-center justify-between space-x-4 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <button
                          @click="convertirAAnuncio(fecha)"
                          class="px-2 py-1 bg-teal-600 text-white text-xs rounded-md hover:bg-teal-700 transition-colors duration-300 flex items-center"
                        >
                          {{ fecha.eventoId ? "Ver anuncio" : "Crear anuncio" }}
                        </button>
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
                          <template v-if="isUrl(fecha.lugar)">
                            <a
                              :href="
                                fecha.lugar.startsWith('www.')
                                  ? 'https://' + fecha.lugar
                                  : fecha.lugar
                              "
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-blue-500 hover:underline"
                            >
                              <template
                                v-if="fecha.lugar.includes('tinyurl.com')"
                              >
                                Google Maps
                              </template>
                              <template v-else>
                                {{ fecha.lugar }}
                              </template>
                            </a>
                          </template>
                          <template v-else>
                            {{ fecha.lugar }}
                          </template>
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
                              v-if="fecha.infoAdiccional === 1"
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
                            <div v-else>
                              Agregado por: {{ fecha.createdBy }}
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-3">
                          <button
                            @click="openModal(fecha)"
                            class="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                            aria-label="Editar fecha"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            @click="duplicarFecha(fecha)"
                            class="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors duration-200"
                            aria-label="Duplicar fecha"
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
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                          <button
                            @click="deleteFecha(fecha.id)"
                            class="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                            aria-label="Eliminar fecha"
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
                          </button>
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

      <!-- Componente para convertir fecha a evento -->
      <FechaToEventoConverter
        v-if="fechaParaConvertir && !fechaParaConvertir.eventoId"
        :fecha="fechaParaConvertir"
        @error="handleConverterError"
        @success="handleConverterSuccess"
        ref="fechaToEventoConverter"
      />
    </div>

    <!-- Modal para Ver Evento -->
    <EventoModal
      v-if="eventoParaVer"
      :key="eventoParaVer ? eventoParaVer.id : 'no-evento'"
      :event="eventoParaVer"
      :isEdit="true"
      :isOpen="showEventoModal"
      :readOnly="false"
      @submit="handleUpdateEvento"
      @cancel="closeEventoModal"
    />
  </div>
</template>

<script>
import { fechas, eventos } from "../../lib/api";
import FechaModal from "./modals/FechaModal.vue";
import FechaToEventoConverter from "./utils/FechaToEventoConverter.vue";
import EventoModal from "./modals/EventoModal.vue";

export default {
  name: "AdminFechasList",
  components: {
    FechaModal,
    FechaToEventoConverter,
    EventoModal,
  },
  data() {
    return {
      fechas: [],
      showModal: false,
      editingFecha: null,
      fechaParaConvertir: null,
      errorMessage: "",
      isLoading: true,
      isGeneratingAnuncio: false,
      generatingStep: "",
      selectedFechas: [],
      isAllSelected: false,
      eventoParaVer: null,
      showEventoModal: false,
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

        // Convertir infoAdiccional a número en cada fecha
        const fechasConvertidas = response.data.map((fecha) => ({
          ...fecha,
          infoAdiccional: Number(fecha.infoAdiccional),
        }));

        // Mostrar las fechas inmediatamente
        this.fechas = this.sortFechas(fechasConvertidas);
        this.isLoading = false;

        // Verificar eventos asociados de forma asíncrona después de mostrar las fechas
        this.verificarEventosAsociados(fechasConvertidas);
      } catch (error) {
        console.error("Error al cargar fechas:", error);
        this.errorMessage = "Error al cargar las fechas";
        this.isLoading = false;
      }
    },
    async verificarEventosAsociados(fechasArray) {
      // Filtrar fechas que tienen eventoId
      const fechasConEventos = fechasArray.filter((fecha) => fecha.eventoId);

      if (fechasConEventos.length === 0) return; // No hay fechas con eventos asociados

      try {
        // Obtener solo los IDs de los eventos asociados para verificar
        const eventosIds = [
          ...new Set(fechasConEventos.map((fecha) => fecha.eventoId)),
        ];

        // Comprobar la existencia de cada evento de forma individual
        const verificaciones = await Promise.all(
          eventosIds.map(async (eventoId) => {
            try {
              await eventos.getById(eventoId);
              return { id: eventoId, existe: true };
            } catch (error) {
              return { id: eventoId, existe: false };
            }
          })
        );

        // Filtrar los eventos que no existen
        const eventosInexistentes = verificaciones
          .filter((verificacion) => !verificacion.existe)
          .map((verificacion) => verificacion.id);

        if (eventosInexistentes.length === 0) return;

        // Identificar fechas con referencias a eventos que ya no existen
        const fechasParaActualizar = fechasConEventos.filter((fecha) =>
          eventosInexistentes.includes(fecha.eventoId)
        );

        // Actualizar las fechas que tienen referencias a eventos eliminados
        if (fechasParaActualizar.length > 0) {
          console.log(
            `Se encontraron ${fechasParaActualizar.length} fechas con referencias a eventos eliminados`
          );

          // Actualizar cada fecha para eliminar la referencia al evento
          const actualizaciones = fechasParaActualizar.map((fecha) =>
            fechas.update(fecha.id, { eventoId: null })
          );

          await Promise.all(actualizaciones);

          // Actualizar las fechas en el array local
          fechasParaActualizar.forEach((fechaInvalida) => {
            const index = this.fechas.findIndex(
              (f) => f.id === fechaInvalida.id
            );
            if (index !== -1) {
              this.fechas[index].eventoId = null;
            }
          });

          // Mostrar notificación si se actualizaron fechas
          if (fechasParaActualizar.length > 0) {
            this.errorMessage = `Se han actualizado ${fechasParaActualizar.length} fechas que tenían referencias a eventos eliminados`;

            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => {
              if (this.errorMessage.includes("Se han actualizado")) {
                this.errorMessage = "";
              }
            }, 5000);
          }
        }
      } catch (error) {
        console.error("Error al verificar eventos asociados:", error);
        // No mostramos error al usuario para no interrumpir la carga de fechas
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
        // Verificamos si estamos editando o duplicando
        if (this.editingFecha && this.editingFecha.id) {
          // Estamos editando una fecha existente
          await fechas.update(this.editingFecha.id, fechaData);
        } else {
          // Estamos creando una nueva fecha (ya sea desde cero o duplicando)
          await fechas.create(fechaData);

          // Mostrar mensaje específico si es una duplicación
          if (fechaData.titulo && fechaData.titulo.includes("(Copia)")) {
            this.errorMessage = "Fecha duplicada con éxito";
            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => {
              if (this.errorMessage === "Fecha duplicada con éxito") {
                this.errorMessage = "";
              }
            }, 3000);
          }
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
          // En lugar de recargar todas las fechas, solo eliminamos la fecha del array local
          this.fechas = this.fechas.filter((fecha) => fecha.id !== id);
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
    async convertirAAnuncio(fecha) {
      if (fecha.eventoId) {
        // Si ya tiene un evento asociado, mostrar ese evento
        await this.verEvento(fecha.eventoId);
      } else {
        // Si no tiene evento asociado, crear uno nuevo
        this.fechaParaConvertir = fecha;
        // Esperar a que el componente se monte en el DOM
        this.$nextTick(() => {
          if (this.$refs.fechaToEventoConverter) {
            this.$refs.fechaToEventoConverter.convertirFechaAEvento();
          }
        });
      }
    },
    async verEvento(eventoId) {
      try {
        // Usaremos una variable local para el estado de carga en lugar de isLoading global
        const loadingIndicator = document.createElement("div");
        loadingIndicator.className =
          "fixed top-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-lg z-50";
        loadingIndicator.textContent = "Cargando anuncio...";
        document.body.appendChild(loadingIndicator);

        console.log("Obteniendo evento con ID:", eventoId);

        try {
          const response = await eventos.getById(eventoId);
          console.log("Evento obtenido:", response.data);
          this.eventoParaVer = response.data;

          // Usar setTimeout para asegurar que el componente se monte correctamente
          setTimeout(() => {
            this.showEventoModal = true;
            console.log("Modal abierto con delay:", this.showEventoModal);
          }, 100);
        } catch (error) {
          console.error("Error al obtener el evento:", error);

          // Si el evento no existe, actualizar la fecha para eliminar la referencia
          if (error.message.includes("Evento no encontrado")) {
            // Buscar la fecha que tiene este eventoId
            const fechaConEventoEliminado = this.fechas.find(
              (f) => f.eventoId === eventoId
            );

            if (fechaConEventoEliminado) {
              // Actualizar la fecha para eliminar la referencia al evento eliminado
              await fechas.update(fechaConEventoEliminado.id, {
                eventoId: null,
              });

              alert(
                "El evento asociado a esta fecha ya no existe. Se ha actualizado la referencia."
              );
              // Recargar las fechas para reflejar el cambio
              await this.loadFechas();
            } else {
              this.errorMessage = "El evento asociado ya no existe";
            }
          } else {
            this.errorMessage = "Error al cargar el evento";
          }
        }
      } catch (error) {
        console.error("Error general:", error);
        this.errorMessage = "Error al procesar la solicitud";
      } finally {
        // Eliminar el indicador de carga local
        const loadingIndicator = document.querySelector(".fixed.top-4.right-4");
        if (loadingIndicator) {
          document.body.removeChild(loadingIndicator);
        }
      }
    },
    handleUpdateEvento(eventoData) {
      // Actualizar el evento si se modificó
      if (this.eventoParaVer && this.eventoParaVer.id) {
        // Verificar si realmente se modificó el evento comparando con los datos originales
        const eventoModificado =
          JSON.stringify(eventoData) !== JSON.stringify(this.eventoParaVer);

        if (eventoModificado) {
          this.isLoading = true;
          eventos
            .update(this.eventoParaVer.id, eventoData)
            .then(() => {
              this.closeEventoModal(true); // Pasar true para indicar que hubo cambios
              alert("Evento actualizado con éxito");
            })
            .catch((error) => {
              console.error("Error al actualizar el evento:", error);

              // Si el evento no existe, actualizar la fecha
              if (error.message.includes("El evento no existe")) {
                // Buscar la fecha que tiene este eventoId
                const fechaConEventoEliminado = this.fechas.find(
                  (f) => f.eventoId === this.eventoParaVer.id
                );

                if (fechaConEventoEliminado) {
                  // Actualizar la fecha para eliminar la referencia al evento eliminado
                  fechas
                    .update(fechaConEventoEliminado.id, {
                      eventoId: null, // o undefined
                    })
                    .then(() => {
                      alert(
                        "El evento asociado a esta fecha ya no existe. Se ha actualizado la referencia."
                      );
                      this.loadFechas();
                    });
                } else {
                  this.errorMessage = "El evento asociado ya no existe";
                }
              } else {
                this.errorMessage = "Error al actualizar el evento";
              }
            })
            .finally(() => {
              this.isLoading = false;
            });
        } else {
          // Si no hubo cambios, simplemente cerrar el modal sin recargar
          this.closeEventoModal(false);
        }
      }
    },
    closeEventoModal(recargarFechas = false) {
      console.log("Cerrando modal de evento");
      this.showEventoModal = false;
      this.eventoParaVer = null;

      // Eliminar la clase modal-open del body para restaurar el scroll
      document.body.classList.remove("modal-open");

      // Solo recargar las fechas si es necesario
      if (recargarFechas) {
        this.loadFechas();
      }

      console.log("Modal cerrado:", this.showEventoModal, this.eventoParaVer);
    },
    handleConverterError(mensaje) {
      this.errorMessage = mensaje;
    },
    handleConverterSuccess(mensaje) {
      alert(mensaje);
      // Recargar las fechas para mostrar la actualización con el eventoId
      this.loadFechas();
    },
    formatDate(date) {
      // Crear la fecha en la zona horaria de Bogotá
      const fechaBogota = new Date(date + "T00:00:00-05:00");
      return fechaBogota.toLocaleDateString("es-CO", {
        timeZone: "America/Bogota",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    },
    getColorClass(value) {
      if (value === "Info") return "bg-teal-500";
      const iconOptions = [
        { value: "Cumpleaños", colorClass: "bg-yellow-500" },
        { value: "Canasta de amor", colorClass: "bg-red-500" },
        { value: "Cena del Señor", colorClass: "bg-red-700" },
        { value: "Reunión de damas", colorClass: "bg-pink-500" },
        { value: "Reunión de varones", colorClass: "bg-blue-500" },
        { value: "Reunión de jovenes", colorClass: "bg-indigo-500" },
        { value: "Domingo misionero", colorClass: "bg-green-500" },
        { value: "Culto de oración", colorClass: "bg-violet-500" },
        { value: "Noches navideñas", colorClass: "bg-red-400" },
        { value: "Reuniones caseras", colorClass: "bg-orange-500" },
      ];
      const option = iconOptions.find((opt) => opt.value === value);
      return option ? option.colorClass : "bg-teal-500";
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

          // En lugar de recargar todas las fechas, solo eliminamos las fechas seleccionadas del array local
          this.fechas = this.fechas.filter(
            (fecha) => !this.selectedFechas.includes(fecha.id)
          );

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
      if (value === "Info") return "default.svg";
      const iconOptions = [
        { value: "Cumpleaños", icon: "cumple.svg" },
        { value: "Canasta de amor", icon: "canasta-de-amor.svg" },
        { value: "Cena del Señor", icon: "cena-del-senor.svg" },
        { value: "Reunión de damas", icon: "reunion-de-damas.svg" },
        { value: "Reunión de varones", icon: "reunion-de-varones.svg" },
        { value: "Reunión de jovenes", icon: "reunion-de-jovenes.svg" },
        { value: "Domingo misionero", icon: "domingo-misionero.svg" },
        { value: "Culto de oración", icon: "culto-de-oracion.svg" },
        { value: "Noches navideñas", icon: "noches-navidenas.svg" },
        { value: "Reuniones caseras", icon: "reuniones-caseras.svg" },
      ];
      const option = iconOptions.find((opt) => opt.value === value);
      return option ? option.icon : "default.svg";
    },
    duplicarFecha(fecha) {
      // Crear una copia profunda del objeto sin usar la referencia original
      const fechaDuplicada = JSON.parse(
        JSON.stringify({
          // No incluir el ID para asegurar que sea una nueva fecha
          titulo: `${fecha.titulo} (Copia)`,
          fecha: fecha.fecha,
          hora: fecha.hora,
          lugar: fecha.lugar,
          createdBy: fecha.createdBy,
          updatedBy: null,
          eventoId: null, // No copiar el eventoId para evitar conflictos
          banner: fecha.banner,
          infoAdiccional: fecha.infoAdiccional,
          infoIconoTexto: fecha.infoIconoTexto,
        })
      );

      // Asegurarnos de que no haya ID en el objeto
      delete fechaDuplicada.id;

      // Abrir el modal con la fecha duplicada para que el usuario pueda editarla
      this.editingFecha = fechaDuplicada;
      this.showModal = true;
    },
    isUrl(str) {
      if (!str) return false;
      // Agregar soporte para URLs que empiezan con www.
      if (str.startsWith("www.")) {
        str = "http://" + str;
      }
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    },
  },
};
</script>
