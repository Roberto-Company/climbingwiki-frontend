import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { PagedResponse, PitchResponse } from "@/lib/types";

export interface ListPitchesParams extends PageParams {
  routeId?: number;
}

export function listPitches(params: ListPitchesParams = {}): Promise<PagedResponse<PitchResponse>> {
  return apiFetch<PagedResponse<PitchResponse>>(`/pitches${toQueryString(params)}`);
}

export function getPitch(id: number): Promise<PitchResponse> {
  return apiFetch<PitchResponse>(`/pitches/${id}`);
}
