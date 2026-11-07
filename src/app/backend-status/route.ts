import { API_BASE_URL } from "@/lib/api/config";
import { HEALTH_TIMEOUT_MS, healthUrl } from "@/lib/api/backend-wake";

// Always ask the API now; a cached answer would defeat the point.
export const dynamic = "force-dynamic";

/** Lets the error page ask whether the API is up (the browser can't reach the API directly). */
export async function GET(): Promise<Response> {
  let up = false;
  try {
    const response = await fetch(healthUrl(API_BASE_URL), {
      cache: "no-store",
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
    });
    up = response.ok;
  } catch {
    // Refused, timed out or DNS failure: all mean the API isn't answering yet.
    up = false;
  }
  return Response.json({ up }, { headers: { "Cache-Control": "no-store" } });
}
