export type BeaconSpan = {
    traceId: string
    spanId: string
    parentSpanId: string | null
    name: string
    startTimeUnixNano: string
    endTimeUnixNano: string | null
    status: { code: string; message?: string}
    attributes: Record<string, unknown>
}