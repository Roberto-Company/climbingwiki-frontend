import { apiFetch } from "./client";
import { toQueryString } from "./query";
import type { GradeResponse } from "@/lib/types";

export interface ListGradesParams {
  gradingSystemId?: number;
}

export function listGrades(params: ListGradesParams = {}): Promise<GradeResponse[]> {
  return apiFetch<GradeResponse[]>(`/grades${toQueryString(params)}`);
}

export function getGrade(id: number): Promise<GradeResponse> {
  return apiFetch<GradeResponse>(`/grades/${id}`);
}
