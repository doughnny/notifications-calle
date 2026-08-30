const DOCK_ICONS = Array.from({ length: 6 }, (_, i) => i);

export function Dock() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 h-[78px] px-3.5 bg-[#faf9f9]/85 border-[1.5px] border-[#a8a8a3] rounded-[18px] flex items-center gap-3 backdrop-blur-sm max-w-[calc(100%-48px)]">
      {DOCK_ICONS.map((i) => (
        <div
          key={i}
          className="flex-none w-14 h-14 bg-[#c9c9c4] border-[1.5px] border-[#a3a39e] rounded-xl"
        />
      ))}
    </div>
  );
}
