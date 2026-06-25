export interface PitchRequest {
  routeId: number;
  gradeId: number | null;
  orderIndex: number;
  lengthM: number | null;
  boltsCount: number | null;
  description: string | null;
}

export interface PitchResponse {
  id: number;
  routeId: number;
  gradeId: number | null;
  orderIndex: number;
  lengthM: number | null;
  boltsCount: number | null;
  description: string | null;
}
