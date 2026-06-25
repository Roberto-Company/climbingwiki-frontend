import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { PagedResponse, TagResponse } from "@/lib/types";

export function listTags(params: PageParams = {}): Promise<PagedResponse<TagResponse>> {
  return apiFetch<PagedResponse<TagResponse>>(`/tags${toQueryString(params)}`);
}

export function getTag(id: number): Promise<TagResponse> {
  return apiFetch<TagResponse>(`/tags/${id}`);
}
