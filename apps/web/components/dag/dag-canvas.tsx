"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

export default function DagCanvas() {
  return (
    <div className="h-full w-full bg-zinc-950">
      <ReactFlow
        nodes={[]}
        edges={[]}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
        />

        <Controls />
      </ReactFlow>
    </div>
  );
}