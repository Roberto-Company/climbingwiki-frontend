import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, type Session } from "./session";

/**
 * Authoritative check — call this inside the page/action that needs the data,
 * not only in a layout (layouts don't re-run on client-side partial navigation).
 */
export const verifySession = cache(async (): Promise<Session> => {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
});
