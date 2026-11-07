import "server-only";

import { cache } from "react";
import { getUser } from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import type { Role } from "@/lib/types";

export interface CurrentUser {
  id: number;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: Role;
}

/**
 * The logged-in user with their profile fields (the session cookie only holds id, name and role).
 * If the API can't be reached the header still renders from the session, just without a picture.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const fallback: CurrentUser = {
    id: session.userId,
    username: session.username,
    fullName: null,
    avatarUrl: null,
    role: session.role,
  };
  try {
    const user = await getUser(session.userId);
    return { ...fallback, fullName: user.fullName, avatarUrl: user.avatarUrl };
  } catch {
    return fallback;
  }
});
