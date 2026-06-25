import { apiFetch } from "./client";
import { toQueryString } from "./query";
import type { RatingRequest, RatingResponse } from "@/lib/types";

export interface ListRatingsParams {
  routeId?: number;
  userId?: number;
}

export function listRatings(params: ListRatingsParams = {}): Promise<RatingResponse[]> {
  return apiFetch<RatingResponse[]>(`/ratings${toQueryString(params)}`);
}

export function getRating(userId: number, routeId: number): Promise<RatingResponse> {
  return apiFetch<RatingResponse>(`/ratings/${userId}/${routeId}`);
}

export function upsertRating(body: RatingRequest, token: string): Promise<RatingResponse> {
  return apiFetch<RatingResponse>("/ratings", { method: "POST", body, token });
}

export function deleteRating(userId: number, routeId: number, token: string): Promise<void> {
  return apiFetch<void>(`/ratings/${userId}/${routeId}`, { method: "DELETE", token });
}
