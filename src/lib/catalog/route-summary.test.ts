import { describe, expect, it } from "vitest";
import type { GradeResponse, PitchResponse } from "@/lib/types";
import { buildGradeLookup, hardestGrade, totalLength } from "./route-summary";

function grade(id: number, label: string, difficultyScore: number): GradeResponse {
  return { id, gradingSystemId: 1, label, difficultyScore } as GradeResponse;
}

function pitch(gradeId: number | null, lengthM: number | null): PitchResponse {
  return { id: Math.random(), routeId: 1, orderIndex: 1, gradeId, lengthM } as PitchResponse;
}

const lookup = buildGradeLookup([grade(1, "6a", 60), grade(2, "6c+", 66), grade(3, "5c", 53)]);

describe("hardestGrade", () => {
  it("returns the grade with the highest difficulty score", () => {
    expect(hardestGrade([pitch(1, 20), pitch(2, 25), pitch(3, 15)], lookup)?.label).toBe("6c+");
  });

  it("skips ungraded pitches and unknown grade ids", () => {
    expect(hardestGrade([pitch(null, 20), pitch(99, 10), pitch(3, 15)], lookup)?.label).toBe("5c");
  });

  it("returns null when no pitch has a known grade", () => {
    expect(hardestGrade([pitch(null, 20)], lookup)).toBeNull();
    expect(hardestGrade([], lookup)).toBeNull();
  });
});

describe("totalLength", () => {
  it("sums the known pitch lengths", () => {
    expect(totalLength([pitch(1, 20), pitch(2, null), pitch(3, 15)])).toBe(35);
  });

  it("returns null when no pitch has a length", () => {
    expect(totalLength([pitch(1, null)])).toBeNull();
    expect(totalLength([])).toBeNull();
  });
});
