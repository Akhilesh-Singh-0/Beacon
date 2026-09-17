import type { Edge, Node } from "@xyflow/react";

import {
  DAG_LAYOUT,
  type DagNodeData,
} from "./dag-config";

export function layoutDag(
  nodes: Node<DagNodeData>[],
  edges: Edge[],
): Node<DagNodeData>[] {
  if (nodes.length === 0) {
    return [];
  }

  const nodeIds = new Set(
    nodes.map((node) => node.id),
  );

  const indegree = new Map<string, number>();
  const outgoing = new Map<string, string[]>();

  for (const node of nodes) {
    indegree.set(node.id, 0);
    outgoing.set(node.id, []);
  }

  for (const edge of edges) {
    if (
      !nodeIds.has(edge.source) ||
      !nodeIds.has(edge.target)
    ) {
      continue;
    }

    outgoing.get(edge.source)?.push(edge.target);

    indegree.set(
      edge.target,
      (indegree.get(edge.target) ?? 0) + 1,
    );
  }

  const depth = new Map<string, number>();

  const queue = nodes
    .filter(
      (node) =>
        (indegree.get(node.id) ?? 0) === 0,
    )
    .map((node) => node.id);

  for (const nodeId of queue) {
    depth.set(nodeId, 0);
  }

  let cursor = 0;

  while (cursor < queue.length) {
    const currentId = queue[cursor];
    cursor += 1;

    const currentDepth =
      depth.get(currentId) ?? 0;

    for (const childId of
      outgoing.get(currentId) ?? []) {
      const nextDepth = currentDepth + 1;

      depth.set(
        childId,
        Math.max(
          depth.get(childId) ?? 0,
          nextDepth,
        ),
      );

      const nextIndegree =
        (indegree.get(childId) ?? 0) - 1;

      indegree.set(childId, nextIndegree);

      if (nextIndegree === 0) {
        queue.push(childId);
      }
    }
  }

  const unresolvedNodes = nodes.filter(
    (node) => !depth.has(node.id),
  );

  if (unresolvedNodes.length > 0) {
    const fallbackDepth =
      Math.max(...depth.values(), 0) + 1;

    unresolvedNodes.forEach((node, index) => {
      depth.set(
        node.id,
        fallbackDepth + index,
      );
    });
  }

  const layers = new Map<
    number,
    Node<DagNodeData>[]
  >();

  for (const node of nodes) {
    const nodeDepth =
      depth.get(node.id) ?? 0;

    const layer = layers.get(nodeDepth);

    if (layer) {
      layer.push(node);
    } else {
      layers.set(nodeDepth, [node]);
    }
  }

  const result: Node<DagNodeData>[] = [];

  for (const [layerIndex, layerNodes] of layers) {
    const sortedNodes = [...layerNodes].sort(
      (a, b) =>
        (a.position?.y ?? 0) -
        (b.position?.y ?? 0),
    );

    const totalHeight =
      (sortedNodes.length - 1) *
      (DAG_LAYOUT.nodeHeight +
        DAG_LAYOUT.rowGap);

    const startY = -totalHeight / 2;

    sortedNodes.forEach((node, index) => {
      result.push({
        ...node,

        position: {
          x:
            layerIndex *
            (DAG_LAYOUT.nodeWidth +
              DAG_LAYOUT.rankGap),

          y:
            startY +
            index *
              (DAG_LAYOUT.nodeHeight +
                DAG_LAYOUT.rowGap),
        },
      });
    });
  }

  return result;
}