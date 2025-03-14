import { geminiService } from './gemini';

export class UnsplashService {
  // Temporalmente hardcodeamos la API key para pruebas
  private readonly API_KEY = 'ACdvcXLn5HroYjLavfqyMXdpgqTGFhcZGBjS4ucIBuA';
  private readonly API_URL = 'https://api.unsplash.com';

  constructor() {
    console.log('UnsplashService inicializado');
    console.log('API Key disponible:', !!this.API_KEY);
    console.log('API Key:', this.API_KEY);
  }

  async searchImage(query: string): Promise<string> {
    try {
      if (!this.API_KEY) {
        throw new Error('API Key de Unsplash no está configurada');
      }
      console.log('Iniciando búsqueda de imagen para:', query);
     
// Prompt optimizado para términos generales y específicos
const prompt = `Genera términos de búsqueda óptimos para Unsplash que produzcan imágenes de alta calidad y EXTREMADAMENTE relevantes para: "${query}".

REQUISITOS DE SALIDA:
- Devuelve SOLAMENTE 4-5 términos de búsqueda sin explicaciones ni contexto adicional
- Términos EN INGLÉS exclusivamente
- NO uses comillas en los términos

ANÁLISIS CONTEXTUAL:
1. Primero, determina si "${query}" es:
   - Término general (ej: luna, cielo, mar)
   - Término específico (ej: espresso, rascacielos)
   - Concepto abstracto (ej: libertad, amor)

2. Para términos generales como "luna":
   - Especifica el aspecto más fotogénico (ej: "full moon", "crescent moon", "moon landscape")
   - Añade contexto visual (ej: "night sky", "stars", "silhouette")
   - Incluye detalles distintivos (ej: "detailed", "crater", "close-up")

ESTRUCTURA DE LOS TÉRMINOS:
- Término principal específico (evitar palabras genéricas)
- Término de composición (telephoto, wide-angle, macro, overhead)
- Término de calidad (4k, professional, high-definition)
- Término de ambiente (nighttime, dramatic, soft light, misty)
- Término de contexto (si es necesario para clarificar)

EJEMPLOS ESPECÍFICOS:
- Para "luna": "full moon telephoto craters night sky professional"
- Para "mar": "ocean waves aerial turquoise dramatic coast"
- Para "café": "espresso steam macro morning professional"
- Para "montaña": "mountain peak dramatic fog sunrise telephoto"`;
     
      console.log('Generando términos de búsqueda con Gemini...');
      const searchQuery = await geminiService.generateContent(prompt);
      console.log('Términos generados:', searchQuery);

      const url = `${this.API_URL}/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&content_filter=high`;
      console.log('URL de Unsplash:', url);
      console.log('Headers:', {
        'Authorization': `Client-ID ${this.API_KEY}`,
        'Accept-Version': 'v1'
      });

      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${this.API_KEY}`,
          'Accept-Version': 'v1'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Respuesta de Unsplash:', data);

      if (!data?.urls?.regular) {
        throw new Error('La respuesta de Unsplash no contiene la URL de la imagen');
      }

      return data.urls.regular;
    } catch (error) {
      console.error('Error detallado al buscar en Unsplash:', error);
      throw new Error(`Error al buscar imagen: ${error.message}`);
    }
  }
}

export const unsplashService = new UnsplashService();