import { apiFetch } from "./client";
import type { GradingSystemResponse } from "@/lib/types";

export function listGradingSystems(): Promise<GradingSystemResponse[]> {
  return apiFetch<GradingSystemResponse[]>("/grading-systems");
}

export function getGradingSystem(id: number): Promise<GradingSystemResponse> {
  return apiFetch<GradingSystemResponse>(`/grading-systems/${id}`);
}
