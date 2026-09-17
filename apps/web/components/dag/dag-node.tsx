"use client";

import { Handle, Position } from "@xyflow/react";

export type NodeStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "ERROR"
  | "STUCK";

export type DagNodeData = {
  name: string;
  status: NodeStatus;
  duration?: string;
};

type DagNodeProps = {
  data: DagNodeData;
};

type StatusConfig = {
  label: string;
  indicator: string;
  glow: string;
};

const STATUS_CONFIG: Record<NodeStatus, StatusConfig> = {
  PENDING: {
    label: "Pending",
    indicator: "bg-zinc-500",
    glow: "shadow-[0_8px_30px_rgba(0,0,0,0.28)]",
  },

  RUNNING: {
    label: "Running",
    indicator: "bg-blue-500",
    glow: "shadow-[0_8px_30px_rgba(59,130,246,0.12)]",
  },

  SUCCESS: {
    label: "Success",
    indicator: "bg-emerald-500",
    glow: "shadow-[0_8px_30px_rgba(16,185,129,0.10)]",
  },

  ERROR: {
    label: "Error",
    indicator: "bg-red-500",
    glow: "shadow-[0_8px_30px_rgba(239,68,68,0.12)]",
  },

  STUCK: {
    label: "Stuck",
    indicator: "bg-amber-500",
    glow: "shadow-[0_8px_30px_rgba(245,158,11,0.12)]",
  },
};

const NODE_STYLES = {
  container:
    "relative flex h-[96px] w-[250px] items-center rounded-xl border border-zinc-700 bg-zinc-950 shadow-xl",

  content:
    "flex w-full items-center justify-between gap-6 !px-6 !py-4",

  textContent:
    "min-w-0",

  name:
    "truncate text-sm font-semibold leading-5 text-zinc-100",

  statusRow:
    "mt-2 flex items-center gap-2",

  indicator:
    "h-2 w-2 shrink-0 rounded-full",

  statusText:
    "text-xs font-medium leading-4 text-zinc-400",

  duration:
    "shrink-0 text-xs font-medium leading-4 tabular-nums text-zinc-500",

  handle:
    "!top-1/2 !h-2 !w-2 !-translate-y-1/2 !border !border-zinc-600 !bg-zinc-800",
} as const;

export default function DagNode({ data }: DagNodeProps) {
  const config = STATUS_CONFIG[data.status];

  const isActive =
    data.status === "RUNNING" ||
    data.status === "STUCK";

  return (
    <div className={`${NODE_STYLES.container} ${config.glow}`}>
      <Handle
        type="target"
        position={Position.Left}
        className={NODE_STYLES.handle}
      />

      <div className={NODE_STYLES.content}>
        <div className={NODE_STYLES.textContent}>
          <p className={NODE_STYLES.name}>
            {data.name}
          </p>

          <div className={NODE_STYLES.statusRow}>
            <span
              aria-hidden="true"
              className={`${NODE_STYLES.indicator} ${
                config.indicator
              } ${isActive ? "animate-pulse" : ""}`}
            />

            <span className={NODE_STYLES.statusText}>
              {config.label}
            </span>
          </div>
        </div>

        {data.duration && (
          <span className={NODE_STYLES.duration}>
            {data.duration}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className={NODE_STYLES.handle}
      />
    </div>
  );
}