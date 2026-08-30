"use client";

import type { TriagedItem } from "@/lib/types";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { NotificationCard } from "./NotificationCard";
import { AskingNotificationCard } from "./AskingNotificationCard";
import { BriefingSection, type BriefingRowAction } from "./BriefingSection";
import { XIcon } from "../icons/XIcon";

export function Desktop({
  currentTime,
  onTimeChange,
  notifications,
  asks,
  held,
  noise,
  briefingOpen,
  onCloseBriefing,
  onDismissNotification,
  onResolveAsk,
  onHeldAction,
  onNoiseAction,
}: {
  currentTime: string;
  onTimeChange: (time: string) => void;
  notifications: TriagedItem[];
  asks: TriagedItem[];
  held: TriagedItem[];
  noise: TriagedItem[];
  briefingOpen: boolean;
  onCloseBriefing: () => void;
  onDismissNotification: (id: string) => void;
  onResolveAsk: (id: string, choice: "flag" | "hold") => void;
  onHeldAction: (id: string, action: BriefingRowAction) => void;
  onNoiseAction: (id: string, action: BriefingRowAction) => void;
}) {
  const briefingCount = held.length + noise.length;

  return (
    <div className="relative flex-1 min-w-0 h-full bg-[#d8d8d5] border-[1.5px] border-[#8d8d88] rounded-md overflow-hidden font-mono">
      <MenuBar currentTime={currentTime} onTimeChange={onTimeChange} />

      <div className="absolute top-[52px] right-6 left-6 flex flex-col items-end gap-4 max-h-[calc(100%-140px)] overflow-y-auto">
        {asks.map((a) => (
          <AskingNotificationCard
            key={a.id}
            message={a.message}
            reason={a.reason}
            onFlag={() => onResolveAsk(a.id, "flag")}
            onHold={() => onResolveAsk(a.id, "hold")}
          />
        ))}
        {notifications.map((n) => (
          <NotificationCard
            key={n.id}
            message={n.message}
            reason={n.reason}
            onDismiss={() => onDismissNotification(n.id)}
          />
        ))}
      </div>

      {briefingOpen && (
        <div
          className="absolute inset-0 bg-black/10 flex items-center justify-center"
          onClick={onCloseBriefing}
        >
          <div
            className="w-[560px] max-h-[80%] bg-[#f4f4f2] border-[1.5px] border-[#8d8d88] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.24)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-none h-14 px-5 bg-[#ebebe9] border-b-[1.5px] border-[#c6c6c1] flex items-center">
              <div className="text-[15px] font-semibold text-[#6e6e66]">Briefing</div>
              <button
                type="button"
                onClick={onCloseBriefing}
                className="ml-auto w-7 h-7 rounded-full bg-[#dcdcd8] border-[1.5px] border-[#a8a8a3] flex items-center justify-center hover:bg-[#d2d2ce] transition-colors"
              >
                <XIcon size={11} />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-5 overflow-y-auto">
              {briefingCount === 0 && (
                <p className="text-[13px] text-[#9a9a92] text-center py-6">
                  Nothing held yet — Calle will bring items here as they come in.
                </p>
              )}
              {held.length > 0 && (
                <BriefingSection title="Held for your briefing" items={held} onAction={onHeldAction} />
              )}
              {noise.length > 0 && (
                <BriefingSection title="Left alone" items={noise} onAction={onNoiseAction} muted />
              )}
            </div>
          </div>
        </div>
      )}

      <Dock />
    </div>
  );
}
