import type { FastifyInstance } from "fastify";
import { runGraph, runsListController } from "./runs.controller";

export async function runsRoutes(fastify: FastifyInstance) {
    fastify.get("/runs", runsListController);
    fastify.get("/runs/:runId/graph", runGraph);
}