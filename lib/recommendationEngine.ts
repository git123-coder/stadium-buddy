import { 
  getGates, 
  getAccessibilityData, 
  getTransportOptions, 
  getSustainabilityData, 
  getEmergencyData 
} from "./knowledgeBase";
import { detectIntent } from "./intentDetector";
import { getUnknownResponse } from "./fallbackResponses";
import { RecommendationResponse, TransportOption } from "@/types/stadium";

/**
 * Helper to check if a text contains any keywords.
 */
function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

/**
 * Extracts a specific gate referenced in the user's query.
 * Matches: gate a, gate b, gate c, gate d, gate e, vip gate, vip.
 */
function extractGateId(question: string): string | null {
  const text = question.toLowerCase();
  if (text.includes("vip")) return "gate-vip";
  if (text.includes("gate a")) return "gate-a";
  if (text.includes("gate b")) return "gate-b";
  if (text.includes("gate c")) return "gate-c";
  if (text.includes("gate d")) return "gate-d";
  if (text.includes("gate e")) return "gate-e";

  // Regex fallback: e.g., "gate c", "gate-c", "gatec"
  const match = text.match(/gate[- ]*([a-e])/i);
  if (match) {
    return `gate-${match[1].toLowerCase()}`;
  }
  return null;
}

/**
 * Helper to format a list with Oxford commas.
 */
function formatList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * Core rule-based recommendation engine for StadiumBuddy.
 * Processes user queries, detects intent, matches static datasets, and builds AI-style responses.
 *
 * @param {string} question The natural language query from the user.
 * @returns {RecommendationResponse} A structured recommendation response containing recommendations and explanations.
 */
export function getRecommendation(question: string): RecommendationResponse {
  const { intent } = detectIntent(question);

  switch (intent) {
    case "gateRecommendation":
      return handleGateRecommendation(question);
    case "crowdStatus":
      return handleCrowdStatus(question);
    case "accessibility":
      return handleAccessibility(question);
    case "transport":
      return handleTransport(question);
    case "sustainability":
      return handleSustainability();
    case "emergency":
      return handleEmergency(question);
    case "unknown":
    default:
      return getUnknownResponse();
  }
}

/**
 * Rule: Recommend gates based on wait time, walking time, and optional accessibility flags.
 */
function handleGateRecommendation(question: string): RecommendationResponse {
  const gates = getGates();
  const isAccessibilityRequest = containsAny(question, [
    "accessible", "wheelchair", "disabled", "elevator", "lift", "ramp", "assistance"
  ]);

  // Filter accessible gates if requested
  const candidates = isAccessibilityRequest 
    ? gates.filter(g => g.accessible) 
    : gates;

  if (candidates.length === 0) {
    return {
      intent: "gateRecommendation",
      success: false,
      title: "No Matching Gate",
      recommendation: "No gates match your criteria.",
      explanation: "All gates are currently closed or restricted."
    };
  }

  // Recommendation sorting logic:
  // 1. Lower wait time is preferred.
  // 2. Lower walking time is a tie-breaker.
  const sorted = [...candidates].sort((a, b) => {
    if (a.estimatedWaitMinutes !== b.estimatedWaitMinutes) {
      return a.estimatedWaitMinutes - b.estimatedWaitMinutes;
    }
    return a.walkingTimeMinutes - b.walkingTimeMinutes;
  });

  const bestGate = sorted[0];
  const altGateId = bestGate.alternativeGate;
  const altGate = gates.find(g => g.id === altGateId) || sorted[1] || bestGate;

  let recommendationText = "";
  let explanationText = "";

  if (isAccessibilityRequest) {
    recommendationText = `${bestGate.name} is recommended.`;
    explanationText = `Since you requested accessibility, ${bestGate.name} is selected because it is fully accessible, serves your section (${bestGate.stadiumSectionServed}), and has the shortest wait time (${bestGate.estimatedWaitMinutes} minutes) with ${bestGate.crowdLevel} crowd levels. If conditions change, the best accessible alternative is ${altGate.name}.`;
  } else {
    recommendationText = `${bestGate.name} is recommended.`;
    explanationText = `${bestGate.name} is recommended because it currently has the shortest estimated wait time (${bestGate.estimatedWaitMinutes} minutes), ${bestGate.crowdLevel} crowd levels, and serves your stadium section (${bestGate.stadiumSectionServed}). If conditions change, ${altGate.name} is the best alternative.`;
  }

  return {
    intent: "gateRecommendation",
    success: true,
    title: isAccessibilityRequest ? "Accessible Gate Recommendation" : "Gate Entrance Recommendation",
    recommendation: recommendationText,
    explanation: explanationText,
    metadata: {
      recommendedGate: bestGate,
      alternativeGate: altGate,
      isAccessible: isAccessibilityRequest,
      allCandidates: sorted.map(g => g.name)
    }
  };
}

/**
 * Rule: Inspect queue sizes and delay metrics for specific gates or show the overall best queue.
 */
function handleCrowdStatus(question: string): RecommendationResponse {
  const gates = getGates();
  const gateId = extractGateId(question);

  if (gateId) {
    const matchedGate = gates.find(g => g.id === gateId);
    if (!matchedGate) {
      return {
        intent: "crowdStatus",
        success: false,
        title: "Gate Not Found",
        recommendation: "Unrecognized Gate.",
        explanation: "Please ask about Gate A, B, C, D, E, or the VIP Gate."
      };
    }

    let recommendationText = "";
    let explanationText = "";

    if (matchedGate.crowdLevel === "High") {
      const altGate = gates.find(g => g.id === matchedGate.alternativeGate) || matchedGate;
      recommendationText = `Avoid ${matchedGate.name} if possible due to heavy delays.`;
      explanationText = `${matchedGate.name} currently has ${matchedGate.crowdLevel} crowd levels with an estimated ${matchedGate.estimatedWaitMinutes}-minute wait. We recommend using its alternative ${altGate.name} instead, which has ${altGate.crowdLevel} crowd levels and a ${altGate.estimatedWaitMinutes}-minute wait.`;
    } else {
      recommendationText = `${matchedGate.name} is clear to enter.`;
      explanationText = `${matchedGate.name} currently has ${matchedGate.crowdLevel} crowd levels with a fast ${matchedGate.estimatedWaitMinutes}-minute wait time. It is a great time to head in.`;
    }

    return {
      intent: "crowdStatus",
      success: true,
      title: `Crowd Report: ${matchedGate.name}`,
      recommendation: recommendationText,
      explanation: explanationText,
      metadata: {
        gate: matchedGate,
        waitMinutes: matchedGate.estimatedWaitMinutes,
        crowdLevel: matchedGate.crowdLevel
      }
    };
  }

  // No specific gate: recommend the gate with the absolute shortest wait
  const sorted = [...gates].sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
  const bestGate = sorted[0];

  return {
    intent: "crowdStatus",
    success: true,
    title: "Overall Stadium Crowd Status",
    recommendation: `${bestGate.name} has the shortest queue.`,
    explanation: `${bestGate.name} currently has the shortest queue in the stadium with an estimated ${bestGate.estimatedWaitMinutes}-minute wait and ${bestGate.crowdLevel} crowd levels.`,
    metadata: {
      bestGate,
      allCrowdStats: gates.map(g => ({ gate: g.name, wait: g.estimatedWaitMinutes, crowd: g.crowdLevel }))
    }
  };
}

/**
 * Rule: Provide specific wheelchair directions, restrooms, elevators, or medical setups.
 */
function handleAccessibility(question: string): RecommendationResponse {
  const data = getAccessibilityData();
  const gates = getGates();

  const isElevator = containsAny(question, ["elevator", "lift", "elv"]);
  const isRestroom = containsAny(question, ["restroom", "toilet", "washroom", "bathroom"]);
  const isRoute = containsAny(question, ["route", "path", "ramp", "wheelchair route"]);
  const isMedical = containsAny(question, ["medical", "first aid", "doctor", "health", "injured"]);
  const isAssistance = containsAny(question, ["assistance", "help", "escort", "desk", "support"]);

  let recommendationText = "";
  let explanationText = "";

  if (isElevator) {
    const list = data.elevators.map(e => `${e.id.toUpperCase()} (${e.location} serving ${formatList(e.servesSections)})`).join("; ");
    recommendationText = "Accessible elevators are available in all stands.";
    explanationText = `For vertical transit, elevators are located at: ${list}. These serve all levels, including wheelchair rows and suite tiers.`;
  } else if (isRestroom) {
    const list = data.accessibleRestrooms.map(r => `${r.location} (Changing table: ${r.hasChangingTable ? "Yes" : "No"})`).join("; ");
    recommendationText = "Accessible restrooms are equipped with panic buttons and changing tables.";
    explanationText = `Accessible restrooms can be found at: ${list}. If you require assistance, emergency alert cords are wired inside each stall.`;
  } else if (isRoute) {
    const list = data.wheelchairRoutes.map(r => `${r.fromLocation} to ${r.toLocation} (${r.description})`).join("; ");
    recommendationText = "Step-free wheelchair routes are fully active.";
    explanationText = `The following dedicated step-free paths are available: ${list}. Please follow the blue accessibility signposts.`;
  } else if (isMedical) {
    const list = data.medicalStations.map(m => `First Aid Room at ${m.location} (equipped with ${formatList(m.equipments)})`).join("; ");
    recommendationText = "First Aid and Medical Centers are ready to support.";
    explanationText = `Medical stations are located at: ${list}. In case of a severe medical emergency, dial ${getEmergencyData().emergencyPhone} or wave down any stadium safety steward.`;
  } else if (isAssistance) {
    const list = data.assistancePoints.map(a => `Assistance Desk at ${a.location} offering ${formatList(a.services)}`).join("; ");
    recommendationText = "Accessibility Services Desks are staffed for passenger escort.";
    explanationText = `You can request physical wheelchair escorts, sensory room entry passes, and audio devices at: ${list}.`;
  } else {
    // General accessibility report
    const accessibleGateNames = gates.filter(g => g.accessible).map(g => g.name);
    recommendationText = "Accessible entries are available via Gates A, C, E, and the VIP Gate.";
    explanationText = `The stadium supports inclusive entry at ${formatList(accessibleGateNames)}. Step-free paths connect these entries directly to wheelchair rows. Assistance points are stationed inside Gate A and Gate C to provide immediate support.`;
  }

  return {
    intent: "accessibility",
    success: true,
    title: "Accessibility Assistance Profile",
    recommendation: recommendationText,
    explanation: explanationText,
    metadata: data
  };
}

/**
 * Rule: Guide transit choices comparing time, cost, convenience, and sustainability.
 */
function handleTransport(question: string): RecommendationResponse {
  const options = getTransportOptions();
  const sustain = getSustainabilityData();

  // Find if they mentioned a specific transit mode
  let matchedOption: TransportOption | undefined;
  if (containsAny(question, ["metro", "subway", "train"])) {
    matchedOption = options.find(o => o.name.toLowerCase().includes("metro"));
  } else if (containsAny(question, ["bus", "shuttle"])) {
    matchedOption = options.find(o => o.name.toLowerCase().includes("bus"));
  } else if (containsAny(question, ["taxi", "cab", "rideshare", "uber"])) {
    matchedOption = options.find(o => o.name.toLowerCase().includes("taxi") || o.name.toLowerCase().includes("rideshare"));
  } else if (containsAny(question, ["walk", "pedestrian", "cycle"])) {
    matchedOption = options.find(o => o.name.toLowerCase().includes("pedestrian") || o.name.toLowerCase().includes("boulevard"));
  }

  const bestOption = options.find(o => o.name.toLowerCase().includes("metro")) || options[0];

  if (matchedOption) {
    const sData = sustain.find(s => s.transportType === matchedOption!.name);
    const co2Text = sData && sData.co2SavedKg > 0 ? `, saving ${sData.co2SavedKg} kg of CO₂` : "";
    return {
      intent: "transport",
      success: true,
      title: `Transit Details: ${matchedOption.name}`,
      recommendation: `${matchedOption.name} takes ${matchedOption.estimatedTimeMinutes} mins.`,
      explanation: `${matchedOption.name} has a travel time of ${matchedOption.estimatedTimeMinutes} minutes and estimated cost of ${matchedOption.estimatedCost}. Crowd density is currently ${matchedOption.crowdLevel}. Recommended for: ${matchedOption.recommendedFor}${co2Text}.`,
      metadata: {
        transit: matchedOption,
        sustainability: sData
      }
    };
  }

  // General recommendation: Metro is fastest and highly sustainable
  const metroSustain = sustain.find(s => s.transportType === bestOption.name);
  const carbonInfo = metroSustain ? `saves approximately ${metroSustain.co2SavedKg} kg of CO₂ compared to driving, ` : "";

  return {
    intent: "transport",
    success: true,
    title: "Tournament Travel Guide",
    recommendation: `${bestOption.name} is recommended.`,
    explanation: `${bestOption.name} is the recommended option. It has a travel time of approximately ${bestOption.estimatedTimeMinutes} minutes, costs ${bestOption.estimatedCost}, and operates ${bestOption.availability}. It ${carbonInfo}and has a Green Score of ${metroSustain?.greenScore || 90}/100.`,
    metadata: {
      recommendedTransit: bestOption,
      allTransitOptions: options
    }
  };
}

/**
 * Rule: Inspect green scores and carbon offsets to recommend the eco-friendly travel path.
 */
function handleSustainability(): RecommendationResponse {
  const sustain = getSustainabilityData();
  
  // Sort by greenScore descending
  const sorted = [...sustain].sort((a, b) => b.greenScore - a.greenScore);
  const greenest = sorted[0];
  const nextGreenest = sorted[1];

  return {
    intent: "sustainability",
    success: true,
    title: "Sustainability Transit Audit",
    recommendation: `${greenest.transportType} is the most eco-friendly transit.`,
    explanation: `${greenest.transportType} is the greenest choice with a perfect Green Score of ${greenest.greenScore}/100, saving ${greenest.co2SavedKg} kg of CO₂ emissions per trip. If walking is not feasible, the next best alternative is ${nextGreenest.transportType} (Green Score: ${nextGreenest.greenScore}/100, saving ${nextGreenest.co2SavedKg} kg of CO₂).`,
    metadata: {
      sustainabilityRankings: sorted
    }
  };
}

/**
 * Rule: Map emergency keywords to medical, security, lost-child, or evacuation procedures.
 */
function handleEmergency(question: string): RecommendationResponse {
  const data = getEmergencyData();

  const isMedical = containsAny(question, ["medical", "first aid", "doctor", "health", "hospital", "medic", "hurt", "injured", "chest pain"]);
  const isSecurity = containsAny(question, ["security", "police", "guard", "fight", "steward", "suspicious", "stolen", "lost bag"]);
  const isLostChild = containsAny(question, ["lost child", "lost kid", "child", "separated", "son", "daughter", "missing child"]);
  const isEvacuation = containsAny(question, ["exit", "evacuate", "escape", "fire", "smoke", "alarm", "assembly"]);

  let title = "Stadium Safety Protocol";
  let recommendation = `Emergency phone line: ${data.emergencyPhone}`;
  let explanation = "";
  let metaKey = "general";

  if (isMedical) {
    title = "First Aid & Medical Emergency Desk";
    recommendation = `Head to ${data.medicalHelp.location} or call ${data.medicalHelp.contactNumber}.`;
    explanation = `${data.medicalHelp.instructions}`;
    metaKey = "medicalHelp";
  } else if (isSecurity) {
    title = "Stadium Security Support";
    recommendation = `Head to ${data.security.location} or call ${data.security.contactNumber}.`;
    explanation = `${data.security.instructions}`;
    metaKey = "security";
  } else if (isLostChild) {
    title = "Lost Child & Reunification Desk";
    recommendation = `Head to ${data.lostChildCenter.location}.`;
    explanation = `${data.lostChildCenter.procedure}`;
    metaKey = "lostChildCenter";
  } else if (isEvacuation) {
    title = "Evacuation & Emergency Exits";
    recommendation = `Move calmly to the nearest exit: ${formatList(data.emergencyExitLocations)}.`;
    explanation = `Proceed immediately to the designated assembly area: ${data.assemblyArea}. Do not use elevators. Follow instructions broadcasted over the PA system.`;
    metaKey = "exitEvacuation";
  } else {
    // General emergency fallback
    explanation = `For immediate emergency help, dial ${data.emergencyPhone}. Security control is located at ${data.security.location}, and the main medical unit is at ${data.medicalHelp.location}. Designated emergency assembly area is ${data.assemblyArea}.`;
  }

  return {
    intent: "emergency",
    success: true,
    title,
    recommendation,
    explanation,
    metadata: {
      type: metaKey,
      emergencyDetails: data
    }
  };
}
