import { connectRedis } from "./lib/redis";
import { shutdown } from "./shutdown";
import { env } from "./config/env";
import "./workers/span.worker";
import app from "./app";
import { registerStuckNodeScheduler } from "./workers/stuck-node.worker"

process.on("SIGINT", () => shutdown(app, "SIGINT"));
process.on("SIGTERM", () => shutdown(app, "SIGTERM"));

async function start() {
  try {
    await connectRedis();

    await app.listen({
      host: "0.0.0.0",
      port: env.PORT,
    });

    await registerStuckNodeScheduler();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();