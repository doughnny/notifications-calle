"use client";

import { useState } from "react";

const TIME_PRESETS = [
  { label: "Morning", value: "09:00" },
  { label: "Afternoon", value: "13:00" },
  { label: "Near deadline", value: "14:45" },
  { label: "End of day", value: "16:30" },
];

function formatDisplayTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function MenuBar({
  currentTime,
  onTimeChange,
}: {
  currentTime: string;
  onTimeChange: (time: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-8 bg-[#f2f2f0] border-b-[1.5px] border-[#a8a8a3] flex items-center px-3.5 gap-[22px]">
      <div className="w-4 h-4 bg-[#b6b6b1] rounded-[3px]" />
      <div className="flex gap-5">
        {["File", "Edit", "View", "Window", "Help"].map((label) => (
          <div key={label} className="text-[11px] text-[#9a9a95] select-none">
            {label}
          </div>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="w-[14px] h-3 bg-[#b6b6b1] rounded-[2px]" />
        <div className="w-[14px] h-3 bg-[#b6b6b1] rounded-[2px]" />
        <div className="w-5 h-3 bg-[#b6b6b1] rounded-[2px]" />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-[11px] text-[#77776f] hover:text-[#6e6e66] tabular-nums transition-colors"
        >
          {formatDisplayTime(currentTime)}
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+6px)] right-3.5 w-[220px] bg-[#f4f4f2] border-[1.5px] border-[#8d8d88] rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.2)] p-3 flex flex-col gap-2.5 z-20">
            <label className="text-[10px] uppercase tracking-wide text-[#9a9a92]">
              Set current time
            </label>
            <input
              type="time"
              value={currentTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="bg-[#fdfdfc] border-[1.5px] border-[#c6c6c1] rounded-lg px-2.5 py-1.5 text-[13px] text-[#6e6e66] focus:outline-none focus:border-[#8d8d88]"
            />
            <div className="flex flex-wrap gap-1.5">
              {TIME_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onTimeChange(preset.value)}
                  className={`text-[11px] rounded-full border-[1.5px] px-2 py-1 transition-colors ${
                    currentTime === preset.value
                      ? "border-[#8d8d88] bg-[#dcdcd8] text-[#6e6e66]"
                      : "border-[#c6c6c1] text-[#9a9a92] hover:bg-[#e9e9e6]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
