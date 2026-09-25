import Link from "next/link";

import BeaconLogo from "./beacon-logo";
import LandingContainer from "./landing-container";

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[18px] w-[18px]"
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.65 1.24 3.3.95.1-.73.39-1.24.72-1.53-2.51-.29-5.15-1.26-5.15-5.61 0-1.24.44-2.25 1.16-3.05-.12-.29-.5-1.45.11-3.02 0 0 .95-.31 3.11 1.17a10.8 10.8 0 0 1 5.66 0c2.16-1.48 3.1-1.17 3.1-1.17.62 1.57.23 2.73.12 3.02.72.8 1.15 1.81 1.15 3.05 0 4.36-2.65 5.31-5.17 5.59.41.36.77 1.07.77 2.16v3.2c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="h-3.5 w-3.5"
    >
      <path
        d="M4 12 12 4M6 4h6v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PRODUCT_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Runs", href: "/runs" },
];

const DEVELOPER_LINKS = [
  { label: "Docs", href: "#docs" },
  { label: "Get Started", href: "/sign-up" },
];

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-[var(--beacon-bg)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--beacon-primary)_6%,transparent)_1px,transparent_0)] [background-size:32px_32px]"
      />

      <LandingContainer>
        <div className="relative py-[clamp(64px,7vw,96px)]">
          <div className="grid gap-14 lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr] lg:gap-16">
            <div className="max-w-[390px]">
              <BeaconLogo size="lg" />

              <p className="mt-5 max-w-[360px] text-[14px] leading-6 text-[var(--beacon-text-secondary)]">
                Real-time observability for AI agents. Understand what your
                agents are doing, step by step.
              </p>

              <a
                href="https://github.com/Akhilesh-Singh-0/Beacon"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[var(--beacon-border)] bg-[var(--beacon-surface)] px-3.5 py-2 text-[12px] font-medium text-[var(--beacon-text-secondary)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--beacon-border-strong)] hover:bg-[var(--beacon-surface-raised)] hover:text-[var(--beacon-text)]"
              >
                <GithubIcon />
                <span>GitHub</span>
                <ArrowUpRightIcon />
              </a>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--beacon-text-muted)]">
                Product
              </p>

              <nav className="mt-5 flex flex-col gap-3">
                {PRODUCT_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="w-fit text-[13px] text-[var(--beacon-text-secondary)] transition-colors duration-200 hover:text-[var(--beacon-text)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--beacon-text-muted)]">
                Developers
              </p>

              <nav className="mt-5 flex flex-col gap-3">
                {DEVELOPER_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="w-fit text-[13px] text-[var(--beacon-text-secondary)] transition-colors duration-200 hover:text-[var(--beacon-text)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="max-w-[280px]">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--beacon-text-muted)]">
                Start building
              </p>

              <p className="mt-5 text-[14px] leading-6 text-[var(--beacon-text-secondary)]">
                Send your first trace to Beacon and see your agent execution
                come to life.
              </p>

              <Link
                href="/sign-up"
                className="mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--beacon-primary)] transition-colors duration-200 hover:brightness-110"
              >
                <span>Get Started</span>
                <ArrowUpRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </LandingContainer>
    </footer>
  );
}