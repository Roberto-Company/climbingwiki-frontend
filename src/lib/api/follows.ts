import { apiFetch } from "./client";
import { toQueryString } from "./query";
import type { FollowRequest, FollowResponse } from "@/lib/types";

export interface ListFollowsParams {
  followerId?: number;
  followedId?: number;
}

export function listFollows(params: ListFollowsParams = {}): Promise<FollowResponse[]> {
  return apiFetch<FollowResponse[]>(`/follows${toQueryString(params)}`);
}

export function getFollow(followerId: number, followedId: number): Promise<FollowResponse> {
  return apiFetch<FollowResponse>(`/follows/${followerId}/${followedId}`);
}

export function upsertFollow(body: FollowRequest, token: string): Promise<FollowResponse> {
  return apiFetch<FollowResponse>("/follows", { method: "POST", body, token });
}

export function deleteFollow(followerId: number, followedId: number, token: string): Promise<void> {
  return apiFetch<void>(`/follows/${followerId}/${followedId}`, { method: "DELETE", token });
}
