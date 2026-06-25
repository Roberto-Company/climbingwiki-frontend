export interface FavoriteRequest {
  userId: number;
  routeId: number;
}

export interface FavoriteResponse {
  userId: number;
  routeId: number;
  createdAt: string;
}
