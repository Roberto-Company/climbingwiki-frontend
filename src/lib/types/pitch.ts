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
  createdById: number | null;
  /** False until a moderator has reviewed it (data added by regular users). */
  verified: boolean;
}
