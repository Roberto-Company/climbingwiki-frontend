export interface CragRequest {
  zoneId: number | null;
  createdById: number | null;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  altitudeM: number | null;
  orientation: string | null;
  rockType: string | null;
  approachDescription: string | null;
}

export interface CragResponse {
  id: number;
  zoneId: number | null;
  createdById: number | null;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  altitudeM: number | null;
  orientation: string | null;
  rockType: string | null;
  approachDescription: string | null;
  createdAt: string;
}
