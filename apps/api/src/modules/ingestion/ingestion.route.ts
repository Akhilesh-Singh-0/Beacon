import type { FastifyInstance } from "fastify";
import { ingestController } from "./ingestion.controller";

export async function ingestionRoutes(fastify: FastifyInstance) {
  fastify.addContentTypeParser(
    "application/x-protobuf",
    { parseAs: "buffer" },
    (_request, body, done) => {
      done(null, body);
    },
  );

  fastify.post("/v1/traces", ingestController);
}