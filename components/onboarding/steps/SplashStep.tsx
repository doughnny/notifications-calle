import { ProgressDots } from "../ProgressDots";

export function SplashStep({ onNext }: { onNext: () => void }) {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-[32px] font-semibold text-[#6e6e66] leading-tight">Meet Calle</h1>
        <p className="mt-4 text-[16px] text-[#77776f] leading-snug">
          Calle handles the noise, and keeps you across what matters.
        </p>
        <p className="mt-3 text-[13px] text-[#9a9a92] leading-relaxed">
          An assistant for your notifications — it screens the noise, surfaces what needs you,
          and brings the rest to you later.
        </p>
      </div>
      <button
        type="button"
        onClick={onNext}
        className="self-start h-11 px-6 rounded-[10px] bg-[#6e6e66] text-[#f4f4f2] text-[14px] font-medium hover:bg-[#5c5c55] transition-colors"
      >
        Get started
      </button>
      <div className="mt-6">
        <ProgressDots current={0} total={4} />
      </div>
    </>
  );
}
