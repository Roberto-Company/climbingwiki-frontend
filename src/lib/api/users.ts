import { apiFetch } from "./client";
import { API_BASE_URL } from "./config";
import { ApiError } from "./errors";
import type { ProfileRequest, UserResponse, UserStatsResponse } from "@/lib/types";

/** With the viewer's token the API includes private fields (email) they are allowed to see. */
export function getUser(id: number, token?: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${id}`, { token });
}

export function getUserStats(id: number): Promise<UserStatsResponse> {
  return apiFetch<UserStatsResponse>(`/users/${id}/stats`);
}

export function updateProfile(id: number, body: ProfileRequest, token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${id}/profile`, { method: "PUT", body, token });
}

export function deleteAvatar(id: number, token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>(`/users/${id}/avatar`, { method: "DELETE", token });
}

/** Multipart upload, so it skips apiFetch's JSON body handling. */
export async function uploadAvatar(id: number, file: Blob, token: string): Promise<UserResponse> {
  const form = new FormData();
  form.append("file", file, "avatar");
  const response = await fetch(`${API_BASE_URL}/users/${id}/avatar`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
        ? data.message
        : response.statusText;
    throw new ApiError(response.status, message);
  }
  return data as UserResponse;
}

/** Raw picture bytes for the avatar route handler; null when the user has none. */
export async function fetchAvatar(id: number): Promise<Response | null> {
  const response = await fetch(`${API_BASE_URL}/users/${id}/avatar`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }
  return response;
}
