import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { PagedResponse, ZoneResponse } from "@/lib/types";

export interface ListZonesParams extends PageParams {
  parentZoneId?: number;
  rootOnly?: boolean;
  name?: string;
}

export function listZones(params: ListZonesParams = {}): Promise<PagedResponse<ZoneResponse>> {
  return apiFetch<PagedResponse<ZoneResponse>>(`/zones${toQueryString(params)}`);
}

export function getZone(id: number): Promise<ZoneResponse> {
  return apiFetch<ZoneResponse>(`/zones/${id}`);
}
