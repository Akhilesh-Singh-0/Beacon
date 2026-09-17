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

const NODE_TYPES = {
  dagNode: DagNode,
};

const CANVAS_CONFIG = {
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

  surface: "#0a0a0a",
} as const;

const nodes: Node<DagNodeData>[] = [
  {
    id: "node-1",
    type: "dagNode",
    position: { x: 40, y: 200 },
    data: {
      name: "Agent",
      status: "SUCCESS",
      duration: "1.2s",
    },
  },

  {
    id: "node-2",
    type: "dagNode",
    position: { x: 370, y: 200 },
    data: {
      name: "LLM Call",
      status: "RUNNING",
      duration: "3.4s",
    },
  },

  {
    id: "node-3",
    type: "dagNode",
    position: { x: 700, y: 200 },
    data: {
      name: "Tool Call",
      status: "STUCK",
      duration: "5m+",
    },
  },
];

const edges: Edge[] = [
  {
    id: "edge-1",
    source: "node-1",
    target: "node-2",
    type: "straight",
    animated: true,
  },

  {
    id: "edge-2",
    source: "node-2",
    target: "node-3",
    type: "straight",
    animated: true,
  },
];

const EDGE_STYLE = {
  stroke: CANVAS_CONFIG.edge.color,
  strokeWidth: CANVAS_CONFIG.edge.width,
  filter: CANVAS_CONFIG.edge.glow,
};

export default function DagCanvas() {
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        backgroundColor: CANVAS_CONFIG.surface,
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