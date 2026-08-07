import { z } from "zod";
import dotenv from "dotenv"

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z
    .enum(["development", "production", "test"] as const)
    .default("development"),
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url()
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    console.error("Invalid environment variable");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

const env = parsed.data;

export { env }