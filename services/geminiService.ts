import { GoogleGenerativeAI } from "@google/generative-ai";
import { StrategicBrief, Source } from "../types";

const generateLocalBrief = async (): Promise<StrategicBrief> => {
  let apiKey = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) { /* ignore */ }

  if (!apiKey && typeof process !== 'undefined' && process.env) {
    apiKey = process.env.VITE_GEMINI_API_KEY || '';
  }

  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY.");

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    // CORRECCIÓN 1: Forzamos el tipo 'as any' para que acepte googleSearch
    tools: [{ googleSearch: {} }] as any
  });

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `ACTÚA COMO DIRECTOR SENIOR DE INTELIGENCIA ESTRATÉGICA O&G.
HORA ACTUAL: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}.

TU TAREA: Generar un reporte dual que separe la información por "Ventana de Tiempo".

INSTRUCCIONES DE INVESTIGACIÓN:
1. BLOQUE "BREAKING" (Últimas 0-12h): Busca noticias publicadas hace minutos/horas. Enfoque en Tickers de precios vivos, incidentes geopolíticos y aperturas de mercado.
2. BLOQUE "RECAP" (Últimas 24-36h): Busca noticias y reportes de la jornada anterior. Enfoque en estudios rigurosos, cierres de contratos, y proyecciones macroeconómicas consolidadas.

ESTRUCTURA JSON OBLIGATORIA:
{
  "lastUpdated": "ACTUALIZACIÓN MATUTINA - ${today}",
  "breaking": [
    { "title": "...", "context": "Noticia de hace minutos...", "implication": "..." }
  ],
  "historyRecap": [
    { "title": "...", "context": "Resumen de lo ocurrido hace 24-36h...", "impact": "Cómo afecta la base de la semana..." }
  ],
  "macro": { ... },
  "actions": [ ... ]
}

REGLA DE CALIDAD: No dupliques información. Si algo está en 'Breaking', no debe estar en 'History'.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();

  let brief;
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    brief = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
  } catch (e) {
    throw new Error("La IA no devolvió un formato JSON válido.");
  }

  const globalSources: Source[] = [];

  // CORRECCIÓN 2: Forzamos 'as any' en el candidato para acceder a metadatos experimentales
  const candidate = response.candidates?.[0] as any;
  const groundingMetadata = candidate?.groundingMetadata;

  if (groundingMetadata?.groundingChunks) {
    groundingMetadata.groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title) {
        globalSources.push({
          uri: chunk.web.uri,
          title: chunk.web.title
        });
      }
    });
  }

  // CORRECCIÓN 3: Acceso seguro a searchEntryPoint
  if (globalSources.length === 0 && groundingMetadata?.searchEntryPoint?.renderedHtml) {
    globalSources.push({
      uri: "https://google.com/search?q=noticias+petroleo+mexico+hoy",
      title: "Ver fuentes en Google Search"
    });
  }

  return {
    ...brief,
    globalSources: globalSources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i).slice(0, 5)
  };
};

export const generateStrategicBrief = async (): Promise<StrategicBrief> => {
  return await generateLocalBrief();
};