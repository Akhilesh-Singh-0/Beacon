import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "@clerk/backend";
import { env } from "../../config/env";
import { getUser } from "./me.service";

export async function getMeController(request: FastifyRequest, reply: FastifyReply) {
    const authorization = request.headers.authorization;

    if(typeof authorization !== "string" || !authorization.startsWith("Bearer ")){
        return reply.status(401).send({
            error: "Missing or invalid authorization header"
        })
    }

    const token = authorization.slice(7);

    if(!token){
        return reply.status(401).send({
            error: "Missing bearer token"
        })
    }
    let verifiedToken;

    try {
        verifiedToken = await verifyToken(token, {
            secretKey: env.CLERK_SECRET_KEY,
            authorizedParties: [
                "http://localhost:3000",
            ],
        });
        console.log("verifiedToken:", verifiedToken);
    } catch (error) {
        request.log.warn(
            error,
            "invalid Clerk session token"
        );
        return reply.status(401).send({
            error: "Unauthorized",
        })
    }
    console.log("verifiedToken:", verifiedToken);

    const clerkId = verifiedToken.sub;

    if (!clerkId) {
        return reply.status(401).send({
            error: "Invalid Clerk token",
        });
    }

    const result = await getUser(clerkId);

    if (!result.success) {
        return reply.status(404).send({
            error: result.error,
        });
    }

    return reply.status(200).send({
        workspace: result.workspace,
        apiKey: result.apiKey,
    });
}