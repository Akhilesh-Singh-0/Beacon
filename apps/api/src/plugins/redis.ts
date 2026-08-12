import Redis from "ioredis";
import { env } from "../config/env";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 10_000,
  connectionName: "beacon-api",

  retryStrategy: (times) => {
    return Math.min(times * 100, 2_000);
  },
});

redis.on("error", (error) => {
  console.error("[Redis] error", error);
});

redis.on("reconnecting", () => {
  console.warn("[Redis] reconnecting");
});