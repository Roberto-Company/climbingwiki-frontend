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
  createdById: number | null;
  /** False until a moderator has reviewed it (data added by regular users). */
  verified: boolean;
}
