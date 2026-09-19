"use client";

import { useMemo, useState } from "react";

import {
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
          "radial-gradient(ellipse 58% 78% at 50% 50%, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.065) 32%, transparent 72%), radial-gradient(ellipse 34% 52% at 70% 56%, rgba(124,58,237,0.04) 0%, transparent 72%), linear-gradient(rgba(96,165,250,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.035) 1px, transparent 1px)",

        backgroundSize:
          "100% 100%, 100% 100%, 36px 36px, 36px 36px",
      }}
    >
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0A0F15]/80 px-8 py-7 text-center backdrop-blur-md">
            <div className="mx-auto mb-3 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />

            <p className="text-sm font-medium text-zinc-300">
              Waiting for spans
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              The execution graph will appear here.
            </p>
          </div>
        </div>
      ) : (
        <ReactFlow
          className="!bg-transparent"
          style={{
            background: "transparent",
          }}
          nodes={graphNodes}
          edges={graphEdges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          defaultEdgeOptions={{
            type: "dagEdge",
          }}
          fitView
          fitViewOptions={{
            padding: 0.12,
            minZoom: 0.55,
            maxZoom: 1.15,
            duration: 0,
          }}
          colorMode="dark"
          minZoom={
            DAG_CANVAS.zoom.min
          }
          maxZoom={
            DAG_CANVAS.zoom.max
          }
          nodesDraggable={false}
          nodesConnectable={false}
          selectionOnDrag={false}
          onNodeClick={(_, node) => {
            setSelectedNodeId(
              node.id,
            );
          }}
          onPaneClick={() => {
            setSelectedNodeId(
              null,
            );
          }}
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Controls
            position="bottom-left"
            showInteractive={false}
            className="!bottom-5 !left-5 !overflow-hidden !rounded-xl !border !border-white/[0.08] !bg-[#0B1118]/85 !shadow-[0_14px_36px_rgba(0,0,0,0.34)] !backdrop-blur-md [&>button]:!border-white/[0.06] [&>button]:!bg-transparent [&>button]:!fill-zinc-400 [&>button:hover]:!bg-white/[0.04] [&>button:hover]:!fill-zinc-200"
          />
        </ReactFlow>
      )}
    </div>
  );
}