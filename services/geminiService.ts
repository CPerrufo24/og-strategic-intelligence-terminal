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
    model: "gemini-3-pro-preview",
    tools: [{ googleSearch: {} }] as any
  });

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const currentTime = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

  const prompt = `ACTÚA COMO DIRECTOR SENIOR DE INTELIGENCIA ESTRATÉGICA O&G.
HORA ACTUAL EN MÉXICO: ${currentTime}.

TU TAREA: Generar un reporte dual separado por ventanas de tiempo.

INSTRUCCIONES DE INVESTIGACIÓN:
1. BLOQUE "BREAKING" (Últimas 0-12h): Busca noticias publicadas hace minutos u horas. Enfoque en Tickers de precios vivos, incidentes geopolíticos repentinos y anuncios matutinos.
2. BLOQUE "HISTORY RECAP" (Últimas 24-48h): Busca noticias y reportes de la jornada anterior. Enfoque en estudios rigurosos, cierres de contratos y proyecciones macro consolidadas.

INSTRUCCIONES DE FUENTES:
- Para CADA noticia (item), debes buscar y asignar URLs reales y específicas que validen la información en el campo "sources".

ESTRUCTURA JSON OBLIGATORIA:
{
  "lastUpdated": "INTELIGENCIA ESTRATÉGICA - ${today}",
  "breaking": [
    { 
      "title": "Titular de Alto Impacto (0-12h)", 
      "context": "Contexto inmediato...", 
      "implication": "Implicación operativa...",
      "sources": [ { "title": "Fuente", "uri": "https://..." } ]
    }
  ],
  "historyRecap": [
    { 
      "title": "Titular Jornada Previa (24-48h)", 
      "context": "Contexto histórico reciente...", 
      "impact": "Impacto en la base de la semana...",
      "sources": [ { "title": "Fuente", "uri": "https://..." } ]
    }
  ],
  "macro": {
    "sentiment": "BULLISH/BEARISH/NEUTRAL",
    "description": "Análisis de variables macro...",
    "recommendation": "Recomendación estratégica..."
  },
  "actions": [
    { "focus": "Área", "risk": "Riesgo", "action": "Acción" }
  ]
}

REGLA CRÍTICA DE LINKS: ÚNICAMENTE utiliza URLs que provengan directamente de tus metadatos de búsqueda (grounding). Prohibido inventar, suponer o truncar URLs basándose en el título. Si no tienes la URL exacta y verificada que usaste para el análisis, NO pongas nada en el campo 'sources'. Es preferible un array vacío que un link roto.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  const text = response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Formato JSON no identificado en la respuesta de IA.");
  }

  const brief = JSON.parse(jsonMatch[0]) as StrategicBrief;

  // FALLBACK ALGORÍTMICO: GOOGLE NEWS SEARCH
  // Si la IA obedeció la regla estricta y mandó sources vacíos, generamos un link de búsqueda funcional.
  const injectFallbackLinks = (items: any[]) => {
    return items.map(item => {
      if (!item.sources || item.sources.length === 0) {
        return {
          ...item,
          sources: [{
            title: "Ver Cobertura Completa ↗",
            uri: `https://www.google.com/search?q=${encodeURIComponent(item.title)}&tbm=nws`
          }]
        };
      }
      return item;
    });
  };

  if (brief.breaking) brief.breaking = injectFallbackLinks(brief.breaking);
  if (brief.historyRecap) brief.historyRecap = injectFallbackLinks(brief.historyRecap);

  /* FALLBACK GLOBAL SOURCES (Grounding Metadata) */
  const globalSources: Source[] = [];
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

  return {
    ...brief,
    globalSources: globalSources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i).slice(0, 5)
  };
};

export const generateStrategicBrief = async (): Promise<StrategicBrief> => {
  return await generateLocalBrief();
};