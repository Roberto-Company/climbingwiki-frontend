import { describe, expect, it } from "vitest";
import type { GradeResponse } from "@/lib/types";
import { bandCounts, gradeBand, gradeHistogram } from "./grade-bands";

function grade(id: number, label: string, difficultyScore: number): GradeResponse {
  return { id, gradingSystemId: 1, label, difficultyScore };
}

const FRENCH = [grade(4, "5", 4), grade(7, "5+", 6), grade(8, "6a", 8), grade(9, "6a+", 9), grade(10, "6b", 10), grade(12, "6c", 12), grade(14, "7a", 14), grade(16, "7b", 16)];
const lookup = new Map(FRENCH.map((entry) => [entry.id, entry]));

describe("gradeBand", () => {
  it("splits the French scale into the usual guidebook bands", () => {
    expect(gradeBand(grade(4, "5", 4))).toBe("beginner");
    expect(gradeBand(grade(7, "5+", 6))).toBe("beginner");
    expect(gradeBand(grade(8, "6a", 8))).toBe("intermediate");
    expect(gradeBand(grade(11, "6b+", 11))).toBe("intermediate");
    expect(gradeBand(grade(12, "6c", 12))).toBe("advanced");
    expect(gradeBand(grade(15, "7a+", 15))).toBe("advanced");
    expect(gradeBand(grade(16, "7b", 16))).toBe("expert");
  });
});

describe("gradeHistogram", () => {
  it("counts routes per grade over a continuous range, including empty grades", () => {
    const bins = gradeHistogram([{ hardestGradeId: 9 }, { hardestGradeId: 9 }, { hardestGradeId: 12 }, { hardestGradeId: null }], lookup, FRENCH);

    expect(bins.map((bin) => [bin.grade.label, bin.count])).toEqual([
      ["6a+", 2],
      ["6b", 0],
      ["6c", 1],
    ]);
    expect(bins[2].band).toBe("advanced");
  });

  it("is empty when no route has a grade", () => {
    expect(gradeHistogram([{ hardestGradeId: null }], lookup, FRENCH)).toEqual([]);
  });
});

describe("bandCounts", () => {
  it("counts graded routes per band, in band order, skipping empty bands", () => {
    const counts = bandCounts([{ hardestGradeId: 16 }, { hardestGradeId: 8 }, { hardestGradeId: 9 }, { hardestGradeId: null }], lookup);

    expect(counts).toEqual([
      { band: "intermediate", count: 2 },
      { band: "expert", count: 1 },
    ]);
  });
});

describe("gradeBand in other systems", () => {
  const yds = (label: string, difficultyScore: number): GradeResponse => ({ id: 100, gradingSystemId: 2, label, difficultyScore });
  const v = (label: string, difficultyScore: number): GradeResponse => ({ id: 200, gradingSystemId: 3, label, difficultyScore });

  it("bands YDS grades by their French equivalent, not their raw score", () => {
    expect(gradeBand(yds("5.9", 5), "YDS")).toBe("beginner");
    expect(gradeBand(yds("5.10b", 7), "YDS")).toBe("intermediate");
    expect(gradeBand(yds("5.11b", 11), "YDS")).toBe("advanced");
    expect(gradeBand(yds("5.12b", 15), "YDS")).toBe("expert");
  });

  it("bands boulder grades on the Font scale", () => {
    expect(gradeBand(v("V2", 4), "V-Scale")).toBe("beginner");
    expect(gradeBand(v("V3", 5), "V-Scale")).toBe("intermediate");
    expect(gradeBand(v("V5", 7), "V-Scale")).toBe("advanced");
    expect(gradeBand(v("V8", 10), "V-Scale")).toBe("expert");
  });

  it("falls back to the score when the system or grade is unknown", () => {
    expect(gradeBand(yds("5.99", 16), "YDS")).toBe("expert");
    expect(gradeBand(yds("6a", 8))).toBe("intermediate");
  });

  it("uses the system names in histograms and band counts", () => {
    const systemNames = new Map([[2, "YDS"]]);
    const ydsGrades = [yds("5.10b", 7)].map((entry) => ({ ...entry, id: 30 }));
    const ydsLookup = new Map(ydsGrades.map((entry) => [entry.id, entry]));

    expect(bandCounts([{ hardestGradeId: 30 }], ydsLookup, systemNames)).toEqual([{ band: "intermediate", count: 1 }]);
    expect(gradeHistogram([{ hardestGradeId: 30 }], ydsLookup, ydsGrades, systemNames)[0].band).toBe("intermediate");
  });
});
