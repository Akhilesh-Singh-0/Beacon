"use client";

import { useEffect, useState } from "react";
import type { Edge, Node } from "@xyflow/react";

import type {
  DagNodeData,
} from "@/components/dag/dag-config";

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
  node: ExistingGraphNode;
};

type NodeUpdatedEvent = {
  type: "node.updated";
  runId: string;
  node: ExistingGraphNode;
};

type EdgeCreatedEvent = {
  type: "edge.created";
  runId: string;
  edge: ExistingGraphEdge;
};

type RunWebSocketEvent =
  | NodeCreatedEvent
  | NodeUpdatedEvent
  | EdgeCreatedEvent;

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

type UseDagWebSocketReturn = {
  nodes: Node<DagNodeData>[];
  edges: Edge[];
  connectionStatus: ConnectionStatus;
};

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

function formatDuration(
  startTime: string,
  endTime: string | null,
): string | undefined {
  if (!endTime) {
    return undefined;
  }

  const duration =
    new Date(endTime).getTime() -
    new Date(startTime).getTime();

  if (!Number.isFinite(duration) || duration < 0) {
    return undefined;
  }

  if (duration < 1000) {
    return `${duration}ms`;
  }

  if (duration < 60_000) {
    return `${(duration / 1000).toFixed(1)}s`;
  }

  const minutes = Math.floor(
    duration / 60_000,
  );

  const seconds = Math.floor(
    (duration % 60_000) / 1000,
  );

  return `${minutes}m ${seconds}s`;
}

function toFlowNode(
  node: ExistingGraphNode,
): Node<DagNodeData> {
  return {
    id: node.id,
    type: "dagNode",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      name: node.name,
      status: node.status,
      duration: formatDuration(
        node.startTime,
        node.endTime,
      ),
    },
  };
}

function toFlowEdge(
  edge: ExistingGraphEdge,
): Edge {
  return {
    id: `${edge.sourceNodeId}-${edge.targetNodeId}`,
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
    type: "straight",
  };
}

export function useDagWebSocket(
  runId: string,
): UseDagWebSocketReturn {
  const [nodes, setNodes] = useState<
    Node<DagNodeData>[]
  >([]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const [
    connectionStatus,
    setConnectionStatus,
  ] = useState<ConnectionStatus>(
    "disconnected",
  );

  useEffect(() => {
    if (!runId) {
      return;
    }

    let cancelled = false;
    let socket: WebSocket | null = null;

    setNodes([]);
    setEdges([]);
    setConnectionStatus("connecting");

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
        }: GraphResponse =
          await response.json();

        if (cancelled) {
          return;
        }

        setNodes(
          existingNodes.map(toFlowNode),
        );

        setEdges(
          existingEdges.map(toFlowEdge),
        );
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

      const wsUrl =
        getWebSocketUrl(runId);

      console.log(
        "Connecting to WebSocket:",
        wsUrl,
      );

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        if (cancelled) {
          return;
        }

        setConnectionStatus("connected");

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
              const node = toFlowNode(
                message.node,
              );

              setNodes((currentNodes) => {
                if (
                  currentNodes.some(
                    (existingNode) =>
                      existingNode.id === node.id,
                  )
                ) {
                  return currentNodes;
                }

                return [
                  ...currentNodes,
                  node,
                ];
              });

              break;
            }

            case "node.updated": {
              setNodes((currentNodes) =>
                currentNodes.map((node) =>
                  node.id === message.node.id
                    ? {
                        ...node,
                        data: {
                          ...node.data,
                          status:
                            message.node.status,
                          duration:
                            formatDuration(
                              message.node
                                .startTime,
                              message.node
                                .endTime,
                            ),
                        },
                      }
                    : node,
                ),
              );

              break;
            }

            case "edge.created": {
              const edge = toFlowEdge(
                message.edge,
              );

              setEdges((currentEdges) => {
                if (
                  currentEdges.some(
                    (existingEdge) =>
                      existingEdge.id === edge.id,
                  )
                ) {
                  return currentEdges;
                }

                return [
                  ...currentEdges,
                  edge,
                ];
              });

              break;
            }
          }
        } catch (error) {
          console.error(
            "Failed to process WebSocket message",
            error,
          );
        }
      };

      socket.onerror = () => {
        if (!cancelled) {
          setConnectionStatus("error");
        }

        console.error("WebSocket error", {
          runId,
          url: wsUrl,
        });
      };

      socket.onclose = (event) => {
        if (!cancelled) {
          setConnectionStatus("disconnected");
        }

        console.log(
          "WebSocket disconnected",
          {
            runId,
            url: wsUrl,
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          },
        );
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
    connectionStatus,
  };
}