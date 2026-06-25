import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { PagedResponse, SectorResponse } from "@/lib/types";

export interface ListSectorsParams extends PageParams {
  cragId?: number;
}

export function listSectors(params: ListSectorsParams = {}): Promise<PagedResponse<SectorResponse>> {
  return apiFetch<PagedResponse<SectorResponse>>(`/sectors${toQueryString(params)}`);
}

export function getSector(id: number): Promise<SectorResponse> {
  return apiFetch<SectorResponse>(`/sectors/${id}`);
}
