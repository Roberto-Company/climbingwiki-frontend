import { apiFetch } from "./client";
import { toQueryString, type PageParams } from "./query";
import type { CommentRequest, CommentResponse, PagedResponse } from "@/lib/types";

export interface ListCommentsParams extends PageParams {
  routeId?: number;
  cragId?: number;
}

export function listComments(params: ListCommentsParams = {}): Promise<PagedResponse<CommentResponse>> {
  return apiFetch<PagedResponse<CommentResponse>>(`/comments${toQueryString(params)}`);
}

export function getComment(id: number): Promise<CommentResponse> {
  return apiFetch<CommentResponse>(`/comments/${id}`);
}

export function createComment(body: CommentRequest, token: string): Promise<CommentResponse> {
  return apiFetch<CommentResponse>("/comments", { method: "POST", body, token });
}

export function updateComment(id: number, body: CommentRequest, token: string): Promise<CommentResponse> {
  return apiFetch<CommentResponse>(`/comments/${id}`, { method: "PUT", body, token });
}

export function deleteComment(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/comments/${id}`, { method: "DELETE", token });
}
