import type { FastifyReply, FastifyRequest } from "fastify";
import { decodeOtlpTrace } from "../../lib/otlp/otlp.decoder";;
import { normalizeOtlpTrace } from "../../lib/otlp/otlp.normalizer";
import { ingestSpan } from "./ingestion.service";


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

  const contentType = request.headers["content-type"] ?? "";

  const decoded = await decodeOtlpTrace(request.body, contentType);

  const spans = normalizeOtlpTrace(decoded);

  await ingestSpan(apiKey, spans);

  return reply.code(200).send({});
}