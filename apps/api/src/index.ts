import Fastify from "fastify";

import { env } from "./config/env";
import { redis } from "./config/redis";
import { spanQueue, closeSpanQueue } from "./queues/spanQueue";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
});

app.get("/health", async () => {
  return {
    status: "ok",
    service: "beacon-api",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
});

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  reply.status(500).send({
    message: "Internal Server Error",
  });
});

const shutdown = async (signal: string) => {
  app.log.info(`Received ${signal}. Shutting down...`);

  try {
    await app.close();

    await closeSpanQueue();

    await redis.quit();

    app.log.info("Shutdown complete.");

    process.exit(0);
  } catch (err) {
    app.log.error(err);

    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

async function start() {
  try {
    await redis.ping();

    await app.listen({
      host: "0.0.0.0",
      port: env.PORT,
    });

    app.log.info(`Beacon API listening on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);

    process.exit(1);
  }
}

start();