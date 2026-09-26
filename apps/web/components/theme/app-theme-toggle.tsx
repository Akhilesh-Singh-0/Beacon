"use client";

import { useEffect, useState } from "react";

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M12 2.5V4M12 20V21.5M21.5 12H20M4 12H2.5M18.72 5.28L17.66 6.34M6.34 17.66L5.28 18.72M18.72 18.72L17.66 17.66M6.34 6.34L5.28 5.28"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AppThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem("beacon-app-theme");

    const isDark =
      stored === "dark" ||
      (!stored &&
        window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches);

    setDark(isDark);
    document.documentElement.classList.toggle(
      "dark",
      isDark,
    );
  }, []);

  function toggleTheme() {
    const nextDark = !dark;

    setDark(nextDark);

    localStorage.setItem(
      "beacon-app-theme",
      nextDark ? "dark" : "light",
    );

    document.documentElement.classList.toggle(
      "dark",
      nextDark,
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--app-text-secondary)] transition-all duration-200 hover:bg-black/[0.035] hover:text-[var(--app-text)] dark:hover:bg-white/[0.035] dark:hover:text-[var(--app-text)]"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}