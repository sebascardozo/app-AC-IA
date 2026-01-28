
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export class AIService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    }
  }

  async getEfficiencyFeedback(tasks: any[]) {
    if (!this.ai) return "Configura tu API Key para recibir sugerencias de la IA.";

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analiza estas tareas y dame un consejo corto (max 20 palabras) para mejorar la productividad: ${JSON.stringify(tasks)}`,
        config: {
          systemInstruction: "Eres un consultor experto en productividad IA. Hablas español profesional y motivador.",
        }
      });
      return response.text || "La IA está procesando tus datos...";
    } catch (error) {
      console.error("AI Service Error:", error);
      return "IA: Optimizando procesos en segundo plano...";
    }
  }
}

export const aiService = new AIService();
