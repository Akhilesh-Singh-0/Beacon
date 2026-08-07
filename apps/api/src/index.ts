import Fastify from "fastify"
import { env } from "./config/env"
import "./config/redis"
import "./queues/spanQueue"

const app = Fastify({logger: true})

app.get('/health', async () => {
    return {status: 'ok', service: 'beacon-api'}
})

const start = async () => {
    try {
        await app.listen({port: env.PORT, host: '0.0.0.0'})
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()