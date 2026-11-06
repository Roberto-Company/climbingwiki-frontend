export type RouteType = "SPORT" | "BOULDER" | "TRAD";

export interface RouteRequest {
  sectorId: number;
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
  /** Grade of the hardest pitch; null when no pitch is graded. */
  hardestGradeId: number | null;
  /** Sum of pitch lengths in metres; null when no pitch has a length. */
  totalLengthM: number | null;
  /** False until a moderator has reviewed it (data added by regular users). */
  verified: boolean;
}
