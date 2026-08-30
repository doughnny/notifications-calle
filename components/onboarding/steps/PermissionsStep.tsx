"use client";

import { useState } from "react";
import { ProgressDots } from "../ProgressDots";

const SOURCES = [
  { key: "slack", name: "Slack", why: "so it can tell a real ask from noise, and who it's from" },
  { key: "email", name: "Email", why: "so nothing important slips past" },
  { key: "confluence", name: "Confluence", why: "so it can weigh deadlines and priorities from your docs" },
  { key: "calendar", name: "Calendar", why: "so it knows when you're heads-down or free" },
];

export function PermissionsStep({ onNext }: { onNext: () => void }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    slack: true,
    email: true,
    confluence: true,
    calendar: true,
  });

  return (
    <>
      <div className="flex-1 min-h-0 flex flex-col">
        <h2 className="text-[24px] font-semibold text-[#6e6e66] leading-tight">
          Choose what Calle can see
        </h2>
        <p className="mt-2 text-[13px] text-[#8d8d85] leading-relaxed">
          All optional. The more Calle can see, the better it reads what matters.
        </p>
        <div className="mt-5 flex-1 min-h-0 overflow-y-auto flex flex-col">
          {SOURCES.map((s) => (
            <div
              key={s.key}
              className="flex items-center gap-3.5 py-3 border-t border-[#d2d2ce] first:border-t-0"
            >
              <div className="flex-none w-[30px] h-[30px] bg-[#dcdcd8] border-[1.5px] border-[#c2c2bd] rounded-[7px]" />
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="text-[14px] font-medium text-[#6e6e66]">{s.name}</div>
                <div className="text-[12px] text-[#9a9a92] leading-snug">{s.why}</div>
              </div>
              <button
                type="button"
                onClick={() => setEnabled((prev) => ({ ...prev, [s.key]: !prev[s.key] }))}
                aria-pressed={enabled[s.key]}
                className={`flex-none w-[46px] h-[26px] rounded-full p-[3px] flex border-[1.5px] transition-colors ${
                  enabled[s.key]
                    ? "bg-[#8d8d88] border-[#6e6e66] justify-end"
                    : "bg-[#dcdcd8] border-[#b8b8b3] justify-start"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#fdfdfc] shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-[#9a9a92]">
          Calle learns what matters to you on your device.
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <ProgressDots current={1} total={4} />
        <button
          type="button"
          onClick={onNext}
          className="h-11 px-6 rounded-[10px] bg-[#6e6e66] text-[#f4f4f2] text-[14px] font-medium hover:bg-[#5c5c55] transition-colors"
        >
          Next
        </button>
      </div>
    </>
  );
}
