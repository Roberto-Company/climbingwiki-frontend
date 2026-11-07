import type { NextRequest } from "next/server";
import { fetchAvatar } from "@/lib/api";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Serves uploaded profile pictures from the API, which browsers cannot reach directly.
 * Links carry a ?v= version that changes with every upload, so versioned requests are cached for good.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/media/avatars/[id]">) {
  const { id } = await ctx.params;
  if (!/^\d{1,18}$/.test(id)) {
    return new Response(null, { status: 404 });
  }

  const upstream = await fetchAvatar(Number(id)).catch(() => undefined);
  if (upstream === undefined) {
    return new Response(null, { status: 502 });
  }
  const contentType = upstream?.headers.get("content-type") ?? "";
  if (upstream === null || !ALLOWED_TYPES.has(contentType)) {
    return new Response(null, { status: 404 });
  }

  const versioned = request.nextUrl.searchParams.has("v");
  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": versioned ? "public, max-age=31536000, immutable" : "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
