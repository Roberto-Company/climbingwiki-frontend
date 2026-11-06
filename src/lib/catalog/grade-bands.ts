import type { GradeResponse } from "@/lib/types";
import type { GradeLookup } from "./route-summary";

/** Guidebook-style difficulty bands; the colours live in `RouteBadges` and `GradeHistogram`. */
export type GradeBand = "beginner" | "intermediate" | "advanced" | "expert";

/** Scores follow the French scale stored in the backend: 5+ = 6, 6a = 8, 6c = 12, 7b = 16. */
const INTERMEDIATE_FROM = 8;
const ADVANCED_FROM = 12;
const EXPERT_FROM = 16;

export function gradeBand(grade: Pick<GradeResponse, "difficultyScore">): GradeBand {
  if (grade.difficultyScore >= EXPERT_FROM) {
    return "expert";
  }
  if (grade.difficultyScore >= ADVANCED_FROM) {
    return "advanced";
  }
  return grade.difficultyScore >= INTERMEDIATE_FROM ? "intermediate" : "beginner";
}

export interface HistogramBin {
  grade: GradeResponse;
  count: number;
  band: GradeBand;
}

/**
 * Routes per grade, from the easiest to the hardest grade present, with empty grades in between
 * so the chart's x-axis is a real scale. Uses the grading system of the routes' grades.
 */
export function gradeHistogram(
  routes: readonly { hardestGradeId: number | null }[],
  lookup: GradeLookup,
  allGrades: readonly GradeResponse[],
): HistogramBin[] {
  const counts = new Map<number, number>();
  for (const route of routes) {
    const grade = route.hardestGradeId !== null ? lookup.get(route.hardestGradeId) : undefined;
    if (grade) {
      counts.set(grade.id, (counts.get(grade.id) ?? 0) + 1);
    }
  }
  const present = [...counts.keys()].map((id) => lookup.get(id)!);
  if (present.length === 0) {
    return [];
  }
  const systemId = present[0].gradingSystemId;
  const scores = present.map((grade) => grade.difficultyScore);
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  return allGrades
    .filter((grade) => grade.gradingSystemId === systemId && grade.difficultyScore >= min && grade.difficultyScore <= max)
    .toSorted((a, b) => a.difficultyScore - b.difficultyScore)
    .map((grade) => ({ grade, count: counts.get(grade.id) ?? 0, band: gradeBand(grade) }));
}

export const GRADE_BANDS: readonly GradeBand[] = ["beginner", "intermediate", "advanced", "expert"];

/** Graded routes per band, easiest band first, for a sector's one-line difficulty spread. */
export function bandCounts(
  routes: readonly { hardestGradeId: number | null }[],
  lookup: GradeLookup,
): { band: GradeBand; count: number }[] {
  const counts = new Map<GradeBand, number>();
  for (const route of routes) {
    const grade = route.hardestGradeId !== null ? lookup.get(route.hardestGradeId) : undefined;
    if (grade) {
      const band = gradeBand(grade);
      counts.set(band, (counts.get(band) ?? 0) + 1);
    }
  }
  return GRADE_BANDS.filter((band) => counts.has(band)).map((band) => ({ band, count: counts.get(band)! }));
}
