import { Worker } from "bullmq";
import { NodeStatus } from "../generated/prisma";

import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

const STUCK_NODE_THRESHOLD_MS = 5 * 60 * 1000;
const STUCK_NODE_INTERVAL_MS = 60 * 1000;

type StuckNodeJob = {
  type: "detect-stuck-nodes";
};

export const stuckNodeWorker = new Worker<StuckNodeJob>(
  "stuck-node-detection",
  async (job) => {
    console.log("Running stuck node detection", {
      jobId: job.id,
    });

    const threshold = new Date(
      Date.now() - STUCK_NODE_THRESHOLD_MS,
    );

    const stuckNodes = await prisma.node.findMany({
      where: {
        status: NodeStatus.RUNNING,
        startTime: {
          lt: threshold,
        },
      },
    });

    console.log("Stuck nodes detected", {
      count: stuckNodes.length,
    });

    for (const node of stuckNodes) {
      await prisma.node.update({
        where: {
          id: node.id,
        },
        data: {
          status: NodeStatus.STUCK,
        },
      });

      await redis.publish(
        `run:${node.runId}`,
        JSON.stringify({
          type: "node.updated",
          runId: node.runId,
          node: {
            id: node.id,
            spanId: node.spanId,
            parentSpanId: node.parentSpanId,
            name: node.name,
            startTime: node.startTime,
            endTime: node.endTime,
            status: NodeStatus.STUCK,
            attributes: node.attributes,
          },
        }),
      );
    }
  },
  {
    connection: redis,
  },
);

stuckNodeWorker.on("completed", (job) => {
  console.log("Stuck node detection completed", {
    jobId: job.id,
  });
});

stuckNodeWorker.on("failed", (job, error) => {
  console.error("Stuck node detection failed", {
    jobId: job?.id,
    error,
  });
});

stuckNodeWorker.on("error", (error) => {
  console.error("Stuck node worker error", error);
});

export async function registerStuckNodeScheduler() {
  await stuckNodeWorker.upsertJobScheduler(
    "stuck-node-detector",
    {
      every: STUCK_NODE_INTERVAL_MS,
    },
    {
      name: "detect-stuck-nodes",
      data: {
        type: "detect-stuck-nodes",
      },
    },
  );

  console.log("Stuck node scheduler registered", {
    intervalMs: STUCK_NODE_INTERVAL_MS,
    thresholdMs: STUCK_NODE_THRESHOLD_MS,
  });
}