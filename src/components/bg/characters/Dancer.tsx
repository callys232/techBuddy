"use client";

import { motion } from "framer-motion";
import { Stickman } from "./Stickman";

interface Props {
  x: number;
  groundY: number;
  color?: string;
}

export function Dancer({ x, groundY, color = "#38BDF8" }: Props) {
  return (
    <motion.g
      transform={`translate(${x}, ${groundY})`}
      animate={{ y: [0, -10, 0, -7, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.2 }}
      style={{ cursor: "pointer" }}
    >
      {/* Spotlight glow under dancer */}
      <ellipse cx="0" cy="2" rx="28" ry="6"
        fill={color} opacity="0.12" />
      <Stickman color={color} mode="dance" speed={0.85} />
    </motion.g>
  );
}
