import Reveal from "./reveal";

const TELEMETRY_LINES = [
  {
    command: "$ trace.ingest",
    details: ["trace_id   7f91a2", "status     received"],
    tone: "info",
  },
  {
    command: "$ span.process",
    details: ["duration   18ms", "status     processing"],
    tone: "info",
  },
  {
    command: "$ node.created",
    details: ["type       tool_call", "status     ✓ complete"],
    tone: "success",
  },
  {
    command: "$ trace.complete",
    details: ["nodes      04", "status     ✓"],
    tone: "success",
  },
];

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function TelemetryVisual() {
  return (
    <div className="group/telemetry relative overflow-hidden rounded-2xl border border-[var(--beacon-border)] bg-[#f3f1fa] shadow-[0_18px_45px_rgba(110,98,180,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--beacon-info)_28%,var(--beacon-border))] dark:bg-[var(--beacon-surface)] dark:shadow-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/telemetry:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 75% 25%, color-mix(in srgb, var(--beacon-info) 8%, transparent), transparent 52%)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between border-b border-[#dfdce8] bg-[#f7f6fb] px-5 py-4 dark:border-[var(--beacon-border)] dark:bg-[var(--beacon-surface)]">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--beacon-text-muted)]">
            Live telemetry
          </p>

          <p className="mt-1 text-[11px] font-medium text-[var(--beacon-text)]">
            OpenTelemetry → Beacon
          </p>
        </div>

        <span className="flex items-center gap-1.5 font-mono text-[9px] text-[var(--beacon-success)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--beacon-success)]" />
          connected
        </span>
      </div>

      <div className="relative z-10 px-5 py-5">
        <div className="min-h-[220px] rounded-xl border border-[#dedbe8] bg-[#ebe9f2] px-4 py-4 dark:border-white/[0.045] dark:bg-black/10">
          <div className="space-y-4 font-mono text-[9px]">
            {TELEMETRY_LINES.map((line, index) => (
              <div
                key={line.command}
                className={`telemetry-entry telemetry-entry-${index}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={
                      line.tone === "success"
                        ? "text-[var(--beacon-success)]"
                        : "text-[var(--beacon-info)]"
                    }
                  >
                    {line.command}
                  </span>

                  <span className="telemetry-cursor h-3 w-px bg-[var(--beacon-info)]" />
                </div>

                <div className="mt-1.5 space-y-1 pl-3 text-[var(--beacon-text-muted)]">
                  {line.details.map((detail) => (
                    <div
                      key={detail}
                      className={
                        detail.includes("✓")
                          ? "text-[var(--beacon-success)]"
                          : ""
                      }
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--beacon-info)]" />

            <span className="font-mono text-[9px] text-[var(--beacon-text-muted)]">
              traces / spans / nodes
            </span>
          </div>

          <span className="font-mono text-[9px] text-[var(--beacon-text-subtle)]">
            streaming
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LandingOpenSource() {
  return (
    <section className="relative overflow-hidden bg-[var(--beacon-bg)] py-[clamp(100px,10vw,150px)]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:32px_32px]" />

      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-10">
        <Reveal variant="left">
          <div className="max-w-[560px]">
            <p className="w-fit bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-[10px] font-semibold uppercase tracking-[0.22em] text-transparent dark:from-violet-300 dark:via-blue-300 dark:to-emerald-300">
              Open source observability
            </p>

            <h2 className="mt-6 text-[clamp(38px,4.5vw,60px)] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--beacon-text)]">
              Built in the open.
              <br />
              Designed for your stack.
            </h2>

            <p className="mt-6 max-w-[500px] text-[14px] leading-6 text-[var(--beacon-text-secondary)] sm:text-[15px]">
              Beacon is built around open standards so your agent telemetry
              stays inspectable, portable, and close to the systems you're
              already using.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/Akhilesh-Singh-0/Beacon"
                target="_blank"
                rel="noreferrer"
                className="group/github inline-flex h-10 items-center gap-2 rounded-lg px-4 text-[12px] font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--beacon-text)",
                  color: "var(--beacon-bg)",
                }}
              >
                <GitHubIcon />

                <span>View on GitHub</span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-3.5 w-3.5 opacity-50 transition-all duration-200 group-hover/github:translate-x-0.5 group-hover/github:opacity-100"
                >
                  <path
                    d="M3 13 13 3M6 3h7v7"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <div className="flex h-10 items-center gap-2 rounded-lg border border-[var(--beacon-border)] bg-[var(--beacon-surface)] px-4 text-[10px] text-[var(--beacon-text-muted)] transition-all duration-200 hover:border-[color-mix(in_srgb,var(--beacon-success)_25%,var(--beacon-border))] hover:bg-[color-mix(in_srgb,var(--beacon-success)_4%,var(--beacon-surface))]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--beacon-success)] shadow-[0_0_8px_var(--beacon-success)]" />
                OpenTelemetry native
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delay={180}>
          <div className="w-full max-w-[620px] lg:ml-auto">
            <TelemetryVisual />
          </div>
        </Reveal>
      </div>
    </section>
  );
}