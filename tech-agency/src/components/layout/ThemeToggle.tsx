"use client";

import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-[0_0_12px_rgba(0,229,192,0.3)] active:scale-95"
    >
      {theme === "dark" ? (
        <IconSun size={17} stroke={1.5} />
      ) : (
        <IconMoon size={17} stroke={1.5} />
      )}
    </button>
  );
}
