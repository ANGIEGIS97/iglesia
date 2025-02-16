<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-show="showModal">
    <div class="flex items-center justify-center min-h-screen p-4">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-show="showModal" class="fixed inset-0 bg-black bg-opacity-50"></div>
      </Transition>

      <Transition
        enter-active-class="animate__animated animate__fadeInDown"
      >
        <div v-show="showModal" class="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl transform border border-gray-200 dark:border-gray-700">
          <!-- Modal header -->
          <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-t-lg">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ editingFecha ? "Editar Fecha" : "Agregar Nueva Fecha" }}
              </h3>
              <button
                @click="closeModal"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <!-- Modal content -->
          <div class="p-6 bg-white dark:bg-gray-800 rounded-b-lg">
            <form @submit.prevent="saveFecha" class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="relative">
                  <input
                    type="date"
                    v-model="fechaForm.fecha"
                    id="fecha"
                    class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required
                  />
                  <label
                    for="fecha"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Fecha
                  </label>
                </div>

                <div class="relative">
                  <input
                    type="time"
                    v-model="fechaForm.hora"
                    id="hora"
                    class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    required
                  />
                  <label
                    for="hora"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Hora
                  </label>
                </div>
              </div>

              <div class="relative">
                <input
                  type="text"
                  v-model="fechaForm.titulo"
                  id="titulo"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="titulo"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Título
                </label>
              </div>

              <div class="relative">
                <input
                  type="text"
                  v-model="fechaForm.lugar"
                  id="lugar"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="lugar"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Lugar/Link
                </label>
              </div>

              <div class="relative">
                <textarea
                  v-model="fechaForm.descripcion"
                  id="descripcion"
                  rows="3"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                ></textarea>
                <label
                  for="descripcion"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Descripción
                </label>
              </div>

              <div class="relative">
                <select
                  v-model="fechaForm.infoAdiccional"
                  id="infoAdiccional"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                >
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
                <label
                  for="infoAdiccional"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Icono de Información
                </label>
              </div>

              <div class="relative">
                <button
                  type="button"
                  @click="showDropdown = !showDropdown"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 text-left"
                >
                  <div class="flex items-center">
                    <span :class="'inline-block w-3 h-3 rounded-full mr-2 ' + getColorClass(fechaForm.tipoIcono)"></span>
                    {{ fechaForm.tipoIcono || "Seleccione una opción" }}
                  </div>
                </button>
                <label class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 left-1">
                  Texto del Icono de Información
                </label>
                <div
                  v-if="showDropdown"
                  class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                >
                  <div
                    v-for="option in iconOptions"
                    :key="option.value"
                    @click="selectOption(option)"
                    class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-300"
                  >
                    <div class="flex items-center">
                      <span :class="'inline-block w-3 h-3 rounded-full mr-2 ' + option.colorClass"></span>
                      {{ option.label }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="relative flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="tieneBanner"
                      v-model="fechaForm.tieneBanner"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="tieneBanner" class="font-medium text-gray-700 dark:text-gray-300">
                      Incluir banner
                    </label>
                  </div>
                </div>

                <div v-if="fechaForm.tieneBanner" class="relative transition-all duration-300">
                  <input
                    type="text"
                    v-model="fechaForm.banner"
                    id="banner"
                    class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    for="banner"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    URL del Banner
                  </label>
                </div>
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="submit"
                  class="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
                >
                  {{ editingFecha ? "Actualizar" : "Crear" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import 'animate.css';

export default {
  name: "FechaModal",
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    editingFecha: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isClosing: false,
      showDropdown: false,
      iconOptions: [
        { value: "Canasta de amor", label: "Canasta de amor", colorClass: "bg-red-500" },
        { value: "Cena del Señor", label: "Cena del Señor", colorClass: "bg-red-700" },
        { value: "Reunión de damas", label: "Reunión de damas", colorClass: "bg-pink-500" },
        { value: "Reunión de varones", label: "Reunión de varones", colorClass: "bg-blue-500" },
        { value: "Reunión de jovenes", label: "Reunión de jovenes", colorClass: "bg-teal-500" },
        { value: "Domingo misionero", label: "Domingo misionero", colorClass: "bg-green-500" },
        { value: "Culto de oración", label: "Culto de oración", colorClass: "bg-violet-500" }
      ],
      fechaForm: {
        fecha: "",
        titulo: "",
        hora: "",
        lugar: "",
        descripcion: "",
        infoAdiccional: 0,
        tipoIcono: "",
        infoIconoTexto: "",
        banner: "",
        tieneBanner: false
      }
    };
  },
  watch: {
    editingFecha: {
      immediate: true,
      handler(fecha) {
        if (fecha) {
          this.fechaForm = { ...fecha };
          this.fechaForm.tieneBanner = !!fecha.banner;
          if (this.fechaForm.fecha) {
            const fechaObj = new Date(this.fechaForm.fecha);
            this.fechaForm.fecha = fechaObj.toISOString().split("T")[0];
          }
          const opcionesPredefinidas = this.iconOptions.map(opt => opt.value);
          this.fechaForm.tipoIcono = opcionesPredefinidas.includes(this.fechaForm.infoIconoTexto)
            ? this.fechaForm.infoIconoTexto
            : "";
        } else {
          this.resetForm();
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.fechaForm = {
        fecha: "",
        titulo: "",
        hora: "",
        lugar: "",
        descripcion: "",
        infoAdiccional: 0,
        tipoIcono: "",
        infoIconoTexto: "",
        banner: "",
        tieneBanner: false
      };
    },
    closeModal() {
      this.$emit("close");
      this.resetForm();
    },
    getColorClass(value) {
      const option = this.iconOptions.find((opt) => opt.value === value);
      return option ? option.colorClass : "";
    },
    selectOption(option) {
      this.fechaForm.tipoIcono = option.value;
      if (option.value !== "personalizado") {
        this.fechaForm.infoIconoTexto = option.value;
      }
      this.showDropdown = false;
    },
    saveFecha() {
      this.fechaForm.infoIconoTexto = this.fechaForm.tipoIcono;
      if (!this.fechaForm.tieneBanner) {
        this.fechaForm.banner = null;
      }
      this.$emit("save", this.fechaForm);
      this.resetForm();
    }
  }
};
</script>

<style scoped>
.animate__animated {
  --animate-duration: 0.5s;
  position: relative;
  z-index: 10;
}

.animate__fadeInDown {
  animation-duration: 0.5s;
}
</style> 