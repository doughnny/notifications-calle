export function XIcon({ size = 11, color = "#8d8d88" }: { size?: number; color?: string }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          position: "absolute",
          top: size / 2 - 0.75,
          left: 0,
          width: size,
          height: 1.5,
          background: color,
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: size / 2 - 0.75,
          left: 0,
          width: size,
          height: 1.5,
          background: color,
          transform: "rotate(-45deg)",
        }}
      />
    </div>
  );
}
