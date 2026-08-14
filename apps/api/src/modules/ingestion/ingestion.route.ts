import type { FastifyInstance } from "fastify";

import { ingestController } from "./ingestion.controller";

export async function ingestionRoutes(fastify: FastifyInstance) {
  fastify.post("/otel", ingestController);
}