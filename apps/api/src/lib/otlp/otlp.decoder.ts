import { opentelemetry } from "../otlp/generated/otlp";

const PROTOBUF_CONTENT_TYPE = "application/x-protobuf";
const JSON_CONTENT_TYPE = "application/json";

type DecoderInput = Buffer | unknown;

function badRequest(message: string): Error & { statusCode: number } {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = 400;
  return error;
}

function parseJsonBody(body: DecoderInput): unknown {
  try {
    if (Buffer.isBuffer(body)) {
      return JSON.parse(body.toString("utf8"));
    }

    if (typeof body === "string") {
      return JSON.parse(body);
    }

    return body;
  } catch {
    throw badRequest("Invalid OTLP JSON body");
  }
}

export function decodeOtlpTrace(
  body: DecoderInput,
  contentType: string,
): opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest {
  const mimeType = contentType.split(";")[0].trim().toLowerCase();

  const ExportTraceServiceRequest =
    opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;

  try {
    if (mimeType === PROTOBUF_CONTENT_TYPE) {
      if (!Buffer.isBuffer(body)) {
        throw badRequest("Invalid OTLP protobuf body");
      }

      return ExportTraceServiceRequest.decode(body);
    }

    if (mimeType === JSON_CONTENT_TYPE) {
      const jsonBody = parseJsonBody(body);

      if (
        jsonBody === null ||
        typeof jsonBody !== "object" ||
        Array.isArray(jsonBody)
      ) {
        throw badRequest("Invalid OTLP JSON body");
      }

      return ExportTraceServiceRequest.fromObject(jsonBody);
    }

    throw badRequest(`Unsupported content type: ${mimeType}`);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      error.statusCode === 400
    ) {
      throw error;
    }

    throw badRequest("Invalid OTLP trace payload");
  }
}