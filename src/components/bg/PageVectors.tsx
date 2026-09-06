import { useId } from "react";

/** A restrained technical background: precision grid, signal paths and focal nodes. */
interface Props {
  variant?: "top-right" | "bottom-left" | "center" | "scattered" | "flow" | "technical" | "minimal";
  intensity?: number;
}

type Composition = { focusX: number; focusY: number; direction: 1 | -1; gridX: number; gridY: number };

const COMPOSITIONS: Record<NonNullable<Props["variant"]>, Composition> = {
  "top-right":   { focusX: 82, focusY: 20, direction: 1,  gridX: 1, gridY: 1 },
  "bottom-left": { focusX: 18, focusY: 80, direction: -1, gridX: 3, gridY: 2 },
  center:         { focusX: 50, focusY: 50, direction: 1,  gridX: 0, gridY: 0 },
  scattered:      { focusX: 72, focusY: 64, direction: -1, gridX: 2, gridY: 4 },
  flow:           { focusX: 76, focusY: 48, direction: 1,  gridX: 4, gridY: 1 },
  technical:      { focusX: 24, focusY: 34, direction: 1,  gridX: 1, gridY: 3 },
  minimal:        { focusX: 88, focusY: 18, direction: -1, gridX: 0, gridY: 0 },
};

export function PageVectors({ variant = "scattered", intensity = 0.5 }: Props) {
  const rawId = useId().replace(/:/g, "");
  const gridId = `pv-grid-${rawId}`;
  const glowId = `pv-glow-${rawId}`;
  const fadeId = `pv-fade-${rawId}`;
  const c = COMPOSITIONS[variant];
  const opacity = Math.max(0, Math.min(1, intensity));
  const sparse = variant === "minimal";
  const startX = c.direction === 1 ? -8 : 108;
  const endX = c.direction === 1 ? 108 : -8;
  const bendA = c.direction === 1 ? 31 : 69;
  const bendB = c.direction === 1 ? 70 : 30;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id={gridId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform={`translate(${c.gridX} ${c.gridY})`}>
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="var(--brand)" strokeWidth="0.11" opacity={0.32 * opacity} />
            <circle cx="0" cy="0" r="0.22" fill="var(--brand)" opacity={0.55 * opacity} />
          </pattern>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--brand)" stopOpacity={0.18 * opacity} />
            <stop offset="0.46" stopColor="var(--brand)" stopOpacity={0.06 * opacity} />
            <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--brand)" stopOpacity="0" />
            <stop offset="0.28" stopColor="var(--brand)" stopOpacity={0.42 * opacity} />
            <stop offset="0.72" stopColor="var(--brand)" stopOpacity={0.42 * opacity} />
            <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
          <style>{`
            @keyframes pv-drift-${rawId} { to { stroke-dashoffset: -18; } }
            @keyframes pv-breathe-${rawId} { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.035); } }
            .pv-path-${rawId} { animation: pv-drift-${rawId} 18s linear infinite; }
            .pv-focus-${rawId} { animation: pv-breathe-${rawId} 8s ease-in-out infinite; transform-origin: ${c.focusX}px ${c.focusY}px; }
            @media (prefers-reduced-motion: reduce) { .pv-path-${rawId}, .pv-focus-${rawId} { animation: none; } }
          `}</style>
        </defs>

        <rect width="100" height="100" fill={`url(#${gridId})`} opacity={sparse ? 0.28 : 0.72} />
        <ellipse cx={c.focusX} cy={c.focusY} rx="34" ry="42" fill={`url(#${glowId})`} />

        {!sparse && (
          <g fill="none" stroke={`url(#${fadeId})`} strokeLinecap="round">
            <path className={`pv-path-${rawId}`} d={`M ${startX} 28 C ${bendA} 4, ${bendB} 58, ${endX} 31`} strokeWidth="0.42" strokeDasharray="2 3.5" />
            <path className={`pv-path-${rawId}`} d={`M ${startX} 52 C ${bendA} 82, ${bendB} 18, ${endX} 57`} strokeWidth="0.28" strokeDasharray="1 4" style={{ animationDirection: "reverse", animationDuration: "24s" }} />
            <path d={`M ${startX} 76 C ${bendA} 48, ${bendB} 96, ${endX} 73`} strokeWidth="0.18" opacity={0.65 * opacity} />
          </g>
        )}

        <g className={`pv-focus-${rawId}`} fill="none" stroke="var(--brand)">
          <circle cx={c.focusX} cy={c.focusY} r="8" strokeWidth="0.34" opacity={0.62 * opacity} />
          <circle cx={c.focusX} cy={c.focusY} r="13" strokeWidth="0.16" strokeDasharray="1 2" opacity={0.42 * opacity} />
          <path d={`M ${c.focusX - 16} ${c.focusY} H ${c.focusX + 16} M ${c.focusX} ${c.focusY - 16} V ${c.focusY + 16}`} strokeWidth="0.12" opacity={0.38 * opacity} />
          <circle cx={c.focusX} cy={c.focusY} r="1.15" fill="var(--brand)" stroke="none" opacity={0.9 * opacity} />
        </g>

        {!sparse && (
          <g fill="var(--surface)" stroke="var(--brand)" strokeWidth="0.24">
            <circle cx={c.direction === 1 ? 30 : 70} cy="25" r="1.1" opacity={0.75 * opacity} />
            <circle cx={c.direction === 1 ? 62 : 38} cy="55" r="0.75" opacity={0.6 * opacity} />
            <circle cx={c.direction === 1 ? 78 : 22} cy="74" r="1.35" opacity={0.7 * opacity} />
          </g>
        )}

        <path d="M 3 12 V 3 H 12 M 88 97 H 97 V 88" fill="none" stroke="var(--brand)" strokeWidth="0.24" opacity={0.38 * opacity} />
      </svg>
    </div>
  );
}
