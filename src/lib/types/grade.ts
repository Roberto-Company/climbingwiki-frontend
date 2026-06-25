export interface GradeRequest {
  gradingSystemId: number;
  label: string;
  difficultyScore: number;
}

export interface GradeResponse {
  id: number;
  gradingSystemId: number;
  label: string;
  difficultyScore: number;
}
