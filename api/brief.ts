import { GoogleGenAI } from "@google/genai";

// Vercel Serverless Function Handler
export default async function handler(request: Request) {
    // CORS Headers for secure access
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "Missing API Configuration" }), { status: 500, headers });
    }

    const ai = new GoogleGenAI({ apiKey });
    const today = new Date().toLocaleDateString('es-XM', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Actúa como un Ingeniero de Software Senior y Estratega de Oil & Gas. Tu misión es mantener y actualizar una Terminal de Inteligencia de Negocios para ejecutivos de alto nivel.
              
              CRITICAL INSTRUCTION: You must return ONLY valid JSON code. Do not wrap it in markdown code blocks like \`\`\`json. Just the raw JSON string.
              
              Tu prioridad es la precisión técnica, el rigor analítico y la estética corporativa tipo Bloomberg. No eres un generador de noticias; eres un sintetizador de implicaciones estratégicas.

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
                        }
                    ]
                }
            ],
            config: {}
        });

        const rawText = response.text || '';

        // Parse JSON safely
        let brief;
        try {
            brief = JSON.parse(rawText);
        } catch (e) {
            // Fallback cleanup
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            brief = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
        }

        return new Response(JSON.stringify(brief), { status: 200, headers });

    } catch (error: any) {
        console.error("AI Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Failed to generate brief" }), { status: 500, headers });
    }
}
