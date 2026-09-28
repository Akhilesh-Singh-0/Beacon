import { randomBytes } from "node:crypto";
import { prisma } from "../../lib/prisma";

export async function findUserWithApiKey(
  clerkId: string,
) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      workspaceMembers: {
        take: 1,
        include: {
          workspace: {
            include: {
              apiKeys: {
                where: {
                  isActive: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
}

function generateApiKey() {
  return `bk_live_${randomBytes(32).toString("hex")}`;
}

export async function regenerateWorkspaceApiKey(
  clerkId: string,
) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        clerkId,
      },
      include: {
        workspaceMembers: {
          take: 1,
        },
      },
    });

    if (!user) {
      return null;
    }

    const membership = user.workspaceMembers[0];

    if (!membership) {
      return null;
    }

    await tx.apiKey.updateMany({
      where: {
        workspaceId: membership.workspaceId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const newApiKey = await tx.apiKey.create({
      data: {
        workspaceId: membership.workspaceId,
        apiKey: generateApiKey(),
      },
    });

    return newApiKey;
  });
}
