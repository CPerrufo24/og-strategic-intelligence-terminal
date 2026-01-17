import { GoogleGenAI } from "@google/genai";
import { StrategicBrief, Source } from "../types";

// Helper for local development SDK usage
const generateLocalBrief = async (): Promise<StrategicBrief> => {
  // ... [Insert the existing SDK logic here but condensed] ...
  // To save space and ensure code reuse, I will just copy the core logic here or better yet:
  // Actually, duplicating the logic is risky. 
  // Best practice: The client should ALWAYS use the API route in production.
  // In local dev, we can point the API route to ... wait, Vite doesn't allow that easily without backend.

  // Proposal: Keep the Logic here for now, but mark it "DEV ONLY".
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing API Key");

  const ai = new GoogleGenAI({ apiKey });
  const today = new Date().toLocaleDateString('es-XM', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{
      role: "user",
      parts: [{
        text: `Actúa como un Ingeniero de Software Senior y Estratega de Oil & Gas. Tu misión es mantener y actualizar una Terminal de Inteligencia de Negocios para ejecutivos de alto nivel.
              
              CRITICAL INSTRUCTION: You must return ONLY valid JSON code. Do not wrap it in markdown code blocks like \`\`\`json. Just the raw JSON string.

              Cada vez que se ejecute la función de actualización, realiza una búsqueda en tiempo real usando Google Search (si tienes acceso) o usa tu base de conocimiento sobre datos recientes del sector energético en México. Transforma los hallazgos en una respuesta JSON. Asegúrate de que cada 'implicación' responda a la pregunta: ¿Cómo afecta esto al flujo de caja o a la operatividad del sector?
              
              FECHA DE HOY: ${today}

              ESTRUCTURA DE INVESTIGACIÓN (Inamovible):
              1. PEMEX: Análisis de liquidez, deuda financiera (SHCP), producción de refinados y combate al mercado ilícito (huachicol).
              2. PRIVADOS (E&P): Monitoreo de contratos, asociaciones público-privadas (Zama, Trión) y postura regulatoria de la SENER.
              3. MACROECONOMÍA PETROLERA: Seguimiento de precios Brent, WTI y Mezcla Mexicana; proyecciones de oferta/demanda global y volatilidad geopolítica.

              Devuelve un objeto JSON con esta estructura exacta:
              {
                "lastUpdated": "Fecha formateada del reporte",
                "pillars": [
                  { "title": "...", "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL", "context": "...", "implication": "..." }
                ],
                "macro": { 
                  "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL", 
                  "description": "...", 
                  "recommendation": "..." 
                },
                "actions": [
                  { "focus": "...", "risk": "...", "action": "..." }
                ]
              }`
      }]
    }],
    config: {}
  });

  const rawText = response.text || '';
  let brief;
  try {
    brief = JSON.parse(rawText);
  } catch (e) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    brief = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
  }
  return brief;
};

export const generateStrategicBrief = async (): Promise<StrategicBrief> => {
  // Hybrid Strategy:
  // If we are in Dev mode and have a key, we can run locally.
  // In Production, we MUST use the API endpoint to hide the key.

  const isDev = import.meta.env.DEV;

  if (isDev) {
    console.log("Environment: DEV (Using direct SDK)");
    return generateLocalBrief();
  } else {
    console.log("Environment: PROD (Using Serverless API)");
    try {
      const res = await fetch('/api/brief');
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (e) {
      console.error("Failed to fetch from API:", e);
      throw e;
    }
  }
};
