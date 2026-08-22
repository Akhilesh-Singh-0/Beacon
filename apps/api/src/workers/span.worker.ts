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
          attributes: (attributes as Prisma.InputJsonValue) ?? null,
        },
      });
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        (err as Prisma.PrismaClientKnownRequestError).code === "P2002"
      ) {
        console.warn("Span already processed, skipping", {
          jobId: job.id,
          spanId,
        });

        return;
      }

      throw err;
    }

    console.log("Node created", {
      nodeId: node.id,
      spanId: node.spanId,
      runId: run.id,
    });

    await redis.publish(
      `run:${run.id}`,
      JSON.stringify({
        type: "node.created",
        runId: run.id,
        node: {
          id: node.id,
          spanId: node.spanId,
          parentSpanId: node.parentSpanId,
          name: node.name,
          startTime: node.startTime,
          endTime: node.endTime,
          status: node.status,
          attributes: node.attributes,
        },
      }),
    );

    if (!parentSpanId) {
      return;
    }

    const parentNode = await prisma.node.findUnique({
      where: {
        spanId: parentSpanId,
      },
    });

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
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        (err as Prisma.PrismaClientKnownRequestError).code === "P2002"
      ) {
        console.warn("Edge already exists, skipping", {
          parentSpanId,
          childSpanId: node.spanId,
          runId: run.id,
        });

        return;
      }

      throw err;
    }

    await redis.publish(
      `run:${run.id}`,
      JSON.stringify({
        type: "edge.created",
        runId: run.id,
        edge: {
          sourceNodeId: parentNode.id,
          targetNodeId: node.id,
        },
      }),
    );
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