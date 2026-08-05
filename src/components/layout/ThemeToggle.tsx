"use client";

import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] transition-colors duration-200 hover:border-[var(--brand)] hover:text-[var(--brand)] active:scale-95"
    >
      {theme === "dark" ? (
        <IconSun size={17} stroke={1.5} />
      ) : (
        <IconMoon size={17} stroke={1.5} />
      )}
    </button>
  );
}
