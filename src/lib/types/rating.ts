export interface RatingRequest {
  userId: number;
  routeId: number;
  score: number;
}

export interface RatingResponse {
  userId: number;
  routeId: number;
  score: number;
  createdAt: string;
}
