"use client";

import { motion } from "framer-motion";
import { Runner }  from "./characters/Runner";
import { Dancer }  from "./characters/Dancer";
import { Acrobat } from "./characters/Acrobat";
import { Hurdle }  from "./obstacles/Hurdle";
import { Car }     from "./obstacles/Car";
import { Ramp }    from "./obstacles/Ramp";

/* viewBox: 1400 × 340. Ground line at y=286. */
const W = 1400;
const H = 340;
const GY = 286; /* ground y */

/* Obstacle scroll: each travels from x=1480 to x=-180 = 1660px */
const TRAVEL = W + 200;
function obstacleTransition(dur: number, delay: number) {
  return {
    x: { duration: dur, delay, repeat: Infinity, ease: "linear" as const },
  };
}

/* Background star positions (x,y,r) */
const STARS = [
  [80,  20,  1.2], [220, 45,  0.8], [400, 15,  1.4], [610, 30,  1],
  [780, 10,  1.2], [950, 55,  0.7], [1100,25,  1.3], [1280,40,  0.9],
  [150, 80,  0.7], [340, 100, 1],   [500, 70,  0.8], [720, 90,  1.1],
  [870, 65,  0.6], [1030,110, 0.9], [1200,75,  1],   [60,  140, 0.8],
  [300, 160, 0.7], [550, 130, 1.1], [800, 155, 0.6], [1050,145, 0.9],
];

/* Floating shapes config */
const SHAPES = [
  { x: 120,  y: 60,  type: "hex",    s: 28, opacity: 0.07, dy: -14 },
  { x: 380,  y: 40,  type: "circle", s: 22, opacity: 0.06, dy: 10  },
  { x: 680,  y: 80,  type: "tri",    s: 32, opacity: 0.08, dy: -18 },
  { x: 950,  y: 50,  type: "hex",    s: 20, opacity: 0.06, dy: 12  },
  { x: 1200, y: 70,  type: "circle", s: 30, opacity: 0.07, dy: -10 },
  { x: 250,  y: 200, type: "tri",    s: 18, opacity: 0.05, dy: 8   },
  { x: 820,  y: 190, type: "circle", s: 16, opacity: 0.05, dy: -6  },
];

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

function triPoints(cx: number, cy: number, r: number) {
  return [0, 120, 240].map((deg) => {
    const a = (deg - 90) * (Math.PI / 180);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

export function StickmanScene() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#060E1C" />
          <stop offset="60%"  stopColor="#0A1A32" />
          <stop offset="100%" stopColor="#0D2150" />
        </linearGradient>

        {/* Ground glow */}
        <linearGradient id="groundGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#38BDF8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0"    />
        </linearGradient>

        {/* Radial glow under characters */}
        <radialGradient id="charGlow" cx="50%" cy="100%" r="50%">
          <stop offset="0%"   stopColor="#38BDF8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0"    />
        </radialGradient>

        {/* Trust blue dot grid */}
        <pattern id="dotGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="#38BDF8" opacity="0.06" />
        </pattern>
      </defs>

      {/* Sky fill */}
      <rect x="0" y="0" width={W} height={H} fill="url(#skyGrad)" />

      {/* Dot grid overlay */}
      <rect x="0" y="0" width={W} height={H} fill="url(#dotGrid)" />

      {/* Stars */}
      {STARS.map(([sx, sy, sr], i) => (
        <motion.circle
          key={i}
          cx={sx} cy={sy} r={sr}
          fill="#F0F8FF"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2 + (i % 4),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating shapes */}
      {SHAPES.map((sh, i) => (
        <motion.g
          key={i}
          animate={{ y: [0, sh.dy, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {sh.type === "hex" && (
            <polygon
              points={hexPoints(sh.x, sh.y, sh.s)}
              fill="none" stroke="#38BDF8"
              strokeWidth="1.5" opacity={sh.opacity}
            />
          )}
          {sh.type === "circle" && (
            <circle
              cx={sh.x} cy={sh.y} r={sh.s}
              fill="none" stroke="#38BDF8"
              strokeWidth="1.5" opacity={sh.opacity}
            />
          )}
          {sh.type === "tri" && (
            <polygon
              points={triPoints(sh.x, sh.y, sh.s)}
              fill="none" stroke="#7DD3FC"
              strokeWidth="1.5" opacity={sh.opacity}
            />
          )}
        </motion.g>
      ))}

      {/* Horizon glow band */}
      <rect x="0" y={GY - 32} width={W} height={32} fill="url(#groundGlow)" />

      {/* Ground track surface */}
      <rect x="0" y={GY} width={W} height={H - GY} fill="#0A1628" />

      {/* Ground glow line */}
      <rect x="0" y={GY - 1} width={W} height="2" fill="#38BDF8" opacity="0.35" />

      {/* Track dashes (motion lines) */}
      {Array.from({ length: 14 }, (_, i) => (
        <motion.rect
          key={i}
          x={i * 100 + 20} y={GY + 14}
          width="60" height="2"
          fill="#1E3A8A" rx="1" opacity="0.5"
          animate={{ x: [i * 100 + 20, i * 100 - 80] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: i * 0.085 }}
        />
      ))}

      {/* ── Obstacles ─────────────────────────────────── */}

      {/* Hurdle 1 */}
      <motion.g
        initial={{ x: W + 80 }}
        animate={{ x: -180 }}
        transition={obstacleTransition(9, 0).x}
      >
        <g transform={`translate(0, ${GY})`}>
          <Hurdle color="#38BDF8" />
        </g>
      </motion.g>

      {/* Ramp */}
      <motion.g
        initial={{ x: W + 80 }}
        animate={{ x: -180 }}
        transition={obstacleTransition(10, 3).x}
      >
        <g transform={`translate(0, ${GY})`}>
          <Ramp />
        </g>
      </motion.g>

      {/* Car */}
      <motion.g
        initial={{ x: W + 80 }}
        animate={{ x: -180 }}
        transition={obstacleTransition(10, 5.5).x}
      >
        <g transform={`translate(0, ${GY})`}>
          <Car />
        </g>
      </motion.g>

      {/* Hurdle 2 (sky blue variant) */}
      <motion.g
        initial={{ x: W + 80 }}
        animate={{ x: -180 }}
        transition={obstacleTransition(9, 8).x}
      >
        <g transform={`translate(0, ${GY})`}>
          <Hurdle color="#7DD3FC" />
        </g>
      </motion.g>

      {/* ── Characters ────────────────────────────────── */}

      {/* Character glow */}
      <rect x="80" y={GY - 60} width="540" height="60" fill="url(#charGlow)" />

      {/* Runner (white) — jumps to clear hurdle at ~t=7.4s */}
      <Runner  x={165}  groundY={GY} color="#F0F8FF" jumpDelay={7}   jumpInterval={9}   jumpHeight={72} />

      {/* Acrobat (light sky) — backflips at ~t=5s */}
      <Acrobat x={325}  groundY={GY} color="#7DD3FC" flipDelay={5}   flipInterval={10} />

      {/* Dancer (sky blue) — grooves in place */}
      <Dancer  x={510}  groundY={GY} color="#38BDF8" />
    </svg>
  );
}
