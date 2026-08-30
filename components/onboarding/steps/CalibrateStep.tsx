"use client";

import { useState } from "react";
import { ProgressDots } from "../ProgressDots";

const MESSAGES = [
  {
    source: "Slack",
    meta: "#product · Tues 10:42",
    text: "When you get a chance, can you take a look at the onboarding flow doc?",
  },
  {
    source: "Slack",
    meta: "#general · Tues 16:05",
    text: "🎉 Great work shipping the release everyone!",
  },
  {
    source: "Slack",
    meta: "#deploys · Wed 09:18",
    text: "Staging deploy is blocked on your review — going out at 3pm.",
  },
  {
    source: "Email",
    meta: "Wed 11:30",
    text: "Might need your thoughts on the pricing thing before it goes further.",
  },
  {
    source: "Email",
    meta: "Thu 08:12",
    text: "Design critique's been moved from Wednesday to Thursday.",
  },
];

export interface CalibrateChoice {
  text: string;
  choice: "brief" | "now";
}

export function CalibrateStep({
  onNext,
  onChoicesCaptured,
}: {
  onNext: () => void;
  onChoicesCaptured?: (choices: CalibrateChoice[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<CalibrateChoice[]>([]);

  function choose(choice: "brief" | "now") {
    const msg = MESSAGES[index];
    const next = [...choices, { text: msg.text, choice }];
    setChoices(next);
    if (index + 1 >= MESSAGES.length) {
      onChoicesCaptured?.(next);
      onNext();
    } else {
      setIndex((i) => i + 1);
    }
  }

  const card = MESSAGES[index];

  return (
    <>
      <div className="flex-1 min-h-0 flex flex-col">
        <h2 className="text-[24px] font-semibold text-[#6e6e66] leading-tight">
          A few quick calls
        </h2>
        <p className="mt-2 text-[13px] text-[#8d8d85] leading-relaxed">
          Here are some messages from your week. For each, tell Calle how you&rsquo;d want it
          handled — now, or in your briefing.
        </p>

        <div className="mt-6 relative h-[150px]">
          <div className="absolute left-6 right-6 top-0 h-[122px] bg-[#f0efec] border-[1.5px] border-[#d4cfc6] rounded-xl" />
          <div className="absolute left-3 right-3 top-2 h-[122px] bg-[#e9e9e6] border-[1.5px] border-[#c2c2bd] rounded-xl" />
          <div className="absolute inset-x-0 top-4 h-[122px] bg-[#fdfdfc] border-[1.5px] border-[#c6c6c1] rounded-xl shadow-[0_6px_14px_rgba(0,0,0,0.08)] p-4 flex gap-3.5">
            <div className="flex-none w-[34px] h-[34px] bg-[#d4d4d0] border-[1.5px] border-[#b0b0ab] rounded-lg" />
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="text-[11px] text-[#9a9a92]">
                {card.source} · {card.meta}
              </div>
              <div className="text-[13px] leading-[1.5] text-[#77776f]">{card.text}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={() => choose("brief")}
            className="flex-1 h-11 rounded-[10px] bg-[#6e6e66] text-[#f4f4f2] text-[14px] font-medium hover:bg-[#5c5c55] transition-colors"
          >
            Brief me
          </button>
          <button
            type="button"
            onClick={() => choose("now")}
            className="flex-1 h-11 rounded-[10px] border-[1.5px] border-[#b0b0ab] text-[#6e6e66] text-[14px] font-medium hover:bg-[#dcdcd8] transition-colors"
          >
            Tell me now
          </button>
        </div>
        <p className="mt-3 text-[12px] text-[#9a9a92]">
          The more you sort, the sharper Calle gets. Five is a good start.
        </p>
      </div>
      <div className="mt-4">
        <ProgressDots current={2} total={4} />
      </div>
    </>
  );
}
