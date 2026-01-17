import { describe, it, expect, vi } from 'vitest';
import { generateStrategicBrief } from './geminiService';

// To mock a class constructor correctly with vitest:
vi.mock('@google/genai', () => {
    // Define the prototype methods
    const generateContentMock = vi.fn().mockResolvedValue({
        text: JSON.stringify({
            lastUpdated: "15 de enero de 2026",
            pillars: [],
            macro: { sentiment: "NEUTRAL", description: "Test", recommendation: "Hold" },
            actions: []
        }),
        candidates: [{
            groundingMetadata: {
                groundingChunks: [{ web: { uri: "https://test.com", title: "Test Source" } }]
            }
        }]
    });

    // The constructor function
    const GoogleGenAI = vi.fn(function () {
        return {
            models: {
                generateContent: generateContentMock
            }
        };
    });

    return {
        GoogleGenAI: GoogleGenAI,
        Type: {
            OBJECT: 'object',
            STRING: 'string',
            ARRAY: 'array'
        }
    };
});

describe('geminiService', () => {
    it('should generate a strategic brief and parse the response correctly', async () => {
        const brief = await generateStrategicBrief();
        expect(brief).toBeDefined();
        expect(brief.lastUpdated).toBe("15 de enero de 2026");
        expect(brief.globalSources[0].title).toBe("Test Source");
    });
});
