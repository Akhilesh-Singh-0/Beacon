import { prisma } from "../../lib/prisma";

export async function findActiveApiKey(apiKey: string) {
  return prisma.apiKey.findFirst({
    where: {
      apiKey,
      isActive: true,
    },
    include: {
      workspace: true,
    },
  });
}