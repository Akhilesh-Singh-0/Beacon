import { opentelemetry } from "./generated/otlp.js";
import type { BeaconSpan } from "./beacon-span.types.js";

type ExportTraceServiceRequest =
  opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;

function bytesToHex(bytes: Uint8Array | null | undefined): string {
  if (!bytes || bytes.length === 0) return "";

  return Buffer.from(bytes).toString("hex");
}

function parentSpanIdToString(
  bytes: Uint8Array | null | undefined,
): string | null {
  if (!bytes || bytes.length === 0) return null;

  return bytesToHex(bytes);
}

function unixNanoToString(value: { toString(): string }): string {
  return value.toString();
}

function statusCodeToString(code: number): string {
  switch (code) {
    case 1:
      return "OK";

    case 2:
      return "ERROR";

    default:
      return "UNSET";
  }
}

function anyValueToJs(
  value: opentelemetry.proto.common.v1.AnyValue,
): unknown {
  if (value.stringValue !== undefined) {
    return value.stringValue;
  }

  if (value.boolValue !== undefined) {
    return value.boolValue;
  }

  if (value.intValue !== undefined) {
    return value.intValue.toString();
  }

  if (value.doubleValue !== undefined) {
    return value.doubleValue;
  }

  if (value.arrayValue != null) {
    return (value.arrayValue.values ?? []).map(
      (v) =>
        anyValueToJs(
          v as opentelemetry.proto.common.v1.AnyValue,
        ),
    );
  }

  if (value.kvlistValue != null) {
    return Object.fromEntries(
      (value.kvlistValue.values ?? []).map((item) => [
        item.key,
        item.value
          ? anyValueToJs(
              item.value as opentelemetry.proto.common.v1.AnyValue,
            )
          : null,
      ]),
    );
  }

  if (value.bytesValue !== undefined) {
    return bytesToHex(value.bytesValue);
  }

  return null;
}

function normalizeAttributes(
  attributes: opentelemetry.proto.common.v1.KeyValue.$Properties[],
): Record<string, unknown> {
  return Object.fromEntries(
    attributes.map((attribute) => [
      attribute.key,
      attribute.value
        ? anyValueToJs(
            attribute.value as opentelemetry.proto.common.v1.AnyValue,
          )
        : null,
    ]),
  );
}

export function normalizeOtlpTrace(
  request: ExportTraceServiceRequest,
): BeaconSpan[] {
  const spans: BeaconSpan[] = [];

  for (const resourceSpans of request.resourceSpans ?? []) {
    for (const scopeSpans of resourceSpans.scopeSpans ?? []) {
      for (const span of scopeSpans.spans ?? []) {
        spans.push({
          traceId: bytesToHex(span.traceId),
          spanId: bytesToHex(span.spanId),
          parentSpanId: parentSpanIdToString(span.parentSpanId),
          name: span.name ?? "",
          startTimeUnixNano: unixNanoToString(span.startTimeUnixNano),
          endTimeUnixNano:
            span.endTimeUnixNano.toString() === "0"
              ? null
              : unixNanoToString(span.endTimeUnixNano),
          status: {
            code: statusCodeToString(span.status?.code ?? 0),
          },
          attributes: normalizeAttributes(span.attributes ?? []),
        });
      }
    }
  }

  return spans;
}