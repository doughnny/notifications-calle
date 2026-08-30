import type { TriageAction, TriageResult } from "./types";

const MODEL = "gemini-3.6-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const VALID_ACTIONS: TriageAction[] = ["interrupt_now", "hold_for_briefing", "let_it_go"];

const SYSTEM_INSTRUCTION = `You are the triage engine inside Calle, a calm and quietly competent executive-assistant app. Calle reads one incoming work message (Slack, email, Jira, calendar) at a time and decides how much it would cost the user to wait before seeing it — not just whether to interrupt, but when.

Classify the message into exactly one action — always make your best call, even when you're not fully sure:
- "interrupt_now": important AND time-critical AND actionable by this specific user, given the current time of day. Rare — reserve it for things that will genuinely go wrong if the user doesn't see them soon.
- "hold_for_briefing": a real, legitimate item, but not urgent right now. This is the default for most real messages.
- "let_it_go": not actionable — purely informational, an FYI, a status update, a courtesy notice. Noise, not signal.

Weigh the current time of day against any deadline or time reference in the message itself. The same message can be "hold_for_briefing" early in the day and "interrupt_now" as its deadline closes in.

Write "reason" as a single short plain-language sentence in Calle's voice: calm, composed, concrete — never urgent-sounding punctuation, never exclamation marks, never words like "scanning" or "monitoring" or "reading your messages." State the deadline or the reasoning plainly, the way a great executive assistant would say it out loud. Examples of the right register: "This needs you before the 3pm deploy." / "Real, but nothing time-critical here." / "Informational — nothing to action."

Return "confidence" as a number from 0 to 1 reflecting how sure you are of the action you chose — be honest, including when you're genuinely torn between two of them. A separate system uses this number to decide whether to act quietly, act while flagging some uncertainty, or check in with the user first, so there's no need to hedge by picking a vaguer action instead of your real best guess.`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    action: {
      type: "STRING",
      enum: VALID_ACTIONS,
    },
    reason: {
      type: "STRING",
    },
    confidence: {
      type: "NUMBER",
    },
  },
  required: ["action", "reason", "confidence"],
};

export async function callGemini(
  message: string,
  currentTime: string
): Promise<TriageResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Current time of day: ${currentTime}\n\nMessage:\n${message}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.2,
          // This model thinks by default, which can push a simple classification
          // call past 15s. Low is enough for a single-message triage decision.
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = await response.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini response had no text");
  }

  const parsed = JSON.parse(text);

  if (
    typeof parsed.action !== "string" ||
    !VALID_ACTIONS.includes(parsed.action) ||
    typeof parsed.reason !== "string" ||
    typeof parsed.confidence !== "number"
  ) {
    throw new Error("Gemini response did not match the expected shape");
  }

  return {
    action: parsed.action,
    reason: parsed.reason,
    confidence: Math.max(0, Math.min(1, parsed.confidence)),
    source: "gemini",
  };
}
