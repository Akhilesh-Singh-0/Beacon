import { spanQueue } from "../../queues/span.queue";
import { findActiveApiKey } from "./ingestion.repository";
import type { IngestionPayload } from "./ingestion.schema";

export async function ingestSpan(apiKey: string, payload: IngestionPayload){
    const key = await findActiveApiKey(apiKey);

    if(!key || !key.workspace){
        return{
            success: false,
            error: "Invalid or inactive API key",
        };
    }

    await spanQueue.add("ingest-span", {
        workspaceId: key.workspaceId,
        ...payload,
    })

    return {
        success: true
    }
}