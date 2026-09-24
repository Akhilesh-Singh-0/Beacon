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