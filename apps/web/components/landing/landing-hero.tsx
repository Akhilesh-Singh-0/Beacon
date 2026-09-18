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

export default function LandingHero() {
  return (
    <section
      id="product"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          height: "760px",
          background:
            "radial-gradient(circle at 50% 30%, rgba(37,99,235,0.10), transparent 34%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          height: "760px",
          opacity: 0.4,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(96,165,250,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.028) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />

      <LandingContainer>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "clamp(88px, 9vw, 136px)",
            paddingBottom: "clamp(80px, 8vw, 120px)",
          }}
        >
          {/* Hero copy */}
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              marginInline: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Eyebrow */}
            <div
              className="inline-flex items-center rounded-full border border-blue-400/15 bg-blue-400/[0.05] text-blue-200/80 shadow-[0_0_30px_rgba(37,99,235,0.05)]"
              style={{
                minHeight: "32px",
                paddingInline: "14px",
                gap: "8px",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.7)]" />

              <span className="text-[11px] font-medium tracking-[0.02em]">
                Open-source observability for AI agents
              </span>

              <span className="text-zinc-700">·</span>

              <span className="hidden text-[11px] text-zinc-500 sm:inline">
                See every step as it happens
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-semibold tracking-[-0.055em] text-zinc-50"
              style={{
                marginTop: "28px",
                maxWidth: "860px",
                fontSize:
                  "clamp(52px, 6.4vw, 84px)",
                lineHeight: 0.98,
              }}
            >
              See what your
              <span className="block text-blue-500">
                AI agents are doing.
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-zinc-400"
              style={{
                marginTop: "28px",
                maxWidth: "680px",
                fontSize:
                  "clamp(16px, 1.35vw, 18px)",
                lineHeight: 1.75,
              }}
            >
              Beacon turns agent executions into live, inspectable traces.
              Follow every tool call, model decision, and execution path as it
              happens.
            </p>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "36px",
              }}
            >
              <Link
                href="/sign-up"
                className="group inline-flex h-12 min-w-[142px] items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-[14px] font-medium text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] transition-all duration-200 hover:bg-[#3B82F6] hover:shadow-[0_14px_36px_rgba(37,99,235,0.3)]"
              >
                <span>Get Started</span>
                <ArrowIcon />
              </Link>

              <Link
                href="/runs"
                className="inline-flex h-12 min-w-[142px] items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-5 text-[14px] font-medium text-zinc-300 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.045] hover:text-zinc-100"
              >
                <GithubIcon />
                <span>Explore runs</span>
              </Link>
            </div>
          </div>

          {/* Product visualization */}
          <div
            style={{
              width: "100%",
              maxWidth: "1180px",
              marginInline: "auto",
              marginTop: "clamp(80px, 8vw, 112px)",
            }}
          >
            <HeroVisual />
          </div>

          {/* Section marker */}
          <div
            className="flex items-center justify-center text-[10px] uppercase tracking-[0.18em] text-zinc-600"
            style={{
              gap: "16px",
              marginTop: "24px",
            }}
          >
            <span className="h-px w-10 bg-white/[0.08]" />

            Real-time execution visibility

            <span className="h-px w-10 bg-white/[0.08]" />
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}