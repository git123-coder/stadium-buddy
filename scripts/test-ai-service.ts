import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { getAIResponse } from "@/lib/aiService";

async function main() {
    const questions = [
        "Which gate should I use?",
        "Where is the nearest accessible entrance?",
        "What is the fastest transport option?",
    ];

    for (const question of questions) {
        console.log("\n==============================");
        console.log("Question:", question);

        try {
            const response = await getAIResponse(question);

            console.log("Source:", response.source);
            console.log("Recommendation:", response.recommendation);
            console.log("Explanation:", response.explanation);
        } catch (error) {
            console.error("Test failed:", error);
        }
    }
}

main();