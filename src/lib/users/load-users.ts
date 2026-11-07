import "server-only";

import { getUser } from "@/lib/api";
import type { UserResponse } from "@/lib/types";

/** Users by id, each fetched once. Users that no longer exist are left out. */
export async function loadUsersById(ids: readonly number[]): Promise<Map<number, UserResponse>> {
  const unique = [...new Set(ids)];
  const results = await Promise.allSettled(unique.map((id) => getUser(id)));
  const users = new Map<number, UserResponse>();
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      users.set(result.value.id, result.value);
    }
  });
  return users;
}
