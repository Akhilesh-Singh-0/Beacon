import Fastify from "fastify";
import "./queues/span.queue";
import { env } from "./config/env";
import { errorHandler } from "./plugins/error-handler";
import { healthRoutes } from "./routes/health";
import prismaPlugin from "./plugins/prisma"

const app = Fastify({
  logger: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
  },
});

app.register(healthRoutes);
app.register(errorHandler);
app.register(prismaPlugin)

export default app;