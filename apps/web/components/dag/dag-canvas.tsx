"use client";

import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import DagNode, {
  type DagNodeData,
} from "./dag-node";

type DagCanvasProps = {
  nodes: Node<DagNodeData>[];
  edges: Edge[];
};

const NODE_TYPES = {
  dagNode: DagNode,
};

const CANVAS_CONFIG = {
  surface: "#0a0a0a",

  background: {
    color: "#27272a",
    gap: 24,
    size: 1,
  },

  edge: {
    color: "#3b82f6",
    width: 2,
    glow: "drop-shadow(0 0 5px rgba(59, 130, 246, 0.55))",
  },
} as const;

const EDGE_STYLE = {
  stroke: CANVAS_CONFIG.edge.color,
  strokeWidth: CANVAS_CONFIG.edge.width,
  filter: CANVAS_CONFIG.edge.glow,
};

export default function DagCanvas({
  nodes,
  edges,
}: DagCanvasProps) {
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        backgroundColor:
          CANVAS_CONFIG.surface,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        defaultEdgeOptions={{
          type: "straight",
          style: EDGE_STYLE,
        }}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        colorMode="dark"
        minZoom={0.25}
        maxZoom={2}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background
          color={CANVAS_CONFIG.background.color}
          gap={CANVAS_CONFIG.background.gap}
          size={CANVAS_CONFIG.background.size}
        />

        <Controls />
      </ReactFlow>
    </div>
  );
}