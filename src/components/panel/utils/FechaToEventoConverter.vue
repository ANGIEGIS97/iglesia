<template>
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
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Generando anuncio
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-center">
          {{ generatingStep }}
        </p>
      </div>
    </div>
  </div>

  <!-- Modal para Crear Anuncio -->
  <EventoModal
    :event="anuncioData"
    :isEdit="!!fecha.eventoId"
    :isOpen="showAnuncioModal"
    @submit="handleCreateAnuncio"
    @cancel="closeAnuncioModal"
    @delete="handleDeleteAnuncio"
  />
</template>

<script>
import EventoModal from "../modals/EventoModal.vue";

export default {
  name: "FechaToEventoConverter",
  components: {
    EventoModal,
  },
  props: {
    fecha: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isGeneratingAnuncio: false,
      generatingStep: "",
      showAnuncioModal: false,
      anuncioData: {},
      errorMessage: "",
    };
  },
  emits: ["error", "success", "notification"],
  methods: {
    async convertirFechaAEvento() {
      try {
        // Mostrar indicador de carga
        this.isGeneratingAnuncio = true;
        this.generatingStep = "Preparando datos para el anuncio...";

        // Si la fecha ya tiene un evento asociado, cargar ese evento
        if (this.fecha.eventoId) {
          await this.cargarEventoExistente();
          return;
        }

        // Preparar datos básicos
        const { lugarParaDescripcion, linkBoton } = this.prepararDatosBasicos();
        const horaFormateada = this.formatHora(this.fecha.hora);
        const fechaFormateada = this.formatDate(this.fecha.fecha);

        // Generar componentes del anuncio
        const descripcion = await this.generarDescripcion(
          fechaFormateada,
          horaFormateada,
          lugarParaDescripcion
        );
        const eslogan = await this.generarEslogan();
        const imagen = await this.buscarImagen();

        // Preparar los datos para el modal de anuncio
        this.anuncioData = {
          titulo: this.fecha.titulo,
          descripcion,
          eslogan,
          linkBoton,
          image: imagen,
          fecha: this.fecha.fecha,
        };

        // Ocultar indicador de carga y mostrar el modal
        this.isGeneratingAnuncio = false;
        this.showAnuncioModal = true;

        // Mostrar advertencia si algún elemento no se pudo generar
        this.mostrarAdvertenciaSiEsNecesario();
      } catch (error) {
        console.error("Error al preparar datos para anuncio:", error);
        this.$emit("error", "Error al preparar los datos para el anuncio");
        this.isGeneratingAnuncio = false;
      }
    },

    async cargarEventoExistente() {
      this.generatingStep = "Cargando evento existente...";
      const { eventos } = await import("../../../lib/api");
      const resultado = await eventos.get(this.fecha.eventoId);

      if (resultado && resultado.data) {
        this.anuncioData = resultado.data;
        this.isGeneratingAnuncio = false;
        this.showAnuncioModal = true;
      }
    },

    prepararDatosBasicos() {
      // Verificar si el lugar es una URL
      const isUrl = this.isValidUrl(this.fecha.lugar);
      const lugarParaDescripcion = isUrl ? "" : this.fecha.lugar;
      const linkBoton = isUrl ? this.fecha.lugar : "";

      return { lugarParaDescripcion, linkBoton };
    },

    async generarDescripcion(
      fechaFormateada,
      horaFormateada,
      lugarParaDescripcion
    ) {
      // Descripción predeterminada
      let descripcion = `${this.fecha.titulo} - ${horaFormateada}${
        lugarParaDescripcion ? ` - ${lugarParaDescripcion}` : ""
      }`;

      try {
        this.generatingStep = "Generando descripción con IA...";
        const { geminiService } = await import("../../../lib/gemini");

        const prompt = `Como escritor cristiano, genera una descripción breve y cautivadora (máximo 35 palabras) para un evento de iglesia titulado: "${
          this.fecha.titulo
        }" que se realizará el ${fechaFormateada} a las ${horaFormateada}${
          lugarParaDescripcion ? ` en ${lugarParaDescripcion}` : ""
        }.
        La descripción debe:
        - Reflejar valores y principios cristianos
        - Incluir referencias bíblicas sutiles si es apropiado
        - Motivar la participación de la congregación
        - Mantener un tono espiritual y edificante
        - Destacar con negritas (**palabra**) importantes elementos como la fecha, hora y lugar
        - El formato será: Destacar la fecha y hora con negrita usando formato **palabra**`;

        const generatedDescription = await geminiService.generateContent(
          prompt
        );
        if (generatedDescription && generatedDescription.trim()) {
          // Convertir formato markdown de negrita a HTML
          const descripcionConHTML = generatedDescription.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
          );
          descripcion = descripcionConHTML;
        }
        return descripcion;
      } catch (error) {
        console.error("Error al generar descripción con IA:", error);
        // Si falla la generación, usamos la descripción predeterminada con énfasis manual
        return `${this.fecha.titulo} - <strong>${horaFormateada}</strong>${
          lugarParaDescripcion
            ? ` - <strong>${lugarParaDescripcion}</strong>`
            : ""
        }`;
      }
    },

    async generarEslogan() {
      let eslogan = "Ver más";

      try {
        // Verificar si fecha.lugar contiene tinyurl.com
        if (this.fecha.lugar && this.fecha.lugar.includes("tinyurl.com")) {
          return "Ubicación";
        }

        this.generatingStep = "Generando eslogan con IA...";
        const { geminiService } = await import("../../../lib/gemini");

        // Usar el tipo de evento (infoIconoTexto) o el título para generar un eslogan apropiado
        const tipoEvento = this.fecha.titulo;
        const promptEslogan = `Como escritor cristiano, genera un eslogan breve y cautivador (máximo 3 palabras) para un evento de iglesia de tipo "${tipoEvento}".
        El eslogan debe:
        - Ser motivador e inspirador
        - Reflejar valores cristianos
        - Ser conciso y memorable
        - Invitar a la acción
        
        Devuelve solo el eslogan sin explicaciones adicionales.`;

        const generatedEslogan = await geminiService.generateContent(
          promptEslogan
        );
        if (
          generatedEslogan &&
          generatedEslogan.trim() &&
          generatedEslogan.length < 30
        ) {
          eslogan = generatedEslogan.trim();
        }
        return eslogan;
      } catch (error) {
        console.error("Error al generar eslogan con IA:", error);
        return eslogan; // Devolvemos el eslogan predeterminado
      }
    },

    async buscarImagen() {
      let imagen = this.fecha.banner || "";

      if (!imagen) {
        try {
          this.generatingStep = "Buscando imagen relacionada...";
          const { unsplashService } = await import("../../../lib/unsplash");

          // Usar el título del evento para buscar una imagen relacionada
          const searchQuery = this.fecha.infoIconoTexto || this.fecha.titulo;
          const imageUrl = await unsplashService.searchImage(searchQuery);
          if (imageUrl) {
            imagen = imageUrl;
          }
        } catch (error) {
          console.error("Error al buscar imagen:", error);
          // Si falla la búsqueda de imagen, continuamos sin imagen
        }
      }

      return imagen;
    },

    mostrarAdvertenciaSiEsNecesario() {
      const descripcionGenerada = true; // Simplificamos este control
      const esloganGenerado = true;
      const imagenGenerada = !!this.anuncioData.image;

      if (!descripcionGenerada || !esloganGenerado || !imagenGenerada) {
        // Usar el componente padre para mostrar la notificación
        this.$emit(
          "error",
          "Algunos elementos no pudieron generarse automáticamente. Puedes editarlos manualmente en el formulario."
        );
      }
    },

    // Método auxiliar para aplicar énfasis a texto
    applyEmphasis(text, terms) {
      if (!text || !terms || !terms.length) return text;

      let result = text;
      terms.forEach((term) => {
        if (term && typeof term === "string") {
          // Crear un regex que sea insensible a mayúsculas/minúsculas
          const regex = new RegExp(`(${term})`, "gi");
          result = result.replace(regex, "<strong>$1</strong>");
        }
      });

      return result;
    },

    isValidUrl(string) {
      try {
        if (!string) return false;

        // Patrón más preciso para URLs
        // Debe comenzar con http://, https://, o www. seguido de un dominio válido
        const urlPattern =
          /^(https?:\/\/|www\.)[a-z\d]+(\.[a-z\d]+)*\.[a-z]{2,}(:\d{1,5})?(\/.*)?$/i;

        // Verificar si es una dirección de correo electrónico
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Patrones que indican que probablemente es una dirección física
        const addressIndicators = [
          /calle|carrera|avenida|av\.|transversal|diagonal|autopista|cra\.|cl\.|tv\.|dg\.|auto\./i, // Términos comunes en direcciones
          /\d+\s*[a-z]?\s*#\s*\d+\s*-\s*\d+/i, // Patrón como "23 # 45-30" o "23A # 45-30"
          /\d+\s*[a-z]?\s*-\s*\d+/i, // Patrón como "23-30" o "23A-30"
        ];

        // Si contiene indicadores de dirección física, no es una URL
        for (const pattern of addressIndicators) {
          if (pattern.test(string)) {
            return false;
          }
        }

        // Verificar si es una URL o correo electrónico
        return urlPattern.test(string) || emailPattern.test(string);
      } catch (err) {
        return false;
      }
    },

    async handleCreateAnuncio(anuncioData) {
      try {
        this.generatingStep = this.fecha.eventoId
          ? "Actualizando anuncio..."
          : "Creando anuncio...";
        this.isGeneratingAnuncio = true;

        // Importar eventos de manera dinámica
        const { eventos, fechas } = await import("../../../lib/api");

        let eventoId = this.fecha.eventoId;

        if (this.fecha.eventoId) {
          // Actualizar el evento existente
          await eventos.update(this.fecha.eventoId, anuncioData);
        } else {
          // Crear un nuevo evento
          const resultado = await eventos.create(anuncioData);
          eventoId = resultado.data.id;

          // Actualizar la fecha con el ID del evento
          await fechas.update(this.fecha.id, {
            eventoId: eventoId,
          });
        }

        // Cerrar el modal y emitir evento de éxito
        this.closeAnuncioModal();
        this.isGeneratingAnuncio = false;

        // Enviar mensaje de éxito a través del componente padre
        // Emitir también los datos actualizados
        const mensaje = this.fecha.eventoId
          ? "¡Anuncio actualizado con éxito!"
          : "¡Anuncio creado con éxito!";

        this.$emit("success", mensaje, {
          fechaId: this.fecha.id,
          eventoId: eventoId,
        });
      } catch (error) {
        console.error("Error al procesar anuncio:", error);
        this.$emit(
          "error",
          this.fecha.eventoId
            ? "Error al actualizar el anuncio"
            : "Error al crear el anuncio"
        );
        this.isGeneratingAnuncio = false;
      }
    },

    async handleDeleteAnuncio() {
      try {
        // Reemplazar confirm con una forma más amigable en un futuro
        if (!confirm("¿Estás seguro que deseas eliminar este anuncio?")) {
          return;
        }

        this.isGeneratingAnuncio = true;
        this.generatingStep = "Eliminando anuncio...";

        // Importar las APIs de manera dinámica
        const { eventos, fechas } = await import("../../../lib/api");

        // Obtener referencia al evento antes de eliminarlo
        const eventoId = this.fecha.eventoId;

        if (!eventoId) {
          throw new Error(
            "No se encontró el ID del evento asociado a esta fecha"
          );
        }

        // Eliminar el evento
        await eventos.delete(eventoId);

        // Actualizar la fecha para quitar la referencia al evento eliminado
        const fechaActualizada = { ...this.fecha, eventoId: null };
        await fechas.update(this.fecha.id, fechaActualizada);

        // Cerrar modal
        this.closeAnuncioModal();

        // Emitir evento de éxito
        this.$emit("success", "Anuncio eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el anuncio:", error);
        this.$emit("error", "Error al eliminar el anuncio");
      } finally {
        this.isGeneratingAnuncio = false;
        this.generatingStep = "";
      }
    },

    closeAnuncioModal() {
      this.showAnuncioModal = false;
      this.anuncioData = {};
    },

    formatDate(date) {
      // Crear la fecha en la zona horaria de Bogotá
      const fechaBogota = new Date(date + "T00:00:00-05:00");
      return fechaBogota.toLocaleDateString("es-CO", {
        timeZone: "America/Bogota",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    formatHora(hora) {
      // Convertir la hora de formato 24h a formato 12h
      if (!hora) return "";

      try {
        // Dividir la hora y los minutos
        const [horas, minutos] = hora.split(":");

        // Convertir a números
        let horasNum = parseInt(horas, 10);
        const minutosStr = minutos || "00";

        // Determinar AM o PM
        const periodo = horasNum >= 12 ? "PM" : "AM";

        // Convertir a formato 12h
        horasNum = horasNum % 12;
        horasNum = horasNum === 0 ? 12 : horasNum;

        // Devolver la hora formateada
        return `${horasNum}:${minutosStr} ${periodo}`;
      } catch (error) {
        console.error("Error al formatear la hora:", error);
        return hora; // Devolver la hora original en caso de error
      }
    },
  },
};
</script>
