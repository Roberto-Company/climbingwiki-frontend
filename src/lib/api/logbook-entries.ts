import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { LogbookEntryRequest, LogbookEntryResponse, PagedResponse } from "@/lib/types";

export interface ListLogbookEntriesParams extends PageParams {
  userId?: number;
  routeId?: number;
}

export function listLogbookEntries(
  params: ListLogbookEntriesParams = {},
): Promise<PagedResponse<LogbookEntryResponse>> {
  return apiFetch<PagedResponse<LogbookEntryResponse>>(`/logbook-entries${toQueryString(params)}`);
}

export function getLogbookEntry(id: number): Promise<LogbookEntryResponse> {
  return apiFetch<LogbookEntryResponse>(`/logbook-entries/${id}`);
}

export function createLogbookEntry(body: LogbookEntryRequest, token: string): Promise<LogbookEntryResponse> {
  return apiFetch<LogbookEntryResponse>("/logbook-entries", { method: "POST", body, token });
}

export function updateLogbookEntry(
  id: number,
  body: LogbookEntryRequest,
  token: string,
): Promise<LogbookEntryResponse> {
  return apiFetch<LogbookEntryResponse>(`/logbook-entries/${id}`, { method: "PUT", body, token });
}

export function deleteLogbookEntry(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/logbook-entries/${id}`, { method: "DELETE", token });
}
