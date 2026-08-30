export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }, (_, i) => {
        const tone = i < current ? "bg-[#8d8d85]" : i === current ? "bg-[#6e6e66]" : "bg-[#dcdcd8]";
        return <div key={i} className={`w-[26px] h-1 rounded-full ${tone}`} />;
      })}
    </div>
  );
}
