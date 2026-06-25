export interface RouteListRequest {
  userId: number;
  name: string;
  description: string | null;
  isPublic: boolean | null;
}

export interface RouteListResponse {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
}
