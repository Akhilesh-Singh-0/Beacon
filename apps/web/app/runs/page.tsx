import Link from "next/link";

type Run = {
  id: string;
  traceId: string;
  status: "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: string;
  completedAt: string | null;
  _count: {
    nodes: number;
  };
};

const STATUS_STYLES = {
  RUNNING: {
    label: "Running",
    dot: "bg-blue-400",
    text: "text-blue-300",
    bg: "bg-blue-400/[0.08]",
    border: "border-blue-400/[0.20]",
  },

  COMPLETED: {
    label: "Completed",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    bg: "bg-emerald-400/[0.08]",
    border: "border-emerald-400/[0.20]",
  },

  FAILED: {
    label: "Failed",
    dot: "bg-red-400",
    text: "text-red-300",
    bg: "bg-red-400/[0.09]",
    border: "border-red-400/[0.22]",
  },
} as const;

function formatStartedAt(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

async function getRuns(): Promise<Run[]> {
  const apiUrl = process.env.BEACON_API_URL;
  const apiKey = process.env.BEACON_API_KEY;

  if (!apiUrl) {
    throw new Error("BEACON_API_URL is not configured");
  }

  if (!apiKey) {
    throw new Error("BEACON_API_KEY is not configured");
  }

  const response = await fetch(`${apiUrl}/runs`, {
    headers: {
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch runs: ${response.status} ${response.statusText}`,
    );
  }

  const data: { runs: Run[] } = await response.json();

  return data.runs;
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 13L13 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 5H13V11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BeaconMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-violet-400/20 bg-violet-400/[0.07]">
      <div className="h-2.5 w-2.5 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.65)]" />
    </div>
  );
}

export default async function RunsPage() {
  const runs = await getRuns();

  const runningCount = runs.filter(
    (run) => run.status === "RUNNING",
  ).length;

  return (
    <main className="min-h-screen bg-[#090A0C] text-zinc-100">
      {/* Top bar */}
      <header className="border-b border-white/[0.07]">
        <div
          style={{
            width: "min(1240px, calc(100% - 64px))",
            marginInline: "auto",
          }}
          className="flex h-16 items-center justify-between"
        >
          <Link
            href="/runs"
            className="flex items-center gap-3"
          >
            <BeaconMark />

            <span className="text-[15px] font-semibold tracking-[-0.015em] text-zinc-100">
              Beacon
            </span>
          </Link>

          <div className="flex items-center gap-2.5 text-[13px] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" />
            Connected
          </div>
        </div>
      </header>

      {/* Main content */}
      <div
        style={{
          width: "min(1240px, calc(100% - 64px))",
          marginInline: "auto",
        }}
        className="pb-20 pt-12"
      >
        {/* Page header */}
        <section className="flex items-end justify-between border-b border-white/[0.07] pb-8">
          <div>
            <p className="text-[12px] font-medium tracking-[0.02em] text-violet-300/70">
              Observability
            </p>

            <h1 className="mt-2 text-[36px] font-semibold leading-tight tracking-[-0.04em] text-zinc-100">
              Runs
            </h1>

            <p className="mt-3 text-[15px] leading-6 text-zinc-400">
              Inspect agent executions and follow their traces in real time.
            </p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3.5 py-2">
              <span className="text-[13px] text-zinc-400">
                {runs.length}
              </span>

              <span className="ml-1.5 text-[13px] text-zinc-600">
                {runs.length === 1 ? "run" : "runs"}
              </span>
            </div>

            {runningCount > 0 && (
              <div className="rounded-lg border border-blue-400/[0.18] bg-blue-400/[0.06] px-3.5 py-2">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-400" />

                <span className="text-[13px] text-blue-300">
                  {runningCount} running
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Runs panel */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0E11] shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
            <div>
              <h2 className="text-[15px] font-medium text-zinc-100">
                Recent runs
              </h2>

              <p className="mt-1 text-[13px] text-zinc-500">
                Latest agent executions received by Beacon.
              </p>
            </div>
          </div>

          {runs.length === 0 ? (
            <div className="px-6 py-24 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-zinc-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 12H5.5L7.2 6L11 14L12.8 9H17.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-[15px] font-medium text-zinc-200">
                No runs yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-[13px] leading-5 text-zinc-500">
                Once Beacon receives an agent execution, its trace will appear
                here.
              </p>
            </div>
          ) : (
            <>
              {/* Column header */}
              <div className="hidden border-b border-white/[0.06] px-6 py-3.5 md:grid md:grid-cols-[minmax(360px,1fr)_150px_110px_190px_28px] md:items-center md:gap-8">
                <span className="text-[11px] font-medium tracking-[0.08em] text-zinc-600">
                  TRACE
                </span>

                <span className="text-[11px] font-medium tracking-[0.08em] text-zinc-600">
                  STATUS
                </span>

                <span className="text-[11px] font-medium tracking-[0.08em] text-zinc-600">
                  SPANS
                </span>

                <span className="text-[11px] font-medium tracking-[0.08em] text-zinc-600">
                  STARTED
                </span>

                <span />
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/[0.06]">
                {runs.map((run) => {
                  const status = STATUS_STYLES[run.status];

                  return (
                    <Link
                      key={run.id}
                      href={`/runs/${run.id}`}
                      className="group block outline-none transition-colors duration-150 hover:bg-white/[0.025] focus-visible:bg-white/[0.035]"
                    >
                      {/* Desktop row */}
                      <div className="hidden min-h-[92px] grid-cols-[minmax(360px,1fr)_150px_110px_190px_28px] items-center gap-8 px-6 md:grid">
                        {/* Trace */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="h-2 w-2 shrink-0 rounded-full bg-violet-400/80 shadow-[0_0_7px_rgba(167,139,250,0.3)]"
                            />

                            <span className="truncate font-mono text-[14px] font-medium text-zinc-200">
                              {run.traceId}
                            </span>
                          </div>

                          <p className="mt-2 truncate pl-5 font-mono text-[11px] text-zinc-500">
                            {run.id}
                          </p>
                        </div>

                        {/* Status */}
                        <div>
                          <span
                            className={[
                              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5",
                              status.bg,
                              status.border,
                            ].join(" ")}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            <span
                              className={`text-[12px] font-medium ${status.text}`}
                            >
                              {status.label}
                            </span>
                          </span>
                        </div>

                        {/* Spans */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[15px] font-medium tabular-nums text-zinc-300">
                            {run._count.nodes}
                          </span>

                          <span className="text-[12px] text-zinc-500">
                            spans
                          </span>
                        </div>

                        {/* Started */}
                        <span className="text-[13px] text-zinc-400">
                          {formatStartedAt(run.startedAt)}
                        </span>

                        {/* Arrow */}
                        <span className="flex justify-end text-zinc-700 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-violet-300">
                          <ArrowUpRightIcon />
                        </span>
                      </div>

                      {/* Mobile row */}
                      <div className="px-5 py-5 md:hidden">
                        <div className="flex items-start justify-between gap-5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                              <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400/80" />

                              <span className="truncate font-mono text-[14px] font-medium text-zinc-200">
                                {run.traceId}
                              </span>
                            </div>

                            <p className="mt-2 truncate pl-4.5 font-mono text-[11px] text-zinc-500">
                              {run.id}
                            </p>
                          </div>

                          <span className="shrink-0 text-zinc-700">
                            <ArrowUpRightIcon />
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <span
                            className={[
                              "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5",
                              status.bg,
                              status.border,
                            ].join(" ")}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            <span
                              className={`text-[12px] font-medium ${status.text}`}
                            >
                              {status.label}
                            </span>
                          </span>

                          <span className="text-[13px] text-zinc-500">
                            {run._count.nodes} spans
                          </span>
                        </div>

                        <div className="mt-4 border-t border-white/[0.06] pt-3">
                          <span className="text-[12px] text-zinc-500">
                            {formatStartedAt(run.startedAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}