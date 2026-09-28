"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

import {
  Controls,
  ReactFlow,
  useNodesInitialized,
  useReactFlow,
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
  fitViewOnChange?: boolean;
  visibleNodeIds?: string[];
  onNodeSelect?: (
    node: Node<DagNodeData> | null,
  ) => void;
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

function DagViewportController({
  enabled,
  nodeCount,
  edgeCount,
}: {
  enabled: boolean;
  nodeCount: number;
  edgeCount: number;
}) {
  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (!enabled || !nodesInitialized) return;

    const frame = requestAnimationFrame(() => {
      void fitView({
        padding: 0.2,
        minZoom: DAG_CANVAS.zoom.min,
        maxZoom: 1.15,
        duration: 350,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [
    enabled,
    nodesInitialized,
    nodeCount,
    edgeCount,
    fitView,
  ]);

  return null;
}

export default function DagCanvas({
  nodes,
  edges,
  fitViewOnChange = false,
  visibleNodeIds,
  onNodeSelect,
}: DagCanvasProps) {
  const [
    selectedNodeId,
    setSelectedNodeId,
  ] = useState<string | null>(null);

  const [isDark, setIsDark] =
    useState(false);

  useEffect(() => {
    const root =
      document.documentElement;

    const updateTheme = () => {
      setIsDark(
        root.classList.contains(
          "dark",
        ),
      );
    };

    updateTheme();

    const observer =
      new MutationObserver(
        updateTheme,
      );

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const positionedNodes =
    useMemo(
      () =>
        layoutDag(
          nodes,
          edges,
        ),
      [nodes, edges],
    );

  const visibleNodeIdSet =
    useMemo(() => {
      if (
        !fitViewOnChange ||
        visibleNodeIds ===
          undefined
      ) {
        return null;
      }

      return new Set(
        visibleNodeIds,
      );
    }, [
      fitViewOnChange,
      visibleNodeIds,
    ]);

  const graphNodes =
    useMemo(() => {
      return positionedNodes.map(
        (node) => {
          const hidden =
            visibleNodeIdSet !==
              null &&
            !visibleNodeIdSet.has(
              node.id,
            );

          return {
            ...node,

            selected:
              node.id ===
              selectedNodeId,

            style: {
              ...(node.style ?? {}),

              opacity: hidden
                ? 0
                : 1,

                pointerEvents: hidden
                  ? ("none" as CSSProperties["pointerEvents"])
                  : ("auto" as CSSProperties["pointerEvents"]),

              transition:
                "opacity 240ms ease",
            },
          };
        },
      );
    }, [
      positionedNodes,
      selectedNodeId,
      visibleNodeIdSet,
    ]);

  const graphEdges =
    useMemo<
      Edge<
        DagEdgeData,
        "dagEdge"
      >[]
    >(() => {
      const statusByNodeId =
        new Map(
          nodes.map(
            (node) => [
              node.id,
              node.data.status,
            ],
          ),
        );

      const outgoingCount =
        new Map<
          string,
          number
        >();

      for (const edge of edges) {
        outgoingCount.set(
          edge.source,
          (outgoingCount.get(
            edge.source,
          ) ?? 0) + 1,
        );
      }

      return edges
        .filter((edge) => {
          if (
            visibleNodeIdSet ===
            null
          ) {
            return true;
          }

          return (
            visibleNodeIdSet.has(
              edge.source,
            ) &&
            visibleNodeIdSet.has(
              edge.target,
            )
          );
        })
        .map((edge) => {
          const status =
            getEdgeStatus(
              statusByNodeId.get(
                edge.source,
              ),
              statusByNodeId.get(
                edge.target,
              ),
            );

          const config =
            DAG_STATUS_CONFIG[
              status
            ];

          return {
            ...edge,

            type: "dagEdge",

            data: {
              status,

              isBranch:
                (outgoingCount.get(
                  edge.source,
                ) ?? 0) > 1,
            },

            style: {
              stroke:
                config.edge.color,
              strokeWidth:
                config.edge.width,
            },
          };
        });
    }, [
      edges,
      nodes,
      visibleNodeIdSet,
    ]);

  function handleNodeClick(
    node: Node<DagNodeData>,
  ) {
    setSelectedNodeId(node.id);
    onNodeSelect?.(node);
  }

  function handlePaneClick() {
    setSelectedNodeId(null);
    onNodeSelect?.(null);
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[var(--app-bg)]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 58% 78% at 50% 50%, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.035) 32%, transparent 72%), radial-gradient(ellipse 34% 52% at 70% 56%, rgba(124,58,237,0.035) 0%, transparent 72%), linear-gradient(var(--app-grid) 1px, transparent 1px), linear-gradient(90deg, var(--app-grid) 1px, transparent 1px)",
        backgroundSize:
          "100% 100%, 100% 100%, 36px 36px, 36px 36px",
      }}
    >
      {nodes.length ===
      0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-8 py-7 text-center shadow-[0_24px_70px_var(--app-shadow)]">
            <div className="mx-auto mb-3 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />

            <p className="text-sm font-medium">
              Waiting for spans
            </p>

            <p className="mt-1 text-xs text-[var(--app-text-muted)]">
              The execution graph will appear here.
            </p>
          </div>
        </div>
      ) : (
        <ReactFlow
          className="!bg-transparent"
          style={{
            background:
              "transparent",
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
            padding: 0.18,
            minZoom: DAG_CANVAS.zoom.min,
            maxZoom: 1.15,
            duration: 0,
          }}
          colorMode={
            isDark
              ? "dark"
              : "light"
          }
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
            handleNodeClick(
              node as Node<DagNodeData>,
            );
          }}
          onPaneClick={
            handlePaneClick
          }
          proOptions={{
            hideAttribution: true,
          }}
        >
          <DagViewportController
            enabled={fitViewOnChange}
            nodeCount={graphNodes.length}
            edgeCount={graphEdges.length}
          />

          <Controls
            position="bottom-left"
            showInteractive={false}
            className="!bottom-5 !left-5 !overflow-hidden !rounded-xl !border !border-[var(--app-border)] !bg-[var(--app-surface)]/90 !shadow-[0_14px_36px_var(--app-shadow)] !backdrop-blur-md [&>button]:!border-[var(--app-border)] [&>button]:!bg-transparent [&>button]:!fill-[var(--app-text-secondary)] [&>button:hover]:!bg-[var(--app-surface-raised)] [&>button:hover]:!fill-[var(--app-text)]"
          />
        </ReactFlow>
      )}
    </div>
  );
}