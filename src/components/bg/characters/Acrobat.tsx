"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Stickman } from "./Stickman";

interface Props {
  x: number;
  groundY: number;
  color?: string;
  flipDelay?: number;
  flipInterval?: number;
}

export function Acrobat({
  x,
  groundY,
  color = "#7DD3FC",
  flipDelay = 4,
  flipInterval = 8,
}: Props) {
  const controls = useAnimation();

  useEffect(() => {
    let alive = true;

    const flip = async () => {
      if (!alive) return;
      /* jump up + full 360 rotation */
      await controls.start({
        y:      [0, -95, 0],
        rotate: [0, -360, -360],
        transition: {
          duration: 0.9,
          times:    [0, 0.48, 1],
          ease:     ["easeOut", "easeIn"],
        },
      });
      /* snap rotation back without transition */
      await controls.set({ rotate: 0 });
      if (alive) setTimeout(flip, (flipInterval - 0.9) * 1000);
    };

    const t = setTimeout(flip, flipDelay * 1000);
    return () => { alive = false; clearTimeout(t); };
  }, [controls, flipDelay, flipInterval]);

  return (
    <g transform={`translate(${x}, ${groundY})`}>
      <motion.g
        animate={controls}
        initial={{ y: 0, rotate: 0 }}
        style={{ transformOrigin: "0px -36px", cursor: "pointer" }}
        whileHover={{ scale: 1.15 }}
      >
        <Stickman color={color} mode="run" speed={1.1} />
      </motion.g>
    </g>
  );
}
