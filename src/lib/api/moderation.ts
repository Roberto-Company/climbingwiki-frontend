import { apiFetch } from "./client";
import type { UnverifiedItem } from "@/lib/types";

/** Moderators and admins only. */
export function listUnverifiedItems(token: string): Promise<UnverifiedItem[]> {
  return apiFetch<UnverifiedItem[]>("/moderation/unverified", { token });
}
