"use client";

import DagCanvas from "@/components/dag/dag-canvas";
import { useDagWebSocket } from "@/hooks/use-dag-websocket";

type RunDetailClientProps = {
  runId: string;
};

export default function RunDetailClient({
  runId,
}: RunDetailClientProps) {
  const { nodes, edges } = useDagWebSocket(runId);

  return (
    <section className="min-h-0 flex-1 h-full">
      <DagCanvas
        nodes={nodes}
        edges={edges}
      />
    </section>
  );
}