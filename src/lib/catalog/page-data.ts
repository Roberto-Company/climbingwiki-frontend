import "server-only";

import { notFound, redirect } from "next/navigation";
import { ApiError, listGrades, listGradingSystems, listTags } from "@/lib/api";
import { canEditCatalogItem, hasMinRole } from "@/lib/auth/roles";
import type { Session } from "@/lib/auth/session";
import { groupGradesBySystem, type GradeGroup } from "./grade-options";

/** Spanish topos use the French scale, so it goes first in grade pickers. */
const PREFERRED_GRADING_SYSTEM = "French";

/** Loads an item, turning an API 404 into the not-found page. */
export async function loadOrNotFound<T>(load: () => Promise<T>): Promise<T> {
  try {
    return await load();
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

/** A positive integer from a route or query parameter, or null. */
export function idParam(raw: string | string[] | undefined): number | null {
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(value) && value > 0 ? value : null;
}

/** Edit pages send people who can't edit the item back to its page instead of showing a form that would fail. */
export function requireEditable(
  session: Session,
  item: { createdById: number | null; verified: boolean },
  fallbackPath: string,
): void {
  if (!canEditCatalogItem(session, item)) {
    redirect(fallbackPath);
  }
}

/** Regular users' additions wait for review; moderators' don't. */
export function needsReview(session: Session): boolean {
  return !hasMinRole(session.role, "MODERATOR");
}

export async function loadGradeGroups(): Promise<GradeGroup[]> {
  const [systems, grades] = await Promise.all([listGradingSystems(), listGrades()]);
  return groupGradesBySystem(systems, grades, PREFERRED_GRADING_SYSTEM);
}

/** The API returns tag names; the route form must send ids back. */
export async function tagIdsFor(tagNames: readonly string[]): Promise<number[]> {
  if (tagNames.length === 0) {
    return [];
  }
  const tags = await listTags({ size: 100 });
  return tags.content.filter((tag) => tagNames.includes(tag.name)).map((tag) => tag.id);
}
