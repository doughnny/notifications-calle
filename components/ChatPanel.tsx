"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { DEMO_PILLS, type DemoPill } from "@/lib/demoPills";
import { SendIcon } from "./icons/SendIcon";

export function ChatPanel({
  messages,
  sending,
  onSendMessage,
  onPillClick,
  briefingCount,
  onOpenBriefing,
}: {
  messages: ChatMessage[];
  sending: boolean;
  onSendMessage: (text: string) => void;
  onPillClick: (pill: DemoPill) => void;
  briefingCount: number;
  onOpenBriefing: () => void;
}) {
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  function submit() {
    const text = input.trim();
    if (!text || sending) return;
    onSendMessage(text);
    setInput("");
  }

  return (
    <div className="flex-none w-[420px] h-full min-h-0 bg-[#f4f4f2] border-[1.5px] border-[#8d8d88] rounded-xl flex flex-col overflow-hidden font-mono">
      <header className="flex-none h-14 px-4 bg-[#ebebe9] border-b-[1.5px] border-[#c6c6c1] flex items-center gap-3">
        <div className="w-[26px] h-[26px] bg-[#c9c9c4] border-[1.5px] border-[#a3a39e] rounded-[7px]" />
        <div className="text-[13px] font-semibold text-[#6e6e66]">Calle backstage</div>
      </header>

      <div ref={listRef} className="flex-1 min-h-0 px-4 py-5 flex flex-col gap-[18px] overflow-y-auto">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div
              key={msg.id}
              className="self-end max-w-[82%] bg-[#dcdcd8] border-[1.5px] border-[#b0b0ab] rounded-[14px_14px_4px_14px] px-[14px] py-3 text-[13px] leading-[1.5] text-[#6e6e66]"
            >
              {msg.text}
            </div>
          ) : (
            <div key={msg.id} className="flex gap-3 max-w-[92%]">
              <div className="flex-none w-7 h-7 bg-[#c9c9c4] border-[1.5px] border-[#a3a39e] rounded-full" />
              <div className="bg-[#e9e9e6] border-[1.5px] border-[#c2c2bd] rounded-[14px_14px_14px_4px] px-[14px] py-3 flex flex-col gap-1.5">
                {msg.lowConfidence && (
                  <span className="text-[10px] uppercase tracking-wide text-[#9a9a92] font-semibold">
                    Best guess
                  </span>
                )}
                <div className="text-[13px] leading-[1.5] text-[#8d8d85]">{msg.text}</div>
                {msg.confidence !== undefined && (
                  <p className="text-[10px] text-[#b0b0a8]">
                    {Math.round(msg.confidence * 100)}% confidence · {msg.source}
                  </p>
                )}
              </div>
            </div>
          )
        )}
        {sending && (
          <div className="flex gap-3 max-w-[92%]">
            <div className="flex-none w-7 h-7 bg-[#c9c9c4] border-[1.5px] border-[#a3a39e] rounded-full" />
            <div className="bg-[#e9e9e6] border-[1.5px] border-[#c2c2bd] rounded-[14px_14px_14px_4px] px-[14px] py-3">
              <div className="text-[13px] text-[#b0b0a8]">…</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-none p-4 border-t-[1.5px] border-[#c6c6c1] bg-[#ebebe9] flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-wide text-[#b0b0a8] px-0.5">Force a behaviour</p>
        <div className="flex flex-wrap gap-1.5 mb-0.5">
          {DEMO_PILLS.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => onPillClick(pill)}
              className="text-[11px] text-[#8d8d85] rounded-full border-[1.5px] border-[#c6c6c1] px-2.5 py-1 hover:bg-[#dcdcd8] transition-colors"
            >
              {pill.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onOpenBriefing}
            className="inline-flex items-center gap-1.5 text-[11px] text-[#8d8d85] rounded-full border-[1.5px] border-[#c6c6c1] px-2.5 py-1 hover:bg-[#dcdcd8] transition-colors"
          >
            Show briefing
            {briefingCount > 0 && (
              <span className="min-w-[16px] h-4 px-1 rounded-full bg-[#6e6e66] text-[#f4f4f2] text-[9px] font-semibold flex items-center justify-center">
                {briefingCount}
              </span>
            )}
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="bg-[#fdfdfc] border-[1.5px] border-[#a8a8a3] rounded-xl px-3 pt-3 pb-2.5 flex flex-col gap-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Send Denny a message..."
            rows={2}
            className="w-full resize-none bg-transparent text-[13px] leading-[1.4] text-[#4a4a44] placeholder:text-[#b0b0a8] focus:outline-none"
          />
          <div className="flex items-center">
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="ml-auto w-8 h-8 bg-[#c9c9c4] border-[1.5px] border-[#9a9a95] rounded-lg flex items-center justify-center disabled:opacity-40 hover:enabled:bg-[#bdbdb8] transition-colors"
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
