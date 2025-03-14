interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private readonly API_KEY = 'AIzaSyA9gmhTdiMtT4rosHltznZGJWFa04qIwTI';
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  private limitWords(text: string, wordLimit: number): string {
    const words = text.split(/\s+/);
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '.';
    }
    return text;
  }

  private sanitizeResponse(text: string): string {
    // Remover cualquier contenido inapropiado o no relacionado
    const inappropriateTerms = ['secta', 'culto', 'ritual', 'florecer'];
    let sanitized = text;
    
    inappropriateTerms.forEach(term => {
      sanitized = sanitized.replace(new RegExp(term, 'gi'), 'servicio');
    });

    // Asegurar que termine con un punto
    if (!sanitized.endsWith('.')) {
      sanitized += '.';
    }

    return sanitized;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const text = data.candidates[0]?.content.parts[0]?.text || '';
      
      // Aplicar el límite de palabras y sanitizar la respuesta
      const limitedText = this.limitWords(text, 50);
      return this.sanitizeResponse(limitedText);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to generate content with Gemini');
    }
  }
}

// Create a singleton instance
export const geminiService = new GeminiService();