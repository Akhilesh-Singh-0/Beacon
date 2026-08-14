import Redis from "ioredis";

import { env } from "../config/env";

let isReady = false;

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,

  retryStrategy(times) {
    if (times > 10) {
      console.error("Redis connection failed after 10 retries");
      process.exit(1);
    }

    const delay = Math.min(times * 100, 3000);

    console.warn(
      `Redis reconnecting... attempt ${times}, retrying in ${delay}ms`,
    );

    return delay;
  },
});

redis.on("ready", () => {
  isReady = true;
  console.log("Redis connection ready");
});

redis.on("reconnecting", () => {
  isReady = false;
  console.warn("Redis reconnecting...");
});

redis.on("error", (error) => {
  console.error("Redis error:", error);
});

redis.on("end", () => {
  isReady = false;
  console.warn("Redis connection closed");
});

export async function connectRedis() {
  if (isReady) {
    return;
  }

  try {
    await redis.ping();

    isReady = true;

    console.log("Redis connection verified");
  } catch (error) {
    console.error("Redis startup connection failed:", error);

    process.exit(1);
  }
}