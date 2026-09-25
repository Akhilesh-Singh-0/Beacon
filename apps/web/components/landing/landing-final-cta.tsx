import Image from "next/image";

import beaconIcon from "@/app/icon.png";

import Reveal from "./reveal";

type SignalIcon = "spark" | "code" | "cube" | "user" | "database";
type OutcomeIcon = "chart" | "bolt" | "shield";

type Signal = {
  label: string;
  icon: SignalIcon;
  tone: "info" | "neutral" | "success" | "muted" | "warning";
};

type Outcome = {
  title: string;
  description: string;
  icon: OutcomeIcon;
  tone: "warning" | "info" | "success";
};

const SIGNALS: Signal[] = [
  { label: "LLM Calls", icon: "spark", tone: "info" },
  { label: "Tool Execution", icon: "code", tone: "neutral" },
  { label: "Agent Steps", icon: "cube", tone: "success" },
  { label: "User Requests", icon: "user", tone: "muted" },
  { label: "System Events", icon: "database", tone: "warning" },
];

const OUTCOMES: Outcome[] = [
  {
    title: "Clearer debugging",
    description: "See where executions go wrong.",
    icon: "chart",
    tone: "warning",
  },
  {
    title: "Faster iteration",
    description: "Understand behavior as you build.",
    icon: "bolt",
    tone: "info",
  },
  {
    title: "More reliable AI systems",
    description: "Reason about complex executions.",
    icon: "shield",
    tone: "success",
  },
];

const LEFT_ANCHORS = [46, 116, 180, 244, 314];
const RIGHT_ANCHORS = [72, 180, 288];

function SignalIcon({ type }: { type: SignalIcon }) {
  if (type === "spark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M12 2 14.2 9.8 22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "code") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "cube") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle
          cx="12"
          cy="8"
          r="3.2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M5.5 20c.9-3.6 3-5.4 6.5-5.4s5.6 1.8 6.5 5.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <ellipse
        cx="12"
        cy="6.5"
        rx="6"
        ry="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6 6.5v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5M6 11.5v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function OutcomeIcon({ type }: { type: OutcomeIcon }) {
  if (type === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M5 19V11M12 19V6M19 19V3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "bolt") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path d="m13 2-8 11h6l-1 9 8-11h-6l1-9Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 3 20 6v5.5c0 4.8-3.3 7.9-8 9.5-4.7-1.6-8-4.7-8-9.5V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getTone(tone: Signal["tone"] | Outcome["tone"]) {
  switch (tone) {
    case "info":
      return {
        color: "var(--beacon-info)",
        background:
          "color-mix(in srgb, var(--beacon-info) 9%, var(--beacon-surface))",
        iconBackground:
          "color-mix(in srgb, var(--beacon-info) 11%, transparent)",
        border:
          "color-mix(in srgb, var(--beacon-info) 20%, var(--beacon-border))",
      };

    case "success":
      return {
        color: "var(--beacon-success)",
        background:
          "color-mix(in srgb, var(--beacon-success) 8%, var(--beacon-surface))",
        iconBackground:
          "color-mix(in srgb, var(--beacon-success) 11%, transparent)",
        border:
          "color-mix(in srgb, var(--beacon-success) 20%, var(--beacon-border))",
      };

    case "warning":
      return {
        color: "var(--beacon-warning)",
        background:
          "color-mix(in srgb, var(--beacon-warning) 8%, var(--beacon-surface))",
        iconBackground:
          "color-mix(in srgb, var(--beacon-warning) 11%, transparent)",
        border:
          "color-mix(in srgb, var(--beacon-warning) 20%, var(--beacon-border))",
      };

    default:
      return {
        color: "var(--beacon-text-secondary)",
        background:
          "color-mix(in srgb, var(--beacon-text-secondary) 5%, var(--beacon-surface))",
        iconBackground:
          "color-mix(in srgb, var(--beacon-text-secondary) 6%, transparent)",
        border:
          "color-mix(in srgb, var(--beacon-text-secondary) 14%, var(--beacon-border))",
      };
  }
}

function SignalCard({ item }: { item: Signal }) {
  const tone = getTone(item.tone);

  return (
    <div
      className="group flex h-[56px] items-center rounded-xl border px-3.5 transition-all duration-200 hover:-translate-x-1 hover:brightness-[0.985] dark:hover:brightness-110"
      style={{
        backgroundColor: tone.background,
        borderColor: tone.border,
      }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
        style={{
          color: tone.color,
          backgroundColor: tone.iconBackground,
          border: `1px solid ${tone.border}`,
        }}
      >
        <SignalIcon type={item.icon} />
      </span>

      <span className="ml-3 text-[12px] font-medium text-[var(--beacon-text)]">
        {item.label}
      </span>
    </div>
  );
}

function OutcomeCard({ item }: { item: Outcome }) {
  const tone = getTone(item.tone);

  return (
    <div
      className="grid min-h-[78px] grid-cols-[40px_minmax(0,1fr)] items-center gap-3.5 rounded-xl border px-4 py-3.5 transition-all duration-200 hover:translate-x-1 hover:brightness-[0.985] dark:hover:brightness-110"
      style={{
        backgroundColor: tone.background,
        borderColor: tone.border,
      }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-[10px]"
        style={{
          color: tone.color,
          backgroundColor: tone.iconBackground,
          border: `1px solid ${tone.border}`,
        }}
      >
        <OutcomeIcon type={item.icon} />
      </span>

      <div className="min-w-0">
        <p className="text-[12px] font-semibold leading-5 text-[var(--beacon-text)]">
          {item.title}
        </p>

        <p className="mt-1 text-[10px] leading-[1.4] text-[var(--beacon-text-muted)]">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function BeaconCore() {
  return (
    <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--beacon-bg)]">
      <span className="absolute -inset-3 rounded-full bg-blue-400/10 blur-xl dark:bg-blue-400/[0.06]" />
      <span className="absolute inset-0 rounded-full border border-blue-400/50 shadow-[0_0_24px_rgba(96,165,250,0.16)] dark:border-blue-400/40" />
      <span className="absolute inset-[4px] rounded-full border border-blue-400/20" />

      <span className="relative z-10 block h-[54px] w-[54px] overflow-hidden rounded-full">
        <Image
          src={beaconIcon}
          alt="Beacon"
          fill
          sizes="54px"
          priority
          className="object-contain"
        />
      </span>
    </div>
  );
}

function DesktopNetwork() {
  return (
    <div className="relative mx-auto hidden h-[380px] w-full max-w-[1700px] lg:block">
      <svg
        aria-hidden="true"
        viewBox="0 0 1700 380"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="network-left" x1="0" x2="1">
            <stop offset="0" stopColor="#60A5FA" stopOpacity="0" />
            <stop offset="0.72" stopColor="#60A5FA" stopOpacity="0.3" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="network-right" x1="1" x2="0">
            <stop offset="0" stopColor="#60A5FA" stopOpacity="0" />
            <stop offset="0.72" stopColor="#60A5FA" stopOpacity="0.3" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="network-glow">
            <stop offset="0" stopColor="#2563EB" stopOpacity="0.14" />
            <stop offset="0.6" stopColor="#2563EB" stopOpacity="0.04" />
            <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          cx="850"
          cy="190"
          rx="300"
          ry="145"
          fill="url(#network-glow)"
        />

        {LEFT_ANCHORS.map((y, index) => {
          const path = `M190 ${y} C390 ${y} 545 ${
            190 + (y - 190) * 0.3
          } 690 190`;

          return (
            <g key={`left-${index}`}>
              <path
                d={path}
                stroke="url(#network-left)"
                strokeWidth={index === 2 ? 1.3 : 1}
              />

              <circle
                r="2.2"
                fill={index === 1 || index === 3 ? "#A78BFA" : "#60A5FA"}
              >
                <animateMotion
                  dur={`${2.2 + index * 0.14}s`}
                  begin={`${index * 0.2}s`}
                  repeatCount="indefinite"
                  path={path}
                />
              </circle>
            </g>
          );
        })}

        {RIGHT_ANCHORS.map((y, index) => {
          const path = `M1010 190 C1160 ${
            190 + (y - 190) * 0.3
          } 1300 ${y} 1510 ${y}`;

          return (
            <g key={`right-${index}`}>
              <path
                d={path}
                stroke="url(#network-right)"
                strokeWidth={index === 1 ? 1.3 : 1}
              />

              <circle
                r="2.2"
                fill={index === 1 ? "#A78BFA" : "#60A5FA"}
              >
                <animateMotion
                  dur={`${2.3 + index * 0.16}s`}
                  begin={`${0.25 + index * 0.32}s`}
                  repeatCount="indefinite"
                  path={path}
                />
              </circle>
            </g>
          );
        })}

        <path
          d="M690 190H1010"
          stroke="#60A5FA"
          strokeOpacity="0.65"
          strokeWidth="1"
        />
      </svg>

      <div className="absolute left-0 top-1/2 w-[180px] -translate-y-1/2">
        <div className="flex flex-col gap-[18px]">
          {SIGNALS.map((signal) => (
            <SignalCard key={signal.label} item={signal} />
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <BeaconCore />

        <div className="absolute left-1/2 top-[calc(100%+14px)] flex -translate-x-1/2 flex-col items-center whitespace-nowrap">
          <span className="text-[19px] font-semibold tracking-[-0.035em] text-[var(--beacon-text)]">
            Beacon
          </span>

          <span className="mt-1 text-center text-[6px] font-medium uppercase leading-[1.5] tracking-[0.34em] text-blue-500/60 dark:text-blue-300/60">
            Observability
            <br />
            for AI
          </span>
        </div>
      </div>

      <div className="absolute right-0 top-1/2 w-[220px] -translate-y-1/2">
        <div className="flex flex-col gap-[30px]">
          {OUTCOMES.map((outcome) => (
            <OutcomeCard key={outcome.title} item={outcome} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileNetwork() {
  return (
    <div className="mx-auto mt-10 w-full max-w-[520px] lg:hidden">
      <div className="grid gap-2.5 sm:grid-cols-2">
        {SIGNALS.map((signal) => (
          <SignalCard key={signal.label} item={signal} />
        ))}
      </div>

      <div className="my-10 flex flex-col items-center">
        <BeaconCore />

        <span className="mt-3.5 text-[21px] font-semibold tracking-[-0.035em] text-[var(--beacon-text)]">
          Beacon
        </span>

        <span className="mt-1 text-center text-[7px] font-medium uppercase tracking-[0.34em] text-blue-500/60 dark:text-blue-300/60">
          Observability for AI
        </span>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {OUTCOMES.map((outcome) => (
          <OutcomeCard key={outcome.title} item={outcome} />
        ))}
      </div>
    </div>
  );
}

export default function LandingFinalCta() {
  return (
    <section
      id="final-cta"
      className="relative w-full overflow-hidden bg-[var(--beacon-bg)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--beacon-primary)_6%,transparent)_1px,transparent_0)] [background-size:32px_32px]"
      />

      <div className="relative mx-auto w-full max-w-[1700px] px-5 sm:px-8 lg:px-12">
        <Reveal variant="scale">
          <div className="py-[clamp(72px,7vw,112px)]">
            <DesktopNetwork />
            <MobileNetwork />
          </div>
        </Reveal>
      </div>
    </section>
  );
}