import { apiFetch } from "./client";
import type { UserResponse } from "@/lib/types";

export function getUser(id: number): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${id}`);
}
