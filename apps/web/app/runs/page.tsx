import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import AppThemeToggle from "@/components/theme/app-theme-toggle";
import LiveObservability from "@/components/runs/live-observability";
import beaconIcon from "@/app/icon.png";

type Run = {
  id: string;
  traceId: string;
  status: "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: string;
  _count: {
    nodes: number;
  };
};

type RunsResponse = {
  runs: Run[];
};

type MeResponse = {
  apiKey: string;
};

const API_URL =
  process.env.BEACON_API_URL ??
  "http://localhost:3001";

async function getRuns(): Promise<Run[]> {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized.");
  }

  const meResponse = await fetch(
    `${API_URL}/api/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!meResponse.ok) {
    throw new Error(
      `Failed to fetch user: ${meResponse.status}`,
    );
  }

  const { apiKey } =
    (await meResponse.json()) as MeResponse;

  const response = await fetch(
    `${API_URL}/runs`,
    {
      headers: {
        "x-api-key": apiKey,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch runs: ${response.status}`,
    );
  }

  const data =
    (await response.json()) as RunsResponse;

  return data.runs;
}

function formatStartedAt(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatRelativeTime(value: string) {
  const seconds = Math.max(
    0,
    Math.floor(
      (Date.now() -
        new Date(value).getTime()) /
        1000,
    ),
  );

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    } ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    } ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} ${
    days === 1
      ? "day"
      : "days"
  } ago`;
}

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m8 5 11 7-11 7V5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FailedIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 4 21 20H3L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M12 9v5M12 17.5v.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpansIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 5h5v5H5zM14 14h5v5h-5z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M10 7.5h2a2 2 0 0 1 2 2v4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusBadge({
  status,
}: {
  status: Run["status"];
}) {
  const config = {
    RUNNING: {
      label: "Running",
      className:
        "border-blue-400/20 bg-blue-400/[0.08] text-blue-500",
      dot: "bg-blue-500",
    },
    COMPLETED: {
      label: "Completed",
      className:
        "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-600",
      dot: "bg-emerald-500",
    },
    FAILED: {
      label: "Failed",
      className:
        "border-pink-400/20 bg-pink-400/[0.08] text-pink-600",
      dot: "bg-pink-500",
    },
  }[status];

  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-1.5 text-[11px] font-medium",
        config.className,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          config.dot,
          status === "RUNNING"
            ? "animate-pulse"
            : "",
        ].join(" ")}
      />

      {config.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone:
    | "blue"
    | "green"
    | "pink"
    | "violet";
}) {
  const styles = {
    blue: {
      border:
        "border-blue-200/70 dark:border-blue-400/10",
      background:
        "bg-blue-50/45 dark:bg-[#10141d]",
      text:
        "text-blue-500 dark:text-blue-300",
    },
    green: {
      border:
        "border-emerald-200/70 dark:border-emerald-400/10",
      background:
        "bg-emerald-50/45 dark:bg-[#101714]",
      text:
        "text-emerald-500 dark:text-emerald-300",
    },
    pink: {
      border:
        "border-pink-200/70 dark:border-pink-400/10",
      background:
        "bg-pink-50/45 dark:bg-[#171016]",
      text:
        "text-pink-500 dark:text-pink-300",
    },
    violet: {
      border:
        "border-violet-200/70 dark:border-violet-400/10",
      background:
        "bg-violet-50/45 dark:bg-[#13101b]",
      text:
        "text-violet-500 dark:text-violet-300",
    },
  }[tone];

  return (
    <div
      className={[
        "rounded-2xl border p-5 transition-transform duration-200 hover:-translate-y-0.5",
        styles.border,
        styles.background,
        styles.text,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium text-[var(--app-text-secondary)]">
            {label}
          </p>

          <p className="mt-2 text-[27px] font-semibold tracking-[-0.04em]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.035] text-current dark:bg-white/[0.05]">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default async function RunsPage() {
  let runs: Run[] = [];
  let errorMessage: string | null = null;

  try {
    runs = await getRuns();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load runs.";
  }

  const runningCount = runs.filter(
    (run) => run.status === "RUNNING",
  ).length;

  const completedCount = runs.filter(
    (run) => run.status === "COMPLETED",
  ).length;

  const failedCount = runs.filter(
    (run) => run.status === "FAILED",
  ).length;

  const totalSpans = runs.reduce(
    (total, run) =>
      total + run._count.nodes,
    0,
  );

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-200">
      <header className="h-[76px] border-b border-[var(--app-border)]">
        <div className="mx-auto flex h-full w-full max-w-[1520px] items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Beacon home"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-blue-500/30 bg-[#071c55] shadow-[0_8px_28px_rgba(37,99,235,0.12)]">
              <Image
                src={beaconIcon}
                alt="Beacon"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>

            <span className="text-[20px] font-semibold tracking-[-0.035em]">
              Beacon
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <AppThemeToggle />
            <UserButton />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1520px] px-6 pb-14 pt-12 sm:px-8 lg:px-10 lg:pt-14">
        <section className="flex items-center justify-between gap-12">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-blue-600 dark:text-blue-300">
              Observability
            </p>

            <h1 className="mt-4 text-[46px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[56px]">
              Run history
            </h1>

            <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-[var(--app-text-secondary)]">
              View and inspect all your agent executions.
            </p>
          </div>

          <div className="hidden shrink-0 lg:block">
            <LiveObservability />
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total runs"
            value={runs.length}
            icon={<PlayIcon />}
            tone="blue"
          />

          <StatCard
            label="Completed"
            value={completedCount}
            icon={<CheckIcon />}
            tone="green"
          />

          <StatCard
            label="Failed"
            value={failedCount}
            icon={<FailedIcon />}
            tone="pink"
          />

          <StatCard
            label="Total spans"
            value={totalSpans}
            icon={<SpansIcon />}
            tone="violet"
          />
        </section>

        <section className="relative mt-8 overflow-hidden rounded-2xl border border-[#d9dad7] bg-[#e9ebe8] shadow-[0_24px_70px_rgba(0,0,0,0.06)] dark:border-[#20262e] dark:bg-[#080d14] dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(37,99,235,0.11), transparent 42%), radial-gradient(circle at 20% 100%, rgba(37,99,235,0.045), transparent 38%)",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
            style={{
              backgroundImage:
                "linear-gradient(rgba(96,165,250,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.035) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 90%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 90%)",
            }}
          />

          <div className="relative">
            <div className="flex items-center justify-between border-b border-[#d9dad7] bg-[#f1f2ef]/80 px-5 py-5 sm:px-6 dark:border-[#20262e] dark:bg-[#0c1118]/90">
              <div>
                <h2 className="text-[16px] font-semibold tracking-[-0.02em]">
                  Recent runs
                </h2>

                <p className="mt-1 text-[12px] text-[var(--app-text-secondary)]">
                  Latest agent executions received by Beacon.
                </p>
              </div>

              <span className="hidden text-[11px] text-[var(--app-text-muted)] sm:block">
                {runs.length}{" "}
                {runs.length === 1
                  ? "run"
                  : "runs"}
              </span>
            </div>

            {errorMessage ? (
              <div className="flex min-h-[320px] items-center justify-center px-6 text-center">
                <div>
                  <p className="text-sm font-medium text-red-500">
                    Unable to load runs
                  </p>

                  <p className="mt-2 max-w-md text-xs leading-5 text-[var(--app-text-muted)]">
                    {errorMessage}
                  </p>
                </div>
              </div>
            ) : runs.length === 0 ? (
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden px-6 text-center">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-3xl dark:bg-blue-500/[0.06]"
                />

                <div className="relative">
                  <div className="mx-auto mb-4 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_14px_rgba(37,99,235,0.65)]" />

                  <p className="text-sm font-medium">
                    No runs yet
                  </p>

                  <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                    Beacon will show executions here as spans arrive.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[850px]">
                  <div className="grid grid-cols-[minmax(320px,1.7fr)_180px_150px_230px_50px] border-b border-[var(--app-border)] bg-[var(--app-surface-raised)]/45 px-5 py-3.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--app-text-muted)] sm:px-6">
                    <span>Run</span>
                    <span>Status</span>
                    <span>Spans</span>
                    <span>Started at</span>
                    <span />
                  </div>

                  {runs.map((run) => (
                    <Link
                      key={run.id}
                      href={`/runs/${run.id}`}
                      className="group grid grid-cols-[minmax(320px,1.7fr)_180px_150px_230px_50px] items-center border-b border-[var(--app-border)] px-5 py-5 transition-colors duration-200 last:border-b-0 hover:bg-blue-500/[0.025] sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.28)]" />

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold tracking-[-0.01em]">
                            {run.traceId}
                          </p>

                          <p className="mt-1 truncate font-mono text-[10px] text-[var(--app-text-muted)]">
                            {run.id}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={run.status} />

                      <div className="text-[13px]">
                        <span className="font-semibold tabular-nums">
                          {run._count.nodes}
                        </span>{" "}
                        <span className="text-[var(--app-text-muted)]">
                          spans
                        </span>
                      </div>

                      <div>
                        <p className="text-[12px]">
                          {formatStartedAt(
                            run.startedAt,
                          )}
                        </p>

                        <p className="mt-1 text-[10px] text-[var(--app-text-muted)]">
                          {formatRelativeTime(
                            run.startedAt,
                          )}
                        </p>
                      </div>

                      <div className="flex justify-end text-[var(--app-text-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--app-text)]">
                        <ArrowRightIcon />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#d9dad7] bg-[#f1f2ef]/70 px-5 py-4 sm:px-6 dark:border-[#20262e] dark:bg-[#0c1118]/80">
              <p className="text-[11px] text-[var(--app-text-muted)]">
                Showing {runs.length}{" "}
                {runs.length === 1
                  ? "run"
                  : "runs"}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-[var(--app-text-muted)]">
                <span className="hidden sm:block">
                  {runningCount} running
                </span>

                <span className="h-1 w-1 rounded-full bg-current" />

                <span>
                  {totalSpans} spans
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 flex items-center justify-between border-t border-[var(--app-border)] pt-5 text-[9px] font-medium uppercase tracking-[0.28em] text-[var(--app-text-muted)]">
          <div className="flex items-center gap-3">
            <span>Build</span>
            <span>·</span>
            <span>Observe</span>
            <span>·</span>
            <span>Improve</span>
          </div>

          <span className="hidden sm:block">
            A clearer perspective for a brighter AI
          </span>
        </footer>
      </div>
    </main>
  );
}