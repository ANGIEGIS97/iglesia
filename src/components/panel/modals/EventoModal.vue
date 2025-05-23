<script setup lang="ts">
import { ref, defineEmits, defineProps, watch, onBeforeUnmount } from "vue";
import "animate.css";
import { geminiService } from "../../../lib/gemini";
import { unsplashService } from "../../../lib/unsplash";

// Importaciones de ProseMirror
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import {
  addListNodes,
  wrapInList,
  liftListItem,
} from "prosemirror-schema-list";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";

// Extender el esquema para incluir marca de color de texto
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks.addToEnd('textColor', {
    attrs: { color: { default: '#000000' } },
    parseDOM: [{
      style: 'color',
      getAttrs: (value) => ({ color: value })
    }],
    toDOM: (mark) => ['span', { style: `color: ${mark.attrs.color}` }, 0]
  })
});

// Serializer para convertir el contenido de ProseMirror a HTML
const domSerializer = DOMSerializer.fromSchema(mySchema);

const props = defineProps({
  event: {
    type: Object,
    default: () => ({
      titulo: "",
      descripcion: "",
      eslogan: "",
      linkBoton: "",
      image: "/imagenes/default.png",
    }),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["submit", "cancel", "delete", "xp-earned"]);

const formData = ref({ ...props.event });
const selectedImageOption = ref("");
const customImageUrl = ref("");
const defaultImageUrl =
  "https://i.ibb.co/bM0Y4b9K/Captura-de-pantalla-2025-02-12-125243.png";

// Referencias para ProseMirror
const editorElement = ref(null);
let editorView = null;

// Sugerencias para textos de botones
const buttonSuggestions = ref<string[]>([]);
const isGeneratingSuggestions = ref(false);

const imageOptions = [
  {
    value: "default",
    label: "1- Imagen predeterminada",
    url: defaultImageUrl,
  },
  {
    value: "biblia1",
    label: "2- Imagen biblia 1",
    url: "https://i.ibb.co/9Td3wVk/ben-white-W8-Qqn1-Pm-QH0-unsplash.jpg",
  },
  {
    value: "biblia2",
    label: "3- Imagen biblia 2",
    url: "https://i.ibb.co/KW60XdT/aaron-burden-9zs-HNt5-Opq-E-unsplash.jpg",
  },
  {
    value: "biblia3",
    label: "4- Imagen biblia 3",
    url: "https://i.ibb.co/b786r8G/biblia.jpg",
  },
  {
    value: "damas",
    label: "5- Imagen damas",
    url: "https://i.ibb.co/MBTgMV7/damas.jpg",
  },
  {
    value: "misionero",
    label: "6- Imagen misionero",
    url: "https://i.ibb.co/nCJpgjQ/misionero.jpg",
  },
  { value: "custom", label: "7- URL Imagen / YouTube" },
];

const showModal = ref(false);
const isGeneratingDescription = ref(false);
const isGeneratingImage = ref(false);
const isUpdating = ref(false);

// Función para extraer el ID del video de YouTube de una URL
const getYoutubeVideoId = (url: string): string | null => {
  const regExps = [
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?=.*v=([^&]+))(?:\S+)?$/,
    /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([^?]+)(?:\S+)?$/,
    /^https?:\/\/(?:www\.)?youtu\.be\/([^?]+)(?:\S+)?$/,
  ];

  for (const regex of regExps) {
    const match = url.match(regex);
    if (match) return match[1];
  }

  return null;
};

// Función para obtener la URL de la miniatura de YouTube de alta calidad
const getYoutubeThumbnailUrl = (videoId: string): string => {
  // Intentamos obtener la versión en calidad maxresdefault (alta calidad)
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Mejorar la función para intentar con diferentes calidades de miniatura
const getThumbnailWithFallback = async (videoId: string): Promise<string> => {
  try {
    // Intentar primero con la calidad máxima
    const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const response = await fetch(maxResUrl, { method: "HEAD" });

    if (response.ok) {
      return maxResUrl;
    } else {
      // Si no está disponible la maxresdefault, usar sddefault
      return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
    }
  } catch (error) {
    console.error("Error al verificar la miniatura:", error);
    // En caso de error, utilizar sddefault como respaldo
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  }
};

// Función para inicializar el editor ProseMirror
const initEditor = () => {
  if (!editorElement.value) return;

  // Crear un contenedor temporal para convertir HTML a nodos ProseMirror
  const tempEl = document.createElement("div");
  tempEl.innerHTML = formData.value.descripcion || "";

  // Crear el estado del editor con plugins básicos
  const state = EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(tempEl),
    plugins: [
      history(),
      keymap({
        ...baseKeymap,
        // Añadir atajos de teclado para listas
        "Shift-Ctrl-8": (state, dispatch) => {
          // Verificar si ya está en un elemento de lista
          const inListItem = findParentNodeOfType(
            state.selection,
            mySchema.nodes.list_item
          );

          if (inListItem) {
            // Si ya está en un elemento de lista, intentar quitar la lista
            return liftListItem(mySchema.nodes.list_item)(state, dispatch);
          }

          // Si no está en una lista, crear una nueva lista con viñetas
          return wrapInList(mySchema.nodes.bullet_list)(state, dispatch);
        },
      }),
    ],
  });

  // Crear la vista del editor
  editorView = new EditorView(editorElement.value, {
    state,
    dispatchTransaction(transaction) {
      const newState = editorView.state.apply(transaction);
      editorView.updateState(newState);

      // Actualizar formData.descripcion con el contenido del editor
      const contentEl = document.createElement("div");
      const fragment = domSerializer.serializeFragment(newState.doc.content);
      contentEl.appendChild(fragment);
      formData.value.descripcion = contentEl.innerHTML;
    },
  });

  // Crear una barra de herramientas simple
  createToolbar();
};

// Función para crear la barra de herramientas
const createToolbar = () => {
  if (!editorElement.value) return;

  // Eliminar cualquier barra de herramientas existente para evitar duplicados
  const existingToolbar = editorElement.value.parentNode.querySelector('div.toolbar-container');
  if (existingToolbar) {
    existingToolbar.remove();
  }

  // Crear un contenedor para la barra de herramientas
  const toolbarContainer = document.createElement('div');
  toolbarContainer.className = 'toolbar-container flex flex-row items-center justify-end gap-2 p-1 pr-2 bg-gray-100 dark:bg-gray-700 rounded-b-lg mt-0 border border-gray-300 dark:border-gray-600 border-t-0';
  
  // Crear botón de IA
  const iaButton = document.createElement('button');
  iaButton.type = 'button';
  iaButton.title = 'Generar descripción con IA';
  iaButton.className = 'p-1 px-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm flex items-center gap-1 text-xs';
  iaButton.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> IA';
  iaButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    generateDescription();
  });
  
  // Deshabilitar botón de IA si no hay título
  if (!formData.value.titulo) {
    iaButton.disabled = true;
  }
  
  // Crear botón de negrita
  const boldButton = createFormatButton(
    "bold",
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/></svg>',
    "Negrita",
    (e) => {
      e.preventDefault();
      const { from, to } = editorView.state.selection;
      const tr = editorView.state.tr;

      if (from === to) {
        // Si no hay selección, no hacer nada
        return;
      }

      // Verificar si la selección ya tiene la marca "strong"
      let hasStrong = false;
      editorView.state.doc.nodesBetween(from, to, (node) => {
        if (node.marks.some((mark) => mark.type.name === "strong")) {
          hasStrong = true;
        }
      });

      // Aplicar o quitar la marca "strong" según el estado actual
      if (hasStrong) {
        tr.removeMark(from, to, mySchema.marks.strong);
      } else {
        tr.addMark(from, to, mySchema.marks.strong.create());
      }

      editorView.dispatch(tr);
    }
  );

  // Crear botón de viñetas
  const bulletListButton = createFormatButton(
    "bullet-list",
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>',
    "Viñetas",
    (e) => {
      e.preventDefault();
      const { state, dispatch } = editorView;

      // Verificar si la selección actual ya está dentro de un elemento de lista
      const inListItem = findParentNodeOfType(
        state.selection,
        mySchema.nodes.list_item
      );

      if (inListItem) {
        // Si ya está en un elemento de lista, intentar quitar la lista
        if (liftListItem(mySchema.nodes.list_item)(state, dispatch)) {
          return;
        }
      }

      // Si no está en una lista o no se pudo quitar, crear una nueva lista con viñetas
      wrapInList(mySchema.nodes.bullet_list)(state, dispatch);
    }
  );

  // Añadir clase para los botones
  boldButton.className = "p-1 rounded bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 shadow-sm";
  bulletListButton.className = "p-1 rounded bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 shadow-sm";

  // Crear el panel de colores
  const colorPanel = document.createElement('div');
  colorPanel.className = 'color-panel hidden absolute bottom-full left-0 p-2 bg-white dark:bg-gray-700 rounded shadow-lg border border-gray-300 dark:border-gray-600 grid grid-cols-4 gap-1';
  colorPanel.style.minWidth = '120px';
  
  // Definir colores para el panel
  const colors = [
    '#22d3ee', // cyan-400
    '#FFA500', // naranja
    '#FF0080', // rosa
    '#FFFF00'  // amarillo
  ];
  
  // Crear botones de colores
  colors.forEach(color => {
    const colorBtn = document.createElement('button');
    colorBtn.className = 'w-6 h-6 rounded border border-gray-300 dark:border-gray-500';
    colorBtn.style.backgroundColor = color;
    colorBtn.title = `Color: ${color}`;
    colorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyTextColor(color);
      colorPanel.classList.add('hidden');
    });
    colorPanel.appendChild(colorBtn);
  });
  
  // Crear botón para quitar colores
  const removeColorBtn = document.createElement('button');
  removeColorBtn.className = 'w-6 h-6 rounded border border-gray-300 dark:border-gray-500 relative';
  removeColorBtn.style.backgroundColor = '#ffffff';
  removeColorBtn.style.position = 'relative';
  removeColorBtn.title = 'Quitar color';
  
  // Añadir línea diagonal para indicar "quitar color"
  const diagonalLine = document.createElement('div');
  diagonalLine.style.position = 'absolute';
  diagonalLine.style.width = '100%';
  diagonalLine.style.height = '2px';
  diagonalLine.style.backgroundColor = '#FF0000';
  diagonalLine.style.top = '50%';
  diagonalLine.style.left = '0';
  diagonalLine.style.transform = 'rotate(45deg)';
  removeColorBtn.appendChild(diagonalLine);
  
  // Evento para quitar el color
  removeColorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Obtener la selección actual
    const { from, to } = editorView.state.selection;
    
    // Si no hay selección, no hacer nada
    if (from === to) return;
    
    // Crear una transacción para quitar la marca de color
    const tr = editorView.state.tr;
    tr.removeMark(from, to, mySchema.marks.textColor);
    editorView.dispatch(tr);
    
    // Ocultar el panel
    colorPanel.classList.add('hidden');
  });
  
  // Añadir el botón al panel
  colorPanel.appendChild(removeColorBtn);
  
  // Crear botón para mostrar/ocultar el panel de colores
  const colorButton = createFormatButton(
    "text-color",
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path></svg>',
    "Color de texto",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      colorPanel.classList.toggle('hidden');
    }
  );
  colorButton.className = "p-1 rounded bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 shadow-sm";
  
  // Crear un contenedor para el botón de color y el panel
  const colorContainer = document.createElement('div');
  colorContainer.className = 'relative';
  colorContainer.appendChild(colorButton);
  colorContainer.appendChild(colorPanel);
  
  // Añadir los botones a la barra de herramientas
  toolbarContainer.appendChild(bulletListButton);
  toolbarContainer.appendChild(boldButton);
  toolbarContainer.appendChild(colorContainer);
  toolbarContainer.appendChild(iaButton);
  
  // Añadir la barra de herramientas después del editor
  editorElement.value.parentNode.appendChild(toolbarContainer);
  
  // Actualizar el estado del botón de IA cuando cambia el título
  watch(() => formData.value.titulo, (newTitle) => {
    iaButton.disabled = !newTitle || isGeneratingDescription.value;
  });
  
  // Actualizar el estado del botón de IA cuando cambia el estado de generación
  watch(() => isGeneratingDescription.value, (isGenerating) => {
    iaButton.disabled = isGenerating || !formData.value.titulo;
    if (isGenerating) {
      iaButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    } else {
      iaButton.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> IA';
    }
  });
};

// Limpiar el editor al desmontar el componente
onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy();
    editorView = null;
  }
});

// Inicializar el editor cuando cambia isOpen
watch(
  () => props.isOpen,
  (newValue) => {
    console.log("EventoModal - isOpen cambiado a:", newValue);
    if (newValue) {
      showModal.value = true;
      document.body.classList.add("modal-open");
      // Inicializar el editor después de que el DOM se actualice
      setTimeout(() => {
        initEditor();
      }, 0);
    } else {
      showModal.value = false;
      document.body.classList.remove("modal-open");
      // Destruir el editor cuando se cierra el modal
      if (editorView) {
        editorView.destroy();
        editorView = null;
      }
    }
  }
);

const generateDescription = async () => {
  if (!formData.value.titulo) {
    alert("Por favor, ingresa un título primero");
    return;
  }

  try {
    isGeneratingDescription.value = true;
    const prompt = `Como escritor cristiano, genera una descripción breve y cautivadora (máximo 35 palabras) para un evento de iglesia titulado: "${formData.value.titulo}".
    La descripción debe:
    - Reflejar valores y principios cristianos
    - Incluir referencias bíblicas sutiles si es apropiado
    - Motivar la participación de la congregación
    - Mantener un tono espiritual y edificante
    - Destacar 2-3 palabras clave importantes colocándolas entre asteriscos dobles **palabra** para indicar formato en negrita
    `;

    const description = await geminiService.generateContent(prompt);

    // Actualizar la descripción y reinicializar el editor con el nuevo contenido
    formData.value.descripcion = description.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    if (editorView) {
      editorView.destroy();
      editorView = null;
    }

    // Reinicializar después de actualizar el contenido
    setTimeout(() => {
      initEditor();
    }, 0);
  } catch (error) {
    console.error("Error al generar la descripción:", error);
    alert("No se pudo generar la descripción. Por favor, intenta nuevamente.");
  } finally {
    isGeneratingDescription.value = false;
  }
};

// Función para generar sugerencias de textos para botones
const generateButtonSuggestions = async () => {
  if (!formData.value.titulo && !formData.value.descripcion) {
    alert("Por favor, ingresa un título o descripción primero");
    return;
  }

  try {
    isGeneratingSuggestions.value = true;
    const prompt = `Como escritor cristiano, genera 4 sugerencias breves (máximo 3 palabras cada una) para el texto de un botón de llamada a la acción para un evento de iglesia con la siguiente información:
    
    Título: "${formData.value.titulo || "Sin título"}"
    Descripción: "${formData.value.descripcion || "Sin descripción"}"
    
    Las sugerencias deben:
    - Ser motivadoras y atractivas
    - Reflejar valores cristianos
    - Invitar a la acción
    - Ser concisas (máximo 3 palabras)
    
    Devuelve solo las 4 sugerencias separadas por punto y coma (;) sin explicaciones adicionales.`;

    const response = await geminiService.generateContent(prompt);
    buttonSuggestions.value = response
      .split(";")
      .map((text) => text.trim())
      .filter((text) => text);
  } catch (error) {
    console.error("Error al generar sugerencias de botones:", error);
    alert("No se pudo generar sugerencias. Por favor, intenta nuevamente.");
  } finally {
    isGeneratingSuggestions.value = false;
  }
};

// Función para aplicar una sugerencia al texto del botón
const applyButtonSuggestion = (suggestion: string) => {
  formData.value.eslogan = suggestion;
};

const generateImage = async () => {
  if (!formData.value.titulo && !formData.value.descripcion) {
    alert("Por favor, ingresa un título o descripción primero");
    return;
  }

  try {
    isGeneratingImage.value = true;
    const searchQuery = formData.value.titulo || formData.value.descripcion;
    console.log("Iniciando generación de imagen para:", searchQuery);

    const imageUrl = await unsplashService.searchImage(searchQuery);
    console.log("URL de imagen obtenida:", imageUrl);

    if (!imageUrl) {
      throw new Error("No se pudo obtener la URL de la imagen");
    }

    formData.value.image = imageUrl;
    selectedImageOption.value = "custom";
    customImageUrl.value = imageUrl;
  } catch (error) {
    console.error("Error completo al generar la imagen:", error);
    alert(`Error al generar la imagen: ${error.message}`);
  } finally {
    isGeneratingImage.value = false;
  }
};

watch(
  () => props.event,
  (newEvent) => {
    console.log("EventoModal - event recibido:", newEvent);
    formData.value = { ...newEvent };

    if (newEvent.image) {
      const predefinedImage = imageOptions.find(
        (option) => option.url === newEvent.image
      );
      if (predefinedImage) {
        selectedImageOption.value = predefinedImage.value;
      } else {
        selectedImageOption.value = "custom";
        customImageUrl.value = newEvent.image;
      }
    } else {
      selectedImageOption.value = "default";
      formData.value.image = defaultImageUrl;
      customImageUrl.value = "";
    }

    // Reinicializar el editor si está montado
    if (editorView) {
      editorView.destroy();
      editorView = null;
      setTimeout(() => {
        initEditor();
      }, 0);
    }
  },
  { immediate: true, deep: true }
);

// Modificar el watch para procesar URLs de YouTube
watch([selectedImageOption, customImageUrl], () => {
  if (selectedImageOption.value === "custom") {
    // Verificar si es una URL de YouTube para extraer la miniatura
    if (customImageUrl.value) {
      const videoId = getYoutubeVideoId(customImageUrl.value);
      if (videoId) {
        // Es una URL de YouTube, obtener la miniatura
        // Mostrar la URL de alta calidad inmediatamente mientras verificamos
        formData.value.image = getYoutubeThumbnailUrl(videoId);
        console.log("Verificando URL de miniatura de YouTube para:", videoId);

        // Iniciar proceso para verificar y posiblemente usar alternativa
        getThumbnailWithFallback(videoId)
          .then((url) => {
            formData.value.image = url;
            console.log("URL final de miniatura de YouTube:", url);
          })
          .catch((error) => {
            console.error("Error al obtener miniatura de YouTube:", error);
            // Si hay error, usar hqdefault como última opción
            formData.value.image = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          });
      } else {
        // Es una URL normal
        formData.value.image = customImageUrl.value || defaultImageUrl;
      }
    } else {
      formData.value.image = defaultImageUrl;
    }
  } else {
    const selected = imageOptions.find(
      (option) => option.value === selectedImageOption.value
    );
    formData.value.image = selected?.url || defaultImageUrl;
  }
});

// Observar cambios en título y descripción para sugerir regenerar sugerencias
watch([() => formData.value.titulo, () => formData.value.descripcion], () => {
  // Limpiar sugerencias cuando cambia el contexto
  buttonSuggestions.value = [];
});

// Función para manejar la eliminación con confirmación
const handleDelete = () => {
  emit("delete");

  // Emitir evento xp-earned al eliminar
  emit("xp-earned", {
    amount: 10,
    message: "¡Anuncio eliminado!",
  });

  // Emitir evento para cerrar el modal
  emit("cancel");
};

const handleSubmit = async () => {
  try {
    // Activar el estado de actualización
    isUpdating.value = true;
    
    // Asegurarse de que la imagen tenga un valor válido
    if (!formData.value.image || formData.value.image === "") {
      formData.value.image = defaultImageUrl;
    }

    // Si es una URL personalizada, validar que sea una URL válida
    if (selectedImageOption.value === "custom" && customImageUrl.value) {
      try {
        // Verificar si es una URL de YouTube primero
        const videoId = getYoutubeVideoId(customImageUrl.value);
        if (!videoId) {
          // No es una URL de YouTube, verificar que sea una URL válida
          new URL(customImageUrl.value);
        }
      } catch (e) {
        console.error("Error de validación de URL:", e);
        alert("La URL de la imagen no es válida");
        return;
      }
    }

    // Formatear los datos antes de enviar
    const dataToSubmit = {
      titulo: formData.value.titulo?.trim() || "",
      descripcion: formData.value.descripcion?.trim() || "",
      eslogan: formData.value.eslogan?.trim() || "",
      linkBoton: formData.value.linkBoton?.trim() || "",
      image: formData.value.image,
      fecha: new Date().toISOString(),
    };

    // Añadir un pequeño retraso para que se vea el texto "Actualizando..."
    await new Promise(resolve => setTimeout(resolve, 800));
    
    emit("submit", dataToSubmit);

    // Emitir evento xp-earned
    if (props.isEdit) {
      emit("xp-earned", {
        amount: 15,
        message: "¡Anuncio actualizado!",
      });
    } else {
      emit("xp-earned", {
        amount: 20,
        message: "¡Nuevo anuncio creado!",
      });
    }
    
    // Desactivar el estado de actualización
    isUpdating.value = false;
    
    // Cerrar el modal automáticamente
    emit("cancel");
  } catch (error: any) {
    console.error("Error al procesar el formulario:", error);
    alert(error.message || "Error al procesar el formulario");
    // Desactivar el estado de actualización en caso de error
    isUpdating.value = false;
  }
};

// Función para crear un botón de formato
const createFormatButton = (name, icon, title, onClick) => {
  const button = document.createElement("button");
  button.className = "pm-format-btn";
  button.innerHTML = icon;
  button.title = title;
  button.addEventListener("click", onClick);
  // Prevenir que el click en el botón cierre el modal
  button.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  return button;
};

// Función para aplicar color al texto seleccionado
const applyTextColor = (color) => {
  const { from, to } = editorView.state.selection;
  
  // Si no hay selección, no hacer nada
  if (from === to) return;
  
  const tr = editorView.state.tr;
  
  // Verificar si la selección ya tiene la marca de color
  let hasTextColor = false;
  let currentColor = null;
  
  editorView.state.doc.nodesBetween(from, to, (node) => {
    node.marks.forEach(mark => {
      if (mark.type.name === 'textColor') {
        hasTextColor = true;
        currentColor = mark.attrs.color;
      }
    });
  });
  
  // Si ya tiene color y es el mismo que se está aplicando, quitarlo
  if (hasTextColor && currentColor === color) {
    tr.removeMark(from, to, mySchema.marks.textColor);
  } else {
    // Quitar cualquier marca de color existente y aplicar la nueva
    tr.removeMark(from, to, mySchema.marks.textColor);
    tr.addMark(from, to, mySchema.marks.textColor.create({ color }));
  }
  
  editorView.dispatch(tr);
};

// Función auxiliar para encontrar el nodo padre de un tipo específico
const findParentNodeOfType = (selection, nodeType) => {
  const { $from } = selection;
  let depth = $from.depth;

  while (depth > 0) {
    const node = $from.node(depth);
    if (node.type === nodeType) {
      return {
        node,
        pos: $from.before(depth),
        depth,
      };
    }
    depth--;
  }

  return null;
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      ></div>
      <div
        v-if="showModal"
        class="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl transform border border-gray-200 dark:border-gray-700 animate__animated animate__fadeInDown animate__faster"
      >
        <!-- Modal header -->
        <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ isEdit ? "Editar Anuncio" : "Nuevo Anuncio" }}
            </h3>
            <button
              @click="$emit('cancel')"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition duration-300"
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
            </button>
          </div>
        </div>
        <!-- Modal content -->
        <div class="p-6 bg-white dark:bg-gray-800 rounded-b-lg">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <div class="relative">
                <input
                  v-model="formData.titulo"
                  type="text"
                  id="titulo"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer"
                  placeholder=" "
                />
                <label
                  for="titulo"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Título (Opcional)
                </label>
              </div>
            </div>

            <div>
              <div class="relative">
                <!-- Editor ProseMirror -->
                <div class="editor-container relative">
                  <div
                    ref="editorElement"
                    id="prosemirror-editor"
                    class="prosemirror-editor block px-2.5 pb-2.5 pt-4 w-full min-h-[100px] text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500"
                  ></div>
                  <label
                    for="prosemirror-editor"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 left-1"
                  >
                    Descripción (Opcional)
                  </label>
                  <!-- El botón de IA ahora está en la barra de herramientas -->
                </div>
              </div>
            </div>

            <div>
              <div class="relative">
                <select
                  v-model="selectedImageOption"
                  id="imagen"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer dark:bg-gray-700"
                >
                  <option
                    v-for="option in imageOptions"
                    :key="option.value"
                    :value="option.value"
                    class="dark:bg-gray-700 dark:text-gray-300"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <label
                  for="imagen"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Imagen
                </label>
                <button
                  type="button"
                  @click="generateImage"
                  :disabled="
                    isGeneratingImage ||
                    (!formData.titulo && !formData.descripcion)
                  "
                  class="absolute right-2 top-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {{ isGeneratingImage ? "Generando..." : "Sugerir" }}
                </button>
              </div>

              <!-- Preview of selected image -->
              <div class="mt-4 flex justify-center">
                <img
                  :src="formData.image"
                  alt="Vista previa"
                  class="h-48 w-full object-cover rounded-lg shadow-md"
                />
              </div>

              <!-- Custom image URL input -->
              <div v-if="selectedImageOption === 'custom'" class="mt-4">
                <div class="relative">
                  <input
                    v-model="customImageUrl"
                    type="text"
                    id="customUrl"
                    class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer"
                    placeholder=" "
                  />
                  <label
                    for="customUrl"
                    class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    URL de la imagen o YouTube
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div class="relative">
                <input
                  v-model="formData.eslogan"
                  type="text"
                  id="eslogan"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer pr-20"
                  placeholder=" "
                />
                <label
                  for="eslogan"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Eslogan (Opcional)
                </label>
                <button
                  type="button"
                  @click="generateButtonSuggestions"
                  :disabled="
                    isGeneratingSuggestions ||
                    (!formData.titulo && !formData.descripcion)
                  "
                  class="absolute right-2 top-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {{ isGeneratingSuggestions ? "Generando..." : "Sugerir" }}
                </button>
              </div>

              <!-- Sugerencias de textos para botones -->
              <div
                v-if="buttonSuggestions.length > 0"
                class="mt-2 flex flex-wrap gap-2"
              >
                <button
                  v-for="(suggestion, index) in buttonSuggestions"
                  :key="index"
                  type="button"
                  @click="applyButtonSuggestion(suggestion)"
                  class="px-3 py-1 text-xs bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors duration-200"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>

            <div>
              <div class="relative">
                <input
                  v-model="formData.linkBoton"
                  type="text"
                  id="linkBoton"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-teal-500 focus:outline-none focus:ring-0 focus:border-teal-500 peer"
                  placeholder=" "
                />
                <label
                  for="linkBoton"
                  class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Link del Eslogan (Opcional)
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                v-if="props.isEdit"
                type="button"
                @click="handleDelete"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
              >
                Eliminar
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-300"
              >
                {{ isUpdating ? "Actualizando..." : (props.isEdit ? "Actualizar" : "Crear") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  height: 100%;
}

/* Estilos para el panel de colores */
.color-panel {
  z-index: 100;
}

body.modal-open {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.animate__animated {
  animation-fill-mode: both;
}

.animate__fadeInDown {
  animation-name: fadeInDown;
  animation-duration: 0.5s;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@supports (-webkit-touch-callout: none) {
  .min-h-screen {
    min-height: -webkit-fill-available;
  }
}

/* Estilos para el editor ProseMirror */
.prosemirror-editor {
  position: relative;
  overflow-y: auto;
  padding: 0.75rem;
  min-height: 100px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.prosemirror-editor:focus {
  outline: none;
  border-color: #14b8a6;
}

.ProseMirror {
  min-height: 100px;
  outline: none;
  padding-top: 8px;
}

.ProseMirror p {
  margin-bottom: 0.5rem;
}

.ProseMirror strong {
  @apply font-bold text-teal-600 dark:text-teal-400 underline decoration-2 underline-offset-2 decoration-teal-500/60;
}

/* Estilos para listas */
.ProseMirror ul {
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  list-style-type: disc;
}

.ProseMirror li {
  margin-bottom: 0.25rem;
}

.ProseMirror li p {
  margin: 0;
}
</style>