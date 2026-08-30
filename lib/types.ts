export type TriageAction =
  | "interrupt_now"
  | "hold_for_briefing"
  | "let_it_go"
  | "unsure";

export interface TriageResult {
  action: TriageAction;
  reason: string;
  confidence: number;
  source: "gemini" | "fallback" | "demo";
}

export interface TriageRequest {
  message: string;
  currentTime: string;
}

export type TriagedBucket = "notification" | "held" | "noise";

export interface TriagedItem {
  id: string;
  message: string;
  reason: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "calle";
  text: string;
  lowConfidence?: boolean;
  confidence?: number;
  source?: TriageResult["source"];
}
