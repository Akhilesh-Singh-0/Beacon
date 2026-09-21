import { BeaconSpan } from "../../lib/otlp/beacon-span.types";
import { spanQueue } from "../../queues/span.queue";
import { findActiveApiKey } from "./ingestion.repository";

export async function ingestSpan(apiKey: string, spans: BeaconSpan[]){
    const key = await findActiveApiKey(apiKey);

    if(!key || !key.workspace){
        return{
            success: false,
            error: "Invalid or inactive API key",
        };
    }

    for (const span of spans){
        await spanQueue.add("ingest-span",{
            workspaceId: key.workspaceId,
            ...span,
        })
    }

    return {
        success: true
    }
}