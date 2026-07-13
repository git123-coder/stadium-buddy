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
  const lowerQ = question.toLowerCase();

  // 1. Identify section and its primary gate
  let targetSectionGateId = "";
  if (lowerQ.includes("100-112") || lowerQ.includes("100")) targetSectionGateId = "gate-a";
  else if (lowerQ.includes("113-125") || lowerQ.includes("113") || lowerQ.includes("120")) targetSectionGateId = "gate-b";
  else if (lowerQ.includes("126-138") || lowerQ.includes("126") || lowerQ.includes("130")) targetSectionGateId = "gate-c";
  else if (lowerQ.includes("139-150") || lowerQ.includes("139") || lowerQ.includes("140")) targetSectionGateId = "gate-d";
  else if (lowerQ.includes("151-160") || lowerQ.includes("151") || lowerQ.includes("155")) targetSectionGateId = "gate-e";
  else if (lowerQ.includes("vip") || lowerQ.includes("suites") || lowerQ.includes("lounge")) targetSectionGateId = "gate-vip";

  // 2. Identify arrival plaza
  let arrivalPlaza = "north"; // default fallback
  if (lowerQ.includes("east")) arrivalPlaza = "east";
  else if (lowerQ.includes("south")) arrivalPlaza = "south";
  else if (lowerQ.includes("west")) arrivalPlaza = "west";

  // 3. Identify priority request
  const isAccessibilityRequest = containsAny(lowerQ, [
    "accessible", "wheelchair", "disabled", "elevator", "lift", "ramp", "assistance"
  ]);
  const isLeastCrowded = containsAny(lowerQ, ["least crowded", "lowest crowd"]);
  const isClosest = containsAny(lowerQ, ["closest", "nearest", "minimal walking"]);

  const plazaDistances: Record<string, Record<string, number>> = {
    north: { "gate-a": 2, "gate-b": 10, "gate-c": 15, "gate-d": 10, "gate-e": 5, "gate-vip": 3 },
    east: { "gate-a": 10, "gate-b": 2, "gate-c": 10, "gate-d": 15, "gate-e": 12, "gate-vip": 8 },
    south: { "gate-a": 15, "gate-b": 10, "gate-c": 2, "gate-d": 10, "gate-e": 12, "gate-vip": 10 },
    west: { "gate-a": 10, "gate-b": 15, "gate-c": 10, "gate-d": 2, "gate-e": 4, "gate-vip": 8 }
  };

  const crowdLevelValue = (level: string): number => {
    switch (level.toLowerCase()) {
      case "low": return 1;
      case "medium": return 2;
      case "high": return 3;
      default: return 9;
    }
  };

  // Filter candidates (accessible candidates if requested)
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

  // Sort candidates dynamically according to priorities
  const sorted = [...candidates].sort((a, b) => {
    const distA = plazaDistances[arrivalPlaza]?.[a.id] || 10;
    const distB = plazaDistances[arrivalPlaza]?.[b.id] || 10;
    const walkA = distA + (a.id === targetSectionGateId ? 0 : 8);
    const walkB = distB + (b.id === targetSectionGateId ? 0 : 8);

    if (isAccessibilityRequest) {
      const servesA = a.id === targetSectionGateId ? 0 : 1;
      const servesB = b.id === targetSectionGateId ? 0 : 1;
      if (servesA !== servesB) return servesA - servesB;
      return walkA - walkB;
    }

    if (isLeastCrowded) {
      const crowdA = crowdLevelValue(a.crowdLevel);
      const crowdB = crowdLevelValue(b.crowdLevel);
      if (crowdA !== crowdB) return crowdA - crowdB;
      const servesA = a.id === targetSectionGateId ? 0 : 1;
      const servesB = b.id === targetSectionGateId ? 0 : 1;
      if (servesA !== servesB) return servesA - servesB;
      return a.estimatedWaitMinutes - b.estimatedWaitMinutes;
    }

    if (isClosest) {
      if (walkA !== walkB) return walkA - walkB;
      return a.estimatedWaitMinutes - b.estimatedWaitMinutes;
    }

    // Default / fastest entry
    const waitDiff = a.estimatedWaitMinutes - b.estimatedWaitMinutes;
    const servesA = a.id === targetSectionGateId ? 0 : 1;
    const servesB = b.id === targetSectionGateId ? 0 : 1;
    
    if (servesA !== servesB) {
      if (Math.abs(waitDiff) < 15) {
        return servesA - servesB;
      }
    }
    
    if (a.estimatedWaitMinutes !== b.estimatedWaitMinutes) {
      return a.estimatedWaitMinutes - b.estimatedWaitMinutes;
    }
    return walkA - walkB;
  });

  const bestGate = sorted[0];
  const altGateId = bestGate.alternativeGate;
  const altGate = gates.find(g => g.id === altGateId) || sorted[1] || bestGate;

  let priorityLabel = "Fastest Entry";
  if (isLeastCrowded) priorityLabel = "Least Crowded";
  else if (isClosest) priorityLabel = "Closest Gate";
  else if (isAccessibilityRequest) priorityLabel = "Accessible Route";

  let sectionLabel = "your section";
  if (targetSectionGateId === "gate-a") sectionLabel = "North Stand (Blocks 100-112)";
  else if (targetSectionGateId === "gate-b") sectionLabel = "East Stand (Blocks 113-125)";
  else if (targetSectionGateId === "gate-c") sectionLabel = "South Stand (Blocks 126-138)";
  else if (targetSectionGateId === "gate-d") sectionLabel = "West Stand (Blocks 139-150)";
  else if (targetSectionGateId === "gate-e") sectionLabel = "North-West Stand (Blocks 151-160)";
  else if (targetSectionGateId === "gate-vip") sectionLabel = "VIP Club Lounge & Suites";

  const arrivalLabel = arrivalPlaza.charAt(0).toUpperCase() + arrivalPlaza.slice(1) + " Plaza";

  const recommendationText = `${bestGate.name} is recommended.`;
  let explanationText = "";

  if (isAccessibilityRequest) {
    explanationText = `For accessible entry serving ${sectionLabel} from ${arrivalLabel}, ${bestGate.name} is recommended. It is fully accessible, has an estimated wait time of ${bestGate.estimatedWaitMinutes} minutes with ${bestGate.crowdLevel} crowd levels. If queue conditions degrade, your best alternative is ${altGate.name}.`;
  } else {
    explanationText = `Based on your request for ${priorityLabel} serving ${sectionLabel} from ${arrivalLabel}, ${bestGate.name} is recommended. It currently has a wait of ${bestGate.estimatedWaitMinutes} minutes and a ${bestGate.crowdLevel} crowd level. If conditions change, we advise using ${altGate.name} as the alternative.`;
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
  const queryLower = question.toLowerCase();

  // Helper to parse numeric cost from string
  const parseCost = (costStr: string): number => {
    const clean = costStr.toLowerCase();
    if (clean.includes("free")) return 0;
    const match = costStr.match(/\$?([0-9.]+)/);
    return match ? parseFloat(match[1]) : 999;
  };

  // Helper to map crowd level string to a numeric value
  const crowdScore = (level: string): number => {
    switch (level.toLowerCase()) {
      case "low": return 1;
      case "medium": return 2;
      case "high": return 3;
      default: return 99;
    }
  };

  // 1. Check if user is asking for fastest
  if (containsAny(queryLower, ["fastest", "fast", "quick", "speed"])) {
    const sortedByTime = [...options].sort((a, b) => a.estimatedTimeMinutes - b.estimatedTimeMinutes);
    const fastest = sortedByTime[0];
    const nextFastest = sortedByTime[1];
    return {
      intent: "transport",
      success: true,
      title: "Fastest Transit Option",
      recommendation: `${fastest.name} is the fastest option, taking ${fastest.estimatedTimeMinutes} minutes.`,
      explanation: `${fastest.name} has the shortest travel time of ${fastest.estimatedTimeMinutes} minutes. If motorized transport is preferred, ${nextFastest.name} takes ${nextFastest.estimatedTimeMinutes} minutes.`,
      metadata: {
        recommendedTransit: fastest,
        allTransitOptions: options
      }
    };
  }

  // 2. Check if user is asking for cheapest
  if (containsAny(queryLower, ["cheapest", "cheap", "cost", "price", "fare", "economic"])) {
    const sortedByCost = [...options].sort((a, b) => parseCost(a.estimatedCost) - parseCost(b.estimatedCost));
    const cheapest = sortedByCost[0];
    const freeOptions = options.filter(o => parseCost(o.estimatedCost) === 0);
    const recommendationText = freeOptions.length > 0
      ? `${freeOptions.map(o => o.name).join(" and ")} are the cheapest options (Free).`
      : `${cheapest.name} is the cheapest option (${cheapest.estimatedCost}).`;
    return {
      intent: "transport",
      success: true,
      title: "Cheapest Transit Option",
      recommendation: recommendationText,
      explanation: `Pedestrian walking paths and the FIFA Tournament Shuttle Bus are free of charge. For rapid rail transit, Express Metro Line 1 costs only $2.50. App-Based Rideshare & Taxi is the most expensive at $30.00.`,
      metadata: {
        recommendedTransit: cheapest,
        allTransitOptions: options
      }
    };
  }

  // 3. Check if user is asking for lowest crowd
  if (containsAny(queryLower, ["lowest crowd", "least crowded", "crowd", "congestion", "busy", "queue"])) {
    const sortedByCrowd = [...options].sort((a, b) => crowdScore(a.crowdLevel) - crowdScore(b.crowdLevel));
    const lowestCrowd = sortedByCrowd[0];
    return {
      intent: "transport",
      success: true,
      title: "Least Congested Transit",
      recommendation: `${lowestCrowd.name} currently has the lowest crowd density (${lowestCrowd.crowdLevel}).`,
      explanation: `${lowestCrowd.name} currently has a "${lowestCrowd.crowdLevel}" crowd level, making it the most comfortable option. However, it takes ${lowestCrowd.estimatedTimeMinutes} minutes and costs ${lowestCrowd.estimatedCost}.`,
      metadata: {
        recommendedTransit: lowestCrowd,
        allTransitOptions: options
      }
    };
  }

  // 4. Check if user is asking for most sustainable
  if (containsAny(queryLower, ["sustainable", "sustainability", "eco", "green", "carbon", "co2", "emission"])) {
    const sortedByGreen = [...sustain].sort((a, b) => b.greenScore - a.greenScore);
    const greenest = sortedByGreen[0];
    const nextGreenest = sortedByGreen[1];
    return {
      intent: "transport",
      success: true,
      title: "Most Sustainable Transit Option",
      recommendation: `${greenest.transportType} is the most eco-friendly transit.`,
      explanation: `${greenest.transportType} is the greenest choice with a perfect Green Score of ${greenest.greenScore}/100, saving ${greenest.co2SavedKg} kg of CO₂ emissions. The next best alternative is ${nextGreenest.transportType} with a Green Score of ${nextGreenest.greenScore}/100.`,
      metadata: {
        sustainabilityRankings: sortedByGreen
      }
    };
  }

  // 5. Find if they mentioned a specific transit mode
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
