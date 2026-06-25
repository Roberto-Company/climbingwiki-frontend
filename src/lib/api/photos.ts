import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { PagedResponse, PhotoRequest, PhotoResponse } from "@/lib/types";

export interface ListPhotosParams extends PageParams {
  routeId?: number;
  cragId?: number;
}

export function listPhotos(params: ListPhotosParams = {}): Promise<PagedResponse<PhotoResponse>> {
  return apiFetch<PagedResponse<PhotoResponse>>(`/photos${toQueryString(params)}`);
}

export function getPhoto(id: number): Promise<PhotoResponse> {
  return apiFetch<PhotoResponse>(`/photos/${id}`);
}

export function createPhoto(body: PhotoRequest, token: string): Promise<PhotoResponse> {
  return apiFetch<PhotoResponse>("/photos", { method: "POST", body, token });
}

export function updatePhoto(id: number, body: PhotoRequest, token: string): Promise<PhotoResponse> {
  return apiFetch<PhotoResponse>(`/photos/${id}`, { method: "PUT", body, token });
}

export function deletePhoto(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/photos/${id}`, { method: "DELETE", token });
}
