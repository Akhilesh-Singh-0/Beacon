import fp from "fastify-plugin"
import redis from "../plugins/redis"

export default fp(async (fastify) => {
  fastify.decorate("redis", redis)
})