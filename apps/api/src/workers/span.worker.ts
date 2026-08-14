import { Worker } from "bullmq";
import { NodeStatus, Prisma } from "../generated/prisma";

import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
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

    // 1. Find or create the Run
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
      jobId: job.id,
      spanId,
      traceId,
      runId: run.id,
    });

    // 2. Convert OTEL nanosecond timestamps to JavaScript Dates
    const startTime = new Date(
      Number(startTimeUnixNano) / 1_000_000,
    );

    const endTime = endTimeUnixNano
      ? new Date(Number(endTimeUnixNano) / 1_000_000)
      : null;

    // 3. Map OTEL status to Beacon NodeStatus
    let nodeStatus: NodeStatus = NodeStatus.RUNNING;

    if (status?.code === "OK") {
      nodeStatus = NodeStatus.SUCCESS;
    } else if (status?.code === "ERROR") {
      nodeStatus = NodeStatus.ERROR;
    }

    // 4. Create Node
    let node;

    try {
      node = await prisma.node.create({
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
    } catch (error) {
      // Duplicate span means this job was already processed.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        console.warn("Span already processed, skipping", {
          jobId: job.id,
          spanId,
        });

        return;
      }

      // Unknown/database errors should reach BullMQ
      // so its retry mechanism can handle them.
      throw error;
    }

    console.log("Node created", {
      nodeId: node.id,
      spanId: node.spanId,
      runId: run.id,
    });

    // 5. Create Edge when the span has a parent
    if (!parentSpanId) {
      return;
    }

    const parentNode = await prisma.node.findUnique({
      where: {
        spanId: parentSpanId,
      },
    });

    // Parent may arrive after the child.
    if (!parentNode) {
      console.warn("Parent node not found, skipping edge creation", {
        parentSpanId,
        childSpanId: node.spanId,
        runId: run.id,
      });

      return;
    }

    try {
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
    } catch (error) {
      // A duplicate edge should not cause the entire span
      // processing job to be retried.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        console.warn("Edge already exists, skipping", {
          parentSpanId,
          childSpanId: node.spanId,
          runId: run.id,
        });

        return;
      }

      throw error;
    }
  },
  {
    connection: redis,
  },
);

spanWorker.on("completed", (job) => {
  console.log("Span job completed", {
    jobId: job.id,
  });
});

spanWorker.on("failed", (job, error) => {
  console.error("Span job failed", {
    jobId: job?.id,
    error,
  });
});

spanWorker.on("error", (error) => {
  console.error("Span worker error", error);
});