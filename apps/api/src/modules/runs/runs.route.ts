import type { FastifyInstance } from "fastify";
import { runGraph } from "./runs.controller";

export async function graphRoutes(fastify: FastifyInstance) {
    fastify.get("/runs/:runId/graph", runGraph)
}