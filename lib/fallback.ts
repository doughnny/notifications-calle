import type { TriageResult } from "./types";

/**
 * Scripted responses for known demo messages, used when the Gemini call
 * fails. Keyed by keyword so the demo never shows a dead state — every
 * message gets a plausible, on-voice result even offline.
 */

function minutesSinceMidnight(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

export function getFallbackResponse(
  message: string,
  currentTime: string
): TriageResult {
  const text = message.toLowerCase();
  const now = minutesSinceMidnight(currentTime);

  if (includesAny(text, ["deploy", "3pm", "release window"])) {
    const deployTime = 15 * 60;
    const closeToDeploy = now !== null && deployTime - now <= 120 && deployTime - now >= -30;
    if (closeToDeploy) {
      return {
        action: "interrupt_now",
        reason: "This needs you before the 3pm deploy.",
        confidence: 0.9,
        source: "fallback",
      };
    }
    return {
      action: "hold_for_briefing",
      reason: "Related to the 3pm deploy, but that's still a while off.",
      confidence: 0.75,
      source: "fallback",
    };
  }

  if (
    includesAny(text, [
      "move our 1:1",
      "reschedule",
      "does that work",
      "let me know if that works",
      "can we push",
    ])
  ) {
    return {
      action: "hold_for_briefing",
      reason: "This might need you today — worth a look?",
      confidence: 0.4,
      source: "fallback",
    };
  }

  if (
    includesAny(text, [
      "fyi",
      "heads up",
      "congrats",
      "release notes are live",
      "just letting you know",
      "no action needed",
    ])
  ) {
    return {
      action: "let_it_go",
      reason: "Informational — nothing to action.",
      confidence: 0.85,
      source: "fallback",
    };
  }

  if (
    includesAny(text, [
      "budget",
      "quarterly",
      "sometime this week",
      "when you get a chance",
      "no rush",
    ])
  ) {
    return {
      action: "hold_for_briefing",
      reason: "Real, but nothing time-critical here.",
      confidence: 0.8,
      source: "fallback",
    };
  }

  return {
    action: "hold_for_briefing",
    reason: "Real enough to keep, but nothing time-critical here.",
    confidence: 0.55,
    source: "fallback",
  };
}
