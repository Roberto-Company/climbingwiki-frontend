import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { PagedResponse, RouteResponse } from "@/lib/types";

export interface ListRoutesParams extends PageParams {
  sectorId?: number;
  name?: string;
}

export function listRoutes(params: ListRoutesParams = {}): Promise<PagedResponse<RouteResponse>> {
  return apiFetch<PagedResponse<RouteResponse>>(`/routes${toQueryString(params)}`);
}

export function getRoute(id: number): Promise<RouteResponse> {
  return apiFetch<RouteResponse>(`/routes/${id}`);
}
