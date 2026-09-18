import { findNodes, findEdges, findRuns } from "./runs.repository";
import { findActiveApiKey } from "../ingestion/ingestion.repository";

export async function getRunGraph(runId: string) {
    const [ nodes, edges ] = await Promise.all([
        findNodes(runId),
        findEdges(runId)
    ])

    return { nodes, edges }
}

export async function getRuns(apiKey: string) {
    const key = await findActiveApiKey(apiKey)

    if(!key || !key.workspace){
        return{
            success: false,
            error: "Invalid or inactive API key",
        };
    }

    const runs = await findRuns(key.workspaceId)
    return{
        success: true,
        runs
    }
}