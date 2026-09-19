"use client";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import {
  DAG_NODE,
  DAG_STATUS_CONFIG,
  type DagNodeData,
} from "./dag-config";

type DagNode = {
  id: string;
  type: "dagNode";
  data: DagNodeData;
};

const NODE_STYLES = {
  handle:
    "!top-1/2 !h-1 !w-1 !-translate-y-1/2 !border-0 !bg-transparent !opacity-0 !pointer-events-none",

  name:
    "truncate text-[14px] font-semibold leading-5 tracking-[-0.01em] text-zinc-100",

  statusRow:
    "mt-2 flex items-center gap-2",

  indicator:
    "h-2 w-2 shrink-0 rounded-full",

  statusText:
    "text-[12px] font-medium leading-4 text-zinc-300",

  duration:
    "shrink-0 font-mono text-[11px] font-medium leading-4 tabular-nums text-zinc-400",
} as const;

function getStatusGlow(
  status: DagNodeData["status"],
) {
  switch (status) {
    case "RUNNING":
      return {
        background:
          "rgba(96,165,250,0.15)",
        dot:
          "0 0 10px rgba(96,165,250,0.72)",
      };

    case "ERROR":
      return {
        background:
          "rgba(248,113,113,0.12)",
        dot:
          "0 0 9px rgba(248,113,113,0.65)",
      };

    case "STUCK":
      return {
        background:
          "rgba(251,191,36,0.11)",
        dot:
          "0 0 9px rgba(251,191,36,0.58)",
      };

    case "SUCCESS":
      return {
        background:
          "rgba(16,185,129,0.065)",
        dot:
          "0 0 7px rgba(52,211,153,0.45)",
      };

    default:
      return {
        background:
          "rgba(148,163,184,0.035)",
        dot:
          "0 0 5px rgba(148,163,184,0.22)",
      };
  }
}

export default function DagNode({
  data,
  selected,
}: NodeProps<DagNode>) {
  const config =
    DAG_STATUS_CONFIG[data.status];

  const statusGlow =
    getStatusGlow(data.status);

  const isRunning =
    data.status === "RUNNING";

  return (
    <div
      className="relative"
      style={{
        width: DAG_NODE.width,
        height: DAG_NODE.height,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-[18px] blur-2xl"
        style={{
          background:
            statusGlow.background,
          opacity: selected ? 1 : 0.8,
        }}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius:
            DAG_NODE.borderRadius,

          background:
            config.surface,

          border: `1px solid ${
            selected
              ? DAG_NODE.selectedBorder
              : config.border
          }`,

          boxShadow: selected
            ? DAG_NODE.selectedShadow
            : DAG_NODE.shadow,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px"
          style={{
            background:
              DAG_NODE.topHighlight,
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl"
          style={{
            background:
              statusGlow.background,
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 bottom-0 h-px"
          style={{
            background:
              DAG_NODE.bottomGlow,
          }}
        />

        <div
          className="flex h-full w-full items-center justify-between gap-4"
          style={{
            padding: `${DAG_NODE.paddingY}px ${DAG_NODE.paddingX}px`,
          }}
        >
          <div className="min-w-0">
            <p className={NODE_STYLES.name}>
              {data.name}
            </p>

            <div
              className={
                NODE_STYLES.statusRow
              }
            >
              <span
                aria-hidden="true"
                className={[
                  NODE_STYLES.indicator,
                  config.indicator,
                  isRunning
                    ? "animate-pulse"
                    : "",
                ].join(" ")}
                style={{
                  boxShadow:
                    statusGlow.dot,
                }}
              />

              <span
                className={
                  NODE_STYLES.statusText
                }
              >
                {config.label}
              </span>
            </div>
          </div>

          {data.duration && (
            <span
              className={
                NODE_STYLES.duration
              }
            >
              {data.duration}
            </span>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className={
          NODE_STYLES.handle
        }
      />

      <Handle
        type="source"
        position={Position.Right}
        className={
          NODE_STYLES.handle
        }
      />
    </div>
  );
}