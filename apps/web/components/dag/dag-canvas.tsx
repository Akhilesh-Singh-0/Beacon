"use client";

import { useMemo, useState } from "react";

import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import DagNode from "./dag-node";
import DagEdge from "./dag-edge";

import {
  DAG_CANVAS,
  DAG_STATUS_CONFIG,
  type DagEdgeData,
  type DagNodeData,
} from "./dag-config";

import { layoutDag } from "./dag-layout";

type DagCanvasProps = {
  nodes: Node<DagNodeData>[];
  edges: Edge[];
};

const NODE_TYPES = {
  dagNode: DagNode,
};

const EDGE_TYPES = {
  dagEdge: DagEdge,
};

function getEdgeStatus(
  sourceStatus:
    | DagNodeData["status"]
    | undefined,
  targetStatus:
    | DagNodeData["status"]
    | undefined,
): DagNodeData["status"] {
  if (
    targetStatus === "ERROR" ||
    targetStatus === "STUCK"
  ) {
    return targetStatus;
  }

  if (
    targetStatus === "RUNNING" ||
    sourceStatus === "RUNNING"
  ) {
    return "RUNNING";
  }

  if (
    sourceStatus === "ERROR" ||
    sourceStatus === "STUCK"
  ) {
    return sourceStatus;
  }

  if (
    targetStatus === "SUCCESS" &&
    sourceStatus === "SUCCESS"
  ) {
    return "SUCCESS";
  }

  return "PENDING";
}

export default function DagCanvas({
  nodes,
  edges,
}: DagCanvasProps) {
  const [
    selectedNodeId,
    setSelectedNodeId,
  ] = useState<string | null>(null);

  const positionedNodes = useMemo(
    () => layoutDag(nodes, edges),
    [nodes, edges],
  );

  const graphNodes = useMemo(
    () =>
      positionedNodes.map((node) => ({
        ...node,

        selected:
          node.id === selectedNodeId,
      })),
    [positionedNodes, selectedNodeId],
  );

  const graphEdges = useMemo<
    Edge<DagEdgeData, "dagEdge">[]
  >(() => {
    const statusByNodeId = new Map(
      nodes.map((node) => [
        node.id,
        node.data.status,
      ]),
    );

    const outgoingCount = new Map<
      string,
      number
    >();

    for (const edge of edges) {
      outgoingCount.set(
        edge.source,
        (outgoingCount.get(edge.source) ?? 0) +
          1,
      );
    }

    return edges.map((edge) => {
      const status = getEdgeStatus(
        statusByNodeId.get(edge.source),
        statusByNodeId.get(edge.target),
      );

      const config =
        DAG_STATUS_CONFIG[status];

      return {
        ...edge,

        type: "dagEdge",

        data: {
          status,

          isBranch:
            (outgoingCount.get(edge.source) ?? 0) >
            1,
        },

        style: {
          stroke: config.edge.color,
          strokeWidth:
            config.edge.width,
        },
      };
    });
  }, [edges, nodes]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor:
          DAG_CANVAS.surface,

        backgroundImage:
          "radial-gradient(circle at 50% 38%, rgba(124,58,237,0.018), transparent 52%)",
      }}
    >
      <ReactFlow
        nodes={graphNodes}
        edges={graphEdges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        defaultEdgeOptions={{
          type: "dagEdge",
        }}
        fitView
        fitViewOptions={{
          padding:
            DAG_CANVAS.zoom.fitPadding,
        }}
        colorMode="dark"
        minZoom={DAG_CANVAS.zoom.min}
        maxZoom={DAG_CANVAS.zoom.max}
        nodesDraggable={false}
        nodesConnectable={false}
        selectionOnDrag={false}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
        }}
        onPaneClick={() => {
          setSelectedNodeId(null);
        }}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background
          color={
            DAG_CANVAS.background.color
          }
          gap={
            DAG_CANVAS.background.gap
          }
          size={
            DAG_CANVAS.background.size
          }
        />

        <Controls
          position="bottom-left"
          showInteractive={false}
        />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.6)]" />

            <p className="text-sm font-medium text-zinc-300">
              Waiting for spans
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              The execution graph will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}