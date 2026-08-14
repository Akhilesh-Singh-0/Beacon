import { Worker } from "bullmq";

import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { NodeStatus } from "../generated/prisma";

import type { IngestionPayload } from "../modules/ingestion/ingestion.schema";

type SpanJobData = IngestionPayload & {
  workspaceId: string;
};

export const spanWorker = new Worker<SpanJobData>(
  "span-processing",
  async (job) => {
    const {
      workspaceId,
      traceId,
      spanId,
      parentSpanId,
      name,
      startTimeUnixNano,
      endTimeUnixNano,
      status,
      attributes,
    } = job.data;

    let run = await prisma.run.findUnique({
      where: {
        workspaceId_traceId: {
          workspaceId,
          traceId,
        },
      },
    });

    if (!run) {
      run = await prisma.run.create({
        data: {
          workspaceId,
          traceId,
        },
      });
    }

    console.log("Processing span", {
      spanId,
      runId: run.id,
    });

    const startTime = new Date(
      Number(startTimeUnixNano) / 1_000_000,
    );

    const endTime = endTimeUnixNano
      ? new Date(Number(endTimeUnixNano) / 1_000_000)
      : null;

    let nodeStatus: NodeStatus = NodeStatus.RUNNING;

    if (status?.code === "OK") {
      nodeStatus = NodeStatus.SUCCESS;
    } else if (status?.code === "ERROR") {
      nodeStatus = NodeStatus.ERROR;
    }

    const node = await prisma.node.create({
      data: {
        runId: run.id,
        spanId,
        parentSpanId: parentSpanId ?? null,
        name,
        startTime,
        endTime,
        status: nodeStatus,
        attributes,
      },
    });

    console.log("Node created", {
      nodeId: node.id,
      spanId: node.spanId,
      runId: run.id,
    });

    if (parentSpanId) {
      const parentNode = await prisma.node.findUnique({
        where: {
          spanId: parentSpanId,
        },
      });

      if (!parentNode) {
        console.warn(
          "Parent node not found, skipping edge creation",
          {
            parentSpanId,
            childSpanId: node.spanId,
            runId: run.id,
          },
        );
      } else {
        await prisma.edge.create({
          data: {
            runId: run.id,
            sourceNodeId: parentNode.id,
            targetNodeId: node.id,
          },
        });

        console.log("Edge created", {
          runId: run.id,
          sourceNodeId: parentNode.id,
          targetNodeId: node.id,
        });
      }
    }
  },
  {
    connection: redis,
  },
);