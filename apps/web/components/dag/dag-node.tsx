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
    "mt-2.5 flex items-center gap-2",

  indicator:
    "h-2 w-2 shrink-0 rounded-full",

  statusText:
    "text-[12px] font-medium leading-4 text-zinc-400",

  duration:
    "shrink-0 font-mono text-[11px] font-medium leading-4 tabular-nums text-zinc-500",
} as const;

export default function DagNode({
  data,
  selected,
}: NodeProps<DagNode>) {
  const config =
    DAG_STATUS_CONFIG[data.status];

  const isActive =
    data.status === "RUNNING" ||
    data.status === "STUCK";

  return (
    <div
      className={[
        "group relative",
        config.glow,
      ].join(" ")}
      style={{
        width: DAG_NODE.width,
        height: DAG_NODE.height,
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden transition-all duration-200"
        style={{
          borderRadius: DAG_NODE.borderRadius,
          background: config.surface,

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
          className="pointer-events-none absolute inset-x-10 bottom-0 h-px"
          style={{
            background:
              DAG_NODE.bottomGlow,
          }}
        />

        <div
          className="relative flex h-full w-full items-center justify-between gap-6"
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
                  isActive
                    ? "animate-pulse"
                    : "",
                ].join(" ")}
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
        className={NODE_STYLES.handle}
      />

      <Handle
        type="source"
        position={Position.Right}
        className={NODE_STYLES.handle}
      />
    </div>
  );
}