import type { GradeResponse } from "@/lib/types";
import { referenceRank } from "./grade-conversion";
import type { GradeLookup } from "./route-summary";

/** Grading system names by id, so grades of any system can be banded on the same scale. */
export type SystemNames = ReadonlyMap<number, string>;

/** Guidebook-style difficulty bands; the colours live in `RouteBadges` and `GradeHistogram`. */
export type GradeBand = "beginner" | "intermediate" | "advanced" | "expert";

/**
 * Band limits as positions on the reference scale (French 6a / 6c / 7b; Font 6A / 6C / 7B), see
 * `referenceRank`. Grades of other systems (YDS, UIAA, V-Scale…) are banded by their equivalent.
 */
const INTERMEDIATE_FROM_RANK = 5;
const ADVANCED_FROM_RANK = 9;
const EXPERT_FROM_RANK = 13;

/** Fallback for unknown grades: French-scale scores, 6a = 8, 6c = 12, 7b = 16. */
const INTERMEDIATE_FROM_SCORE = 8;
const ADVANCED_FROM_SCORE = 12;
const EXPERT_FROM_SCORE = 16;

function bandFor(value: number, intermediate: number, advanced: number, expert: number): GradeBand {
  if (value >= expert) {
    return "expert";
  }
  if (value >= advanced) {
    return "advanced";
  }
  return value >= intermediate ? "intermediate" : "beginner";
}

/** The grade's band. Pass its system's name to band non-French grades by their equivalent. */
export function gradeBand(grade: Pick<GradeResponse, "label" | "difficultyScore">, systemName?: string): GradeBand {
  const rank = systemName ? referenceRank(grade.label, systemName) : null;
  return rank !== null
    ? bandFor(rank, INTERMEDIATE_FROM_RANK, ADVANCED_FROM_RANK, EXPERT_FROM_RANK)
    : bandFor(grade.difficultyScore, INTERMEDIATE_FROM_SCORE, ADVANCED_FROM_SCORE, EXPERT_FROM_SCORE);
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
  systemNames: SystemNames = new Map(),
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
    .map((grade) => ({ grade, count: counts.get(grade.id) ?? 0, band: gradeBand(grade, systemNames.get(grade.gradingSystemId)) }));
}

export const GRADE_BANDS: readonly GradeBand[] = ["beginner", "intermediate", "advanced", "expert"];

/** Graded routes per band, easiest band first, for a sector's one-line difficulty spread. */
export function bandCounts(
  routes: readonly { hardestGradeId: number | null }[],
  lookup: GradeLookup,
  systemNames: SystemNames = new Map(),
): { band: GradeBand; count: number }[] {
  const counts = new Map<GradeBand, number>();
  for (const route of routes) {
    const grade = route.hardestGradeId !== null ? lookup.get(route.hardestGradeId) : undefined;
    if (grade) {
      const band = gradeBand(grade, systemNames.get(grade.gradingSystemId));
      counts.set(band, (counts.get(band) ?? 0) + 1);
    }
  }
  return GRADE_BANDS.filter((band) => counts.has(band)).map((band) => ({ band, count: counts.get(band)! }));
}
