import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { env } from "../../config/env";
import { handleUserCreated } from "./auth.service";

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: {
      id: string;
      email_address: string;
    }[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
  };
};

export async function authWebhookController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { Webhook } = await import("svix");

  const wh = new Webhook(
    env.CLERK_WEBHOOK_SECRET,
  );

  const svixId =
    request.headers["svix-id"];

  const svixTimestamp =
    request.headers["svix-timestamp"];

  const svixSignature =
    request.headers["svix-signature"];

  if (
    typeof svixId !== "string" ||
    typeof svixTimestamp !== "string" ||
    typeof svixSignature !== "string"
  ) {
    return reply.code(400).send({
      error: "Missing webhook signature headers",
    });
  }

  const rawBody = request.body as Buffer;

  try {
    wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (error) {
    request.log.warn(
      error,
      "Invalid Clerk webhook signature",
    );

    return reply.code(400).send({
      error: "Invalid webhook",
    });
  }

  let event: ClerkWebhookEvent;

  try {
    event = JSON.parse(
      rawBody.toString("utf8"),
    ) as ClerkWebhookEvent;
  } catch (error) {
    request.log.warn(
      error,
      "Invalid webhook JSON",
    );

    return reply.code(400).send({
      error: "Invalid webhook payload",
    });
  }

  if (event.type !== "user.created") {
    return reply.code(200).send({
      received: true,
    });
  }

  const primaryEmail =
    event.data.email_addresses.find(
      (email) =>
        email.id ===
        event.data.primary_email_address_id,
    )?.email_address;

  if (!primaryEmail) {
    return reply.code(400).send({
      error: "User does not have a primary email",
    });
  }

  const name =
    [
      event.data.first_name,
      event.data.last_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || "Beacon User";

  await handleUserCreated({
    clerkId: event.data.id,
    email: primaryEmail,
    name,
  });

  return reply.code(200).send({
    received: true,
  });
}