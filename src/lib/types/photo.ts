export interface PhotoRequest {
  userId: number;
  routeId: number | null;
  cragId: number | null;
  url: string;
  caption: string | null;
  isTopo: boolean | null;
}

export interface PhotoResponse {
  id: number;
  userId: number;
  routeId: number | null;
  cragId: number | null;
  url: string;
  caption: string | null;
  isTopo: boolean;
  createdAt: string;
}
