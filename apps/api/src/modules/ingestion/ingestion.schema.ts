import {z} from "zod";

export const ingestionSchema = z.object({
    traceId: z.string().min(1),
    spanId: z.string().min(1),
    parentSpanId: z.string().min(1).nullable().optional(),
    name: z.string().min(1),
    startTimeUnixNano: z.string().or(z.number()),
    endTimeUnixNano: z.string().or(z.number().nullable().optional()),
    status: z.object({
        code: z.string().optional(),
        message: z.string().optional(),
    })
    .optional(),
    attributes: z.record(z.string(), z.unknown()).optional(),
});

export type IngestionPayload = z.infer<typeof ingestionSchema>;