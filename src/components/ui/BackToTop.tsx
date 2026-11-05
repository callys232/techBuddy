"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowUp } from "@tabler/icons-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{   scale: 0.9 }}
          className="fixed bottom-5 right-22 sm:right-24 z-[990] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]/60 shadow-lg hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
        >
          <IconArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
