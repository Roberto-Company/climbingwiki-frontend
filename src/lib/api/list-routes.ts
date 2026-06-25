import { apiFetch } from "./client";
import { toQueryString } from "./query";
import type { ListRouteRequest, ListRouteResponse } from "@/lib/types";

export interface ListListRoutesParams {
  listId?: number;
  routeId?: number;
}

export function listListRoutes(params: ListListRoutesParams = {}): Promise<ListRouteResponse[]> {
  return apiFetch<ListRouteResponse[]>(`/list-routes${toQueryString(params)}`);
}

export function getListRoute(listId: number, routeId: number): Promise<ListRouteResponse> {
  return apiFetch<ListRouteResponse>(`/list-routes/${listId}/${routeId}`);
}

export function upsertListRoute(body: ListRouteRequest, token: string): Promise<ListRouteResponse> {
  return apiFetch<ListRouteResponse>("/list-routes", { method: "POST", body, token });
}

export function deleteListRoute(listId: number, routeId: number, token: string): Promise<void> {
  return apiFetch<void>(`/list-routes/${listId}/${routeId}`, { method: "DELETE", token });
}
