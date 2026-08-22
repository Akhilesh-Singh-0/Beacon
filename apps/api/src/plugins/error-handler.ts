import type { FastifyError, FastifyInstance } from "fastify";

export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode =
      error.statusCode && error.statusCode >= 400 && error.statusCode < 600
        ? error.statusCode
        : 500;

    request.log.error(
      {
        err: error,
        request: {
          method: request.method,
          url: request.url,
        },
      },
      "Request failed",
    );

    const message =
      statusCode >= 500
        ? "Internal Server Error"
        : error.message;

    return reply.status(statusCode).send({
      error: {
        message,
        statusCode,
      },
    });
  });
}