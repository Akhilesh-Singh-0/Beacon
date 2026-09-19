import Image from "next/image";
import Link from "next/link";

import beaconIcon from "@/app/beacon-icon.svg";

type SignalIconType =
  | "spark"
  | "code"
  | "cube"
  | "user"
  | "database";

type OutcomeIconType = "chart" | "bolt" | "shield";

type Signal = {
  label: string;
  icon: SignalIconType;
};

type Outcome = {
  title: string;
  description: string;
  icon: OutcomeIconType;
};

const SIGNALS: Signal[] = [
  { label: "LLM Calls", icon: "spark" },
  { label: "Tool Execution", icon: "code" },
  { label: "Agent Steps", icon: "cube" },
  { label: "User Requests", icon: "user" },
  { label: "System Events", icon: "database" },
];

const OUTCOMES: Outcome[] = [
  {
    title: "Clearer debugging",
    description: "See where executions go wrong.",
    icon: "chart",
  },
  {
    title: "Faster iteration",
    description: "Understand behavior as you build.",
    icon: "bolt",
  },
  {
    title: "More reliable AI systems",
    description: "Reason about complex workflows.",
    icon: "shield",
  },
];

const LEFT_ANCHORS = [46, 116, 180, 244, 314];
const RIGHT_ANCHORS = [72, 180, 288];

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
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="m8.5 4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.65 1.24 3.3.95.1-.73.39-1.24.72-1.53-2.51-.29-5.15-1.26-5.15-5.61 0-1.24.44-2.25 1.16-3.05-.12-.29-.5-1.45.11-3.02 0 0 .95-.31 3.11 1.17a10.8 10.8 0 0 1 5.66 0c2.16-1.48 3.1-1.17 3.1-1.17.62 1.57.23 2.73.12 3.02.72.8 1.15 1.81 1.15 3.05 0 4.36-2.65 5.31-5.17 5.59.41.36.77 1.07.77 2.16v3.2c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

function SignalIcon({ type }: { type: SignalIconType }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
  };

  if (type === "spark") {
    return (
      <svg {...common} aria-hidden="true">
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
      <svg {...common} aria-hidden="true">
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
      <svg {...common} aria-hidden="true">
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
      <svg {...common} aria-hidden="true">
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
    <svg {...common} aria-hidden="true">
      <ellipse
        cx="12"
        cy="6.5"
        rx="6"
        ry="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6 6.5v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M6 11.5v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function OutcomeIcon({ type }: { type: OutcomeIconType }) {
  if (type === "chart") {
    return (
      <svg
        aria-hidden="true"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
      >
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
      <svg
        aria-hidden="true"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="m13 2-8 11h6l-1 9 8-11h-6l1-9Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
    >
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

function SignalCard({
  item,
  mobile = false,
}: {
  item: Signal;
  mobile?: boolean;
}) {
  return (
    <div
      className={[
        "flex w-full items-center rounded-xl",
        "border-[1.5px] border-blue-300/[0.14]",
        "bg-[#08131E]/95",
        "shadow-[0_10px_28px_rgba(0,0,0,0.18)]",
        "backdrop-blur-md",
        "transition-all duration-200",
        "hover:border-blue-300/[0.28]",
        "hover:bg-[#0A1722]",
        mobile
          ? "min-h-[62px] px-4"
          : "h-[56px] px-3.5",
      ].join(" ")}
    >
      <span
        className={[
          "flex shrink-0 items-center justify-center rounded-[10px]",
          "border border-blue-400/25",
          "bg-blue-400/[0.055]",
          "text-blue-300",
          mobile ? "h-9 w-9" : "h-8 w-8",
        ].join(" ")}
      >
        <SignalIcon type={item.icon} />
      </span>

      <span
        className={[
          "min-w-0 flex-1 truncate font-medium text-zinc-200",
          mobile ? "ml-3 text-[14px]" : "ml-3 text-[12px]",
        ].join(" ")}
      >
        {item.label}
      </span>
    </div>
  );
}

function OutcomeCard({
  item,
  mobile = false,
}: {
  item: Outcome;
  mobile?: boolean;
}) {
  return (
    <div
      className={[
        "grid w-full min-w-0 grid-cols-[40px_minmax(0,1fr)] items-center",
        "rounded-xl",
        "border-[1.5px] border-blue-300/[0.14]",
        "bg-[#08131E]/95",
        "shadow-[0_10px_28px_rgba(0,0,0,0.18)]",
        "backdrop-blur-md",
        "transition-all duration-200",
        "hover:border-blue-300/[0.28]",
        "hover:bg-[#0A1722]",
        mobile
          ? "min-h-[82px] gap-3 px-4 py-4"
          : "min-h-[78px] gap-3.5 px-4 py-3.5",
      ].join(" ")}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-400/25 bg-blue-400/[0.055] text-blue-300">
        <OutcomeIcon type={item.icon} />
      </span>

      <div className="min-w-0">
        <p
          className={[
            "font-semibold leading-5 text-zinc-100",
            mobile ? "text-[14px]" : "text-[12px]",
          ].join(" ")}
        >
          {item.title}
        </p>

        <p
          className={[
            "mt-1 leading-[1.4] text-zinc-500",
            mobile ? "text-[11px]" : "text-[10px]",
          ].join(" ")}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

function BeaconCore({ mobile = false }: { mobile?: boolean }) {
    const size = mobile ? 82 : 84;
    const imageSize = mobile ? 60 : 62;
  
    return (
      <div
        className="beacon-core relative flex items-center justify-center rounded-full bg-[#06101A]"
        style={{
          width: size,
          height: size,
        }}
      >
        <span
          aria-hidden="true"
          className="beacon-core-glow pointer-events-none absolute inset-[-16px] rounded-full"
        />
  
        <span
          aria-hidden="true"
          className="beacon-core-ring pointer-events-none absolute inset-0 rounded-full"
        />
  
        <span
          aria-hidden="true"
          className="beacon-core-ring-secondary pointer-events-none absolute inset-[5px] rounded-full"
        />
  
        <span
          className="relative z-10 block overflow-hidden rounded-full"
          style={{
            width: imageSize,
            height: imageSize,
          }}
        >
          <Image
            src={beaconIcon}
            alt="Beacon"
            fill
            sizes={`${imageSize}px`}
            priority
            unoptimized
            className="beacon-core-image object-contain"
          />
        </span>
      </div>
    );
}

function DesktopNetwork() {
  return (
    <div className="relative mx-auto mt-16 hidden h-[380px] w-full max-w-[1700px] lg:block xl:mt-[76px]">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1700 380"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="beacon-left-flow"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0" stopColor="#60A5FA" stopOpacity="0" />
            <stop offset="0.72" stopColor="#60A5FA" stopOpacity="0.38" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient
            id="beacon-right-flow"
            x1="1"
            y1="0"
            x2="0"
            y2="0"
          >
            <stop offset="0" stopColor="#60A5FA" stopOpacity="0" />
            <stop offset="0.72" stopColor="#60A5FA" stopOpacity="0.38" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient
            id="beacon-ghost-left"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#60A5FA" stopOpacity="0.13" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient
            id="beacon-ghost-right"
            x1="1"
            y1="0"
            x2="0"
            y2="0"
          >
            <stop offset="0" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#60A5FA" stopOpacity="0.13" />
            <stop offset="1" stopColor="#60A5FA" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="beacon-center-glow">
            <stop offset="0" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="0.55" stopColor="#2563EB" stopOpacity="0.07" />
            <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          cx="850"
          cy="190"
          rx="300"
          ry="145"
          fill="url(#beacon-center-glow)"
        />

        {/* Secondary background paths */}
        <path
          d="M120 18 C360 18 520 88 690 190"
          stroke="url(#beacon-ghost-left)"
          strokeWidth="0.85"
        />

        <path
          d="M120 350 C360 350 520 280 690 190"
          stroke="url(#beacon-ghost-left)"
          strokeWidth="0.85"
        />

        <path
          d="M1010 190 C1180 88 1340 18 1580 18"
          stroke="url(#beacon-ghost-right)"
          strokeWidth="0.85"
        />

        <path
          d="M1010 190 C1180 280 1340 350 1580 350"
          stroke="url(#beacon-ghost-right)"
          strokeWidth="0.85"
        />

        {/* Main left paths */}
        {LEFT_ANCHORS.map((y, index) => {
          const path = `
            M 190 ${y}
            C 390 ${y}
              545 ${190 + (y - 190) * 0.3}
              690 190
          `;

          return (
            <path
              key={`left-${index}`}
              d={path}
              stroke="url(#beacon-left-flow)"
              strokeWidth={index === 2 ? 1.3 : 1}
            />
          );
        })}

        {/* Main right paths */}
        {RIGHT_ANCHORS.map((y, index) => {
          const path = `
            M 1010 190
            C 1160 ${190 + (y - 190) * 0.3}
              1300 ${y}
              1510 ${y}
          `;

          return (
            <path
              key={`right-${index}`}
              d={path}
              stroke="url(#beacon-right-flow)"
              strokeWidth={index === 1 ? 1.3 : 1}
            />
          );
        })}

        {/* Center connection */}
        <path
          d="M690 190H1010"
          stroke="#60A5FA"
          strokeOpacity="0.8"
          strokeWidth="1.2"
        />

        {/* Main particles */}
        {LEFT_ANCHORS.map((y, index) => {
          const path = `
            M 190 ${y}
            C 390 ${y}
              545 ${190 + (y - 190) * 0.3}
              690 190
          `;

          return (
            <circle
              key={`left-particle-${index}`}
              r="2.2"
              fill={
                index === 1 || index === 3
                  ? "#A78BFA"
                  : "#60A5FA"
              }
            >
              <animateMotion
                dur={`${2.2 + index * 0.14}s`}
                begin={`${index * 0.2}s`}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
          );
        })}

        {RIGHT_ANCHORS.map((y, index) => {
          const path = `
            M 1010 190
            C 1160 ${190 + (y - 190) * 0.3}
              1300 ${y}
              1510 ${y}
          `;

          return (
            <circle
              key={`right-particle-${index}`}
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
          );
        })}

        {/* Secondary particles */}
        <circle r="1.7" fill="#60A5FA">
          <animateMotion
            dur="3.8s"
            begin="0s"
            repeatCount="indefinite"
            path="M120 18 C360 18 520 88 690 190"
          />
        </circle>

        <circle r="1.7" fill="#60A5FA">
          <animateMotion
            dur="4.2s"
            begin="1.1s"
            repeatCount="indefinite"
            path="M120 350 C360 350 520 280 690 190"
          />
        </circle>

        <circle r="1.7" fill="#60A5FA">
          <animateMotion
            dur="4s"
            begin="0.6s"
            repeatCount="indefinite"
            path="M1010 190 C1180 88 1340 18 1580 18"
          />
        </circle>

        <circle r="1.7" fill="#60A5FA">
          <animateMotion
            dur="4.4s"
            begin="1.4s"
            repeatCount="indefinite"
            path="M1010 190 C1180 280 1340 350 1580 350"
          />
        </circle>
      </svg>

      {/* Left cards */}
      <div className="absolute left-0 top-1/2 w-[180px] -translate-y-1/2">
        <div className="flex flex-col gap-[18px]">
          {SIGNALS.map((signal) => (
            <SignalCard
              key={signal.label}
              item={signal}
            />
          ))}
        </div>
      </div>

      {/* Center Beacon */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <BeaconCore />

        <div className="absolute left-1/2 top-[calc(100%+14px)] flex -translate-x-1/2 flex-col items-center whitespace-nowrap">
          <span className="text-[19px] font-semibold tracking-[-0.035em] text-zinc-100">
            Beacon
          </span>

          <span className="mt-1 text-center text-[6px] font-medium uppercase leading-[1.5] tracking-[0.34em] text-blue-300/70">
            Observability
            <br />
            for AI
          </span>
        </div>
      </div>

      {/* Right cards */}
      <div className="absolute right-0 top-1/2 w-[220px] -translate-y-1/2">
        <div className="flex flex-col gap-[30px]">
          {OUTCOMES.map((outcome) => (
            <OutcomeCard
              key={outcome.title}
              item={outcome}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileNetwork() {
    return (
      <div className="mx-auto mt-10 w-full max-w-[520px] lg:hidden">
        {/* Input signals */}
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
          {SIGNALS.map((signal) => (
            <SignalCard
              key={signal.label}
              item={signal}
              mobile
            />
          ))}
        </div>
  
        {/* Beacon transition */}
        <div className="relative my-10 flex flex-col items-center">
          {/* Incoming flow */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-1/2 h-8 w-px -translate-x-1/2 bg-gradient-to-b from-blue-400/0 via-blue-400/35 to-blue-400/70"
          />
  
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]"
          />
  
          <BeaconCore mobile />
  
          <span className="mt-3.5 text-[21px] font-semibold tracking-[-0.035em] text-zinc-100">
            Beacon
          </span>
  
          <span className="mt-1 text-center text-[7px] font-medium uppercase leading-[1.5] tracking-[0.34em] text-blue-300/70">
            Observability
            <br />
            for AI
          </span>
  
          {/* Outgoing flow */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 left-1/2 h-8 w-px -translate-x-1/2 bg-gradient-to-b from-blue-400/70 via-blue-400/35 to-blue-400/0"
          />
  
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]"
          />
        </div>
  
        {/* Outcomes */}
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
          {OUTCOMES.map((outcome) => (
            <OutcomeCard
              key={outcome.title}
              item={outcome}
              mobile
            />
          ))}
        </div>
      </div>
    );
}

export default function LandingFinalCta() {
  return (
    <section
      id="final-cta"
      className="relative w-full overflow-hidden border-t border-white/[0.06] bg-[#050B12]"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, rgba(37,99,235,0.09), transparent 34%), radial-gradient(circle at 50% 66%, rgba(37,99,235,0.04), transparent 42%)",
        }}
      />

      {/* Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(96,165,250,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(to bottom, black 0%, transparent 90%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 90%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1700px] px-5 sm:px-8 lg:px-12">
        <div
          className="relative"
          style={{
            paddingTop: "clamp(72px, 7vw, 112px)",
            paddingBottom: "clamp(56px, 6vw, 88px)",
          }}
        >
          {/* Heading */}
          <header className="mx-auto flex w-full max-w-[860px] flex-col items-center text-center">
            <span className="inline-flex min-h-7 items-center justify-center rounded-full border border-blue-400/15 bg-blue-400/[0.04] px-3.5 text-[9px] font-medium uppercase tracking-[0.24em] text-blue-300/75">
              Observability for what&apos;s next
            </span>

            <h2
              className="mt-6 w-full font-semibold text-zinc-50"
              style={{
                fontSize: "clamp(40px, 5vw, 68px)",
                lineHeight: 1.01,
                letterSpacing: "-0.055em",
              }}
            >
              <span className="block">
                Turn your AI agents
              </span>

              <span className="block text-blue-500">
                into clear insights.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[650px] text-center text-[15px] leading-7 text-zinc-500 sm:text-[17px] sm:leading-8">
              Start building with Beacon today and get real-time visibility
              into your AI systems.
            </p>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-12 w-full max-w-[168px] items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-[14px] font-medium text-white shadow-[0_14px_34px_rgba(37,99,235,0.18)] transition-all duration-200 hover:bg-[#3B82F6] hover:shadow-[0_18px_42px_rgba(37,99,235,0.24)]"
              >
                <span>Get Started</span>
                <ArrowIcon />
              </Link>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full max-w-[180px] items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.025] px-5 text-[14px] font-medium text-zinc-300 transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
              >
                <GithubIcon />
                <span>Star on GitHub</span>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[8px] font-medium uppercase tracking-[0.24em] text-zinc-700 sm:text-[9px] sm:tracking-[0.28em]">
              <span className="hidden h-px w-8 bg-white/[0.08] sm:block" />

              <span>Open source</span>
              <span>•</span>
              <span>Developer first</span>
              <span>•</span>
              <span>Built for AI</span>

              <span className="hidden h-px w-8 bg-white/[0.08] sm:block" />
            </div>
          </header>

          <DesktopNetwork />

          <MobileNetwork />

          <div className="mt-9 flex items-center justify-center gap-4 text-center text-[8px] font-medium uppercase tracking-[0.25em] text-zinc-700 sm:tracking-[0.3em]">
            <span className="h-px w-8 bg-white/[0.07] sm:w-10" />

            <span>
              A clearer perspective for a brighter AI
            </span>

            <span className="h-px w-8 bg-white/[0.07] sm:w-10" />
          </div>
        </div>
      </div>
    </section>
  );
}