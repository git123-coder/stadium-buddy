import { RecommendationResponse } from "@/types/stadium";

/**
 * Generates a standard conversational fallback response for unrecognized queries.
 * @returns {RecommendationResponse} Formatted fallback recommendation.
 */
export function getUnknownResponse(): RecommendationResponse {
  return {
    intent: "unknown",
    success: false,
    title: "Unrecognized Inquiry",
    recommendation: "I'm not sure how to help with that yet.",
    explanation: "Try asking about gates (e.g., 'Which gate is closest?'), crowd status (e.g., 'How busy is Gate C?'), accessibility (e.g., 'Where is elevator access?'), transit routes, sustainability, or emergency zones.",
  };
}

/**
 * Generates a fallback response for queries referring to missing entities.
 * @param {string} entityName The name of the missing item.
 * @returns {RecommendationResponse} Formatted missing data recommendation.
 */
export function getMissingDataResponse(entityName: string): RecommendationResponse {
  return {
    intent: "unknown",
    success: false,
    title: "Data Not Found",
    recommendation: `I couldn't find records for "${entityName}" in our stadium database.`,
    explanation: "Please ensure the query refers to valid tournament infrastructure (e.g. Gates A through E, or Metro/Bus transport options).",
  };
}

/**
 * Generates a fallback response for unsupported action/intent requests.
 * @param {string} actionName Description of the requested action.
 * @returns {RecommendationResponse} Formatted unsupported action recommendation.
 */
export function getUnsupportedRequestResponse(actionName: string): RecommendationResponse {
  return {
    intent: "unknown",
    success: false,
    title: "Action Not Supported",
    recommendation: `The action "${actionName}" is not supported.`,
    explanation: "StadiumBuddy is currently in static preview mode. Live backend services, real-time ticket binding, and booking integrations are planned for future phases.",
  };
}
