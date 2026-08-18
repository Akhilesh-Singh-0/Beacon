import fp from "fastify-plugin";
import websocket from "@fastify/websocket";
import type { FastifyInstance } from "fastify";
import type { WebSocket } from "ws";

import { redisSubscriber } from "../lib/redis.subscriber";

const clientsByRun = new Map<string, Set<WebSocket>>();

const subscribedRuns = new Set<string>();

async function subscribeToRun(runId: string) {
  const channel = `run:${runId}`;

  if (subscribedRuns.has(runId)) {
    return;
  }

  await redisSubscriber.subscribe(channel);

  subscribedRuns.add(runId);

  console.log("Subscribed to Redis channel", {
    channel,
  });
}

async function unsubscribeFromRun(runId: string) {
  const clients = clientsByRun.get(runId);

  if (clients && clients.size > 0) {
    return;
  }

  const channel = `run:${runId}`;

  if (!subscribedRuns.has(runId)) {
    return;
  }

  await redisSubscriber.unsubscribe(channel);

  subscribedRuns.delete(runId);

  console.log("Unsubscribed from Redis channel", {
    channel,
  });
}

redisSubscriber.on("message", (channel, message) => {
  const runId = channel.replace("run:", "");

  const clients = clientsByRun.get(runId);

  if (!clients) {
    return;
  }

  for (const socket of clients) {
    if (socket.readyState === socket.OPEN) {
      socket.send(message);
    }
  }
});

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(websocket);

  fastify.get(
    "/ws/:runId",
    { websocket: true },
    async (socket, request) => {
      const { runId } = request.params as { runId: string };

      let clients = clientsByRun.get(runId);

      if (!clients) {
        clients = new Set<WebSocket>();
        clientsByRun.set(runId, clients);
      }

      clients.add(socket);

      await subscribeToRun(runId);

      console.log("WebSocket client connected", {
        runId,
        clients: clients.size,
      });

      socket.on("close", async () => {
        const clients = clientsByRun.get(runId);

        if (!clients) {
          return;
        }

        clients.delete(socket);

        console.log("WebSocket client disconnected", {
          runId,
          clients: clients.size,
        });

        if (clients.size === 0) {
          clientsByRun.delete(runId);

          await unsubscribeFromRun(runId);
        }
      });
    },
  );
});