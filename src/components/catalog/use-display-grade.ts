"use client";

import { convertGradeLabel } from "@/lib/catalog/grade-conversion";
import { ORIGINAL, useGradeDisplayChoice } from "@/lib/catalog/grade-preference";
import type { GradeResponse } from "@/lib/types";
import { useGradingSystem } from "./GradingSystemsProvider";

export interface DisplayGrade {
  /** What to show: the converted grade, or the grade as entered. */
  label: string;
  /** Set when `label` is a conversion: the grade and system it was entered in. */
  original: { label: string; system: string } | null;
}

/** A grade as the visitor chose to see it (see `GradeSystemSwitcher`). */
export function useDisplayGrade(grade: GradeResponse): DisplayGrade {
  const system = useGradingSystem(grade.gradingSystemId);
  const choice = useGradeDisplayChoice(system?.category ?? "ROPED");
  const converted = system && choice !== ORIGINAL ? convertGradeLabel(grade.label, system.name, choice) : null;
  if (!system || converted === null || converted === grade.label) {
    return { label: grade.label, original: null };
  }
  return { label: converted, original: { label: grade.label, system: system.name } };
}
