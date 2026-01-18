import { GoogleGenerativeAI } from "@google/generative-ai";
import { StrategicBrief, Source } from "../types";

const generateLocalBrief = async (): Promise<StrategicBrief> => {
  // CORRECCIÓN: Soporte híbrido para Vite (browser) y Scripts (Node.js/TSX)
  let apiKey = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) { /* ignore */ }

  if (!apiKey && typeof process !== 'undefined' && process.env) {
    apiKey = process.env.VITE_GEMINI_API_KEY || '';
  }

  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY. Ensure it is set in .env.local (for scripts) or .env (for Vite).");

  const genAI = new GoogleGenerativeAI(apiKey);

  // CORRECCIÓN: Usar el modelo gemini-2.0-flash (es el que tiene cuota en tu lista)
  // Nota: Si el modelo 2.5 da error de cuota, cámbialo a "gemini-1.5-flash"
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // CORRECCIÓN: Añadimos la herramienta de búsqueda para noticias reales
    // tools: [{ googleSearch: {} }] // Note: googleSearch might need specific setup or checking SDK version support
  });

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `Actúa como un Ingeniero de Software Senior y Estratega de Oil & Gas. Tu misión es mantener y actualizar una Terminal de Inteligencia de Negocios para ejecutivos de alto nivel.
            
    CRITICAL INSTRUCTION: You must return ONLY valid JSON code. Do not wrap it in markdown code blocks like \`\`\`json. Just the raw JSON string.

    Realiza una búsqueda en tiempo real usando Google Search sobre datos recientes (HOY) del sector energético en México y global. Transforma los hallazgos en una respuesta JSON. Asegúrate de que cada 'implicación' responda a la pregunta: ¿Cómo afecta esto al flujo de caja o a la operatividad del sector?
    
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
    }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();

  let brief;
  try {
    // Intentar limpiar el texto por si la IA añade markdown
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    brief = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
  } catch (e) {
    console.error("Error parsing JSON from Gemini:", rawText);
    throw new Error("La IA no devolvió un formato JSON válido.");
  }

  // Extraer fuentes de búsqueda si están disponibles
  const globalSources: Source[] = [];
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata?.groundingChunks) {
    groundingMetadata.groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        globalSources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || "Fuente de información"
        });
      }
    });
  }

  return {
    ...brief,
    globalSources: globalSources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i).slice(0, 5)
  };
};

export const generateStrategicBrief = async (): Promise<StrategicBrief> => {
  const isDev = import.meta.env.DEV;

  // Si no tienes configurado un backend en Vercel (/api/brief), 
  // lo más seguro es ejecutar la lógica directamente en el cliente.
  try {
    // Intentamos ejecutar localmente primero (funciona en Vercel si la Key tiene prefijo VITE_)
    return await generateLocalBrief();
  } catch (e) {
    console.error("Error en la generación directa:", e);
    // Solo si falla y tienes un endpoint real en Vercel, intentamos el fetch
    if (!isDev) {
      const res = await fetch('/api/brief');
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      return await res.json();
    }
    throw e;
  }
};