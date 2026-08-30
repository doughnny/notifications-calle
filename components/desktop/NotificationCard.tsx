"use client";

import { useState } from "react";
import { XIcon } from "../icons/XIcon";

export function NotificationCard({
  message,
  reason,
  onDismiss,
}: {
  message: string;
  reason: string;
  onDismiss: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative w-[400px] rounded-2xl border-[1.5px] px-[18px] py-[18px] flex gap-4 transition-colors ${
        hovered
          ? "bg-[#e4e4e1] border-[#8d8d88] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
          : "bg-[#efefed] border-[#a8a8a3] shadow-[0_8px_20px_rgba(0,0,0,0.16)]"
      }`}
    >
      {hovered && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute -left-[13px] -top-[13px] w-[30px] h-[30px] rounded-full bg-[#f4f4f2] border-[1.5px] border-[#9a9a95] flex items-center justify-center hover:bg-[#e9e9e6] transition-colors"
        >
          <XIcon size={12} />
        </button>
      )}
      <div className="flex-none w-11 h-11 bg-[#c9c9c4] border-[1.5px] border-[#a3a39e] rounded-[9px]" />
      <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-px">
        <div
          className={`text-[15px] font-semibold leading-[1.3] ${
            hovered ? "text-[#6e6e66]" : "text-[#77776f]"
          }`}
        >
          {reason}
        </div>
        <div
          className={`text-[13px] leading-[1.45] ${hovered ? "text-[#8d8d85]" : "text-[#9a9a92]"}`}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
