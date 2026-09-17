import Fastify from "fastify";
import "./queues/span.queue";
import { env } from "./config/env";
import { errorHandler } from "./plugins/error-handler";
import { healthPlugin } from "./plugins/health";
import prismaPlugin from "./plugins/prisma";
import { ingestionRoutes } from "./modules/ingestion/ingestion.route";
import { graphRoutes } from "./modules/runs/runs.route";
import websocketPlugin from "./websocket/websocket.server";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
});

app.register(healthPlugin);
app.register(errorHandler);
app.register(prismaPlugin);
app.register(ingestionRoutes);
app.register(graphRoutes)
app.register(websocketPlugin);

export default app;