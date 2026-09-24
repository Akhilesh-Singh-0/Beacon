import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import beaconIcon from "@/app/beacon-icon.svg";

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
      (Date.now() - new Date(value).getTime()) /
        1000,
    ),
  );

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} ${
    days === 1 ? "day" : "days"
  } ago`;
}

function StatusBadge({
  status,
}: {
  status: Run["status"];
}) {
  const config = {
    RUNNING: {
      label: "Running",
      dot: "#60A5FA",
      text: "#60A5FA",
      border: "rgba(37,99,235,0.45)",
      background: "rgba(37,99,235,0.10)",
    },
    COMPLETED: {
      label: "Completed",
      dot: "#34D399",
      text: "#34D399",
      border: "rgba(16,185,129,0.35)",
      background: "rgba(16,185,129,0.08)",
    },
    FAILED: {
      label: "Failed",
      dot: "#F87171",
      text: "#F87171",
      border: "rgba(248,113,113,0.35)",
      background: "rgba(248,113,113,0.08)",
    },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[12px] font-medium"
      style={{
        color: config.text,
        borderColor: config.border,
        backgroundColor: config.background,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: config.dot,
          boxShadow:
            status === "RUNNING"
              ? `0 0 8px ${config.dot}`
              : "none",
        }}
      />
      {config.label}
    </span>
  );
}

function Header() {
  return (
    <header className="relative h-[80px] shrink-0 border-b border-white/[0.07] bg-[#050B12]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-[1520px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Beacon home"
        >
          <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-[10px] border border-blue-400/30 bg-[#0B1320] shadow-[0_0_24px_rgba(37,99,235,0.10)]">
            <Image
              src={beaconIcon}
              alt="Beacon"
              fill
              priority
              className="object-contain p-1"
            />
          </span>

          <span className="text-[17px] font-semibold tracking-[-0.025em] text-zinc-100">
            Beacon
          </span>
        </Link>

        <div className="flex items-center gap-2.5 text-[13px] text-zinc-300">
          <span
            className="h-2 w-2 rounded-full bg-emerald-400"
            style={{
              boxShadow:
                "0 0 10px rgba(52,211,153,0.75)",
            }}
          />
          <span>Connected</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 h-px w-20 -translate-x-1/2 bg-blue-500" />
    </header>
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

  return (
    <main className="min-h-screen bg-[#050B12] text-zinc-100">
      <Header />

      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 78% 18%, rgba(37,99,235,0.08), transparent 30%), radial-gradient(circle, rgba(96,165,250,0.13) 0.8px, transparent 0.8px)",
            backgroundSize:
              "100% 100%, 18px 18px",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1520px] px-6 pb-14 pt-12 lg:px-10 lg:pt-16">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="text-[14px] font-medium tracking-[-0.01em] text-violet-400">
                Observability
              </p>

              <h1 className="mt-2 text-[40px] font-semibold leading-none tracking-[-0.045em] text-white sm:text-[46px]">
                Runs
              </h1>

              <p className="mt-4 max-w-[620px] text-[15px] leading-6 text-zinc-400 sm:text-[16px]">
                Inspect agent executions and
                follow their traces in real
                time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-[13px] text-zinc-300">
                {runs.length} runs
              </div>

              <div className="rounded-lg border border-blue-500/45 bg-blue-500/[0.08] px-4 py-2 text-[13px] text-blue-400">
                {runningCount} running
              </div>
            </div>
          </div>

          <section className="mt-12 overflow-hidden rounded-[24px] border border-blue-400/20 bg-[#07101A]/90 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <div className="border-b border-blue-400/15 px-7 py-6 sm:px-8">
              <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-zinc-100">
                Recent runs
              </h2>

              <p className="mt-1.5 text-[14px] text-zinc-500">
                Latest agent executions
                received by Beacon.
              </p>
            </div>

            {errorMessage ? (
              <div className="flex min-h-[220px] items-center justify-center px-6 text-center">
                <div>
                  <p className="text-sm font-medium text-red-400">
                    Unable to load runs
                  </p>

                  <p className="mt-2 max-w-md text-xs leading-5 text-zinc-600">
                    {errorMessage}
                  </p>
                </div>
              </div>
            ) : runs.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center px-6 text-center">
                <div>
                  <div className="mx-auto mb-4 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.65)]" />

                  <p className="text-sm font-medium text-zinc-300">
                    No runs yet
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Beacon will show executions
                    here as spans arrive.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-[minmax(340px,1.7fr)_210px_170px_260px_56px] border-b border-blue-400/15 px-7 py-4 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 sm:px-8">
                    <span>Trace</span>
                    <span>Status</span>
                    <span>Spans</span>
                    <span>Started</span>
                    <span />
                  </div>

                  <div>
                    {runs.map((run) => (
                      <Link
                        key={run.id}
                        href={`/runs/${run.id}`}
                        className="group grid grid-cols-[minmax(340px,1.7fr)_210px_170px_260px_56px] items-center border-b border-white/[0.055] px-7 py-6 transition-colors duration-200 last:border-b-0 hover:bg-blue-500/[0.025] sm:px-8"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.28)]" />

                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-semibold tracking-[-0.015em] text-zinc-100">
                              {run.traceId}
                            </p>

                            <p className="mt-1 truncate font-mono text-[11px] text-zinc-600">
                              {run.id}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={run.status}
                        />

                        <div className="text-[14px] text-zinc-300">
                          <span className="font-semibold tabular-nums text-zinc-100">
                            {run._count.nodes}
                          </span>{" "}
                          <span className="text-zinc-500">
                            spans
                          </span>
                        </div>

                        <div>
                          <p className="text-[13px] text-zinc-300">
                            {formatStartedAt(
                              run.startedAt,
                            )}
                          </p>

                          <p className="mt-1 text-[11px] text-zinc-600">
                            {formatRelativeTime(
                              run.startedAt,
                            )}
                          </p>
                        </div>

                        <div className="flex justify-end text-zinc-500 transition-colors duration-200 group-hover:text-zinc-200">
                          <svg
                            aria-hidden="true"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                          >
                            <path
                              d="M4 9h9"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                            <path
                              d="m10 5 4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-blue-400/10 px-7 py-5 sm:px-8">
              <p className="text-[13px] text-zinc-500">
                Showing {runs.length}{" "}
                {runs.length === 1 ? "run" : "runs"}
              </p>
            </div>
          </section>

          <div className="mt-12 flex items-center justify-between gap-6 border-t border-white/[0.08] pt-5 text-[9px] font-medium uppercase tracking-[0.28em] text-zinc-600">
            <div className="flex items-center gap-3">
              <span>Build</span>
              <span>·</span>
              <span>Observe</span>
              <span>·</span>
              <span>Improve</span>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="h-px w-12 bg-white/[0.08]" />
              <span>
                A clearer perspective for
                a brighter AI
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}