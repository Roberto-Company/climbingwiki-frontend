import type { GradeResponse, PitchResponse } from "@/lib/types";

export type GradeLookup = ReadonlyMap<number, GradeResponse>;

export function buildGradeLookup(grades: readonly GradeResponse[]): GradeLookup {
  return new Map(grades.map((grade) => [grade.id, grade]));
}

/** A route's overall grade is the grade of its hardest pitch. */
export function hardestGrade(pitches: readonly PitchResponse[], grades: GradeLookup): GradeResponse | null {
  return pitches.reduce<GradeResponse | null>((hardest, pitch) => {
    const grade = pitch.gradeId !== null ? grades.get(pitch.gradeId) : undefined;
    if (!grade) {
      return hardest;
    }
    return hardest === null || grade.difficultyScore > hardest.difficultyScore ? grade : hardest;
  }, null);
}

export function totalLength(pitches: readonly PitchResponse[]): number | null {
  const lengths = pitches.map((pitch) => pitch.lengthM).filter((length): length is number => length !== null);
  return lengths.length > 0 ? lengths.reduce((sum, length) => sum + length, 0) : null;
}
