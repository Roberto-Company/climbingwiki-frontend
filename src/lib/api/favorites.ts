import { apiFetch } from "./client";
import { toQueryString } from "./query";
import type { FavoriteRequest, FavoriteResponse } from "@/lib/types";

export interface ListFavoritesParams {
  routeId?: number;
  userId?: number;
}

export function listFavorites(params: ListFavoritesParams = {}): Promise<FavoriteResponse[]> {
  return apiFetch<FavoriteResponse[]>(`/favorites${toQueryString(params)}`);
}

export function getFavorite(userId: number, routeId: number): Promise<FavoriteResponse> {
  return apiFetch<FavoriteResponse>(`/favorites/${userId}/${routeId}`);
}

export function upsertFavorite(body: FavoriteRequest, token: string): Promise<FavoriteResponse> {
  return apiFetch<FavoriteResponse>("/favorites", { method: "POST", body, token });
}

export function deleteFavorite(userId: number, routeId: number, token: string): Promise<void> {
  return apiFetch<void>(`/favorites/${userId}/${routeId}`, { method: "DELETE", token });
}
