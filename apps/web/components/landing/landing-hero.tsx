import Link from "next/link";

import HeroVisual from "./hero-visual";
import LandingContainer from "./landing-container";

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3.5 8H12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M8.5 4L12.5 8L8.5 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RunsIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <rect
        x="2.5"
        y="2.5"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 8h6M8 5v6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LandingHero() {
  return (
    <section
      id="product"
      className="relative w-full overflow-hidden bg-[var(--beacon-bg)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[760px] opacity-40 [background-image:linear-gradient(color-mix(in_srgb,var(--foreground)_3%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--foreground)_3%,transparent)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_85%)]"
      />

      <LandingContainer>
        <div className="relative flex flex-col items-center pb-[clamp(80px,8vw,120px)] pt-[clamp(88px,9vw,136px)]">
          <div className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
            <div className="beacon-reveal beacon-reveal-1 inline-flex min-h-8 items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--beacon-info)_24%,var(--border))] bg-[color-mix(in_srgb,var(--beacon-info)_5%,transparent)] px-3.5 text-[color-mix(in_srgb,var(--beacon-info)_78%,var(--foreground))]">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[var(--beacon-info)]"
              />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
                Real-time observability for AI agents
              </span>
            </div>

            <h1 className="beacon-reveal beacon-reveal-2 mt-7 max-w-[900px] font-semibold text-[clamp(52px,6.4vw,84px)] leading-[0.98] tracking-[-0.055em] text-[var(--beacon-text)]">
              Turn your AI agents
              <span className="block bg-gradient-to-r from-[#a89bea] via-[#b9aaf2] to-[#8dd9d0] bg-clip-text text-transparent">
                into clear insights.
              </span>
            </h1>

            <p className="beacon-reveal beacon-reveal-3 mt-7 max-w-[680px] text-[clamp(16px,1.35vw,18px)] leading-[1.75] text-[var(--beacon-text-secondary)]">
              Beacon turns agent executions into live, inspectable traces.
              Follow every tool call, model decision, and execution path as it
              happens.
            </p>

            <div className="beacon-reveal beacon-reveal-4 mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/sign-up"
                className="group inline-flex h-12 min-w-[142px] items-center justify-center gap-2 rounded-xl border border-violet-300 bg-violet-200 px-5 text-[14px] font-medium text-violet-950 shadow-[0_8px_24px_rgba(124,110,200,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-300 dark:border-violet-400/25 dark:bg-violet-400/15 dark:text-violet-100 dark:hover:bg-violet-400/20"
              >
                <span>Get Started</span>
                <ArrowIcon />
              </Link>

              <Link
                href="/runs"
                className="inline-flex h-12 min-w-[142px] items-center justify-center gap-2 rounded-xl border border-[var(--beacon-border)] bg-[var(--beacon-surface)] px-5 text-[14px] font-medium text-[var(--beacon-text-secondary)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--beacon-border-strong)] hover:bg-[var(--beacon-surface-raised)] hover:text-[var(--beacon-text)]"
              >
                <RunsIcon />
                <span>Explore runs</span>
              </Link>
            </div>
          </div>

          <div className="beacon-reveal beacon-reveal-5 mx-auto mt-[clamp(80px,8vw,112px)] w-full max-w-[1180px]">
            <HeroVisual />
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}