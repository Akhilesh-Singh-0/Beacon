import Fastify from "fastify";
import cors from "@fastify/cors";
import "./queues/span.queue";
import { env } from "./config/env";
import { errorHandler } from "./plugins/error-handler";
import { healthPlugin } from "./plugins/health";
import prismaPlugin from "./plugins/prisma";
import { ingestionRoutes } from "./modules/ingestion/ingestion.route";
import { runsRoutes } from "./modules/runs/runs.route";
import { authRoute } from "./modules/auth/auth.route";
import { meRoute } from "./modules/me/me.route";
import websocketPlugin from "./websocket/websocket.server";

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
});

app.register(cors, {
  origin: "http://localhost:3000",
});
app.register(healthPlugin);
app.register(errorHandler);
app.register(prismaPlugin);
app.register(authRoute);
app.register(meRoute);
app.register(ingestionRoutes);
app.register(runsRoutes);
app.register(websocketPlugin);

export default app;