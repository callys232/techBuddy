/**
 * PageVectors — animated geometric + technical vector background.
 * Place as first child of any `relative overflow-hidden` section.
 * All content above needs `relative z-10`.
 * No inline styles — animations injected via <style> tag as per-shape classes.
 */

interface Props {
  variant?: "top-right" | "bottom-left" | "center" | "scattered" | "flow" | "technical" | "minimal";
  intensity?: number; /* 0–1 */
}

/* ── Shape math ─────────────────────────────────────────────────────────────── */

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

function octPts(cx: number, cy: number, r: number) {
  return Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

function diamondPts(cx: number, cy: number, r: number) {
  return `${cx},${cy - r} ${cx + r * 0.6},${cy} ${cx},${cy + r} ${cx - r * 0.6},${cy}`;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export function PageVectors({ variant = "scattered", intensity = 0.5 }: Props) {
  const op = intensity * 0.065;

  type ShapeDef = {
    type: "hex"|"circle"|"tri"|"oct"|"diamond"|"plus"|"bracket-l"|"bracket-r"|"arrow-r"|"arrow-d"|"circuit"|"dashes"|"ring";
    cx: number; cy: number; r: number;
    anim?: string; dur?: number; delay?: number;
  };

  const shapes: ShapeDef[] =
    variant === "top-right" ? [
      { type: "hex",       cx: 88, cy: 10, r: 34, anim: "pv-spin",  dur: 40 },
      { type: "circle",    cx: 62, cy: 22, r: 20, anim: "pv-pulse", dur: 5  },
      { type: "oct",       cx: 78, cy: 38, r: 22, anim: "pv-spinR", dur: 35 },
      { type: "tri",       cx: 95, cy: 52, r: 16, anim: "pv-float", dur: 6  },
      { type: "hex",       cx: 55, cy: 48, r: 14, anim: "pv-float", dur: 7, delay: 1 },
      { type: "diamond",   cx: 82, cy: 68, r: 12, anim: "pv-float", dur: 8  },
      { type: "arrow-r",   cx: 45, cy: 35, r: 10 },
      { type: "arrow-d",   cx: 90, cy: 82, r: 8  },
      { type: "ring",      cx: 70, cy: 80, r: 18, anim: "pv-pulse", dur: 6, delay: 2 },
      { type: "plus",      cx: 45, cy: 12, r: 8,  anim: "pv-spin",  dur: 20 },
    ]
    : variant === "bottom-left" ? [
      { type: "hex",       cx: 6,  cy: 80, r: 36, anim: "pv-spinR", dur: 45 },
      { type: "circle",    cx: 22, cy: 95, r: 22, anim: "pv-pulse", dur: 6  },
      { type: "tri",       cx: 32, cy: 68, r: 28, anim: "pv-float", dur: 7  },
      { type: "oct",       cx: 14, cy: 58, r: 18, anim: "pv-spin",  dur: 30 },
      { type: "diamond",   cx: 40, cy: 88, r: 14, anim: "pv-floatR",dur: 8  },
      { type: "arrow-r",   cx: 50, cy: 75, r: 10 },
      { type: "ring",      cx: 6,  cy: 40, r: 20, anim: "pv-pulse", dur: 5  },
      { type: "bracket-l", cx: 55, cy: 60, r: 12 },
    ]
    : variant === "center" ? [
      { type: "circle", cx: 50, cy: 50, r: 70, anim: "pv-pulse", dur: 8  },
      { type: "hex",    cx: 50, cy: 50, r: 46, anim: "pv-spin",  dur: 50 },
      { type: "ring",   cx: 50, cy: 50, r: 30, anim: "pv-spinR", dur: 35 },
      { type: "circle", cx: 50, cy: 50, r: 18, anim: "pv-pulse", dur: 4  },
      { type: "oct",    cx: 50, cy: 50, r: 56, anim: "pv-spinR", dur: 60 },
      { type: "diamond",cx: 50, cy: 50, r: 10, anim: "pv-spin",  dur: 10 },
    ]
    : variant === "flow" ? [
      { type: "arrow-r", cx: 8,  cy: 25, r: 14 },
      { type: "dashes",  cx: 28, cy: 25, r: 18 },
      { type: "arrow-r", cx: 50, cy: 25, r: 14 },
      { type: "dashes",  cx: 70, cy: 25, r: 18 },
      { type: "arrow-r", cx: 92, cy: 25, r: 14 },
      { type: "arrow-d", cx: 20, cy: 60, r: 12 },
      { type: "circle",  cx: 20, cy: 80, r: 16, anim: "pv-pulse", dur: 5  },
      { type: "arrow-d", cx: 80, cy: 60, r: 12 },
      { type: "circle",  cx: 80, cy: 80, r: 16, anim: "pv-pulse", dur: 5, delay: 1 },
      { type: "hex",     cx: 50, cy: 72, r: 20, anim: "pv-float", dur: 6  },
      { type: "circuit", cx: 10, cy: 45, r: 20 },
    ]
    : variant === "technical" ? [
      { type: "circuit",   cx: 5,  cy: 10, r: 25 },
      { type: "bracket-l", cx: 8,  cy: 50, r: 18 },
      { type: "bracket-r", cx: 92, cy: 50, r: 18 },
      { type: "plus",      cx: 30, cy: 20, r: 10, anim: "pv-spin",  dur: 20 },
      { type: "plus",      cx: 70, cy: 80, r: 10, anim: "pv-spinR", dur: 18 },
      { type: "oct",       cx: 80, cy: 20, r: 22, anim: "pv-spinR", dur: 40 },
      { type: "diamond",   cx: 50, cy: 10, r: 12, anim: "pv-float", dur: 6  },
      { type: "circuit",   cx: 90, cy: 70, r: 20 },
      { type: "ring",      cx: 50, cy: 90, r: 22, anim: "pv-pulse", dur: 7  },
      { type: "hex",       cx: 18, cy: 80, r: 16, anim: "pv-spin",  dur: 30, delay: 2 },
    ]
    : variant === "minimal" ? [
      { type: "ring",    cx: 10, cy: 10, r: 16, anim: "pv-pulse", dur: 8  },
      { type: "ring",    cx: 90, cy: 90, r: 22, anim: "pv-pulse", dur: 10, delay: 3 },
      { type: "plus",    cx: 85, cy: 15, r: 8,  anim: "pv-spin",  dur: 20 },
      { type: "plus",    cx: 15, cy: 85, r: 8,  anim: "pv-spinR", dur: 22 },
      { type: "diamond", cx: 50, cy: 5,  r: 10, anim: "pv-float", dur: 6  },
      { type: "diamond", cx: 50, cy: 95, r: 10, anim: "pv-float", dur: 7  },
    ]
    : /* scattered */ [
      { type: "hex",       cx: 5,  cy: 8,  r: 28, anim: "pv-spinR", dur: 50 },
      { type: "circle",    cx: 25, cy: 20, r: 16, anim: "pv-pulse", dur: 6  },
      { type: "tri",       cx: 50, cy: 5,  r: 20, anim: "pv-float", dur: 7  },
      { type: "hex",       cx: 75, cy: 15, r: 20, anim: "pv-spin",  dur: 45, delay: 3 },
      { type: "circle",    cx: 90, cy: 35, r: 14, anim: "pv-pulse", dur: 5, delay: 1 },
      { type: "tri",       cx: 15, cy: 70, r: 18, anim: "pv-floatR",dur: 8  },
      { type: "hex",       cx: 85, cy: 78, r: 24, anim: "pv-spinR", dur: 40 },
      { type: "oct",       cx: 60, cy: 88, r: 16, anim: "pv-spin",  dur: 30 },
      { type: "tri",       cx: 40, cy: 58, r: 14, anim: "pv-float", dur: 9, delay: 2 },
      { type: "diamond",   cx: 95, cy: 60, r: 10, anim: "pv-float", dur: 6  },
      { type: "arrow-r",   cx: 35, cy: 30, r: 12 },
      { type: "plus",      cx: 65, cy: 45, r: 8,  anim: "pv-spin",  dur: 20 },
      { type: "bracket-l", cx: 4,  cy: 45, r: 16 },
      { type: "ring",      cx: 55, cy: 55, r: 20, anim: "pv-pulse", dur: 7  },
    ];

  /* Build per-shape CSS classes (avoids inline style on SVG elements) */
  const shapeCss = shapes.map((s, i) => {
    if (!s.anim) return "";
    const delay = s.delay ? `${s.delay}s` : "0s";
    return `.pv-s${i}{animation:${s.anim} ${s.dur ?? 8}s linear ${delay} infinite;transform-origin:${s.cx}% ${s.cy}%;}`;
  }).filter(Boolean).join("");

  const css = `
    @keyframes pv-float  {0%,100%{transform:translateY(0)}   50%{transform:translateY(-2%)}}
    @keyframes pv-floatR {0%,100%{transform:translate(0,0)}  50%{transform:translate(1.5%,-1.5%)}}
    @keyframes pv-spin   {from{transform:rotate(0deg)}  to{transform:rotate(360deg)}}
    @keyframes pv-spinR  {from{transform:rotate(0deg)}  to{transform:rotate(-360deg)}}
    @keyframes pv-pulse  {0%,100%{opacity:${op * 14}} 50%{opacity:${op * 5}}}
    @keyframes pv-dash   {to{stroke-dashoffset:-24}}
    .pv-dash-line{animation:pv-dash 3s linear infinite;transform-origin:50% 50%;}
    ${shapeCss}
  `;

  const colors = ["#38BDF8", "#7DD3FC", "#1E3A8A", "#38BDF8"];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <style>{css}</style>

          <marker id="pv-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="#38BDF8" fillOpacity={op * 12} />
          </marker>

          <radialGradient id="pv-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#38BDF8" stopOpacity={op * 3} />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dot grid baseline */}
        {Array.from({ length: 10 }, (_, row) =>
          Array.from({ length: 14 }, (_, col) => (
            <circle
              key={`d${row}-${col}`}
              cx={col * 7.5 + 3.75} cy={row * 10 + 5}
              r="0.35" fill="#38BDF8" opacity={op * 0.55}
            />
          ))
        )}

        {/* Shapes */}
        {shapes.map((s, i) => {
          const color   = colors[i % colors.length];
          const sw      = s.r > 20 ? "0.35" : "0.4";
          const fillOp  = i % 5 === 0 ? op * 0.5 : 0;
          const sOp     = op * (s.r > 25 ? 0.9 : 1.2);
          const cls     = s.anim ? `pv-s${i}` : undefined;

          if (s.type === "hex")
            return <polygon key={i} className={cls} points={hexPts(s.cx, s.cy, s.r)} fill={color} fillOpacity={fillOp} stroke={color} strokeWidth={sw} strokeOpacity={sOp} />;

          if (s.type === "circle")
            return <circle key={i} className={cls} cx={s.cx} cy={s.cy} r={s.r} fill={color} fillOpacity={fillOp} stroke={color} strokeWidth={sw} strokeOpacity={sOp} />;

          if (s.type === "tri")
            return <polygon key={i} className={cls} points={triPts(s.cx, s.cy, s.r)} fill={color} fillOpacity={fillOp} stroke={color} strokeWidth={sw} strokeOpacity={sOp} />;

          if (s.type === "oct")
            return <polygon key={i} className={cls} points={octPts(s.cx, s.cy, s.r)} fill="none" stroke={color} strokeWidth={sw} strokeOpacity={sOp} />;

          if (s.type === "diamond")
            return <polygon key={i} className={cls} points={diamondPts(s.cx, s.cy, s.r)} fill={color} fillOpacity={fillOp} stroke={color} strokeWidth={sw} strokeOpacity={sOp} />;

          if (s.type === "ring")
            return (
              <g key={i} className={cls}>
                <circle cx={s.cx} cy={s.cy} r={s.r}        fill="none" stroke={color} strokeWidth={sw}       strokeOpacity={sOp} />
                <circle cx={s.cx} cy={s.cy} r={s.r * 0.7}  fill="none" stroke={color} strokeWidth="0.22"     strokeOpacity={sOp * 0.5} />
                <circle cx={s.cx} cy={s.cy} r={s.r * 1.3}  fill="url(#pv-glow)" />
              </g>
            );

          if (s.type === "plus") {
            const h = s.r; const t = s.r * 0.35;
            return (
              <g key={i} className={cls} stroke={color} strokeWidth={sw} strokeOpacity={sOp} strokeLinecap="round" fill="none">
                <line x1={s.cx - h} y1={s.cy}     x2={s.cx + h} y2={s.cy}     />
                <line x1={s.cx}     y1={s.cy - h}  x2={s.cx}     y2={s.cy + h} />
                <rect x={s.cx - t}  y={s.cy - t}   width={t * 2}  height={t * 2} fill={color} fillOpacity={fillOp} stroke="none" />
              </g>
            );
          }

          if (s.type === "bracket-l") {
            const h = s.r; const arm = s.r * 0.45;
            return (
              <g key={i} stroke={color} strokeWidth={sw} strokeOpacity={sOp} strokeLinecap="round" fill="none">
                <line x1={s.cx + arm} y1={s.cy - h} x2={s.cx}        y2={s.cy - h} />
                <line x1={s.cx}       y1={s.cy - h} x2={s.cx}        y2={s.cy + h} />
                <line x1={s.cx}       y1={s.cy + h} x2={s.cx + arm}  y2={s.cy + h} />
              </g>
            );
          }

          if (s.type === "bracket-r") {
            const h = s.r; const arm = s.r * 0.45;
            return (
              <g key={i} stroke={color} strokeWidth={sw} strokeOpacity={sOp} strokeLinecap="round" fill="none">
                <line x1={s.cx - arm} y1={s.cy - h} x2={s.cx}        y2={s.cy - h} />
                <line x1={s.cx}       y1={s.cy - h} x2={s.cx}        y2={s.cy + h} />
                <line x1={s.cx}       y1={s.cy + h} x2={s.cx - arm}  y2={s.cy + h} />
              </g>
            );
          }

          if (s.type === "arrow-r") {
            const len = s.r * 2.5;
            return (
              <g key={i} stroke={color} strokeWidth={sw} strokeOpacity={sOp * 0.9} fill="none">
                <line x1={s.cx - len / 2} y1={s.cy} x2={s.cx + len / 2} y2={s.cy} markerEnd="url(#pv-arr)" />
                <line x1={s.cx - len / 2} y1={s.cy - 2.5} x2={s.cx + len / 2 - 4} y2={s.cy - 2.5}
                  strokeDasharray="1.5,2" strokeOpacity={sOp * 0.4} />
              </g>
            );
          }

          if (s.type === "arrow-d") {
            const len = s.r * 2.5;
            return (
              <g key={i} stroke={color} strokeWidth={sw} strokeOpacity={sOp * 0.9} fill="none">
                <line x1={s.cx} y1={s.cy - len / 2} x2={s.cx} y2={s.cy + len / 2} markerEnd="url(#pv-arr)" />
              </g>
            );
          }

          if (s.type === "circuit") {
            const x = s.cx; const y = s.cy;
            return (
              <g key={i} stroke={color} strokeWidth={sw} strokeOpacity={sOp * 0.85} fill="none" strokeLinecap="round">
                <path d={`M${x-12},${y} H${x-6} V${y-8} H${x+6} V${y+8} H${x+14}`} />
                <path d={`M${x-6},${y-8} H${x-14} M${x+6},${y+8} H${x+14}`} strokeDasharray="1,2" strokeOpacity={sOp * 0.4} />
                <circle cx={x - 6}  cy={y - 8} r="1"   fill={color} fillOpacity={sOp * 3} stroke="none" />
                <circle cx={x + 6}  cy={y + 8} r="1"   fill={color} fillOpacity={sOp * 3} stroke="none" />
                <circle cx={x + 14} cy={y}     r="1.4" fill="none" stroke={color} strokeWidth={sw} strokeOpacity={sOp * 0.7} />
              </g>
            );
          }

          if (s.type === "dashes") {
            return (
              <line key={i}
                className="pv-dash-line"
                x1={s.cx - s.r} y1={s.cy} x2={s.cx + s.r} y2={s.cy}
                stroke={color} strokeWidth="0.5" strokeOpacity={sOp * 0.7}
                strokeDasharray="3,2" strokeLinecap="round"
              />
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
}
