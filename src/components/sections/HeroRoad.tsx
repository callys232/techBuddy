"use client";

/* ──────────────────────────────────────────────────────────────────────────────
   HeroRoad — full-height hero background.
   SVG viewBox: 1400 × 560. Road surface at y = 440.
   Pure CSS keyframes — zero JS animations, zero Framer Motion.
   Opacity kept low so it never fights the hero copy.
────────────────────────────────────────────────────────────────────────────── */

const W      = 1400;
const H      = 560;
const ROAD_Y = 440;
const SW     = 1.5;

function PoseA({ cx }: { cx: number }) {
  const cy = ROAD_Y;
  return (
    <g stroke="currentColor" strokeWidth={SW} strokeLinecap="round" fill="none">
      <circle cx={cx} cy={cy - 22} r={4} />
      <line x1={cx}   y1={cy - 18} x2={cx}      y2={cy - 8} />
      <line x1={cx}   y1={cy - 15} x2={cx - 7}  y2={cy - 20} />
      <line x1={cx}   y1={cy - 15} x2={cx + 6}  y2={cy - 11} />
      <line x1={cx}   y1={cy - 8}  x2={cx + 7}  y2={cy - 16} />
      <line x1={cx}   y1={cy - 8}  x2={cx - 5}  y2={cy} />
    </g>
  );
}

function PoseB({ cx }: { cx: number }) {
  const cy = ROAD_Y;
  return (
    <g stroke="currentColor" strokeWidth={SW} strokeLinecap="round" fill="none">
      <circle cx={cx} cy={cy - 22} r={4} />
      <line x1={cx}   y1={cy - 18} x2={cx}      y2={cy - 8} />
      <line x1={cx}   y1={cy - 15} x2={cx + 7}  y2={cy - 20} />
      <line x1={cx}   y1={cy - 15} x2={cx - 6}  y2={cy - 11} />
      <line x1={cx}   y1={cy - 8}  x2={cx - 7}  y2={cy - 16} />
      <line x1={cx}   y1={cy - 8}  x2={cx + 5}  y2={cy} />
    </g>
  );
}

interface RunnerCfg {
  speed:  number;
  delay:  number;
  tempo:  number;
  flip?:  boolean;
  scale?: number;
}

function Runner({ speed, delay, tempo, flip = false, scale = 1 }: RunnerCfg) {
  const uid    = `rd${speed}${Math.abs(delay)}`.replace(/\./g, "x");
  const moveKf = `mv-${uid}`;
  const pAkf   = `pA-${uid}`;
  const pBkf   = `pB-${uid}`;
  const half   = tempo / 2;
  const fromX  = flip ? "-80px"   : "1480px";
  const toX    = flip ? "1480px"  : "-80px";

  return (
    <>
      <style>{`
        @keyframes ${moveKf} { from{transform:translateX(${fromX})} to{transform:translateX(${toX})} }
        @keyframes ${pAkf}   { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes ${pBkf}   { 0%,49%{opacity:0} 50%,100%{opacity:1} }
        .${uid}-run  { animation:${moveKf} ${speed}s linear ${delay}s infinite; }
        .${uid}-pA   { animation:${pAkf} ${tempo}s steps(1) infinite; }
        .${uid}-pB   { animation:${pBkf} ${tempo}s steps(1) ${half}s infinite; }
      `}</style>
      <g className={`${uid}-run`} transform={`scale(${scale},${scale})`}>
        <g className={`${uid}-pA`}><PoseA cx={0} /></g>
        <g className={`${uid}-pB`}><PoseB cx={0} /></g>
      </g>
    </>
  );
}

export function HeroRoad() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-[var(--fg)] opacity-[0.14]"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <pattern id="hrDots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="1" fill="currentColor" opacity="0.06" />
          </pattern>
          <linearGradient id="hrFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--bg)" stopOpacity="1" />
            <stop offset="52%"  stopColor="var(--bg)" stopOpacity="0.75" />
            <stop offset="80%"  stopColor="var(--bg)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hrGlow" cx="50%" cy="100%" r="55%">
            <stop offset="0%"   stopColor="var(--primary)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#hrDots)" />
        <rect x="0" y="0" width={W} height={H} fill="url(#hrGlow)" />

        {/* Road lines */}
        <line x1="0" y1={ROAD_Y - 28} x2={W} y2={ROAD_Y - 28} stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <line x1="0" y1={ROAD_Y}      x2={W} y2={ROAD_Y}      stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        <line x1="0" y1={ROAD_Y + 14} x2={W} y2={ROAD_Y + 14} stroke="currentColor" strokeWidth="0.7" opacity="0.2" />

        {/* Centre lane dashes */}
        {Array.from({ length: 26 }, (_, i) => (
          <line key={i}
            x1={i * 56 + 6} y1={ROAD_Y - 14}
            x2={i * 56 + 38} y2={ROAD_Y - 14}
            stroke="currentColor" strokeWidth="0.9" opacity="0.25"
          />
        ))}

        {/* Runners */}
        <Runner speed={18} delay={-3}  tempo={0.42} scale={0.65} />
        <Runner speed={15} delay={-11} tempo={0.38} scale={0.68} flip />
        <Runner speed={11} delay={-6}  tempo={0.30} scale={0.85} />
        <Runner speed={12} delay={-1}  tempo={0.32} scale={0.82} />
        <Runner speed={7}  delay={-4}  tempo={0.24} />
        <Runner speed={8}  delay={-9}  tempo={0.26} flip />

        {/* Top-fade overlay */}
        <rect x="0" y="0" width={W} height={H} fill="url(#hrFade)" />
      </svg>
    </div>
  );
}
