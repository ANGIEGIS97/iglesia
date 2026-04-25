import { geminiService } from './gemini';

export class UnsplashService {
  private readonly API_KEY = import.meta.env.PUBLIC_UNSPLASH_ACCESS_KEY as string | undefined;
  private readonly API_URL = 'https://api.unsplash.com';

  async searchImage(query: string): Promise<string> {
    try {
      if (!this.API_KEY) {
        throw new Error('Falta PUBLIC_UNSPLASH_ACCESS_KEY en variables de entorno');
      }

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

      const searchQuery = await geminiService.generateContent(prompt);

      const url = `${this.API_URL}/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&content_filter=high`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${this.API_KEY}`,
          'Accept-Version': 'v1'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response de Unsplash:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      if (!data?.urls?.regular) {
        throw new Error('La respuesta de Unsplash no contiene la URL de la imagen');
      }

      return data.urls.regular;
    } catch (error) {
      console.error('Error al buscar imagen en Unsplash:', error);
      throw new Error(`Error al buscar imagen: ${error.message}`);
    }
  }
}

export const unsplashService = new UnsplashService();
