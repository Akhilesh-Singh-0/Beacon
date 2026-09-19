"use client";

import DagCanvas from "@/components/dag/dag-canvas";
import { useDagWebSocket } from "@/hooks/use-dag-websocket";

type RunDetailClientProps = {
  runId: string;
};

const CONNECTION_STYLE = {
  connecting: {
    label: "Connecting",
    dot: "#fbbf24",
  },
  connected: {
    label: "Live",
    dot: "#34d399",
  },
  disconnected: {
    label: "Offline",
    dot: "#71717a",
  },
  error: {
    label: "Connection error",
    dot: "#f87171",
  },
} as const;

export default function RunDetailClient({
  runId,
}: RunDetailClientProps) {
  const {
    nodes,
    edges,
    connectionStatus,
  } = useDagWebSocket(runId);

  const connection =
    CONNECTION_STYLE[connectionStatus];

  return (
    <main className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#050B12] text-zinc-100">
      <header className="h-[56px] shrink-0 border-b border-white/[0.05] bg-[#050B12]">
        <div className="flex h-full items-center px-5 sm:px-6 lg:px-8">
          <a
            href="/runs"
            className="text-[13px] font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
          >
            ← Runs
          </a>
        </div>
      </header>

      <section className="min-h-0 flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-5">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0A0F15] shadow-[0_30px_100px_rgba(0,0,0,0.38)]">
          <header className="flex min-h-[68px] shrink-0 items-center justify-between border-b border-white/[0.06] px-5 sm:px-7">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/[0.06]">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-blue-400"
                  style={{
                    boxShadow:
                      "0 0 12px rgba(96,165,250,0.65)",
                  }}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[12px] font-medium text-zinc-300">
                  Live execution
                </p>

                <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-600 sm:text-[11px]">
                  {runId}
                </p>
              </div>
            </div>

            <div
              className="flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium"
              style={{
                color: connection.dot,
                borderColor: `${connection.dot}2A`,
                backgroundColor: `${connection.dot}0D`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    connection.dot,
                  boxShadow:
                    connectionStatus ===
                    "connected"
                      ? `0 0 8px ${connection.dot}`
                      : "none",
                }}
              />

              <span>{connection.label}</span>
            </div>
          </header>

          <div className="min-h-0 flex-1">
            <DagCanvas
              nodes={nodes}
              edges={edges}
            />
          </div>

          <footer className="flex min-h-[78px] shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#090E14]/80 px-5 sm:px-7">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Execution stream
              </p>

              <p className="mt-1 text-[11px] text-zinc-500">
                Live updates enabled
              </p>
            </div>

            <div className="flex items-stretch">
              <div className="px-5 sm:px-7">
                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                  Spans
                </p>

                <p className="mt-1 text-[17px] font-semibold tabular-nums text-zinc-200">
                  {nodes.length}
                </p>
              </div>

              <div className="w-px bg-white/[0.06]" />

              <div className="px-5 sm:px-7">
                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                  Links
                </p>

                <p className="mt-1 text-[17px] font-semibold tabular-nums text-zinc-200">
                  {edges.length}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}