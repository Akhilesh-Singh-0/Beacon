"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import BeaconLogo from "./beacon-logo";
import LandingContainer from "./landing-container";

const NAV_ITEMS = [
  { label: "Product", href: "#product" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Docs", href: "#docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
];

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.65 1.24 3.3.95.1-.73.39-1.24.72-1.53-2.51-.29-5.15-1.26-5.15-5.61 0-1.24.44-2.25 1.16-3.05-.12-.29-.5-1.45.11-3.02 0 0 .95-.31 3.11 1.17a10.8 10.8 0 0 1 5.66 0c2.16-1.48 3.1-1.17 3.1-1.17.62 1.57.23 2.73.12 3.02.72.8 1.15 1.81 1.15 3.05 0 4.36-2.65 5.31-5.17 5.59.41.36.77 1.07.77 2.16v3.2c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path
        d="M4.5 11.5L11.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M6.5 4.5H11.5V9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative block h-[18px] w-5"
    >
      <span
        className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all duration-200 ${
          open
            ? "top-[8px] rotate-45"
            : "top-[2px]"
        }`}
      />

      <span
        className={`absolute left-0 top-[8px] h-[1.5px] w-5 rounded-full bg-current transition-opacity duration-150 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />

      <span
        className={`absolute left-0 h-[1.5px] w-5 rounded-full bg-current transition-all duration-200 ${
          open
            ? "top-[8px] -rotate-45"
            : "top-[14px]"
        }`}
      />
    </span>
  );
}

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 1024px)",
    );

    const handleViewportChange = () => {
      if (mediaQuery.matches) {
        setMenuOpen(false);
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleViewportChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleViewportChange,
      );
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [menuOpen]);

  return (
    <div
      className="relative z-50"
      style={{
        paddingTop: "32px",
      }}
    >
      <LandingContainer>
        <header
          style={{
            position: "relative",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "20px",
            background: "rgba(11,14,19,0.88)",
            boxShadow:
              "0 16px 50px rgba(0,0,0,0.24)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Desktop */}
          <div
            className="hidden lg:grid"
            style={{
              minHeight: "72px",
              gridTemplateColumns:
                "auto minmax(0, 1fr) auto",
              alignItems: "center",
              columnGap: "32px",
              padding: "12px 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Brand */}
            <div className="shrink-0">
              <BeaconLogo size="md" />
            </div>

            {/* Navigation */}
            <nav aria-label="Primary navigation">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "32px",
                }}
              >
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-lg px-2.5 text-[14px] font-medium text-zinc-400 transition-all duration-200 hover:bg-white/[0.035] hover:text-zinc-100"
                  >
                    {item.label}

                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 left-2.5 right-2.5 h-[2px] origin-center scale-x-0 rounded-full bg-[#60A5FA] transition-transform duration-200 ease-out group-hover:scale-x-100"
                    />
                  </Link>
                ))}
              </div>
            </nav>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "28px",
                flexShrink: 0,
              }}
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Beacon GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 hover:bg-white/[0.035] hover:text-zinc-100"
              >
                <GithubIcon />
              </a>

              <Link
                href="/sign-in"
                className="flex h-10 items-center justify-center rounded-lg px-1 text-[14px] font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="group flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#2563EB] px-5 text-[14px] font-medium text-white shadow-[0_8px_26px_rgba(37,99,235,0.24)] transition-all duration-200 hover:bg-[#3B82F6] hover:shadow-[0_10px_32px_rgba(37,99,235,0.3)]"
                style={{
                  minWidth: "136px",
                }}
              >
                <span>Get Started</span>
                <ArrowUpRightIcon />
              </Link>
            </div>
          </div>

          {/* Mobile / tablet */}
          <div
            className="flex lg:hidden"
            style={{
              minHeight: "64px",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "12px 14px",
              boxSizing: "border-box",
            }}
          >
            <BeaconLogo size="sm" />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <Link
                href="/sign-up"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-[#2563EB] px-4 text-[12px] font-medium text-white transition-colors duration-200 hover:bg-[#3B82F6] max-[380px]:hidden"
                style={{
                  height: "40px",
                  minWidth: "112px",
                }}
              >
                Get Started
              </Link>

              <button
                type="button"
                aria-label={
                  menuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={menuOpen}
                onClick={() =>
                  setMenuOpen(
                    (open) => !open,
                  )
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.025] text-zinc-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-zinc-100"
              >
                <MenuIcon open={menuOpen} />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            aria-hidden={!menuOpen}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width:
                "min(320px, calc(100vw - 32px))",
              opacity: menuOpen ? 1 : 0,
              visibility: menuOpen
                ? "visible"
                : "hidden",
              transform: menuOpen
                ? "translateY(0)"
                : "translateY(-8px)",
              transformOrigin: "top right",
              transition:
                "opacity 180ms ease, transform 180ms ease, visibility 180ms ease",
              pointerEvents: menuOpen
                ? "auto"
                : "none",
            }}
          >
            <div
              style={{
                padding: "8px",
                border:
                  "1px solid rgba(255,255,255,0.09)",
                borderRadius: "16px",
                background:
                  "rgba(11,14,19,0.97)",
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.42)",
                backdropFilter:
                  "blur(24px)",
                WebkitBackdropFilter:
                  "blur(24px)",
              }}
            >
              <nav aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="flex min-h-11 items-center rounded-xl px-3.5 text-[14px] font-medium text-zinc-400 transition-colors duration-150 hover:bg-white/[0.04] hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-white/[0.06]" />

                <Link
                  href="/sign-in"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="flex min-h-11 items-center rounded-xl px-3.5 text-[14px] font-medium text-zinc-400 transition-colors duration-150 hover:bg-white/[0.04] hover:text-zinc-100"
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