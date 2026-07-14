import { loadEnvConfig } from "@next/env";
import { isGeminiConfigured, testGeminiConnection } from "../lib/gemini";

// Load Next.js environment variables (loads .env, .env.local, etc.)
loadEnvConfig(process.cwd());

async function run() {
  console.log("=== Gemini SDK Connectivity Test ===");
  console.log(`Configured: ${isGeminiConfigured() ? "YES" : "NO"}`);
  console.log("-------------------------------------");

  console.log("Running connectivity test (using gemini-2.5-flash)...");
  const result = await testGeminiConnection();

  if (result.success) {
    console.log("✅ SUCCESS!");
    console.log(result.message);
    process.exit(0);
  } else {
    console.log("❌ FAILED!");
    console.log(result.message);
    process.exit(1);
  }
}

run().catch((error) => {
  console.error("Unhandled error running verification:", error);
  process.exit(1);
});
