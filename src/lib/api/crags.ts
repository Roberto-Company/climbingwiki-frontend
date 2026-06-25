import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { CragResponse, PagedResponse } from "@/lib/types";

export interface ListCragsParams extends PageParams {
  zoneId?: number;
}

export function listCrags(params: ListCragsParams = {}): Promise<PagedResponse<CragResponse>> {
  return apiFetch<PagedResponse<CragResponse>>(`/crags${toQueryString(params)}`);
}

export function getCrag(id: number): Promise<CragResponse> {
  return apiFetch<CragResponse>(`/crags/${id}`);
}
