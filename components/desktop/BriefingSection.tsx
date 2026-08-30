"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TriagedItem } from "@/lib/types";

export type BriefingRowAction = "alert" | "keep" | "dismiss";

function BriefingRow({
  item,
  muted,
  onAction,
}: {
  item: TriagedItem;
  muted: boolean;
  onAction: (id: string, action: BriefingRowAction) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function toggleMenu() {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setMenuPos({ top: rect.bottom + 4, left: rect.right - 188 });
    setMenuOpen(true);
  }

  function choose(action: BriefingRowAction) {
    setMenuOpen(false);
    onAction(item.id, action);
  }

  return (
    <div
      className={`rounded-xl border-[1.5px] px-[14px] py-[14px] flex items-start gap-3.5 ${
        muted ? "bg-[#f0efec] border-[#d2d2ce]" : "bg-[#fdfdfc] border-[#c6c6c1]"
      }`}
    >
      <div
        className={`flex-none w-[38px] h-[38px] rounded-lg border-[1.5px] ${
          muted ? "bg-[#dcdcd8] border-[#c2c2bd]" : "bg-[#d4d4d0] border-[#b0b0ab]"
        }`}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div
          className={`text-[13px] font-semibold leading-[1.3] ${
            muted ? "text-[#9a9a92]" : "text-[#77776f]"
          }`}
        >
          {item.reason}
        </div>
        <div className="text-[12px] leading-[1.45] text-[#9a9a92]">{item.message}</div>
      </div>

      <button
        ref={btnRef}
        type="button"
        onClick={toggleMenu}
        aria-label="More actions"
        className="flex-none w-6 h-6 rounded-md flex items-center justify-center hover:bg-[#e2e2df] transition-colors text-[#9a9a95] text-[15px] leading-none tracking-tighter"
      >
        ⋯
      </button>

      {menuOpen &&
        menuPos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div
              style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
              className="w-[188px] bg-[#f4f4f2] border-[1.5px] border-[#8d8d88] rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.2)] p-1.5 flex flex-col z-50"
            >
              <button
                type="button"
                onClick={() => choose("alert")}
                className="text-left px-3 py-2 rounded-lg text-[12px] text-[#6e6e66] hover:bg-[#e2e2df] transition-colors"
              >
                Move to alert
              </button>
              <button
                type="button"
                onClick={() => choose("keep")}
                className="text-left px-3 py-2 rounded-lg text-[12px] text-[#6e6e66] hover:bg-[#e2e2df] transition-colors"
              >
                Keep for next briefing
              </button>
              <div className="h-[1.5px] bg-[#d2d2ce] mx-2 my-1" />
              <button
                type="button"
                onClick={() => choose("dismiss")}
                className="text-left px-3 py-2 rounded-lg text-[12px] text-[#8d8d85] hover:bg-[#e2e2df] transition-colors"
              >
                Dismiss
              </button>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

export function BriefingSection({
  title,
  items,
  onAction,
  muted = false,
}: {
  title: string;
  items: TriagedItem[];
  onAction: (id: string, action: BriefingRowAction) => void;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] uppercase tracking-wide text-[#9a9a92] px-1">{title}</p>
      {items.map((item) => (
        <BriefingRow key={item.id} item={item} muted={muted} onAction={onAction} />
      ))}
    </div>
  );
}
