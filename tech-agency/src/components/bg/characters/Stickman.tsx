"use client";

import { motion } from "framer-motion";

export type StickmanMode = "run" | "dance" | "idle";

interface Props {
  color?: string;
  mode?: StickmanMode;
  speed?: number;
}

const mirror = "mirror" as const;
const eio    = "easeInOut" as const;

export function Stickman({ color = "#F0F8FF", mode = "run", speed = 1 }: Props) {
  const isRun   = mode === "run";
  const isDance = mode === "dance";
  const dur = (isDance ? 0.55 : 0.38) / speed;

  /* arm / leg rotate ranges */
  const armL = isDance ? [-75, 75, 95, -90, 60, -70] : isRun ? [-40, 40] : [-8, 8];
  const armR = isDance ? [75, -75, -95, 90, -60, 70]  : isRun ? [40, -40] : [8, -8];
  const legL = isDance ? [-18, 18, -22, 22]             : isRun ? [-34, 34] : [-4, 4];
  const legR = isDance ? [18, -18, 22, -22]             : isRun ? [34, -34] : [4, -4];

  const t = (d = dur) => ({
    duration: d, repeat: Infinity, repeatType: mirror, ease: eio,
  });

  return (
    <g>
      {/* Head */}
      <circle cx="0" cy="-56" r="10"
        fill="none" stroke={color} strokeWidth="2.5" />

      {/* Body */}
      <line x1="0" y1="-46" x2="0" y2="-16"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" />

      {/* Left arm — pivots at shoulder y=-36 */}
      <motion.g
        style={{ transformOrigin: "0px -36px" }}
        animate={{ rotate: armL }}
        transition={t()}
      >
        <line x1="0" y1="-36" x2="-18" y2="-20"
          stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>

      {/* Right arm */}
      <motion.g
        style={{ transformOrigin: "0px -36px" }}
        animate={{ rotate: armR }}
        transition={t()}
      >
        <line x1="0" y1="-36" x2="18" y2="-20"
          stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>

      {/* Left leg — pivots at hip y=-16 */}
      <motion.g
        style={{ transformOrigin: "0px -16px" }}
        animate={{ rotate: legL }}
        transition={t(dur * 0.95)}
      >
        <line x1="0" y1="-16" x2="-14" y2="18"
          stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>

      {/* Right leg */}
      <motion.g
        style={{ transformOrigin: "0px -16px" }}
        animate={{ rotate: legR }}
        transition={t(dur * 0.95)}
      >
        <line x1="0" y1="-16" x2="14" y2="18"
          stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
    </g>
  );
}
