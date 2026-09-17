import { FastifyRequest, FastifyReply } from "fastify";
import { getRunGraph } from "./runs.service";

export async function runGraph(
    request: FastifyRequest,
    reply: FastifyReply,
  ){
    const { runId } = request.params as { runId: string }

    if(!runId){
        return reply.status(400).send({
            error: "Invalid or no runId",
        })
    }

    const { nodes, edges } = await getRunGraph(runId);

    return reply.status(200).send({ nodes, edges })
}