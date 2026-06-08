/**
 * PageVectors — abstract geometric background decoration.
 * Usage: place as first child of any `relative overflow-hidden` section.
 * All content above should have `relative z-10`.
 */

interface Props {
  variant?: "top-right" | "bottom-left" | "center" | "scattered";
  intensity?: number; /* 0–1, default 0.5 */
}

function hexPts(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

function triPts(cx: number, cy: number, r: number) {
  return [0, 120, 240].map((deg) => {
    const a = (deg - 90) * (Math.PI / 180);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

export function PageVectors({ variant = "scattered", intensity = 0.5 }: Props) {
  const op = intensity * 0.08;

  const shapes =
    variant === "top-right"
      ? [
          { type: "hex",    cx: 85,  cy: 12,  r: 36 },
          { type: "circle", cx: 60,  cy: 55,  r: 22 },
          { type: "hex",    cx: 30,  cy: 28,  r: 18 },
          { type: "tri",    cx: 70,  cy: 30,  r: 28 },
          { type: "circle", cx: 95,  cy: 40,  r: 14 },
          { type: "hex",    cx: 50,  cy: 72,  r: 12 },
        ]
      : variant === "bottom-left"
      ? [
          { type: "hex",    cx: 5,  cy: 75,  r: 40 },
          { type: "circle", cx: 20, cy: 92,  r: 24 },
          { type: "tri",    cx: 30, cy: 65,  r: 30 },
          { type: "hex",    cx: 12, cy: 55,  r: 16 },
        ]
      : variant === "center"
      ? [
          { type: "hex",    cx: 50, cy: 50,  r: 48 },
          { type: "circle", cx: 50, cy: 50,  r: 70 },
          { type: "circle", cx: 50, cy: 50,  r: 30 },
        ]
      : /* scattered */
        [
          { type: "hex",    cx: 5,   cy: 8,   r: 30 },
          { type: "circle", cx: 25,  cy: 20,  r: 18 },
          { type: "tri",    cx: 50,  cy: 5,   r: 24 },
          { type: "hex",    cx: 75,  cy: 15,  r: 22 },
          { type: "circle", cx: 90,  cy: 35,  r: 16 },
          { type: "tri",    cx: 15,  cy: 70,  r: 20 },
          { type: "hex",    cx: 85,  cy: 80,  r: 28 },
          { type: "circle", cx: 60,  cy: 90,  r: 14 },
          { type: "tri",    cx: 40,  cy: 60,  r: 16 },
          { type: "hex",    cx: 95,  cy: 60,  r: 12 },
        ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        {shapes.map((s, i) => {
          const stroke = i % 3 === 0 ? "#38BDF8" : i % 3 === 1 ? "#7DD3FC" : "#1E3A8A";
          const fill   = i % 4 === 0 ? stroke : "none";
          const fillOp = i % 4 === 0 ? op * 0.4 : 0;
          return s.type === "hex" ? (
            <polygon key={i} points={hexPts(s.cx, s.cy, s.r)}
              fill={fill} fillOpacity={fillOp}
              stroke={stroke} strokeWidth="0.4" strokeOpacity={op * 1.2} />
          ) : s.type === "circle" ? (
            <circle  key={i} cx={s.cx} cy={s.cy} r={s.r}
              fill={fill} fillOpacity={fillOp}
              stroke={stroke} strokeWidth="0.4" strokeOpacity={op * 1.2} />
          ) : (
            <polygon key={i} points={triPts(s.cx, s.cy, s.r)}
              fill={fill} fillOpacity={fillOp}
              stroke={stroke} strokeWidth="0.4" strokeOpacity={op * 1.2} />
          );
        })}

        {/* Dot grid */}
        {Array.from({ length: 10 }, (_, row) =>
          Array.from({ length: 14 }, (_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 7.5 + 3.75} cy={row * 10 + 5}
              r="0.5" fill="#38BDF8" opacity={op * 0.6}
            />
          ))
        )}
      </svg>
    </div>
  );
}
