import Reveal from "./reveal";

const FEATURES = [
  {
    title: "Real-time traces",
    description: "See agent executions as they happen.",
    icon: "trace",
    color: "blue",
  },
  {
    title: "Tool & LLM visibility",
    description: "Inspect every tool call, prompt, and response.",
    icon: "nodes",
    color: "violet",
  },
  {
    title: "Debug failures",
    description: "Find where complex executions go wrong.",
    icon: "debug",
    color: "amber",
  },
  {
    title: "Open standards",
    description: "Built on OpenTelemetry and designed for your stack.",
    icon: "open",
    color: "emerald",
  },
];

function FeatureIcon({ type }: { type: string }) {
  if (type === "trace") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <circle
          cx="5"
          cy="10"
          r="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle
          cx="15"
          cy="5"
          r="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle
          cx="15"
          cy="15"
          r="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M7 9 13 6M7 11l6 3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "nodes") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <rect
          x="2.5"
          y="3"
          width="6"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect
          x="11.5"
          y="12"
          width="6"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path
          d="M8.5 5.5h3M14.5 8v4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "debug") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <path
          d="M6 3.5h8M6 16.5h8M5 6h10v8H5z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M8 8.5h4M8 11.5h2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M5 7.5 8 10l-3 2.5M10.5 13h4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getIconStyles(color: string) {
  switch (color) {
    case "violet":
      return "bg-violet-500/[0.08] text-violet-600 dark:bg-violet-400/[0.08] dark:text-violet-300";

    case "amber":
      return "bg-amber-500/[0.08] text-amber-600 dark:bg-amber-400/[0.08] dark:text-amber-300";

    case "emerald":
      return "bg-emerald-500/[0.08] text-emerald-600 dark:bg-emerald-400/[0.08] dark:text-emerald-300";

    default:
      return "bg-blue-500/[0.08] text-blue-600 dark:bg-blue-400/[0.08] dark:text-blue-300";
  }
}

function getRowStyles(color: string) {
  switch (color) {
    case "violet":
      return "bg-[#F3EFFB] hover:bg-[#EEE8F8] dark:bg-transparent dark:hover:bg-[var(--beacon-surface-raised)]";

    case "amber":
      return "bg-[#FBF3E7] hover:bg-[#F8ECD9] dark:bg-transparent dark:hover:bg-[var(--beacon-surface-raised)]";

    case "emerald":
      return "bg-[#EAF5F1] hover:bg-[#E2F1EB] dark:bg-transparent dark:hover:bg-[var(--beacon-surface-raised)]";

    default:
      return "bg-[#EDF3FB] hover:bg-[#E6EFFA] dark:bg-transparent dark:hover:bg-[var(--beacon-surface-raised)]";
  }
}

export default function LandingProblem() {
  return (
    <section
      id="about"
      className="relative bg-[var(--beacon-bg)] py-[clamp(88px,9vw,132px)]"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
        <Reveal variant="left">
          <div className="max-w-[500px]">
            <p className="bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-[10px] font-medium uppercase tracking-[0.22em] text-transparent dark:from-violet-300 dark:via-blue-300 dark:to-cyan-200">
              Understand every execution
            </p>

            <h2 className="mt-5 max-w-[480px] text-[clamp(34px,3.6vw,52px)] font-semibold leading-[1.04] tracking-[-0.045em] text-[var(--beacon-text)]">
              From black box agents to clear execution traces.
            </h2>

            <p className="mt-6 max-w-[470px] text-[14px] leading-6 text-[var(--beacon-text-secondary)] sm:text-[15px]">
              Beacon gives you visibility into what your agents are doing, which
              tools they use, how long each step takes, and where things go
              wrong.
            </p>
          </div>
        </Reveal>

        <Reveal variant="right" delay={140}>
          <div className="w-full max-w-[620px] lg:ml-auto">
            <div className="overflow-hidden rounded-2xl border border-[#D8D9D6] bg-[#EEEFEF] dark:border-[var(--beacon-border)] dark:bg-[var(--beacon-surface)]">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group flex items-center gap-4 px-5 py-5 transition-colors duration-300 sm:px-6 ${getRowStyles(
                    feature.color,
                  )} ${
                    index !== FEATURES.length - 1
                      ? "border-b border-[#D8D9D6] dark:border-[var(--beacon-border)]"
                      : ""
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getIconStyles(
                      feature.color,
                    )}`}
                  >
                    <FeatureIcon type={feature.icon} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[var(--beacon-text)]">
                      {feature.title}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[var(--beacon-text-muted)]">
                      {feature.description}
                    </p>
                  </div>

                  <span className="ml-auto hidden shrink-0 text-[10px] font-medium tabular-nums text-[var(--beacon-text-subtle)] transition-colors duration-300 group-hover:text-[var(--beacon-text-muted)] sm:block">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}