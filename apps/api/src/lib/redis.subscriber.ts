import Redis from "ioredis";
import { env } from "../config/env";

export const redisSubscriber = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisSubscriber.on("error", (error) => {
  console.error("Redis subscriber error:", error);
});

redisSubscriber.on("ready", () => {
  console.log("Redis subscriber connection ready");
});