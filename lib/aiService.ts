import { RecommendationResponse } from "@/types/stadium";
import { isGeminiConfigured, getGeminiClient } from "./gemini";
import { buildGeminiPrompt } from "./promptBuilder";
import { getRecommendation } from "./recommendationEngine";

export interface AIResponse extends RecommendationResponse {
  source: "gemini" | "engine";
}

/**
 * Orchestrator that evaluates a user question, decides whether to route to Gemini
 * or the local rule-based recommendation engine, and returns a grounded AIResponse.
 * Ensures strict error handling, timeouts, and automatic fallback.
 * 
 * @param {string} question The user input query.
 * @returns {Promise<AIResponse>} The AI-augmented or rule-based response.
 */
export async function getAIResponse(question: string): Promise<AIResponse> {
  console.log(`\nQuestion: ${question}`);

  // Get baseline recommendation engine response first (our single source of truth)
  const engineResponse = getRecommendation(question);

  const isConfigured = isGeminiConfigured();
  console.log(`isGeminiConfigured(): ${isConfigured}`);

  // If Gemini API is not configured, bypass calling Gemini entirely
  if (!isConfigured) {
    console.log("Returning source: engine");
    return {
      ...engineResponse,
      source: "engine",
    };
  }

  try {
    const { systemPrompt, userPrompt } = buildGeminiPrompt(question);
    const client = getGeminiClient();

    console.log("Attempting Gemini call");

    // Call the model with a 5-second timeout safeguard
    const apiCall = client.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API call timed out after 10000ms")), 10000)
    );

    const response = await Promise.race([apiCall, timeoutPromise]);

    if (response && response.text) {
      console.log("Gemini response received");
      console.log("Returning source: gemini");
      return {
        ...engineResponse,
        explanation: response.text.trim(),
        source: "gemini",
      };
    }

    console.warn("[DEBUG] Gemini returned an empty response. Falling back to recommendation engine.");
    console.log("Returning source: engine");
    return {
      ...engineResponse,
      source: "engine",
    };
  } catch (error) {
    // Log a dev-only console warning for troubleshooting
    console.warn("[DEBUG] Gemini API call failed or timed out. Falling back to engine:", error);
    console.log("Returning source: engine");

    // Graceful fallback to recommendation engine
    return {
      ...engineResponse,
      source: "engine",
    };
  }
}
