import type { FastifyInstance } from "fastify";

export async function healthPlugin(fastify: FastifyInstance) {
  fastify.get("/health", async (_request, reply) => {
    return reply.status(200).send({
      status: "ok",
    });
  });
}