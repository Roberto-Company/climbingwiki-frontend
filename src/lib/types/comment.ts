export interface CommentRequest {
  userId: number;
  routeId: number | null;
  cragId: number | null;
  parentCommentId: number | null;
  body: string;
}

export interface CommentResponse {
  id: number;
  userId: number;
  routeId: number | null;
  cragId: number | null;
  parentCommentId: number | null;
  body: string;
  createdAt: string;
}
