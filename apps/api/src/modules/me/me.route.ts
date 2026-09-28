import type { FastifyInstance } from "fastify";

import {
  getMeController,
  regenerateApiKeyController,
} from "./me.controller";

export async function meRoute(
  fastify: FastifyInstance,
) {
  fastify.get(
    "/api/me",
    getMeController,
  );

  fastify.post(
    "/api/me/api-key/regenerate",
    regenerateApiKeyController,
  );
}