import type { FastifyInstance } from "fastify";

import { getMeController } from "./me.controller";

export async function meRoute(
  fastify: FastifyInstance,
) {
  fastify.get(
    "/api/me",
    getMeController,
  );
}