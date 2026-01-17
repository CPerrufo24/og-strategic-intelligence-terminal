import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API KEY found in .env.local");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: apiKey });

async function listModels() {
    try {
        console.log("Fetching available models...");
        const response = await ai.models.list();

        // The response is a Pager, which is likely an async iterable or has a page property
        console.log("Models/Versions available for your key:");

        // Try standard async iteration which is common for Google SDK pagers
        for await (const model of response) {
            console.log(`- ${model.name} (${model.displayName})`);
            console.log(`  Supported generation methods: ${model.supportedGenerationMethods?.join(', ')}`);
        }

    } catch (error) {
        console.error("Error listing models:", error);
        // Fallback or debug info
        if (error.response) {
            console.error("API Error Response:", error.response);
        }
    }
}

listModels();
