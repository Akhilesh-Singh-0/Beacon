import { FastifyRequest, FastifyReply } from "fastify";
import { getRunGraph, getRuns } from "./runs.service";

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

export async function runsListController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const apiKey = request.headers["x-api-key"];
  
    if (typeof apiKey !== "string" || apiKey.length === 0) {
      return reply.status(401).send({
        error: "Missing API key",
      });
    }
  
    const result = await getRuns(apiKey);
  
    if (!result.success) {
      return reply.status(401).send({
        error: "Invalid or inactive API key",
      });
    }
  
    return reply.status(200).send({
      runs: result.runs,
    });
}