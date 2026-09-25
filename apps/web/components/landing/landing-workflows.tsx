import Reveal from "./reveal";

const WORKFLOWS = [
  {
    title: "Faster iteration",
    description: "Understand behavior and improve your agents quickly.",
    icon: "bolt",
    tone: "var(--beacon-info)",
    visual: "trace",
    card: "blue",
  },
  {
    title: "Higher reliability",
    description: "Catch errors and edge cases before your users do.",
    icon: "shield",
    tone: "var(--beacon-success)",
    visual: "reliability",
    card: "emerald",
  },
  {
    title: "Better performance",
    description: "See latency breakdowns across your entire stack.",
    icon: "chart",
    tone: "var(--beacon-warning)",
    visual: "performance",
    card: "amber",
  },
  {
    title: "Works with your stack",
    description: "OpenTelemetry native. Framework agnostic.",
    icon: "code",
    tone: "var(--beacon-text-secondary)",
    visual: "stack",
    card: "violet",
  },
];

function FeatureIcon({ type }: { type: string }) {
  if (type === "bolt") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <path
          d="M11.5 2.5 5.5 10h4l-1 7.5 6-8h-4l1-7Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <path
          d="M10 2.5 16 5v4.2c0 3.7-2.5 6.7-6 8.3-3.5-1.6-6-4.6-6-8.3V5l6-2.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="m7.2 10 1.8 1.8 3.8-4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <path
          d="M4 16V9M10 16V5M16 16V2.5"
          stroke="currentColor"
          strokeWidth="1.5"
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
        d="m7 5-4 5 4 5M13 5l4 5-4 5M11.5 3.5l-3 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getCardStyles(color: string) {
  switch (color) {
    case "emerald":
      return "bg-[#EAF5F1] hover:bg-[#E2F1EB] dark:bg-[var(--beacon-surface)] dark:hover:bg-[#15191D]";

    case "amber":
      return "bg-[#FBF3E7] hover:bg-[#F8ECD9] dark:bg-[var(--beacon-surface)] dark:hover:bg-[#15191D]";

    case "violet":
      return "bg-[#F3EFFB] hover:bg-[#EEE8F8] dark:bg-[var(--beacon-surface)] dark:hover:bg-[#15191D]";

    default:
      return "bg-[#EDF3FB] hover:bg-[#E6EFFA] dark:bg-[var(--beacon-surface)] dark:hover:bg-[#15191D]";
  }
}

function TraceVisual() {
  return (
    <div className="relative mt-auto h-14 overflow-hidden rounded-xl border border-[#D9D9D7] bg-white/45 dark:border-white/[0.06] dark:bg-black/[0.1]">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-[#D2D2CF] dark:bg-white/[0.07]" />

      <div className="absolute inset-y-0 left-[12%] flex items-center">
        <span className="h-2 w-2 rounded-full bg-[var(--beacon-info)]" />
      </div>

      <div className="absolute inset-y-0 left-[38%] flex items-center">
        <span className="h-2 w-2 rounded-full bg-[var(--beacon-info)] opacity-80" />
      </div>

      <div className="absolute inset-y-0 left-[65%] flex items-center">
        <span className="h-2 w-2 rounded-full bg-[var(--beacon-info)] opacity-60" />
      </div>

      <div className="absolute inset-y-0 right-[8%] flex items-center">
        <span className="h-2 w-2 rounded-full bg-[var(--beacon-success)] opacity-70" />
      </div>

      <span className="workflow-trace absolute left-0 top-1/2 h-px w-20 -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--beacon-info)] to-transparent" />
    </div>
  );
}

function ReliabilityVisual() {
  return (
    <div className="relative mt-auto h-14 overflow-hidden rounded-xl border border-[#D9D9D7] bg-white/45 px-3 dark:border-white/[0.06] dark:bg-black/[0.1]">
      <div className="flex h-full items-center">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--beacon-success)_28%,transparent)] bg-[color-mix(in_srgb,var(--beacon-success)_8%,transparent)]">
          <span className="workflow-pulse absolute inset-0 rounded-full border border-[var(--beacon-success)] opacity-0" />

          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4 text-[var(--beacon-success)]"
          >
            <path
              d="m5.5 10 3 3 6-6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="ml-3 flex flex-1 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <span
              key={item}
              className="h-1.5 flex-1 rounded-full bg-[color-mix(in_srgb,var(--beacon-success)_16%,transparent)]"
            />
          ))}
        </div>

        <span className="ml-3 font-mono text-[9px] text-[var(--beacon-success)]">
          OK
        </span>
      </div>
    </div>
  );
}

function PerformanceVisual() {
  return (
    <div className="relative mt-auto h-14 overflow-hidden rounded-xl border border-[#D9D9D7] bg-white/45 px-3 dark:border-white/[0.06] dark:bg-black/[0.1]">
      <div className="flex h-full items-end gap-1.5 pb-2">
        {[28, 42, 34, 52, 39, 61, 47, 68, 55, 76, 64, 82].map(
          (height, index) => (
            <span
              key={index}
              className="performance-bar min-w-0 flex-1 rounded-t-[3px] bg-[color-mix(in_srgb,var(--beacon-warning)_38%,transparent)]"
              style={{
                height: `${height}%`,
                animationDelay: `${index * 90}ms`,
              }}
            />
          ),
        )}
      </div>
    </div>
  );
}

function StackVisual() {
  return (
    <div className="relative mt-auto h-14 overflow-hidden rounded-xl border border-[#D9D9D7] bg-white/45 px-3 py-2 dark:border-white/[0.06] dark:bg-black/[0.1]">
      <div className="space-y-1.5 font-mono text-[8px] leading-none text-[#777675] dark:text-[var(--beacon-text-muted)]">
        <div className="flex gap-2">
          <span className="text-[#A0A09D] dark:text-[var(--beacon-text-subtle)]">
            01
          </span>
          <span>span.ingest</span>
          <span className="ml-auto text-[var(--beacon-success)]">
            202
          </span>
        </div>

        <div className="flex gap-2">
          <span className="text-[#A0A09D] dark:text-[var(--beacon-text-subtle)]">
            02
          </span>
          <span>trace.process</span>
          <span className="ml-auto text-[var(--beacon-info)]">
            18ms
          </span>
        </div>

        <div className="flex gap-2">
          <span className="text-[#A0A09D] dark:text-[var(--beacon-text-subtle)]">
            03
          </span>
          <span>node.complete</span>
          <span className="ml-auto text-[var(--beacon-success)]">
            ok
          </span>
        </div>
      </div>

      <span className="workflow-scan absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent dark:via-white/[0.04]" />
    </div>
  );
}

function WorkflowVisual({ type }: { type: string }) {
  if (type === "trace") return <TraceVisual />;
  if (type === "reliability") return <ReliabilityVisual />;
  if (type === "performance") return <PerformanceVisual />;

  return <StackVisual />;
}

export default function LandingWorkflows() {
  return (
    <section className="relative overflow-hidden bg-[var(--beacon-bg)] py-[clamp(100px,10vw,150px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.45] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(100,105,115,0.10) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <Reveal variant="soft">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-[10px] font-medium uppercase tracking-[0.22em] text-transparent dark:from-violet-300 dark:via-blue-300 dark:to-cyan-200">
              BUILT FOR REAL ENGINEERING WORKFLOWS
            </p>

            <h2 className="mt-5 text-[clamp(38px,4.5vw,60px)] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--beacon-text)]">
              Build with visibility.
              <br />
              Ship with confidence.
            </h2>

            <p className="mx-auto mt-6 max-w-[700px] text-[14px] leading-6 text-[var(--beacon-text-secondary)] sm:text-[15px]">
              Whether you're building research agents, customer support
              copilots, or autonomous systems, Beacon helps you ship with
              confidence.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-4">
          {WORKFLOWS.map((workflow, index) => (
            <Reveal
              key={workflow.title}
              variant="up"
              delay={index * 140}
            >
              <article
                className={`group relative flex min-h-[290px] flex-col overflow-hidden rounded-2xl border border-[#D8D9D6] p-6 shadow-[0_8px_30px_rgba(24,24,24,0.025)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(24,24,24,0.06)] dark:border-[var(--beacon-border)] dark:shadow-none dark:hover:shadow-none ${getCardStyles(
                  workflow.card,
                )}`}
              >
                <div
                  className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border"
                  style={{
                    color: workflow.tone,
                    borderColor: `color-mix(in srgb, ${workflow.tone} 25%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${workflow.tone} 8%, transparent)`,
                  }}
                >
                  <FeatureIcon type={workflow.icon} />
                </div>

                <div className="relative z-10 mt-8">
                  <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-[var(--beacon-text)]">
                    {workflow.title}
                  </h3>

                  <p className="mt-2 max-w-[240px] text-[12px] leading-5 text-[var(--beacon-text-muted)]">
                    {workflow.description}
                  </p>
                </div>

                <div className="relative z-10 mt-auto">
                  <WorkflowVisual type={workflow.visual} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}