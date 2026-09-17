import { findNodes, findEdges } from "./runs.repository";

export async function getRunGraph(runId: string) {
    const [ nodes, edges ] = await Promise.all([
        findNodes(runId),
        findEdges(runId)
    ])

    return { nodes, edges }
}