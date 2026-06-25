import type { RouteType } from "./route";

export interface ZoneRequest {
  parentZoneId: number | null;
  name: string;
  description: string | null;
}

export interface ZoneResponse {
  id: number;
  parentZoneId: number | null;
  name: string;
  description: string | null;
  routeTypes: RouteType[];
}
