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
    model: "gemini-3-flash",
    // CORRECCIÓN: Añadimos la herramienta de búsqueda para noticias reales
    // tools: [{ googleSearch: {} }] // Note: googleSearch might need specific setup or checking SDK version support
  });

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `Actúa como un Experto en Planeación Estratégica de la industria Oil & Gas con enfoque en Inteligencia de Mercados. 
    
    Tu misión es generar el "Briefing Matutino de Inteligencia": una recopilación y análisis de las noticias más relevantes de HOY (${today}) que impactan al sector petrolero.

    INSTRUCCIONES DE BÚSQUEDA (Prioridad Alta):
    1. Utiliza Google Search para identificar los eventos más significativos de esta mañana en:
       - Sector petrolero (upstream, midstream, downstream).
       - Cambios regulatorios, proyecciones de producción o anuncios gubernamentales.
       - Estudios rigurosos de variables macroeconómicas (precios spot, inflación, tipos de cambio, demanda global).
       - Otros indicadores clave (inventarios de la EIA, decisiones de la OPEP+, geopolítica).

    CRITICAL INSTRUCTION: Return ONLY a raw JSON string. No markdown, no text before or after.

    ESTRUCTURA DEL ANÁLISIS (Basada en relevancia del día):
    - PILLARS: Identifica los 2 temas de mayor impacto hoy (pueden ser sobre PEMEX, empresas internacionales o nuevas tecnologías/estudios).
    - MACRO: Analiza las proyecciones y variables macroeconómicas que están moviendo el mercado en este momento.
    - ACTIONS: Traduce las noticias en recomendaciones tácticas para ejecutivos de la industria.

    Devuelve este esquema JSON exacto:
    {
      "lastUpdated": "Reporte Estratégico - ${today}",
      "pillars": [
        { 
          "title": "Título de la Noticia/Tema más Relevante", 
          "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL", 
          "context": "Resumen ejecutivo de la noticia o estudio encontrado hoy.", 
          "implication": "¿Cómo impacta esto específicamente en la rentabilidad, operatividad o proyecciones del sector?" 
        }
      ],
      "macro": { 
        "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL", 
        "description": "Análisis de indicadores (Brent/WTI, tasas, proyecciones OPEP) detectados en las noticias de esta mañana.", 
        "recommendation": "Recomendación estratégica basada en el entorno macro actual." 
      },
      "actions": [
        { "focus": "Área de enfoque", "risk": "Riesgo detectado hoy", "action": "Acción mitigante recomendada" }
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