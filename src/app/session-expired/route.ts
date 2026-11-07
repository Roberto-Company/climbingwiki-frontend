import { NextResponse, type NextRequest } from "next/server";
import { deleteSession } from "@/lib/auth/session";

/**
 * Pages can't delete cookies while rendering, so a rejected session redirects here.
 * Only ever removes the visitor's own cookie, so a forged link can do no more than log them out.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  await deleteSession();
  return NextResponse.redirect(new URL("/login?expired=1", request.url));
}
