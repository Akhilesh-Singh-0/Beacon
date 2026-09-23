"use client";

import {
  useCallback,
  useState,
} from "react";

import type {
  Edge,
  Node,
} from "@xyflow/react";

import DagCanvas from "@/components/dag/dag-canvas";
import { DagReplay } from "@/components/dag/dag-replay";
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
    nodes: liveNodes,
    edges: liveEdges,
    connectionStatus,
  } = useDagWebSocket(runId);

  const [
    isReplay,
    setIsReplay,
  ] = useState(false);

  const [
    replayNodes,
    setReplayNodes,
  ] = useState<
    Node[]
  >([]);

  const [
    replayEdges,
    setReplayEdges,
  ] = useState<
    Edge[]
  >([]);

  const [
    replayVisibleNodeIds,
    setReplayVisibleNodeIds,
  ] = useState<
    string[]
  >([]);

  const connection =
    CONNECTION_STYLE[
      connectionStatus
    ];

  const handleReplayChange =
    useCallback(
      (
        visibleNodeIds: string[],
      ) => {
        setReplayVisibleNodeIds(
          visibleNodeIds,
        );
      },
      [],
    );

  const handleReplayToggle =
    useCallback(() => {
      if (isReplay) {
        setIsReplay(false);

        setReplayNodes([]);
        setReplayEdges([]);
        setReplayVisibleNodeIds(
          [],
        );

        return;
      }

      setReplayNodes(
        [...liveNodes],
      );

      setReplayEdges(
        [...liveEdges],
      );

      setReplayVisibleNodeIds(
        [],
      );

      setIsReplay(true);
    }, [
      isReplay,
      liveNodes,
      liveEdges,
    ]);

  const canvasNodes =
    isReplay
      ? replayNodes
      : liveNodes;

  const canvasEdges =
    isReplay
      ? replayEdges
      : liveEdges;

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
                color:
                  connection.dot,
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

              <span>
                {connection.label}
              </span>
            </div>
          </header>

          <div className="relative min-h-0 flex-1">
            <DagCanvas
              nodes={
                canvasNodes
              }
              edges={
                canvasEdges
              }
              fitViewOnChange={
                isReplay
              }
              visibleNodeIds={
                isReplay
                  ? replayVisibleNodeIds
                  : undefined
              }
            />

            <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex w-[calc(100%-32px)] max-w-2xl -translate-x-1/2 items-center justify-center gap-3">
              <button
                type="button"
                onClick={
                  handleReplayToggle
                }
                className="pointer-events-auto shrink-0 rounded-lg border border-white/[0.1] bg-[#0B121A]/90 px-3.5 py-2 text-[11px] font-medium text-zinc-300 shadow-lg backdrop-blur-md transition-colors hover:border-white/[0.18] hover:text-zinc-100"
              >
                {isReplay
                  ? "Live"
                  : "Replay"}
              </button>

              {isReplay && (
                <div className="pointer-events-auto flex min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-[#0B121A]/90 px-4 py-2.5 shadow-lg backdrop-blur-md">
                  <DagReplay
                    nodes={
                      replayNodes
                    }
                    onReplayChange={
                      handleReplayChange
                    }
                  />
                </div>
              )}
            </div>
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
                  {
                    liveNodes.length
                  }
                </p>
              </div>

              <div className="w-px bg-white/[0.06]" />

              <div className="px-5 sm:px-7">
                <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                  Links
                </p>

                <p className="mt-1 text-[17px] font-semibold tabular-nums text-zinc-200">
                  {
                    liveEdges.length
                  }
                </p>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}