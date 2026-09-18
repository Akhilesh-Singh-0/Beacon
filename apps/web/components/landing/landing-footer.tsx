import type { ReactNode } from "react";
import Link from "next/link";

import BeaconLogo from "./beacon-logo";
import LandingContainer from "./landing-container";

const PRODUCT_LINKS = [
  { label: "Features", href: "#product" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
];

const DEVELOPER_LINKS = [
  { label: "Quick Start", href: "#docs" },
  { label: "API Reference", href: "#api" },
  { label: "SDKs", href: "#sdks" },
  { label: "Examples", href: "#examples" },
  { label: "Integrations", href: "#integrations" },
];

const COMPANY_LINKS = [
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
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

function TwitterIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.9-6.41L6.45 22H3.34l7.24-8.28L2.8 2h6.4l4.43 5.86L18.9 2Zm-1.1 17.66h1.73L8.29 4.26H6.43L17.8 19.66Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M5.23 3.5a2.15 2.15 0 1 1 0 4.3 2.15 2.15 0 0 1 0-4.3ZM3.4 9h3.66v11.5H3.4V9Zm5.94 0h3.51v1.57h.05c.49-.92 1.68-1.9 3.46-1.9 3.7 0 4.38 2.44 4.38 5.62v6.21h-3.66v-5.51c0-1.32-.03-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93v5.6H9.34V9Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M23.5 6.2a2.98 2.98 0 0 0-2.1-2.11C19.56 3.6 12 3.6 12 3.6s-7.56 0-9.4.49A2.98 2.98 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 2.98 2.98 0 0 0 2.1 2.11c1.84.49 9.4.49 9.4.49s7.56 0 9.4-.49a2.98 2.98 0 0 0 2.1-2.11A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.75v-7.5L16 12l-6.4 3.75Z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.3 4.52A19.8 19.8 0 0 0 15.5 3l-.6 1.2a18 18 0 0 0-5.8 0L8.5 3a19.8 19.8 0 0 0-4.8 1.52C.66 9.06-.18 13.5.24 17.87A19.9 19.9 0 0 0 6.1 20.84l1.42-1.96a12.6 12.6 0 0 1-2.23-1.07l.54-.4c4.3 2.02 8.99 2.02 13.24 0l.55.4c-.72.43-1.47.79-2.24 1.07l1.42 1.96a19.9 19.9 0 0 0 5.87-2.97c.49-5.07-.84-9.47-4.37-13.35ZM8.3 15.08c-1.3 0-2.37-1.2-2.37-2.67s1.04-2.68 2.37-2.68c1.34 0 2.4 1.2 2.37 2.68 0 1.47-1.04 2.67-2.37 2.67Zm7.4 0c-1.3 0-2.37-1.2-2.37-2.67s1.04-2.68 2.37-2.68c1.34 0 2.4 1.2 2.37 2.68 0 1.47-1.04 2.67-2.37 2.67Z" />
    </svg>
  );
}

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
        d="M3.5 8h9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="m8.5 4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-blue-300/60">
        {title}
      </p>

      <nav className="mt-6 flex flex-col gap-3.5">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="w-fit text-[13px] leading-5 text-zinc-500 transition-colors duration-200 hover:text-zinc-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-200/55 transition-all duration-200 hover:bg-blue-400/[0.06] hover:text-blue-200"
    >
      {children}
    </a>
  );
}

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[#050A10]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.055), transparent 52%)",
        }}
      />

      <LandingContainer>
        <div
          className="relative"
          style={{
            paddingTop: "clamp(72px, 7vw, 104px)",
            paddingBottom: "clamp(38px, 4vw, 56px)",
          }}
        >
          <div className="grid gap-14 xl:grid-cols-[1.2fr_0.72fr_0.72fr_0.72fr_1.15fr] xl:gap-12">
            {/* Brand */}
            <div className="max-w-[360px]">
              <BeaconLogo size="lg" />

              <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.3em] text-blue-200/55">
                Observability for AI
              </p>

              <p className="mt-6 max-w-[340px] text-[13px] leading-6 text-zinc-500">
                Open-source observability for AI agents. Trace, visualize,
                and understand every step from tools and LLM calls to
                complex multi-agent workflows.
              </p>

              <div className="mt-6 flex items-center gap-1">
                <SocialLink
                  href="https://github.com"
                  label="Beacon on GitHub"
                >
                  <GithubIcon />
                </SocialLink>

                <SocialLink
                  href="https://x.com"
                  label="Beacon on X"
                >
                  <TwitterIcon />
                </SocialLink>

                <SocialLink
                  href="https://linkedin.com"
                  label="Beacon on LinkedIn"
                >
                  <LinkedinIcon />
                </SocialLink>

                <SocialLink
                  href="https://youtube.com"
                  label="Beacon on YouTube"
                >
                  <YoutubeIcon />
                </SocialLink>

                <SocialLink
                  href="https://discord.com"
                  label="Beacon on Discord"
                >
                  <DiscordIcon />
                </SocialLink>
              </div>
            </div>

            {/* Product */}
            <FooterColumn
              title="Product"
              links={PRODUCT_LINKS}
            />

            {/* Developers */}
            <FooterColumn
              title="Developers"
              links={DEVELOPER_LINKS}
            />

            {/* Company */}
            <FooterColumn
              title="Company"
              links={COMPANY_LINKS}
            />

            {/* Newsletter */}
            <div className="max-w-[380px]">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-blue-300/60">
                Stay in the loop
              </p>

              <p className="mt-5 max-w-[340px] text-[13px] leading-6 text-zinc-500">
                Get product updates, technical deep dives, and useful Beacon
                news.
              </p>

              <form className="mt-6">
                <div className="flex min-h-[48px] overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.02] transition-colors duration-200 focus-within:border-blue-400/30">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="min-w-0 flex-1 bg-transparent px-4 text-[13px] text-zinc-200 outline-none placeholder:text-zinc-600"
                  />

                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="flex w-12 shrink-0 items-center justify-center bg-[#2563EB] text-white transition-colors duration-200 hover:bg-[#3B82F6]"
                  >
                    <ArrowIcon />
                  </button>
                </div>
              </form>

              <p className="mt-3 text-[10px] leading-5 text-zinc-700">
                No spam. Just useful updates.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 border-t border-white/[0.07] pt-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <p className="text-[11px] text-zinc-600">
                © {new Date().getFullYear()} Beacon. All rights reserved.
              </p>

              <div className="hidden items-center justify-center gap-4 text-[8px] uppercase tracking-[0.3em] text-zinc-700 lg:flex">
                <span className="h-px w-10 bg-blue-400/20" />

                <span>
                  A clearer perspective for a brighter AI
                </span>

                <span className="h-px w-10 bg-blue-400/20" />
              </div>

              <nav className="flex items-center gap-5 lg:justify-end">
                <Link
                  href="#privacy"
                  className="text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                >
                  Privacy
                </Link>

                <Link
                  href="#terms"
                  className="text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                >
                  Terms
                </Link>

                <Link
                  href="#security"
                  className="text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                >
                  Security
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </LandingContainer>
    </footer>
  );
}