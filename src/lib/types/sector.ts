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
  createdById: number | null;
  /** False until a moderator has reviewed it (data added by regular users). */
  verified: boolean;
}
