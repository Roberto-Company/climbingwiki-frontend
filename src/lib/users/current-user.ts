import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { getUser } from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import { accountIsGone, SESSION_EXPIRED_PATH } from "@/lib/auth/session-expiry";
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
 * If the account no longer exists the session is ended. The role comes from the API, so a demoted
 * moderator stops seeing moderator links straight away.
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
  let user;
  try {
    user = await getUser(session.userId);
  } catch (error) {
    if (!accountIsGone(error)) {
      return fallback;
    }
  }
  // redirect() throws, so it must stay outside the try block.
  if (!user) {
    redirect(SESSION_EXPIRED_PATH);
  }
  return { ...fallback, fullName: user.fullName, avatarUrl: user.avatarUrl, role: user.role };
});
