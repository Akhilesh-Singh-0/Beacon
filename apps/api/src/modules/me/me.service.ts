import {
  findUserWithApiKey,
  regenerateWorkspaceApiKey,
} from "./me.repository";

export async function getUser(clerkId: string) {
  const user = await findUserWithApiKey(clerkId);

  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const membership = user.workspaceMembers[0];

  if (!membership) {
    return {
      success: false,
      error: "User has no workspace",
    };
  }

  const apiKey = membership.workspace.apiKeys[0];

  if (!apiKey) {
    return {
      success: false,
      error: "User has no active API key",
    };
  }

  return {
    success: true,
    workspace: membership.workspace,
    apiKey: apiKey.apiKey,
  };
}

export async function regenerateApiKey(clerkId: string) {
  const apiKey = await regenerateWorkspaceApiKey(clerkId);

  if (!apiKey) {
    return {
      success: false,
      error: "User or workspace not found",
    };
  }

  return {
    success: true,
    apiKey: apiKey.apiKey,
  };
}
