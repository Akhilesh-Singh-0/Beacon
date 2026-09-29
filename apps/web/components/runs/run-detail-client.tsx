"use client";

import Link from "next/link";
import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type {
  Edge,
  Node,
} from "@xyflow/react";

import DagCanvas from "@/components/dag/dag-canvas";
import { DagReplay } from "@/components/dag/dag-replay";
import type { DagNodeData } from "@/components/dag/dag-config";
import AppThemeToggle from "@/components/theme/app-theme-toggle";
import { useDagWebSocket } from "@/hooks/use-dag-websocket";

type RunDetailClientProps = {
  runId: string;
};

const CONNECTION_STYLE = {
  connecting: {
    label: "Connecting",
    dot: "#f59e0b",
  },

  connected: {
    label: "Live",
    dot: "#10b981",
  },

  disconnected: {
    label: "Offline",
    dot: "#71717a",
  },

  error: {
    label: "Connection error",
    dot: "#ef4444",
  },
} as const;

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
    >
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4H6.5A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M19 12H5M11 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
    >
      <path
        d="M8 5.5v13l10-6.5-10-6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M4 12h4l2-7 4 14 2-7h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M12 10.5v5M12 7.5h.01"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatDuration(
  node: Node<DagNodeData>,
) {
  if (
    !node.data.startTime ||
    !node.data.endTime
  ) {
    return "—";
  }

  const start = new Date(
    node.data.startTime,
  ).getTime();

  const end = new Date(
    node.data.endTime,
  ).getTime();

  const duration = Math.max(
    0,
    end - start,
  );

  if (duration < 1000) {
    return `${duration}ms`;
  }

  return `${(
    duration / 1000
  ).toFixed(2)}s`;
}

function formatTime(
  value:
    | string
    | number
    | Date
    | undefined,
) {
  if (!value) {
    return "—";
  }

  return new Date(
    value,
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyles(
  status?: string,
) {
  switch (status) {
    case "SUCCESS":
      return "bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-300";

    case "ERROR":
      return "bg-red-500/[0.08] text-red-600 dark:text-red-300";

    case "STUCK":
      return "bg-amber-500/[0.10] text-amber-600 dark:text-amber-300";

    case "RUNNING":
      return "bg-blue-500/[0.08] text-blue-600 dark:text-blue-300";

    default:
      return "bg-[var(--app-surface-raised)] text-[var(--app-text-secondary)]";
  }
}

function getStatusLabel(
  status?: string,
) {
  switch (status) {
    case "SUCCESS":
      return "Success";

    case "ERROR":
      return "Error";

    case "STUCK":
      return "Stuck";

    case "RUNNING":
      return "Running";

    case "PENDING":
      return "Pending";

    default:
      return status ?? "Unknown";
  }
}

function StatusPill({
  status,
}: {
  status?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium",
        getStatusStyles(status),
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",

          status === "SUCCESS"
            ? "bg-emerald-500"
            : "",

          status === "ERROR"
            ? "bg-red-500"
            : "",

          status === "STUCK"
            ? "bg-amber-500"
            : "",

          status === "RUNNING"
            ? "bg-blue-500"
            : "",

          ![
            "SUCCESS",
            "ERROR",
            "STUCK",
            "RUNNING",
          ].includes(status ?? "")
            ? "bg-current"
            : "",
        ].join(" ")}
      />

      {getStatusLabel(status)}
    </span>
  );
}

export default function RunDetailClient({
  runId,
}: RunDetailClientProps) {
  const {
    nodes: liveNodes,
    edges: liveEdges,
    connectionStatus,
    runStatus,
  } = useDagWebSocket(runId);

  const [
    isReplay,
    setIsReplay,
  ] = useState(false);

  const [
    replayNodes,
    setReplayNodes,
  ] = useState<Node<DagNodeData>[]>([]);

  const [
    replayEdges,
    setReplayEdges,
  ] = useState<Edge[]>([]);

  const [
    replayVisibleNodeIds,
    setReplayVisibleNodeIds,
  ] = useState<string[]>([]);

  const [
    selectedNode,
    setSelectedNode,
  ] = useState<Node<DagNodeData> | null>(
    null,
  );

  const connection =
    CONNECTION_STYLE[
      connectionStatus
    ];

  const runStatusStyle = {
    RUNNING: {
      label: "Running",
      dot: "#3b82f6",
    },

    COMPLETED: {
      label: "Completed",
      dot: "#10b981",
    },

    FAILED: {
      label: "Failed",
      dot: "#ef4444",
    },
  }[runStatus];

  const handleReplayChange =
    useCallback(
      (visibleNodeIds: string[]) => {
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
        setReplayVisibleNodeIds([]);
        return;
      }

      setReplayNodes([
        ...liveNodes,
      ]);

      setReplayEdges([
        ...liveEdges,
      ]);

      setReplayVisibleNodeIds([]);
      setIsReplay(true);
    }, [
      isReplay,
      liveNodes,
      liveEdges,
    ]);

  const canvasNodes = isReplay
    ? replayNodes
    : liveNodes;

  const canvasEdges = isReplay
    ? replayEdges
    : liveEdges;

  const runningCount =
    liveNodes.filter(
      (node) =>
        node.data.status ===
        "RUNNING",
    ).length;

  const successCount =
    liveNodes.filter(
      (node) =>
        node.data.status ===
        "SUCCESS",
    ).length;

  const errorCount =
    liveNodes.filter(
      (node) =>
        node.data.status ===
        "ERROR",
    ).length;

  const stuckCount =
    liveNodes.filter(
      (node) =>
        node.data.status ===
        "STUCK",
    ).length;

  const selectedDuration =
    selectedNode
      ? formatDuration(
          selectedNode,
        )
      : null;

  const streamNodes =
    useMemo(
      () =>
        [...liveNodes].sort(
          (a, b) => {
            const aTime =
              new Date(
                a.data.startTime ??
                  0,
              ).getTime();

            const bTime =
              new Date(
                b.data.startTime ??
                  0,
              ).getTime();

            return aTime - bTime;
          },
        ),
      [liveNodes],
    );

  return (
    <main className="flex min-h-[100dvh] bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-[var(--app-border)] bg-[#eef3f8] px-4 backdrop-blur-md sm:px-6 lg:px-8 dark:bg-[var(--app-surface)]">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/runs"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--app-text-secondary)] transition hover:bg-[var(--app-surface-raised)] hover:text-[var(--app-text)]"
              aria-label="Back to runs"
            >
              <ArrowLeftIcon />
            </Link>

            <div className="hidden h-5 w-px bg-[var(--app-border)] sm:block" />

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
                Runs
              </p>

              <p className="truncate text-[12px] font-medium">
                Run details
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium sm:flex"
              style={{
                color: runStatusStyle.dot,
                borderColor: `${runStatusStyle.dot}2A`,
                backgroundColor: `${runStatusStyle.dot}0D`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    runStatusStyle.dot,
                  boxShadow:
                    runStatus ===
                    "RUNNING"
                      ? `0 0 8px ${runStatusStyle.dot}`
                      : "none",
                }}
              />

              {runStatusStyle.label}
            </div>

            <AppThemeToggle />
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
              <div className="min-w-0">
                <section className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[#f4f8fc] shadow-[0_24px_70px_var(--app-shadow)] dark:bg-[var(--app-surface)]">
                  <div className="flex min-h-[62px] items-center justify-between border-b border-[var(--app-border)] bg-[#eaf2fb] px-4 sm:px-5 dark:bg-[var(--app-surface)]">
                    <div>
                      <h2 className="text-[14px] font-semibold tracking-[-0.015em]">
                        Execution graph
                      </h2>

                      <p className="mt-0.5 text-[10px] text-[var(--app-text-muted)]">
                        Visualize the steps your agent took during this run.
                      </p>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                      <span className="rounded-md bg-[#dfe9f3] px-2 py-1 text-[9px] text-[var(--app-text-muted)] dark:bg-[var(--app-surface-raised)]">
                        {liveNodes.length} nodes
                      </span>

                      <span className="rounded-md bg-[#dfe9f3] px-2 py-1 text-[9px] text-[var(--app-text-muted)] dark:bg-[var(--app-surface-raised)]">
                        {liveEdges.length} edges
                      </span>
                    </div>
                  </div>

                  <div className="h-[520px] min-h-[420px] sm:h-[580px] lg:h-[640px]">
                    <DagCanvas
                      nodes={canvasNodes}
                      edges={canvasEdges}
                      fitViewOnChange={isReplay}
                      visibleNodeIds={
                        isReplay
                          ? replayVisibleNodeIds
                          : undefined
                      }
                    />
                  </div>

                  <div className="flex justify-start border-t border-[var(--app-border)] bg-[#e7f0f9] px-4 py-3 sm:px-5 dark:bg-[var(--app-surface)]">
                    <button
                      type="button"
                      onClick={
                        handleReplayToggle
                      }
                      className={[
                        "inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 text-[11px] font-medium transition",

                        isReplay
                          ? "border-blue-500/25 bg-blue-500/[0.08] text-blue-600 dark:text-blue-300"
                          : "border-[#cbd8e5] bg-[#f3f7fb] text-[var(--app-text-secondary)] hover:bg-[#e5edf5] hover:text-[var(--app-text)] dark:border-[var(--app-border)] dark:bg-[var(--app-surface)] dark:hover:bg-[var(--app-surface-raised)]",
                      ].join(" ")}
                    >
                      <PlayIcon />
                      Replay
                    </button>
                  </div>

                  {isReplay && (
                    <div className="flex w-full min-w-0 border-t border-[var(--app-border)] bg-[#dfeaf5] px-4 py-3 sm:px-5 dark:bg-[var(--app-surface-raised)]/45 [&>div]:flex-1 [&>div]:w-full [&>div]:max-w-none [&>div]:min-w-0 [&_input]:w-full [&_input]:max-w-none [&_input]:flex-1 [&_input[type=range]]:w-full [&_input[type=range]]:max-w-none">
                      <DagReplay
                        nodes={replayNodes}
                        onReplayChange={
                          handleReplayChange
                        }
                      />
                    </div>
                  )}
                </section>

                <section className="mt-5 overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[#f3f4fb] shadow-[0_24px_70px_var(--app-shadow)] dark:bg-[var(--app-surface)]">
                  <div className="flex items-center justify-between border-b border-[var(--app-border)] px-4 py-5 sm:px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/[0.10] text-blue-500 dark:text-blue-300">
                        <ActivityIcon />
                      </div>

                      <div>
                        <h2 className="text-[14px] font-semibold">
                          Execution stream
                        </h2>

                        <p className="mt-0.5 text-[10px] text-[var(--app-text-muted)]">
                          Live updates from the agent execution.
                        </p>
                      </div>
                    </div>

                    <div
                      className={[
                        "flex items-center gap-2 text-[10px] font-medium",
                        runStatus === "RUNNING"
                          ? "text-blue-600 dark:text-blue-300"
                          : runStatus === "COMPLETED"
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-red-600 dark:text-red-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          runStatus === "RUNNING"
                            ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.55)]"
                            : runStatus === "COMPLETED"
                              ? "bg-emerald-500"
                              : "bg-red-500",
                        ].join(" ")}
                      />
                      {runStatusStyle.label}
                    </div>
                  </div>

                  {streamNodes.length ===
                  0 ? (
                    <div className="flex min-h-[180px] items-center justify-center px-6 text-center">
                      <div>
                        <p className="text-sm font-medium">
                          Waiting for execution events
                        </p>

                        <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                          Steps will appear here as spans arrive.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {streamNodes.map(
                        (
                          node,
                          index,
                        ) => (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() =>
                              setSelectedNode(
                                node,
                              )
                            }
                            className="group flex w-full items-center gap-3 border-b border-[var(--app-border)] px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-blue-500/[0.04] sm:px-5"
                          >
                            <span className="w-[74px] shrink-0 font-mono text-[9px] text-[var(--app-text-muted)]">
                              {formatTime(
                                node.data
                                  .startTime,
                              )}
                            </span>

                            <span
                              className={[
                                "h-1.5 w-1.5 shrink-0 rounded-full",

                                node.data.status ===
                                "SUCCESS"
                                  ? "bg-emerald-500"
                                  : node.data.status ===
                                      "ERROR"
                                    ? "bg-red-500"
                                    : node.data.status ===
                                        "STUCK"
                                      ? "bg-amber-500"
                                      : "bg-blue-500",
                              ].join(" ")}
                            />

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11px] font-medium">
                                {node.data
                                  .name ??
                                  `Step ${index + 1}`}
                              </p>

                              <p className="mt-0.5 truncate font-mono text-[9px] text-[var(--app-text-muted)]">
                                {node.id}
                              </p>
                            </div>

                            <StatusPill
                              status={
                                node.data
                                  .status
                              }
                            />

                            <span className="hidden w-14 text-right text-[10px] tabular-nums text-[var(--app-text-secondary)] sm:block">
                              {formatDuration(
                                node,
                              )}
                            </span>

                            <span className="text-[var(--app-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--app-text)]">
                              <ChevronIcon />
                            </span>
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </section>
              </div>

              <aside className="min-w-0">
                <section className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[#f5f0fb] shadow-[0_24px_70px_var(--app-shadow)] dark:bg-[var(--app-surface)]">
                  <div className="border-b border-[var(--app-border)] bg-[#eee8f8] px-5 py-5 dark:bg-[var(--app-surface)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/[0.10] text-violet-600 dark:text-violet-300">
                        <InfoIcon />
                      </div>

                      <div>
                        <h2 className="text-[14px] font-semibold">
                          Run details
                        </h2>

                        <p className="mt-0.5 text-[10px] text-[var(--app-text-muted)]">
                          Execution metadata
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-[var(--app-border)]">
                    <DetailRow
                      label="Run ID"
                      value={runId}
                      mono
                      copy
                    />

                    <DetailRow
                      label="Status"
                      value={runStatusStyle.label}
                      status
                    />

                    <DetailRow
                      label="Steps"
                      value={`${liveNodes.length}`}
                    />

                    <DetailRow
                      label="Links"
                      value={`${liveEdges.length}`}
                    />

                    <DetailRow
                      label="Successful"
                      value={`${successCount}`}
                    />

                    <DetailRow
                      label="Errors"
                      value={`${errorCount}`}
                    />

                    <DetailRow
                      label="Stuck"
                      value={`${stuckCount}`}
                    />
                  </div>
                </section>

                <section className="mt-5 overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[#eef5fc] shadow-[0_24px_70px_var(--app-shadow)] dark:bg-[var(--app-surface)]">
                  <div className="border-b border-[var(--app-border)] bg-[#e5eff9] px-5 py-5 dark:bg-[var(--app-surface)]">
                    <h2 className="text-[14px] font-semibold">
                      Selected step
                    </h2>

                    <p className="mt-0.5 text-[10px] text-[var(--app-text-muted)]">
                      Inspect an individual span.
                    </p>
                  </div>

                  {selectedNode ? (
                    <div>
                      <div className="border-b border-[var(--app-border)] bg-[#f4f8fd] px-5 py-5 dark:bg-[var(--app-surface)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold">
                              {selectedNode.data
                                .name ??
                                "Unnamed step"}
                            </p>

                            <p className="mt-1 truncate font-mono text-[9px] text-[var(--app-text-muted)]">
                              {selectedNode.id}
                            </p>
                          </div>

                          <StatusPill
                            status={
                              selectedNode
                                .data
                                .status
                            }
                          />
                        </div>
                      </div>

                      <div className="divide-y divide-[var(--app-border)]">
                        <DetailRow
                          label="Duration"
                          value={
                            selectedDuration ??
                            "—"
                          }
                        />

                        <DetailRow
                          label="Started"
                          value={formatTime(
                            selectedNode
                              .data
                              .startTime,
                          )}
                        />

                        <DetailRow
                          label="Tokens"
                          value={
                            selectedNode
                              .data
                              .totalTokens !=
                            null
                              ? selectedNode
                                  .data
                                  .totalTokens
                                  .toLocaleString()
                              : "—"
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 py-8 text-center">
                      <div className="mx-auto mb-3 h-1.5 w-1.5 rounded-full bg-[var(--app-text-muted)]" />

                      <p className="text-[11px] font-medium">
                        No step selected
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-[var(--app-text-muted)]">
                        Select a node in the execution stream to inspect it.
                      </p>
                    </div>
                  )}
                </section>

                <section className="mt-5 rounded-2xl border border-[var(--app-border)] bg-[#edf8f3] p-5 shadow-[0_24px_70px_var(--app-shadow)] dark:bg-[var(--app-surface)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
                        Connection
                      </p>

                      <p className="mt-1 text-[13px] font-medium">
                        {connection.label}
                      </p>
                    </div>

                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          connection.dot,
                        boxShadow:
                          connectionStatus ===
                          "connected"
                            ? `0 0 10px ${connection.dot}`
                            : "none",
                      }}
                    />
                  </div>

                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#dbece5] dark:bg-[var(--app-surface-raised)]">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width:
                          connectionStatus ===
                          "connected"
                            ? "100%"
                            : connectionStatus ===
                                "connecting"
                              ? "55%"
                              : "18%",
                      }}
                    />
                  </div>

                  <p className="mt-3 text-[10px] leading-5 text-[var(--app-text-muted)]">
                    Beacon is subscribed to this run&apos;s execution channel and will update the graph as new spans arrive.
                  </p>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  copy = false,
  status = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copy?: boolean;
  status?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="shrink-0 text-[10px] text-[var(--app-text-muted)]">
        {label}
      </span>

      <div className="flex min-w-0 items-center gap-2">
        {status ? (
          <StatusPill
            status={
              value === "Running"
                ? "RUNNING"
                : value === "Failed"
                  ? "ERROR"
                  : "SUCCESS"
            }
          />
        ) : (
          <span
            className={[
              "truncate text-right text-[10px] font-medium text-[var(--app-text-secondary)]",
              mono
                ? "font-mono"
                : "",
            ].join(" ")}
          >
            {value}
          </span>
        )}

        {copy && (
          <button
            type="button"
            className="shrink-0 text-[var(--app-text-muted)] transition hover:text-[var(--app-text)]"
            aria-label={`Copy ${label}`}
          >
            <CopyIcon />
          </button>
        )}
      </div>
    </div>
  );
}