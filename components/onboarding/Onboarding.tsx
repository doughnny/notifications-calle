"use client";

import { useState } from "react";
import { MenuBar } from "../desktop/MenuBar";
import { Dock } from "../desktop/Dock";
import { OnboardingCard } from "./OnboardingCard";
import { SplashStep } from "./steps/SplashStep";
import { PermissionsStep } from "./steps/PermissionsStep";
import { CalibrateStep } from "./steps/CalibrateStep";
import { BriefingSetupStep } from "./steps/BriefingSetupStep";

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [clockTime, setClockTime] = useState("09:00");

  return (
    <div className="relative flex-1 min-w-0 h-full bg-[#d8d8d5] border-[1.5px] border-[#8d8d88] rounded-md overflow-hidden font-mono">
      <MenuBar currentTime={clockTime} onTimeChange={setClockTime} />

      <div className="absolute inset-0 flex items-center justify-center">
        <OnboardingCard onSkip={onComplete}>
          {step === 0 && <SplashStep onNext={() => setStep(1)} />}
          {step === 1 && <PermissionsStep onNext={() => setStep(2)} />}
          {step === 2 && <CalibrateStep onNext={() => setStep(3)} />}
          {step === 3 && <BriefingSetupStep onDone={onComplete} />}
        </OnboardingCard>
      </div>

      <Dock />
    </div>
  );
}
