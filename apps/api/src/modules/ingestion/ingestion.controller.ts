import type { FastifyReply, FastifyRequest } from "fastify";

import { ingestSpan } from "./ingestion.service";
import { ingestionSchema } from "./ingestion.schema";

export async function ingestController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const apiKey = request.headers["x-api-key"];

  if (typeof apiKey !== "string" || apiKey.length === 0) {
    return reply.status(401).send({
      error: "Missing API key",
    });
  }

  const result = ingestionSchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "Invalid request body",
      details: result.error.issues,
    });
  }

  const serviceResult = await ingestSpan(apiKey, result.data);

  if (!serviceResult.success) {
    return reply.status(401).send({
      error: serviceResult.error,
    });
  }

  return reply.status(202).send({
    message: "Span accepted",
  });
}