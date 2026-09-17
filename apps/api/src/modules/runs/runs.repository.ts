import { prisma } from "../../lib/prisma";

export async function findNodes(runId: string) {
    return await prisma.node.findMany({
        where: {
            runId: runId
        }
    })
}

export async function findEdges(runId: string) {
    return await prisma.edge.findMany({
        where:{
            runId: runId
        }
    })
}