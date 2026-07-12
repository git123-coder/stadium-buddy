import { IntentType, IntentResult } from "@/types/stadium";

// Define keyword sets for each intent
const KEYWORDS: Record<IntentType, string[]> = {
  gateRecommendation: [
    "best gate",
    "which gate",
    "nearest gate",
    "entrance",
    "fastest entry",
    "least crowded gate",
    "gate recommendation",
    "how to enter",
    "which entrance",
    "recommend a gate",
    "find gate",
    "enter stadium",
    "gate location",
  ],
  crowdStatus: [
    "crowd",
    "busy",
    "wait",
    "queue",
    "line",
    "crowded",
    "congestion",
    "traffic",
    "delay",
    "wait time",
    "how long",
  ],
  accessibility: [
    "wheelchair",
    "accessible",
    "elevator",
    "restroom",
    "medical",
    "assistance",
    "disabled",
    "barrier free",
    "lift",
    "physical helper",
    "stairs alternate",
    "ramp",
  ],
  transport: [
    "metro",
    "bus",
    "taxi",
    "walking",
    "transport",
    "airport",
    "shuttle",
    "ride",
    "drive",
    "cab",
    "cycle",
    "transit",
    "how to get to",
    "getting there",
  ],
  sustainability: [
    "eco",
    "carbon",
    "co2",
    "green",
    "sustainable",
    "sustainability",
    "environment",
    "footprint",
    "emissions",
    "planet",
    "eco friendly",
    "most sustainable",
    "sustainable transport",
    "sustainable option",
  ],
  emergency: [
    "help",
    "emergency",
    "security",
    "lost child",
    "exit",
    "medical station",
    "first aid",
    "lost my child",
    "steward",
    "evacuate",
    "police",
    "accident",
    "hurt",
    "injury",
    "assembly area",
  ],
  unknown: [],
};

/**
 * Detects user intent based on keyword matching in a given query.
 * @param {string} question The user input query.
 * @returns {IntentResult} Object containing the matched intent and confidence score.
 */
export function detectIntent(question: string): IntentResult {
  const normalized = question.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  
  if (!normalized.trim()) {
    return { intent: "unknown", confidence: 0.0 };
  }

  let bestIntent: IntentType = "unknown";
  let maxScore = 0;

  // Search each intent keyword list
  for (const [intentKey, keywordList] of Object.entries(KEYWORDS)) {
    const intent = intentKey as IntentType;
    if (intent === "unknown") continue;

    let score = 0;
    for (const keyword of keywordList) {
      if (normalized.includes(keyword)) {
        // Multi-word matches or exact matches get higher weights
        const wordCount = keyword.split(" ").length;
        score += wordCount * 2;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestIntent = intent;
    }
  }

  // Calculate confidence score (bounded between 0.5 and 0.95 for matches, otherwise 0 for unknown)
  if (bestIntent === "unknown" || maxScore === 0) {
    return { intent: "unknown", confidence: 0.0 };
  }

  const confidence = Math.min(0.95, 0.5 + maxScore * 0.1);

  return {
    intent: bestIntent,
    confidence,
  };
}
