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
    :isEdit="false"
    :isOpen="showAnuncioModal"
    @submit="handleCreateAnuncio"
    @cancel="closeAnuncioModal"
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
  emits: ["error", "success"],
  methods: {
    async convertirFechaAEvento() {
      try {
        // Mostrar indicador de carga
        this.isGeneratingAnuncio = true;
        this.generatingStep = "Preparando datos para el anuncio...";

        // Variables para controlar el progreso
        let descripcionGenerada = false;
        let esloganGenerado = false;
        let imagenGenerada = false;

        // Importar servicios necesarios
        const { geminiService } = await import("../../../lib/gemini");
        const { unsplashService } = await import("../../../lib/unsplash");

        // Verificar si el lugar es una URL
        const isUrl = this.isValidUrl(this.fecha.lugar);
        let lugarParaDescripcion = isUrl ? "" : this.fecha.lugar;
        let linkBoton = isUrl ? this.fecha.lugar : "";

        // Formatear la hora en formato 12h
        const horaFormateada = this.formatHora(this.fecha.hora);

        // Formatear la fecha
        const fechaFormateada = this.formatDate(this.fecha.fecha);

        // Generar una descripción más atractiva con Gemini
        let descripcion = `${this.fecha.titulo} - ${horaFormateada}${
          lugarParaDescripcion ? ` - ${lugarParaDescripcion}` : ""
        }`;

        try {
          this.generatingStep = "Generando descripción con IA...";
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
          descripcionGenerada = true;
        } catch (error) {
          console.error("Error al generar descripción con IA:", error);
          // Si falla la generación, usamos la descripción predeterminada con énfasis manual
          descripcion = `${
            this.fecha.titulo
          } - <strong>${horaFormateada}</strong>${
            lugarParaDescripcion
              ? ` - <strong>${lugarParaDescripcion}</strong>`
              : ""
          }`;
        }

        // Generar un eslogan atractivo basado en el tipo de evento
        let eslogan = "Ver más";
        try {
          // Verificar si fecha.lugar contiene tinyurl.com
          if (this.fecha.lugar && this.fecha.lugar.includes("tinyurl.com")) {
            eslogan = "Ubicación";
            esloganGenerado = true;
          } else {
            this.generatingStep = "Generando eslogan con IA...";
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
            esloganGenerado = true;
          }
        } catch (error) {
          console.error("Error al generar eslogan con IA:", error);
          // Si falla la generación, usamos el eslogan predeterminado
        }

        // Buscar una imagen si no hay banner
        let imagen = this.fecha.banner || "";
        if (!imagen) {
          try {
            this.generatingStep = "Buscando imagen relacionada...";
            // Usar el título del evento para buscar una imagen relacionada
            const searchQuery = this.fecha.infoIconoTexto || this.fecha.titulo;
            const imageUrl = await unsplashService.searchImage(searchQuery);
            if (imageUrl) {
              imagen = imageUrl;
            }
            imagenGenerada = true;
          } catch (error) {
            console.error("Error al buscar imagen:", error);
            // Si falla la búsqueda de imagen, continuamos sin imagen
          }
        } else {
          imagenGenerada = true; // Ya tenemos imagen del banner
        }

        // Preparar los datos para el modal de anuncio
        this.anuncioData = {
          titulo: this.fecha.titulo,
          descripcion: descripcion,
          eslogan: eslogan,
          linkBoton: linkBoton,
          image: imagen,
          fecha: this.fecha.fecha,
        };

        // Ocultar indicador de carga y mostrar el modal
        this.isGeneratingAnuncio = false;
        this.showAnuncioModal = true;

        // Mostrar advertencia si algún elemento no se pudo generar
        if (!descripcionGenerada || !esloganGenerado || !imagenGenerada) {
          setTimeout(() => {
            alert(
              "Algunos elementos no pudieron generarse automáticamente. Puedes editarlos manualmente en el formulario."
            );
          }, 500);
        }
      } catch (error) {
        console.error("Error al preparar datos para anuncio:", error);
        this.$emit("error", "Error al preparar los datos para el anuncio");
        this.isGeneratingAnuncio = false;
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
          /^(https?:\/\/|www\.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i;

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
        this.generatingStep = "Creando anuncio...";
        this.isGeneratingAnuncio = true;

        // Importar eventos de manera dinámica
        const { eventos, fechas } = await import("../../../lib/api");

        // Crear el anuncio con los datos del modal
        const resultado = await eventos.create(anuncioData);

        // Obtener el ID del evento creado
        const eventoId = resultado.data.id;

        // Actualizar la fecha con el ID del evento
        await fechas.update(this.fecha.id, {
          eventoId: eventoId,
        });

        // Cerrar el modal y emitir evento de éxito
        this.closeAnuncioModal();
        this.isGeneratingAnuncio = false;
        this.$emit("success", "¡Anuncio creado con éxito!");
      } catch (error) {
        console.error("Error al crear anuncio:", error);
        this.$emit("error", "Error al crear el anuncio");
        this.isGeneratingAnuncio = false;
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
