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
    <main className="flex h-full min-h-0 flex-col bg-[#0a0a0a] text-zinc-100">
      <header className="h-[68px] shrink-0 border-b border-white/[0.07] bg-[#0b0b0d]/95 backdrop-blur-xl">
        <div
          className="mx-auto flex h-full w-full items-center justify-between"
          style={{
            paddingInline:
              "clamp(32px, 5vw, 80px)",
          }}
        >
          <div className="flex min-w-0 items-center gap-4">
            <a
              href="/runs"
              className="shrink-0 text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              ← Runs
            </a>

            <span
              aria-hidden="true"
              className="h-5 w-px bg-white/[0.08]"
            />

            <span className="shrink-0 text-[13px] font-semibold text-zinc-300">
              Run
            </span>

            <span className="max-w-[320px] truncate font-mono text-[12px] text-zinc-600">
              {runId}
            </span>
          </div>

          <div className="ml-8 flex shrink-0 items-center gap-5">
            <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-300">
              <span
                aria-hidden="true"
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

              <span>
                {connection.label}
              </span>
            </div>

            <span
              aria-hidden="true"
              className="h-4 w-px bg-white/[0.07]"
            />

            <div className="flex items-baseline gap-1.5 text-[12px]">
              <span className="font-semibold tabular-nums text-zinc-200">
                {nodes.length}
              </span>

              <span className="text-zinc-600">
                spans
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 text-[12px]">
              <span className="font-semibold tabular-nums text-zinc-200">
                {edges.length}
              </span>

              <span className="text-zinc-600">
                links
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="min-h-0 flex-1">
        <DagCanvas
          nodes={nodes}
          edges={edges}
        />
      </section>
    </main>
  );
}