export function OnboardingCard({
  onSkip,
  children,
}: {
  onSkip: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="w-[560px] h-[660px] bg-[#f4f4f2] border-[1.5px] border-[#8d8d88] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.24)] px-11 pt-6 pb-7 flex flex-col font-mono">
      <button
        type="button"
        onClick={onSkip}
        className="self-start text-[12px] text-[#8d8d85] border-b border-[#c6c6c1] pb-0.5 hover:text-[#6e6e66] hover:border-[#8d8d88] transition-colors"
      >
        Skip to demo
      </button>
      <div className="flex-1 min-h-0 flex flex-col mt-8">{children}</div>
    </div>
  );
}
