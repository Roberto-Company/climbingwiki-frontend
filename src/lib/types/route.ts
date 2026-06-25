export type RouteType = "SPORT" | "BOULDER" | "TRAD";

export interface RouteRequest {
  sectorId: number;
  createdById: number | null;
  name: string;
  routeType: RouteType;
  description: string | null;
  equipmentNotes: string | null;
  firstAscentBy: string | null;
  firstAscentDate: string | null;
  latitude: number | null;
  longitude: number | null;
  tagIds: number[] | null;
}

export interface RouteResponse {
  id: number;
  sectorId: number;
  createdById: number | null;
  name: string;
  routeType: RouteType;
  description: string | null;
  equipmentNotes: string | null;
  firstAscentBy: string | null;
  firstAscentDate: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}
