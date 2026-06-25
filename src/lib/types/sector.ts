import type { RouteType } from "./route";

export interface SectorRequest {
  cragId: number;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface SectorResponse {
  id: number;
  cragId: number;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  routeTypes: RouteType[];
}
