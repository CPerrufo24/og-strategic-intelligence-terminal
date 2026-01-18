import { describe, it, expect, vi } from 'vitest';
import { generateStrategicBrief } from './geminiService';

// To mock a class constructor correctly with vitest:
vi.mock('@google/generative-ai', () => {
    const generateContentMock = vi.fn().mockResolvedValue({
        response: {
            text: () => JSON.stringify({
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
        }
    });

    const GoogleGenerativeAI = vi.fn(function () {
        return {
            getGenerativeModel: vi.fn().mockReturnValue({
                generateContent: generateContentMock
            })
        };
    });

    return {
        GoogleGenerativeAI: GoogleGenerativeAI
    };
});

describe('geminiService', () => {
    it('should generate a strategic brief and parse the response correctly', async () => {
        // Correctly stub the environment variable for Vite
        vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key-123');

        const brief = await generateStrategicBrief();
        expect(brief).toBeDefined();
        expect(brief.lastUpdated).toBe("15 de enero de 2026");
        expect(brief.globalSources[0].title).toBe("Test Source");
    });
});


