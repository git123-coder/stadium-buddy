import "dotenv/config";
import { buildGeminiPrompt } from "../lib/promptBuilder";
import { getAIResponse } from "../lib/aiService";

console.log("=========================================");
console.log("    STADIUMBUDDY AI SERVICE LAYER TESTS  ");
console.log("=========================================");

let passed = 0;
let total = 0;

function assert(condition: boolean, message: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${message}`);
  } else {
    console.error(`❌ [FAIL] ${message}`);
  }
}

// Save original environment
const originalKey = process.env.GEMINI_API_KEY;

// 1. Test Prompt Builder Context Formatting for Core Intents
console.log("\n--- Testing Prompt Context Formatting ---");

// Test Gate Intent
const gatePrompt = buildGeminiPrompt("Which gate should I use for section 105?");
assert(
  gatePrompt.userPrompt.includes("Gate: Gate A") && gatePrompt.userPrompt.includes("Wait Time"),
  "Gate recommendation prompt contains gate list context."
);

// Test Crowd Intent
const crowdPrompt = buildGeminiPrompt("How busy is Gate C right now?");
assert(
  crowdPrompt.userPrompt.includes("Gate C") && crowdPrompt.userPrompt.includes("Wait Time"),
  "Crowd status prompt contains crowd wait times context."
);

// Test Accessibility Intent
const accessPrompt = buildGeminiPrompt("Where are the elevators located?");
assert(
  accessPrompt.userPrompt.includes("Wheelchair Access") && accessPrompt.userPrompt.includes("Elevator"),
  "Accessibility assistant prompt contains accessible routes and elevator context."
);

// Test Transport Intent
const transportPrompt = buildGeminiPrompt("Which route is the cheapest option?");
assert(
  transportPrompt.userPrompt.includes("Transit Mode:") && transportPrompt.userPrompt.includes("Cost:"),
  "Transport sustainability prompt contains transit options with costs context."
);

// 2. Test AI Service Fallback Behaviors
console.log("\n--- Testing AI Service Fallbacks ---");

async function testFallbacks() {
  // Test Case A: Missing API Key Configuration
  console.log("Testing with missing GEMINI_API_KEY...");
  process.env.GEMINI_API_KEY = ""; // clear key

  const responseNoKey = await getAIResponse("Which gate should I use?");
  assert(
    responseNoKey.source === "engine",
    "Missing key bypasses Gemini call and returns source: 'engine'"
  );
  assert(
    responseNoKey.success === true && responseNoKey.intent === "gateRecommendation",
    "Missing key returns correct structured engine recommendation data"
  );

  // Test Case B: Invalid API Key / Forced API Failure
  console.log("Testing with invalid GEMINI_API_KEY...");
  process.env.GEMINI_API_KEY = "invalid-stadiumbuddy-key-12345"; // set bad key to force API error

  const responseBadKey = await getAIResponse("Which transit mode is fastest?");
  assert(
    responseBadKey.source === "engine",
    "API failure automatically falls back to engine with source: 'engine'"
  );
  assert(
    responseBadKey.success === true && responseBadKey.intent === "transport",
    "API failure returns correct structured engine transit data"
  );

  // Restore original environment key
  process.env.GEMINI_API_KEY = originalKey;

  console.log("\n=========================================");
  console.log(`AI Service Tests Completed. Passed: ${passed}/${total}`);
  console.log("=========================================");

  if (passed === total) {
    console.log("✅ ALL AI SERVICE LAYER TESTS COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("❌ CRITICAL FAILURES ENCOUNTERED IN AI SERVICE LAYER.");
    process.exit(1);
  }
}

testFallbacks().catch((err) => {
  console.error("Unhandled test runner error:", err);
  process.exit(1);
});
