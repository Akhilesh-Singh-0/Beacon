import { Queue } from "bullmq";
import { redis } from "../plugins/redis"

export const SPAN_QUEUE = "span-processing";

const defaultJobOptions = {
  attempts: 3,

  backoff: {
    type: "exponential" as const,
    delay: 1000,
  },

  removeOnComplete: {
    age: 60 * 60,
    count: 5000,
  },

  removeOnFail: {
    age: 60 * 60 * 24,
    count: 10000,
  },
};

export const spanQueue = new Queue(SPAN_QUEUE, {
  connection: redis,
  defaultJobOptions,
});

export async function closeSpanQueue() {
  await spanQueue.close();
}