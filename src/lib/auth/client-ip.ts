import "server-only";

import { headers } from "next/headers";
import { buildClientIpHeaders, pickClientIp } from "./client-ip-headers";

/** Headers to forward the visitor's IP to the backend, so per-IP limits apply per visitor. */
export async function clientIpHeaders(): Promise<Record<string, string>> {
  const incoming = await headers();
  return buildClientIpHeaders(
    pickClientIp(incoming.get("x-forwarded-for")),
    process.env.API_PROXY_SECRET,
  );
}
