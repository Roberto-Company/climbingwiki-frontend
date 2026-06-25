import { apiFetch } from "./client";
import { toQueryString } from "./query";
import type { RouteListRequest, RouteListResponse } from "@/lib/types";

export interface ListRouteListsParams {
  userId?: number;
}

export function listRouteLists(params: ListRouteListsParams = {}): Promise<RouteListResponse[]> {
  return apiFetch<RouteListResponse[]>(`/route-lists${toQueryString(params)}`);
}

export function getRouteList(id: number): Promise<RouteListResponse> {
  return apiFetch<RouteListResponse>(`/route-lists/${id}`);
}

export function createRouteList(body: RouteListRequest, token: string): Promise<RouteListResponse> {
  return apiFetch<RouteListResponse>("/route-lists", { method: "POST", body, token });
}

export function updateRouteList(id: number, body: RouteListRequest, token: string): Promise<RouteListResponse> {
  return apiFetch<RouteListResponse>(`/route-lists/${id}`, { method: "PUT", body, token });
}

export function deleteRouteList(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/route-lists/${id}`, { method: "DELETE", token });
}
