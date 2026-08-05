"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Cycles through `words`, sliding the next one up into place. Colored via
 *  the brand accent so the headline reads as one animated, colored phrase
 *  rather than a static line. */
export function RotatingWord({ words, intervalMs = 2200 }: { words: string[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  return (
    <span
      className="relative inline-grid align-bottom overflow-hidden"
      style={{ verticalAlign: "-0.08em" }}
    >
      {/* Reserves width for the longest word so surrounding text doesn't reflow */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap pointer-events-none" aria-hidden>
        {words.reduce((longest, w) => (w.length > longest.length ? w : longest), "")}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "0.6em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.6em", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap text-[var(--brand)]"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
