import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/aiService";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    const response = await getAIResponse(question);
    return NextResponse.json(response);
  } catch (error) {
    console.error("API Chat route error:", error);
    return NextResponse.json({ error: "Failed to resolve question" }, { status: 500 });
  }
}
