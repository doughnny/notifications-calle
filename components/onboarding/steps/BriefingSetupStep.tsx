"use client";

import { useState } from "react";
import { ProgressDots } from "../ProgressDots";

const DEFAULT_BRIEFINGS = [
  { key: "morning", label: "Morning", time: "09:00" },
  { key: "afternoon", label: "Afternoon", time: "13:00" },
  { key: "evening", label: "End of day", time: "16:30" },
];

export function BriefingSetupStep({ onDone }: { onDone: () => void }) {
  const [times, setTimes] = useState(DEFAULT_BRIEFINGS);

  return (
    <>
      <div className="flex-1 min-h-0 flex flex-col">
        <h2 className="text-[24px] font-semibold text-[#6e6e66] leading-tight">Your briefings</h2>
        <p className="mt-2 text-[13px] text-[#8d8d85] leading-relaxed">
          Calle holds what isn&rsquo;t urgent and brings it to you three times a day. Nothing
          important waits too long; nothing trivial interrupts.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {times.map((b, i) => (
            <div
              key={b.key}
              className="flex items-center bg-[#fdfdfc] border-[1.5px] border-[#c6c6c1] rounded-[11px] px-4 py-3"
            >
              <div className="text-[14px] text-[#6e6e66]">{b.label}</div>
              <input
                type="time"
                value={b.time}
                onChange={(e) => {
                  const v = e.target.value;
                  setTimes((prev) => prev.map((x, idx) => (idx === i ? { ...x, time: v } : x)));
                }}
                className="ml-auto text-[14px] font-medium text-[#6e6e66] bg-transparent focus:outline-none [color-scheme:light]"
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[#9a9a92]">Adjust any time.</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <ProgressDots current={3} total={4} />
        <button
          type="button"
          onClick={onDone}
          className="h-11 px-6 rounded-[10px] bg-[#6e6e66] text-[#f4f4f2] text-[14px] font-medium hover:bg-[#5c5c55] transition-colors"
        >
          Done
        </button>
      </div>
    </>
  );
}
