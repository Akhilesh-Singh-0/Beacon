import type { FastifyInstance } from "fastify";
import { redis } from "./plugins/redis";
import { closeSpanQueue } from "./queues/span.queue";

let shuttingDown = false;

export async function shutdown(
  app: FastifyInstance,
  signal: NodeJS.Signals,
) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  app.log.info({ signal }, "Shutdown signal received");

  try {
    await app.close();
    app.log.info("HTTP server closed");

    await closeSpanQueue();
    app.log.info("Span queue closed");

    await redis.quit();
    app.log.info("Redis connection closed");

    app.log.info("Shutdown complete");
  } catch (error) {
    app.log.fatal({ err: error }, "Shutdown failed");
    process.exitCode = 1;
  }
}