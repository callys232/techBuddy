"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Stickman } from "./Stickman";

interface Props {
  x: number;
  groundY: number;
  color?: string;
  jumpDelay?: number;
  jumpInterval?: number;
  jumpHeight?: number;
}

export function Runner({
  x,
  groundY,
  color = "#F0F8FF",
  jumpDelay = 2,
  jumpInterval = 9,
  jumpHeight = 75,
}: Props) {
  const controls = useAnimation();

  useEffect(() => {
    let alive = true;

    const jump = async () => {
      if (!alive) return;
      await controls.start({
        y: [0, -jumpHeight, 0],
        transition: {
          duration: 0.72,
          times: [0, 0.38, 1],
          ease: ["easeOut", "easeIn"],
        },
      });
      if (alive) setTimeout(jump, (jumpInterval - 0.72) * 1000);
    };

    const t = setTimeout(jump, jumpDelay * 1000);
    return () => { alive = false; clearTimeout(t); };
  }, [controls, jumpDelay, jumpInterval, jumpHeight]);

  return (
    <motion.g
      transform={`translate(${x}, ${groundY})`}
      animate={controls}
      initial={{ y: 0 }}
      whileHover={{ scale: 1.15 }}
      style={{ cursor: "pointer" }}
    >
      <Stickman color={color} mode="run" />
    </motion.g>
  );
}
