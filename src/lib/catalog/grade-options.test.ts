import { describe, expect, it } from "vitest";
import type { GradeResponse, GradingSystemResponse } from "@/lib/types";
import { groupGradesBySystem } from "./grade-options";

const systems: GradingSystemResponse[] = [
  { id: 2, name: "V-Scale", category: "BOULDER" },
  { id: 1, name: "French", category: "ROPED" },
  { id: 3, name: "Empty", category: "ROPED" },
];

const grades: GradeResponse[] = [
  { id: 10, gradingSystemId: 1, label: "6a", difficultyScore: 8 },
  { id: 11, gradingSystemId: 1, label: "5+", difficultyScore: 6 },
  { id: 20, gradingSystemId: 2, label: "V0", difficultyScore: 1 },
];

describe("groupGradesBySystem", () => {
  it("groups grades by system, easiest first, preferred system on top, empty systems dropped", () => {
    expect(groupGradesBySystem(systems, grades, "French")).toEqual([
      { system: "French", grades: [{ id: 11, label: "5+" }, { id: 10, label: "6a" }] },
      { system: "V-Scale", grades: [{ id: 20, label: "V0" }] },
    ]);
  });
});
