"use client";

import {
  BaseEdge,
  getBezierPath,
  Position,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

import {
  DAG_EDGE,
  DAG_STATUS_CONFIG,
  type DagEdgeData,
} from "./dag-config";

type DagEdge = Edge<DagEdgeData, "dagEdge">;

function FlowParticle({
  path,
  color,
  duration,
  begin,
  radius,
}: {
  path: string;
  color: string;
  duration: string;
  begin: string;
  radius: number;
}) {
  return (
    <circle
      r={radius}
      fill={color}
      opacity="0"
      pointerEvents="none"
      style={{
        filter: `drop-shadow(0 0 5px ${color})`,
      }}
    >
      <animateMotion
        path={path}
        dur={duration}
        begin={begin}
        repeatCount="indefinite"
      />

      <animate
        attributeName="opacity"
        values="0;0.95;0"
        dur={duration}
        begin={begin}
        repeatCount="indefinite"
      />

      <animate
        attributeName="r"
        values={`${radius * 0.6};${radius};${radius * 0.6}`}
        dur={duration}
        begin={begin}
        repeatCount="indefinite"
      />
    </circle>
  );
}

function ArrowHead({
  color,
  targetX,
  targetY,
  targetPosition,
  size,
  opacity,
}: {
  color: string;
  targetX: number;
  targetY: number;
  targetPosition: Position;
  size: number;
  opacity: number;
}) {
  let rotation = 0;

  if (targetPosition === Position.Left) {
    rotation = 180;
  }

  if (targetPosition === Position.Top) {
    rotation = -90;
  }

  if (targetPosition === Position.Bottom) {
    rotation = 90;
  }

  const points = [
    "0,0",
    `${-size},-${size * 0.46}`,
    `${-size * 0.7},0`,
    `${-size},${size * 0.46}`,
  ].join(" ");

  return (
    <polygon
      points={points}
      fill={color}
      opacity={opacity}
      transform={`translate(${targetX} ${targetY}) rotate(${rotation})`}
      pointerEvents="none"
    />
  );
}

export default function DagEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<DagEdge>) {
  const status =
    data?.status ?? "PENDING";

  const isBranch =
    data?.isBranch ?? false;

  const config =
    DAG_STATUS_CONFIG[status];

  const isRunning =
    status === "RUNNING";

  const [edgePath] =
    getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: isBranch
        ? 0.34
        : 0.18,
    });

  const edgeColor =
    isRunning
      ? DAG_EDGE.activeColor
      : DAG_EDGE.color;

  const edgeWidth =
    isRunning
      ? DAG_EDGE.activeWidth
      : DAG_EDGE.baseWidth;

  const edgeOpacity =
    isRunning
      ? DAG_EDGE.activeOpacity
      : DAG_EDGE.baseOpacity;

  return (
    <g
      className="beacon-edge"
      pointerEvents="none"
    >
      <BaseEdge
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth:
            edgeWidth + 7,
          strokeLinecap:
            "round",
          opacity: isRunning
            ? 0.16
            : 0.07,
          filter:
            "blur(3px)",
          vectorEffect:
            "non-scaling-stroke",
        }}
      />

      <BaseEdge
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth:
            edgeWidth + 2,
          strokeLinecap:
            "round",
          opacity: isRunning
            ? 0.22
            : 0.12,
          filter:
            config.edge.glow,
          vectorEffect:
            "non-scaling-stroke",
        }}
      />

      <BaseEdge
        path={edgePath}
        style={{
          stroke: edgeColor,
          strokeWidth:
            edgeWidth,
          strokeLinecap:
            "round",
          opacity:
            edgeOpacity,
          vectorEffect:
            "non-scaling-stroke",
        }}
      />

      <FlowParticle
        path={edgePath}
        color={
          isRunning
            ? "#A8C7FF"
            : "#8B9BFF"
        }
        duration={
          isRunning
            ? "2.1s"
            : "2.8s"
        }
        begin="-0.7s"
        radius={
          isRunning ? 2.4 : 2
        }
      />

      {isRunning &&
        isBranch && (
          <FlowParticle
            path={edgePath}
            color="#C4B5FD"
            duration="2.5s"
            begin="-1.5s"
            radius={1.7}
          />
        )}

      <ArrowHead
        color={edgeColor}
        targetX={targetX}
        targetY={targetY}
        targetPosition={
          targetPosition
        }
        size={
          DAG_EDGE.arrowSize
        }
        opacity={
          isRunning
            ? 0.9
            : 0.55
        }
      />
    </g>
  );
}