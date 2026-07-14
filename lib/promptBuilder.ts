import { detectIntent } from "./intentDetector";
import {
  getGates,
  getCrowdData,
  getAccessibilityData,
  getTransportOptions,
  getSustainabilityData,
  getEmergencyData,
} from "./knowledgeBase";
import { getRecommendation } from "./recommendationEngine";

/**
 * Builds the system and user prompts for grounding Gemini content generation.
 * Consumes the existing recommendation engine output as the single source of truth.
 * 
 * @param {string} question The visitor's question.
 * @returns {{ systemPrompt: string; userPrompt: string }} Prompt payloads.
 */
export function buildGeminiPrompt(question: string): { systemPrompt: string; userPrompt: string } {
  // 1. Classify the user query using the intent detector from Phase 3
  const { intent } = detectIntent(question);

  // 2. Fetch the corresponding raw database context matching the classified intent
  let databaseContext = "";
  switch (intent) {
    case "gateRecommendation": {
      const gates = getGates();
      const crowd = getCrowdData();
      databaseContext = gates
        .map((g) => {
          const telemetry = crowd.find((c) => c.gateId === g.id);
          const waitTime = telemetry ? telemetry.estimatedWaitMinutes : g.estimatedWaitMinutes;
          const crowdLvl = telemetry ? telemetry.crowdLevel : g.crowdLevel;
          return `Gate: ${g.name} / Sections Served: ${g.stadiumSectionServed} / Wait Time: ${waitTime} mins / Crowd Level: ${crowdLvl} / Accessible: ${g.accessible ? "Yes" : "No"}`;
        })
        .join("\n");
      break;
    }
    case "crowdStatus": {
      const crowd = getCrowdData();
      const gates = getGates();
      databaseContext = crowd
        .map((c) => {
          const g = gates.find((gate) => gate.id === c.gateId);
          return `Gate: ${g?.name ?? c.gateId} / Wait Time: ${c.estimatedWaitMinutes} mins / Crowd Level: ${c.crowdLevel}`;
        })
        .join("\n");
      break;
    }
    case "accessibility": {
      const access = getAccessibilityData();
      const routes = access.wheelchairRoutes
        .map((r) => `- Wheelchair route from ${r.fromLocation} to ${r.toLocation}: ${r.description}`)
        .join("\n");
      const elevators = access.elevators
        .map((e) => `- Elevator ${e.id} at ${e.location} (serves sections ${e.servesSections.join(", ")})`)
        .join("\n");
      const restrooms = access.accessibleRestrooms
        .map((r) => `- Restroom at ${r.location} (Changing table: ${r.hasChangingTable ? "Yes" : "No"})`)
        .join("\n");
      const desks = access.assistancePoints
        .map((p) => `- Assistance Desk at ${p.location} (Services: ${p.services.join(", ")})`)
        .join("\n");
      databaseContext = `Wheelchair Access:\n${routes}\n\nElevators:\n${elevators}\n\nRestrooms:\n${restrooms}\n\nAssistance Desks:\n${desks}`;
      break;
    }
    case "transport": {
      const transport = getTransportOptions();
      const sustainability = getSustainabilityData();
      databaseContext = transport
        .map((t) => {
          const s = sustainability.find((item) => item.transportType === t.name);
          return `Transit Mode: ${t.name} / Cost: ${t.estimatedCost} / Time: ${t.estimatedTimeMinutes} mins / Crowd: ${t.crowdLevel} / CO2 Saved: ${s?.co2SavedKg ?? "N/A"}kg / Green Score: ${s?.greenScore ?? "N/A"}/100 / Best for: ${t.recommendedFor}`;
        })
        .join("\n");
      break;
    }
    case "sustainability": {
      const sustainability = getSustainabilityData();
      const transport = getTransportOptions();
      databaseContext = sustainability
        .map((s) => {
          const t = transport.find((item) => item.name === s.transportType);
          return `Mode: ${s.transportType} / CO2 Saved: ${s.co2SavedKg}kg / Green Score: ${s.greenScore}/100 / Footprint: ${s.environmentalImpact} / Est Cost: ${t?.estimatedCost ?? "N/A"}`;
        })
        .join("\n");
      break;
    }
    case "emergency": {
      const emergency = getEmergencyData();
      const exits = emergency.emergencyExitLocations.map((loc) => `- ${loc}`).join("\n");
      const medical = `- Medical Help: Located at ${emergency.medicalHelp.location} (Phone: ${emergency.medicalHelp.contactNumber}). Instructions: ${emergency.medicalHelp.instructions}`;
      const security = `- Security: Located at ${emergency.security.location} (Phone: ${emergency.security.contactNumber}). Instructions: ${emergency.security.instructions}`;
      const lostChild = `- Lost Child Center: Located at ${emergency.lostChildCenter.location}. Procedure: ${emergency.lostChildCenter.procedure}`;
      const assembly = `- Assembly Area: ${emergency.assemblyArea}\n- Emergency Hotline: ${emergency.emergencyPhone}`;
      databaseContext = `Emergency Contacts & Info:\n${medical}\n${security}\n${lostChild}\n\nEmergency Exits:\n${exits}\n\nAssembly Guidelines:\n${assembly}`;
      break;
    }
    default: {
      databaseContext = "No specific database context matching this inquiry.";
      break;
    }
  }

  // 3. Extract standard recommendation engine choices (respecting existing Phase 3 logic)
  const engineResponse = getRecommendation(question);
  const resolvedDecision = `Recommendation Outcome:\n- Best Option: ${engineResponse.recommendation}\n- Details: ${engineResponse.explanation}`;

  const systemPrompt =
    "You are StadiumBuddy. You help FIFA World Cup 2026 visitors.\n" +
    "Never invent stadium information. Only answer using the supplied context.\n" +
    "If information is missing, clearly say so. Keep responses helpful, natural, and friendly.";

  const userPrompt =
    `Context:\n` +
    `-- GROUNDED FACTS --\n` +
    `${databaseContext}\n\n` +
    `-- RECOMMENDED ENGINE OPTION --\n` +
    `${resolvedDecision}\n\n` +
    `Question: ${question}`;

  return {
    systemPrompt,
    userPrompt,
  };
}
