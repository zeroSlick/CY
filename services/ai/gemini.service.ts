
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async analyzeThreat(threatData: any) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze this threat telemetry: ${JSON.stringify(threatData)}`,
        config: {
          systemInstruction: `You are a Senior Security Analyst at Cloud-Basin. 
          Provide a technical assessment of the telemetry.
          1. Severity Level (P1-P5).
          2. Numeric Risk Index (0.0 to 10.0).
          3. Technical Summary.
          4. Recommended Countermeasures.
          Return valid JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              priorityLevel: { type: Type.STRING },
              riskScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["priorityLevel", "riskScore", "summary", "mitigationSteps"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Analysis protocol failure:", error);
      return null;
    }
  },

  async lookupIndicator(indicator: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform intelligence correlation for: ${indicator}`,
        config: { 
          tools: [{ googleSearch: {} }],
          systemInstruction: `You are a Lead Threat Intelligence Analyst. 
          Analyze the indicator (IP, Hash, or URL).
          Compare against global threat databases.
          Output a professional markdown report including risk score and tactical recommendations.`
        }
      });
      return response.text || "No intelligence markers discovered.";
    } catch (error) {
      return "Intelligence link failure. Verify network parameters.";
    }
  }
};
