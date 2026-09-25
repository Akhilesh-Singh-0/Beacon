"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import BeaconLogo from "./beacon-logo";
import LandingContainer from "./landing-container";

const NAV_ITEMS = [
  { label: "Product", href: "#product" },
  { label: "Docs", href: "#docs" },
  { label: "Help", href: "#help" },
];

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.65 1.24 3.3.95.1-.73.39-1.24.72-1.53-2.51-.29-5.15-1.26-5.15-5.61 0-1.24.44-2.25 1.16-3.05-.12-.29-.5-1.45.11-3.02 0 0 .95-.31 3.11 1.17a10.8 10.8 0 0 1 5.66 0c2.16-1.48 3.1-1.17 3.1-1.17.62 1.57.23 2.73.12 3.02.72.8 1.15 1.81 1.15 3.05 0 4.36-2.65 5.31-5.17 5.59.41.36.77 1.07.77 2.16v3.2c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-[18px] w-5">
      <span
        className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all duration-200 ${
          open ? "top-[8px] rotate-45" : "top-[2px]"
        }`}
      />

      <span
        className={`absolute left-0 top-[8px] h-[1.5px] w-5 rounded-full bg-current transition-opacity duration-150 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />

      <span
        className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all duration-200 ${
          open ? "top-[8px] -rotate-45" : "top-[14px]"
        }`}
      />
    </span>
  );
}

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("beacon-theme");

    const isDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = () => {
      if (mediaQuery.matches) {
        setMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;

    setDark(nextDark);
    localStorage.setItem("beacon-theme", nextDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", nextDark);
  }

  return (
    <div className="relative z-50 pt-6 sm:pt-8">
      <LandingContainer>
        <header
          className="
            w-full rounded-[20px]
            border border-[#e2e2df]
            bg-[#f0f0ee]
            shadow-[0_8px_24px_rgba(24,24,24,0.035)]
            backdrop-blur-2xl

            dark:border-white/[0.09]
            dark:bg-[#0B0E13]/88
            dark:shadow-[0_16px_50px_rgba(0,0,0,0.24)]
          "
        >
          <div className="hidden min-h-[68px] grid-cols-[1fr_auto_1fr] items-center gap-8 px-5 py-3 lg:grid">
            <BeaconLogo size="md" />

            <nav aria-label="Primary navigation">
              <div className="flex items-center gap-8">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative inline-flex min-h-10 items-center justify-center rounded-lg px-2.5 text-[13px] font-medium text-[var(--beacon-text-secondary)] transition-all duration-200 hover:bg-black/[0.035] hover:text-[var(--beacon-text)] dark:text-zinc-400 dark:hover:bg-white/[0.035] dark:hover:text-zinc-100"
                  >
                    {item.label}

                    <span className="absolute bottom-1 left-2.5 right-2.5 h-[2px] origin-center scale-x-0 rounded-full bg-[var(--beacon-primary)] transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
                ))}
              </div>
            </nav>

            <div className="flex items-center justify-end gap-4">
              <a
                href="https://github.com/Akhilesh-Singh-0/Beacon"
                target="_blank"
                rel="noreferrer"
                aria-label="Beacon GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--beacon-text-secondary)] transition-all duration-200 hover:bg-black/[0.035] hover:text-[var(--beacon-text)] dark:text-zinc-500 dark:hover:bg-white/[0.035] dark:hover:text-zinc-100"
              >
                <GithubIcon />
              </a>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  dark ? "Switch to light mode" : "Switch to dark mode"
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--beacon-text-secondary)] transition-all duration-200 hover:bg-black/[0.035] hover:text-[var(--beacon-text)] dark:text-zinc-500 dark:hover:bg-white/[0.035] dark:hover:text-zinc-100"
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>

              <Link
                href="/sign-in"
                className="flex h-9 items-center justify-center rounded-lg px-2 text-[13px] font-medium text-[var(--beacon-text-secondary)] transition-all duration-200 hover:bg-black/[0.04] hover:text-[var(--beacon-text)] dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-100"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="flex min-h-[62px] items-center justify-between px-3.5 py-3 lg:hidden">
            <BeaconLogo size="sm" />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  dark ? "Switch to light mode" : "Switch to dark mode"
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--beacon-text-secondary)] transition-colors hover:bg-black/[0.05] hover:text-[var(--beacon-text)] dark:text-zinc-500 dark:hover:bg-white/[0.05] dark:hover:text-zinc-100"
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>

              <button
                type="button"
                aria-label={
                  menuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e2e2df] bg-[#e9e9e7] text-[var(--beacon-text-secondary)] transition-colors hover:bg-[#e4e4e2] hover:text-[var(--beacon-text)] dark:border-white/[0.1] dark:bg-white/[0.025] dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-zinc-100"
              >
                <MenuIcon open={menuOpen} />
              </button>
            </div>
          </div>

          <div
            className={`absolute right-0 top-[calc(100%+10px)] w-[min(320px,calc(100vw-32px))] transition-all duration-200 lg:hidden ${
              menuOpen
                ? "visible translate-y-0 opacity-100"
                : "pointer-events-none invisible -translate-y-2 opacity-0"
            }`}
          >
            <div className="rounded-2xl border border-[#e2e2df] bg-[#f0f0ee] p-2 shadow-[0_24px_60px_rgba(24,24,24,0.12)] backdrop-blur-2xl dark:border-white/[0.09] dark:bg-[#0B0E13]/97 dark:shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
              <nav aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-xl px-3.5 text-[14px] font-medium text-[var(--beacon-text-secondary)] transition-colors hover:bg-black/[0.04] hover:text-[var(--beacon-text)] dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-[#e2e2df] dark:bg-white/[0.06]" />

                <a
                  href="https://github.com/Akhilesh-Singh-0/Beacon"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3.5 text-[14px] font-medium text-[var(--beacon-text-secondary)] transition-colors hover:bg-black/[0.04] hover:text-[var(--beacon-text)] dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-100"
                >
                  GitHub
                </a>

                <Link
                  href="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3.5 text-[14px] font-medium text-[var(--beacon-text-secondary)] transition-colors hover:bg-black/[0.04] hover:text-[var(--beacon-text)] dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-100"
                >
                  Sign in
                </Link>
              </nav>
            </div>
          </div>
        </header>
      </LandingContainer>
    </div>
  );
}