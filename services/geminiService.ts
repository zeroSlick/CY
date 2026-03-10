
import { GoogleGenAI, Type } from "@google/genai";
import { Evidence, TimelineEvent } from "../types";

export const geminiService = {
  // Analyzes threat telemetry and returns assessment
  async analyzeThreat(threatData: any) {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze this threat telemetry: ${JSON.stringify(threatData)}`,
        config: {
          systemInstruction: `You are a Senior Security Analyst at Cloud-Basin. 
          Provide a technical assessment of the telemetry. 
          Respond with:
          1. Priority Level (P1-P5).
          2. Numeric Risk Index (0.0 to 10.0).
          3. Technical Summary.
          4. Recommended Countermeasures.
          Return valid JSON only.`,
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
      return {
        priorityLevel: 'UNKNOWN',
        riskScore: 0,
        summary: 'Telemetry analysis timed out or failed validation.',
        mitigationSteps: ['Investigate telemetry manual ingestion', 'Check neural link status']
      };
    }
  },

  // Provides insights and emergency playbook for an incident
  async getIncidentInsights(incident: any) {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide an emergency response playbook for this incident: ${JSON.stringify(incident)}`,
        config: {
          systemInstruction: `You are a Senior DFIR Specialist. Analyze the incident and provide:
          1. Technical Summary. 2. Specific Precautions. 3. Technical Solutions. 4. Mitigation Playbook.
          Return valid JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              riskAssessment: { type: Type.STRING },
              solutions: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    action: { type: Type.STRING },
                    details: { type: Type.STRING }
                  }
                }
              },
              hiddenPatterns: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["summary", "riskAssessment", "solutions", "hiddenPatterns"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return null;
    }
  },

  // Performs intelligence correlation using Google Search grounding
  async lookupIndicator(indicator: string) {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform intelligence correlation for indicator: ${indicator}`,
        config: { 
          tools: [{ googleSearch: {} }],
          systemInstruction: `You are a Lead Threat Intelligence Analyst. 
          Analyze the indicator (IP, Hash, or URL). Output a professional markdown report.`
        }
      });
      return response.text || "No intelligence markers discovered.";
    } catch (error) {
      return "Intelligence link failure. Verify network parameters.";
    }
  },

  // Analyzes forensic file artifacts for static analysis
  async analyzeFileArtifact(fileName: string, fileContent: string, fileType: string) {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze forensic artifact: ${fileName} (${fileType}). Content: ${fileContent.substring(0, 5000)}`,
        config: {
          systemInstruction: "Forensic Malware Researcher. Static analysis mode. Return JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              threatVerdict: { type: Type.STRING },
              riskScore: { type: Type.NUMBER },
              findings: { type: Type.ARRAY, items: { type: Type.STRING } },
              technicalDetails: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return null;
    }
  },

  // Reconstructs a forensic timeline based on a collection of evidence artifacts
  async reconstructTimeline(evidence: Evidence[]): Promise<TimelineEvent[]> {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Reconstruct a chronological forensic timeline from these evidence artifacts: ${JSON.stringify(evidence)}`,
        config: {
          systemInstruction: "You are an expert Forensic Investigator. Analyze the evidence and reconstruct the sequence of events. Return only valid JSON array of objects.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                event: { type: Type.STRING },
                category: { type: Type.STRING },
                importance: { type: Type.STRING }
              },
              required: ["timestamp", "event", "category", "importance"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Timeline reconstruction failure:", error);
      return [];
    }
  }
};
