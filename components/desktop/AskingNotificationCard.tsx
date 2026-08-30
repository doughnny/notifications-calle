export function AskingNotificationCard({
  message,
  reason,
  onFlag,
  onHold,
}: {
  message: string;
  reason: string;
  onFlag: () => void;
  onHold: () => void;
}) {
  return (
    <div className="w-[400px] rounded-2xl border-[1.5px] border-dashed border-[#b0b0ab] bg-[#f4f4f2] px-[18px] py-[18px] flex gap-4 shadow-[0_6px_16px_rgba(0,0,0,0.10)]">
      <div className="flex-none w-11 h-11 bg-[#dcdcd8] border-[1.5px] border-[#c2c2bd] rounded-[9px]" />
      <div className="flex-1 min-w-0 flex flex-col gap-2 pt-px">
        <div className="text-[10px] uppercase tracking-wide text-[#9a9a92] font-semibold">
          Calle is asking
        </div>
        <div className="text-[14px] font-medium leading-[1.4] text-[#77776f]">{reason}</div>
        <div className="text-[12px] leading-[1.4] text-[#9a9a92]">{message}</div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onFlag}
            className="text-[12px] font-medium rounded-full bg-[#6e6e66] text-[#f4f4f2] px-3 py-1.5 hover:bg-[#5c5c55] transition-colors"
          >
            Flag now
          </button>
          <button
            type="button"
            onClick={onHold}
            className="text-[12px] rounded-full border-[1.5px] border-[#b0b0ab] text-[#6e6e66] px-3 py-1.5 hover:bg-[#dcdcd8] transition-colors"
          >
            Hold for briefing
          </button>
        </div>
      </div>
    </div>
  );
}
