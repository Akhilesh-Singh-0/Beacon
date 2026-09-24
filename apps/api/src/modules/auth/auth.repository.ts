import { randomBytes } from "node:crypto";
import { Role } from "../../generated/prisma";
import { prisma } from "../../lib/prisma";

type CreateAuthUserInput = {
  clerkId: string;
  email: string;
  name: string;
};

function generateApiKey() {
  return `bk_live_${randomBytes(32).toString("hex")}`;
}

function generateWorkspaceSlug(name: string) {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "workspace";

  return `beacon-${base}-${randomBytes(4).toString("hex")}`;
}

export async function createUserWorkspace(
  input: CreateAuthUserInput,
) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: {
        clerkId: input.clerkId,
      },
      create: {
        clerkId: input.clerkId,
        email: input.email,
        name: input.name,
      },
      update: {
        email: input.email,
        name: input.name,
      },
    });

    const existingMembership =
      await tx.workspaceMember.findFirst({
        where: {
          userId: user.id,
        },
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
      });

    if (existingMembership) {
      const existingApiKey =
        existingMembership.workspace.apiKeys[0];

      if (existingApiKey) {
        return {
          user,
          workspace: existingMembership.workspace,
          apiKey: existingApiKey.apiKey,
        };
      }

      const apiKey = await tx.apiKey.create({
        data: {
          workspaceId: existingMembership.workspaceId,
          apiKey: generateApiKey(),
        },
      });

      return {
        user,
        workspace: existingMembership.workspace,
        apiKey: apiKey.apiKey,
      };
    }

    const workspace = await tx.workspace.create({
      data: {
        name: `${input.name}'s Workspace`,
        slug: generateWorkspaceSlug(input.name),
      },
    });

    await tx.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: Role.OWNER,
      },
    });

    const apiKey = await tx.apiKey.create({
      data: {
        workspaceId: workspace.id,
        apiKey: generateApiKey(),
      },
    });

    return {
      user,
      workspace,
      apiKey: apiKey.apiKey,
    };
  });
}