"use client";

import { useEffect, useState } from "react";
import type { Edge, Node } from "@xyflow/react";

import type { DagNodeData } from "@/components/dag/dag-node";

type NodeCreatedEvent = {
  type: "node.created";
  runId: string;
  node: {
    id: string;
    spanId: string;
    parentSpanId: string | null;
    name: string;
    startTime: string;
    endTime: string | null;
    status: DagNodeData["status"];
    attributes: unknown;
  };
};

type EdgeCreatedEvent = {
  type: "edge.created";
  runId: string;
  edge: {
    sourceNodeId: string;
    targetNodeId: string;
  };
};

type RunWebSocketEvent =
  | NodeCreatedEvent
  | EdgeCreatedEvent;

type UseDagWebSocketReturn = {
  nodes: Node<DagNodeData>[];
  edges: Edge[];
};

const NODE_LAYOUT = {
  horizontalGap: 330,
  y: 200,
} as const;

function getWebSocketUrl(runId: string) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001";

  const url = new URL(apiUrl);

  url.protocol =
    url.protocol === "https:" ? "wss:" : "ws:";

  url.pathname = `/ws/${runId}`;

  return url.toString();
}

export function useDagWebSocket(
  runId: string,
): UseDagWebSocketReturn {
  const [nodes, setNodes] = useState<
    Node<DagNodeData>[]
  >([]);

  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!runId) {
      return;
    }

    const socket = new WebSocket(
      getWebSocketUrl(runId),
    );

    socket.onopen = () => {
      console.log("WebSocket connected", {
        runId,
      });
    };

    socket.onmessage = (event) => {
      try {
        const message: RunWebSocketEvent =
          JSON.parse(event.data);

        switch (message.type) {
          case "node.created": {
            const node: Node<DagNodeData> = {
              id: message.node.id,
              type: "dagNode",
              position: {
                x: 0,
                y: NODE_LAYOUT.y,
              },
              data: {
                name: message.node.name,
                status: message.node.status,
                duration: undefined,
              },
            };

            setNodes((currentNodes) => {
              if (
                currentNodes.some(
                  (existingNode) =>
                    existingNode.id === node.id,
                )
              ) {
                return currentNodes;
              }

              const position = {
                x:
                  currentNodes.length *
                  NODE_LAYOUT.horizontalGap,
                y: NODE_LAYOUT.y,
              };

              return [
                ...currentNodes,
                {
                  ...node,
                  position,
                },
              ];
            });

            break;
          }

          case "edge.created": {
            const edge: Edge = {
              id: `${message.edge.sourceNodeId}-${message.edge.targetNodeId}`,
              source: message.edge.sourceNodeId,
              target: message.edge.targetNodeId,
              type: "straight",
              animated: true,
            };

            setEdges((currentEdges) => {
              if (
                currentEdges.some(
                  (existingEdge) =>
                    existingEdge.id === edge.id,
                )
              ) {
                return currentEdges;
              }

              return [...currentEdges, edge];
            });

            break;
          }

          default:
            break;
        }
      } catch (error) {
        console.error(
          "Failed to process WebSocket message",
          error,
        );
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error", {
        runId,
        error,
      });
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected", {
        runId,
      });
    };

    return () => {
      socket.close();
    };
  }, [runId]);

  return {
    nodes,
    edges,
  };
}