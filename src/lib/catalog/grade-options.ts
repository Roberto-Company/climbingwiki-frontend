import type { GradeResponse, GradingSystemResponse } from "@/lib/types";

export interface GradeOption {
  id: number;
  label: string;
}

export interface GradeGroup {
  system: string;
  grades: GradeOption[];
}

/** Grade choices for a select: one group per system, easiest grade first, `preferred` system on top. */
export function groupGradesBySystem(
  systems: readonly GradingSystemResponse[],
  grades: readonly GradeResponse[],
  preferred: string,
): GradeGroup[] {
  const ordered = [...systems].sort(
    (a, b) => Number(b.name === preferred) - Number(a.name === preferred) || a.name.localeCompare(b.name),
  );
  return ordered
    .map((system) => ({
      system: system.name,
      grades: grades
        .filter((grade) => grade.gradingSystemId === system.id)
        .sort((a, b) => a.difficultyScore - b.difficultyScore)
        .map(({ id, label }) => ({ id, label })),
    }))
    .filter((group) => group.grades.length > 0);
}
