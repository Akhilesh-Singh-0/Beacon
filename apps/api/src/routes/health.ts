import { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health",async (request, reply) => {
    return {
      status: "ok",
      service: "beacon-api",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  })
}