"use client";

import {
  BaseEdge,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
  Position,
} from "@xyflow/react";

import {
  DAG_EDGE,
  DAG_STATUS_CONFIG,
  type DagEdgeData,
} from "./dag-config";

type DagEdge = Edge<DagEdgeData, "dagEdge">;

function ArrowHead({
  color,
  targetX,
  targetY,
  size,
  animated,
  animationDuration,
  opacity,
}: {
  color: string;
  targetX: number;
  targetY: number;
  size: number;
  animated: boolean;
  animationDuration: string;
  opacity: number;
}) {
  const points = [
    "0,0",
    `${-size},-${size * 0.46}`,
    `${-size * 0.72},0`,
    `${-size},${size * 0.46}`,
  ].join(" ");

  return (
    <g
      transform={`translate(${targetX} ${targetY})`}
      pointerEvents="none"
    >
      <polygon
        points={points}
        fill={color}
        opacity={opacity}
      >
        {animated && (
          <>
            <animate
              attributeName="opacity"
              values="0.45;1;0.45"
              dur={animationDuration}
              repeatCount="indefinite"
            />

            <animateTransform
              attributeName="transform"
              type="scale"
              values="0.84;1;0.84"
              dur={animationDuration}
              repeatCount="indefinite"
            />
          </>
        )}
      </polygon>
    </g>
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

  const isAnimated =
    config.edge.animated;

  const branchX =
    sourceX + DAG_EDGE.branchLength;

  const [edgePath] =
    getSmoothStepPath({
      sourceX: isBranch
        ? branchX
        : sourceX,

      sourceY,

      sourcePosition: isBranch
        ? Position.Right
        : sourcePosition,

      targetX,
      targetY,
      targetPosition,

      borderRadius:
        DAG_EDGE.borderRadius,

      offset:
        DAG_EDGE.offset,
    });

  const trunkPath = isBranch
    ? `M ${sourceX} ${sourceY} L ${branchX} ${sourceY}`
    : null;

  const opacity = isAnimated
    ? DAG_EDGE.activeOpacity
    : DAG_EDGE.baseOpacity;

  return (
    <g
      pointerEvents="none"
      className="beacon-edge"
    >

      {trunkPath && (
        <path
          d={trunkPath}
          fill="none"
          stroke={DAG_EDGE.color}
          strokeWidth={DAG_EDGE.baseWidth}
          strokeLinecap="round"
          opacity={0.82}
          vectorEffect="non-scaling-stroke"
        />
      )}

      <BaseEdge
        path={edgePath}
        style={{
          stroke: config.edge.color,
          strokeWidth:
            config.edge.width + 2.5,
          strokeLinecap: "round",
          opacity: isAnimated
            ? 0.09
            : 0.045,
          filter: config.edge.glow,
        }}
      />

      <BaseEdge
        path={edgePath}
        style={{
          stroke: config.edge.color,
          strokeWidth:
            config.edge.width,
          strokeLinecap: "round",
          opacity,
        }}
      />

      {isAnimated && (
        <circle
          r="2"
          fill={config.edge.color}
        >
          <animateMotion
            path={edgePath}
            dur={
              DAG_EDGE.animationDuration
            }
            repeatCount="indefinite"
          />

          <animate
            attributeName="opacity"
            values="0;1;0"
            dur={
              DAG_EDGE.animationDuration
            }
            repeatCount="indefinite"
          />

          <animate
            attributeName="r"
            values="1.4;2.4;1.4"
            dur={
              DAG_EDGE.animationDuration
            }
            repeatCount="indefinite"
          />
        </circle>
      )}

      <ArrowHead
        color={config.edge.color}
        targetX={targetX}
        targetY={targetY}
        size={DAG_EDGE.arrowSize}
        animated={isAnimated}
        animationDuration={
          DAG_EDGE.animationDuration
        }
        opacity={opacity}
      />
    </g>
  );
}