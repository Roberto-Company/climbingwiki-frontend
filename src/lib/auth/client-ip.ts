import "server-only";

import { headers } from "next/headers";

/**
 * Picks the visitor's IP from an `X-Forwarded-For` value.
 *
 * Takes the LAST entry: it is the one written by the nearest proxy (or by Next.js itself from the
 * socket). Earlier entries come from the client and can be forged. In production, Next.js must sit
 * behind a reverse proxy that appends to this header, or a visitor could send their own value.
 */
export function pickClientIp(forwardedFor: string | null): string | null {
  if (!forwardedFor) {
    return null;
  }
  const entries = forwardedFor
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  return entries.at(-1) ?? null;
}

/** Headers to forward the visitor's IP to the backend, so per-IP limits apply per visitor. */
export async function clientIpHeaders(): Promise<Record<string, string>> {
  const incoming = await headers();
  const ip = pickClientIp(incoming.get("x-forwarded-for"));
  return ip ? { "X-Forwarded-For": ip } : {};
}
