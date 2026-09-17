"use client";

import { useEffect, useState } from "react";
import type { Edge, Node } from "@xyflow/react";

import type { DagNodeData } from "@/components/dag/dag-node";

type ExistingGraphNode = {
  id: string;
  spanId: string;
  parentSpanId: string | null;
  name: string;
  startTime: string;
  endTime: string | null;
  status: DagNodeData["status"];
  attributes: unknown;
};

type ExistingGraphEdge = {
  sourceNodeId: string;
  targetNodeId: string;
};

type GraphResponse = {
  nodes: ExistingGraphNode[];
  edges: ExistingGraphEdge[];
};

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

    let cancelled = false;
    let socket: WebSocket | null = null;

    setNodes([]);
    setEdges([]);

    async function initialize() {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ??
        "http://localhost:3001";

      try {
        const response = await fetch(
          `${apiUrl}/runs/${runId}/graph`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch graph: ${response.status} ${response.statusText}`,
          );
        }

        const {
          nodes: existingNodes,
          edges: existingEdges,
        }: GraphResponse = await response.json();

        if (cancelled) {
          return;
        }

        const flowNodes: Node<DagNodeData>[] =
          existingNodes.map((node, index) => ({
            id: node.id,
            type: "dagNode",
            position: {
              x: index * NODE_LAYOUT.horizontalGap,
              y: NODE_LAYOUT.y,
            },
            data: {
              name: node.name,
              status: node.status,
              duration: undefined,
            },
          }));

        const flowEdges: Edge[] =
          existingEdges.map((edge) => ({
            id: `${edge.sourceNodeId}-${edge.targetNodeId}`,
            source: edge.sourceNodeId,
            target: edge.targetNodeId,
            type: "straight",
            animated: true,
          }));

        setNodes(flowNodes);
        setEdges(flowEdges);

        console.log("Initial graph loaded", {
          runId,
          nodes: flowNodes.length,
          edges: flowEdges.length,
        });
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to fetch initial graph",
            error,
          );
        }
      }

      if (cancelled) {
        return;
      }

      const wsUrl = getWebSocketUrl(runId);

      console.log(
        "Connecting to WebSocket:",
        wsUrl,
      );

      socket = new WebSocket(wsUrl);

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

      socket.onerror = () => {
        console.error("WebSocket error", {
          runId,
          url: wsUrl,
        });
      };

      socket.onclose = (event) => {
        console.log("WebSocket disconnected", {
          runId,
          url: wsUrl,
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
      };
    }

    void initialize();

    return () => {
      cancelled = true;
      socket?.close();
    };
  }, [runId]);

  return {
    nodes,
    edges,
  };
}