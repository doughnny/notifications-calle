import type { TriageAction, TriageResult, TriagedBucket } from "./types";

/**
 * Confidence below which Calle asks instead of acting on her own judgement.
 * Conceptually this should drift downward over time as Calle learns the
 * user's patterns and needs to check in less often — there's no learning
 * loop yet, so tune it by hand for now.
 */
export const ASK_THRESHOLD = 0.5;

/** Above this, Calle acts without flagging any uncertainty in the chat line. */
const CONFIDENT_THRESHOLD = 0.75;

export interface ResolvedDecision {
  action: TriageAction;
  reason: string;
  confidence: number;
  source: TriageResult["source"];
  /** Acting on a best guess it isn't fully sure of — chat should say so. */
  lowConfidence: boolean;
}

/**
 * Turns a raw classification (Gemini, fallback, or a forced demo result)
 * into what Calle actually does with it. Gemini/fallback always return
 * their best guess plus an honest confidence — this is the one place that
 * decides whether that guess is acted on silently, acted on with a flagged
 * caveat, or held back to ask the user instead.
 *
 * `skipThreshold` is for the demo pills: they force an exact outcome
 * (including "unsure" itself) and should bypass the confidence gate rather
 * than risk being reclassified if ASK_THRESHOLD is tuned later.
 */
export function resolveDecision(
  result: TriageResult,
  options: { skipThreshold?: boolean } = {}
): ResolvedDecision {
  if (!options.skipThreshold && result.confidence < ASK_THRESHOLD) {
    return {
      action: "unsure",
      reason: result.reason,
      confidence: result.confidence,
      source: result.source,
      lowConfidence: false,
    };
  }

  return {
    action: result.action,
    reason: result.reason,
    confidence: result.confidence,
    source: result.source,
    lowConfidence: !options.skipThreshold && result.confidence < CONFIDENT_THRESHOLD,
  };
}

const ACTION_PREFIX: Record<Exclude<TriageAction, "unsure">, string> = {
  interrupt_now: "Flagged on your screen",
  hold_for_briefing: "Held for your briefing",
  let_it_go: "Left alone",
};

export function replyLine(resolved: ResolvedDecision): string {
  if (resolved.action === "unsure") return resolved.reason;
  const prefix = ACTION_PREFIX[resolved.action];
  return `${prefix} — ${resolved.reason[0].toLowerCase()}${resolved.reason.slice(1)}`;
}

const BUCKET_BY_ACTION: Record<Exclude<TriageAction, "unsure">, TriagedBucket> = {
  interrupt_now: "notification",
  hold_for_briefing: "held",
  let_it_go: "noise",
};

export function bucketForAction(action: Exclude<TriageAction, "unsure">): TriagedBucket {
  return BUCKET_BY_ACTION[action];
}
