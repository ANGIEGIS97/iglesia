import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

const MODEL = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION =
  'Eres un escritor cristiano especializado en contenido para iglesias evangélicas. ' +
  'Genera textos edificantes, espirituales y motivadores que reflejen los valores del Evangelio. ' +
  'Mantén siempre un tono respetuoso, esperanzador e inclusivo. ' +
  'Responde únicamente con el texto solicitado, sin explicaciones adicionales ni encabezados.';

const INAPPROPRIATE_TERMS = ['secta', 'culto', 'ritual', 'florecer', 'espiservicio'];

export class GeminiService {
  private _client: GoogleGenAI | null = null;

  private get client(): GoogleGenAI {
    if (!this._client) {
      const apiKey = import.meta.env.PUBLIC_GEMINI_API_KEY as string | undefined;
      if (!apiKey) {
        throw new Error('Falta PUBLIC_GEMINI_API_KEY en variables de entorno');
      }
      this._client = new GoogleGenAI({ apiKey });
    }
    return this._client;
  }

  private limitWords(text: string, wordLimit: number): string {
    const words = text.split(/\s+/);
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '.'
      : text;
  }

  private sanitizeResponse(text: string): string {
    let sanitized = text;
    for (const term of INAPPROPRIATE_TERMS) {
      sanitized = sanitized.replace(new RegExp(term, 'gi'), 'servicio');
    }
    if (!sanitized.endsWith('.')) sanitized += '.';
    return sanitized;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 800,
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          ],
        },
      });

      const text = response.text ?? '';
      return this.sanitizeResponse(this.limitWords(text, 70));
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('No se pudo generar contenido con Gemini');
    }
  }
}

export const geminiService = new GeminiService();
