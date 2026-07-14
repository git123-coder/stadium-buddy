import { GoogleGenAI } from "@google/genai";

let geminiClientInstance: GoogleGenAI | null = null;

/**
 * Checks if the Gemini API Key is configured and non-empty.
 */
export function isGeminiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return typeof apiKey === "string" && apiKey.trim().length > 0;
}

/**
 * Returns a lazily-initialized singleton instance of the GoogleGenAI client.
 * Throws a clear Error if the API key is not configured.
 */
export function getGeminiClient(): GoogleGenAI {
  if (geminiClientInstance) {
    return geminiClientInstance;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error("GEMINI_API_KEY environment variable is not configured or is empty.");
  }

  geminiClientInstance = new GoogleGenAI({ apiKey: apiKey.trim() });
  return geminiClientInstance;
}

/**
 * Sends a minimal connection verification request using the lightweight gemini-flash-lite-latest model.
 * Catches all errors and returns a structured success status and message.
 */
export async function testGeminiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    if (!isGeminiConfigured()) {
      return {
        success: false,
        message: "Gemini API key is not configured.",
      };
    }

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: "Ping",
    });

    if (response && response.text) {
      return {
        success: true,
        message: `Successfully connected to Gemini API. Response snippet: "${response.text.trim().substring(0, 100)}"`,
      };
    }

    return {
      success: false,
      message: "Connected to Gemini API but received empty response text.",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Gemini connectivity check failed: ${errorMessage}`,
    };
  }
}
