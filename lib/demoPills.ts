import type { TriageResult } from "./types";

/**
 * Pre-written demo pills. Each forces an exact outcome and skips the real
 * Gemini call entirely, so the demo stays reliable regardless of ASK_THRESHOLD
 * tuning or model behavior. Free-typed messages never go through this path.
 */
export interface DemoPill {
  id: string;
  label: string;
  message: string;
  result: TriageResult;
}

export const DEMO_PILLS: DemoPill[] = [
  {
    id: "silent",
    label: "Silent",
    message: "FYI — the release notes for v2.3 are up whenever you want a look.",
    result: {
      action: "let_it_go",
      reason: "Informational — nothing to action.",
      confidence: 0.95,
      source: "demo",
    },
  },
  {
    id: "ask",
    label: "Ask me",
    message: "Might need your thoughts on the pricing thing before it goes further.",
    result: {
      action: "unsure",
      reason: "This might need your input before it moves forward — worth a look?",
      confidence: 0.3,
      source: "demo",
    },
  },
  {
    id: "alert",
    label: "Alert",
    message: "The director needs the board deck in 10 minutes — can you send it now?",
    result: {
      action: "interrupt_now",
      reason: "This needs you now — the board deck goes out in ten minutes.",
      confidence: 0.97,
      source: "demo",
    },
  },
];
