"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Node } from "@xyflow/react";

type DagReplayNodeData = {
  spanId?: string;
  parentSpanId?: string | null;
  startTime?: string | number | Date | null;
};

type ReplayNode = Node<DagReplayNodeData>;

type DagReplayProps = {
  nodes: Node[];
  onReplayChange: (
    visibleNodeIds: string[],
  ) => void;
};

const REPLAY_INTERVAL = 900;

function getStartTime(
  node: ReplayNode,
): number {
  const value = node.data?.startTime;

  if (value instanceof Date) {
    return value.getTime();
  }

  if (
    typeof value === "number"
  ) {
    return value;
  }

  if (
    typeof value === "string"
  ) {
    const timestamp = Date.parse(value);

    if (!Number.isNaN(timestamp)) {
      return timestamp;
    }

    const numericValue = Number(value);

    if (!Number.isNaN(numericValue)) {
      return numericValue;
    }
  }

  return Number.MAX_SAFE_INTEGER;
}

function getReplayOrder(
  nodes: ReplayNode[],
): ReplayNode[] {
  if (nodes.length <= 1) {
    return nodes;
  }

  const nodeBySpanId = new Map<
    string,
    ReplayNode
  >();

  for (const node of nodes) {
    if (node.data?.spanId) {
      nodeBySpanId.set(
        node.data.spanId,
        node,
      );
    }
  }

  const childrenBySpanId =
    new Map<
      string,
      ReplayNode[]
    >();

  const indegree = new Map<
    string,
    number
  >();

  for (const node of nodes) {
    indegree.set(node.id, 0);
  }

  for (const node of nodes) {
    const parentSpanId =
      node.data?.parentSpanId;

    if (
      !parentSpanId ||
      !nodeBySpanId.has(parentSpanId)
    ) {
      continue;
    }

    const children =
      childrenBySpanId.get(
        parentSpanId,
      ) ?? [];

    children.push(node);

    childrenBySpanId.set(
      parentSpanId,
      children,
    );

    indegree.set(
      node.id,
      (indegree.get(node.id) ?? 0) + 1,
    );
  }

  const readyNodes = nodes
    .filter(
      (node) =>
        (indegree.get(node.id) ?? 0) ===
        0,
    )
    .sort(
      (a, b) =>
        getStartTime(a) -
        getStartTime(b),
    );

  const orderedNodes: ReplayNode[] =
    [];

  while (readyNodes.length > 0) {
    const current =
      readyNodes.shift();

    if (!current) {
      break;
    }

    orderedNodes.push(current);

    const spanId =
      current.data?.spanId;

    if (!spanId) {
      continue;
    }

    const children =
      childrenBySpanId.get(
        spanId,
      ) ?? [];

    for (const child of children) {
      const nextIndegree =
        (indegree.get(child.id) ?? 0) -
        1;

      indegree.set(
        child.id,
        nextIndegree,
      );

      if (nextIndegree === 0) {
        readyNodes.push(child);

        readyNodes.sort(
          (a, b) =>
            getStartTime(a) -
            getStartTime(b),
        );
      }
    }
  }

  if (
    orderedNodes.length !==
    nodes.length
  ) {
    const alreadyIncluded =
      new Set(
        orderedNodes.map(
          (node) => node.id,
        ),
      );

    const remainingNodes = nodes
      .filter(
        (node) =>
          !alreadyIncluded.has(
            node.id,
          ),
      )
      .sort(
        (a, b) =>
          getStartTime(a) -
          getStartTime(b),
      );

    orderedNodes.push(
      ...remainingNodes,
    );
  }

  return orderedNodes;
}

export function DagReplay({
  nodes,
  onReplayChange,
}: DagReplayProps) {
  const replayOrder = useMemo(
    () =>
      getReplayOrder(
        nodes as ReplayNode[],
      ),
    [nodes],
  );

  const [position, setPosition] =
    useState(
      replayOrder.length > 0
        ? 1
        : 0,
    );

  const [isPlaying, setIsPlaying] =
    useState(
      replayOrder.length > 0,
    );

  useEffect(() => {
    setPosition(
      replayOrder.length > 0
        ? 1
        : 0,
    );

    setIsPlaying(
      replayOrder.length > 0,
    );
  }, [replayOrder]);

  useEffect(() => {
    const visibleNodeIds =
      replayOrder
        .slice(0, position)
        .map(
          (node) => node.id,
        );

    onReplayChange(
      visibleNodeIds,
    );
  }, [
    replayOrder,
    position,
    onReplayChange,
  ]);

  useEffect(() => {
    if (
      !isPlaying ||
      replayOrder.length === 0
    ) {
      return;
    }

    if (
      position >=
      replayOrder.length
    ) {
      setIsPlaying(false);
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setPosition(
          (currentPosition) =>
            Math.min(
              currentPosition + 1,
              replayOrder.length,
            ),
        );
      }, REPLAY_INTERVAL);

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    isPlaying,
    position,
    replayOrder.length,
  ]);

  function handlePlayPause() {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (
      position >=
      replayOrder.length
    ) {
      setPosition(0);
    }

    setIsPlaying(true);
  }

  const progress =
    replayOrder.length === 0
      ? 0
      : (position /
          replayOrder.length) *
        100;

  return (
    <div className="flex w-full max-w-md items-center gap-3">
      <span className="text-xs text-zinc-500">
        Replay
      </span>

      <button
        type="button"
        onClick={
          handlePlayPause
        }
        aria-label={
          isPlaying
            ? "Pause replay"
            : "Play replay"
        }
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.03] text-[11px] text-zinc-300 transition-colors hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
      >
        {isPlaying ? "Ⅱ" : "▶"}
      </button>

      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-blue-400 transition-[width] duration-500 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}