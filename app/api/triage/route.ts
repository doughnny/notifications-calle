import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";
import { getFallbackResponse } from "@/lib/fallback";
import type { TriageRequest } from "@/lib/types";

export async function POST(request: Request) {
  let body: Partial<TriageRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const currentTime =
    typeof body.currentTime === "string" ? body.currentTime : "09:00";

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const result = await callGemini(message, currentTime);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Gemini triage failed, using fallback:", error);
    const fallback = getFallbackResponse(message, currentTime);
    return NextResponse.json(fallback);
  }
}
