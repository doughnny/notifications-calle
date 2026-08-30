"use client";

import { useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { Desktop } from "@/components/desktop/Desktop";
import type { BriefingRowAction } from "@/components/desktop/BriefingSection";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { bucketForAction, replyLine, resolveDecision } from "@/lib/decision";
import type { DemoPill } from "@/lib/demoPills";
import type { ChatMessage, TriagedBucket, TriagedItem, TriageResult } from "@/lib/types";

export default function Home() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [currentTime, setCurrentTime] = useState("09:00");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed-1",
      role: "user",
      text: "Can you take a look at the onboarding flow doc when you get a chance?",
    },
    {
      id: "seed-2",
      role: "calle",
      text: "Held for your briefing — it reads as a real ask, but nothing about it needs you this minute.",
    },
  ]);
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState<TriagedItem[]>([]);
  const [asks, setAsks] = useState<TriagedItem[]>([]);
  const [held, setHeld] = useState<TriagedItem[]>([]);
  const [noise, setNoise] = useState<TriagedItem[]>([]);
  const [briefingOpen, setBriefingOpen] = useState(false);

  function appendMessage(msg: Omit<ChatMessage, "id">) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...msg }]);
  }

  function routeDecision(input: { message: string; reason: string }, bucket: TriagedBucket) {
    const item: TriagedItem = { id: crypto.randomUUID(), ...input };
    if (bucket === "notification") setNotifications((prev) => [item, ...prev]);
    if (bucket === "held") setHeld((prev) => [item, ...prev]);
    if (bucket === "noise") setNoise((prev) => [item, ...prev]);
  }

  function handleClassified(
    userMessage: string,
    result: TriageResult,
    options?: { skipThreshold?: boolean }
  ) {
    const resolved = resolveDecision(result, options);

    if (resolved.action === "unsure") {
      appendMessage({ role: "calle", text: resolved.reason });
      setAsks((prev) => [{ id: crypto.randomUUID(), message: userMessage, reason: resolved.reason }, ...prev]);
      return;
    }

    appendMessage({
      role: "calle",
      text: replyLine(resolved),
      lowConfidence: resolved.lowConfidence,
      confidence: resolved.confidence,
      source: resolved.source,
    });
    routeDecision({ message: userMessage, reason: resolved.reason }, bucketForAction(resolved.action));
  }

  async function handleSendMessage(text: string) {
    appendMessage({ role: "user", text });
    setSending(true);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, currentTime }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const result: TriageResult = await res.json();
      handleClassified(text, result);
    } catch {
      appendMessage({ role: "calle", text: "That didn't go through — try sending it again." });
    } finally {
      setSending(false);
    }
  }

  function handlePillClick(pill: DemoPill) {
    appendMessage({ role: "user", text: pill.message });
    handleClassified(pill.message, pill.result, { skipThreshold: true });
  }

  function handleResolveAsk(id: string, choice: "flag" | "hold") {
    const item = asks.find((a) => a.id === id);
    if (!item) return;
    setAsks((prev) => prev.filter((a) => a.id !== id));
    appendMessage({
      role: "calle",
      text: choice === "flag" ? "Flagged — bringing it to you now." : "Held — back at your next briefing.",
    });
    routeDecision({ message: item.message, reason: item.reason }, choice === "flag" ? "notification" : "held");
  }

  function handleBriefingAction(from: "held" | "noise", id: string, action: BriefingRowAction) {
    const list = from === "held" ? held : noise;
    const item = list.find((i) => i.id === id);
    if (!item) return;

    if (from === "held") setHeld((prev) => prev.filter((i) => i.id !== id));
    else setNoise((prev) => prev.filter((i) => i.id !== id));

    if (action === "dismiss") return;
    routeDecision({ message: item.message, reason: item.reason }, action === "alert" ? "notification" : "held");
  }

  if (!onboardingDone) {
    return (
      <main className="h-screen w-screen overflow-hidden bg-[#e7e7e4] p-6 flex">
        <div className="flex-1 flex items-stretch gap-6 p-6 bg-[#f0efec] border-[1.5px] border-[#b8b8b3] rounded-[18px] min-w-0 min-h-0">
          <Onboarding onComplete={() => setOnboardingDone(true)} />
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#e7e7e4] p-6 flex">
      <div className="flex-1 flex items-stretch gap-6 p-6 bg-[#f0efec] border-[1.5px] border-[#b8b8b3] rounded-[18px] min-w-0 min-h-0">
        <ChatPanel
          messages={messages}
          sending={sending}
          onSendMessage={handleSendMessage}
          onPillClick={handlePillClick}
          briefingCount={held.length + noise.length}
          onOpenBriefing={() => setBriefingOpen(true)}
        />
        <Desktop
          currentTime={currentTime}
          onTimeChange={setCurrentTime}
          notifications={notifications}
          asks={asks}
          held={held}
          noise={noise}
          briefingOpen={briefingOpen}
          onCloseBriefing={() => setBriefingOpen(false)}
          onDismissNotification={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
          onResolveAsk={handleResolveAsk}
          onHeldAction={(id, action) => handleBriefingAction("held", id, action)}
          onNoiseAction={(id, action) => handleBriefingAction("noise", id, action)}
        />
      </div>
    </main>
  );
}
