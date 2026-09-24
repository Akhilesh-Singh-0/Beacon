import type { FastifyInstance } from "fastify";

import {
  authWebhookController,
} from "./auth.controller";

export async function authRoute(
  fastify: FastifyInstance,
) {
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (_request, body, done) => {
      done(null, body);
    },
  );

  fastify.post(
    "/api/webhooks",
    authWebhookController,
  );
}