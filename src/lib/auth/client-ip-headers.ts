/**
 * Picks the visitor's IP from an `X-Forwarded-For` value.
 *
 * Takes the LAST entry: it is the one written by the nearest proxy (Vercel's edge, or Next.js itself
 * from the socket). Earlier entries come from the client and can be forged. Self-hosted, Next.js must
 * sit behind a reverse proxy that appends to this header, or a visitor could send their own value.
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

/**
 * Headers that pass the visitor's IP on to the backend.
 *
 * `X-Forwarded-For` works when the backend trusts this server's address (same host or Docker
 * network). With a proxy secret (the backend's `PROXY_SHARED_SECRET`) the IP also goes in
 * `X-Client-IP`, which the backend accepts from anywhere the secret matches: needed when a hosting
 * proxy sits in between (site on Vercel, API on Render).
 */
export function buildClientIpHeaders(
  ip: string | null,
  proxySecret: string | undefined,
): Record<string, string> {
  if (!ip) {
    return {};
  }
  const secret = proxySecret?.trim();
  return secret
    ? { "X-Forwarded-For": ip, "X-Client-IP": ip, "X-Proxy-Secret": secret }
    : { "X-Forwarded-For": ip };
}
