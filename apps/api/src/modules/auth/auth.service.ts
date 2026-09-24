import { createUserWorkspace } from "./auth.repository";

type UserCreatedInput = {
  clerkId: string;
  email: string;
  name: string;
};

export async function handleUserCreated(
  input: UserCreatedInput,
) {
  return createUserWorkspace(input);
}