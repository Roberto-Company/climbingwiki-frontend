import { describe, expect, it } from "vitest";
import { convertGradeLabel, routeGradeCategory, systemsForCategory } from "./grade-conversion";

describe("convertGradeLabel", () => {
  it("returns the same label when source and target match", () => {
    expect(convertGradeLabel("5.10a", "YDS", "YDS")).toBe("5.10a");
  });

  it("converts YDS to French", () => {
    expect(convertGradeLabel("5.10a", "YDS", "French")).toBe("5+");
    expect(convertGradeLabel("5.11d", "YDS", "French")).toBe("7a");
    expect(convertGradeLabel("5.14d", "YDS", "French")).toBe("9a");
  });

  it("converts French to YDS and UIAA", () => {
    expect(convertGradeLabel("6a", "French", "YDS")).toBe("5.10b");
    expect(convertGradeLabel("7b", "French", "UIAA")).toBe("IX-");
  });

  it("maps YDS grades that share a French grade to the same one", () => {
    expect(convertGradeLabel("5.8", "YDS", "French")).toBe("5");
    expect(convertGradeLabel("5.9", "YDS", "French")).toBe("5");
  });

  it("converts boulder grades between Font and V-Scale", () => {
    expect(convertGradeLabel("V4", "V-Scale", "Font")).toBe("6B");
    expect(convertGradeLabel("7A", "Font", "V-Scale")).toBe("V6");
    expect(convertGradeLabel("V-easy", "V-Scale", "Font")).toBe("3");
  });

  it("returns null across categories or for unknown grades and systems", () => {
    expect(convertGradeLabel("V4", "V-Scale", "French")).toBeNull();
    expect(convertGradeLabel("5.99", "YDS", "French")).toBeNull();
    expect(convertGradeLabel("6a", "Unknown", "YDS")).toBeNull();
  });
});

describe("systemsForCategory", () => {
  it("lists the systems a grade can be shown in, per category", () => {
    expect(systemsForCategory("ROPED")).toEqual(["French", "YDS", "UIAA", "Ewbank"]);
    expect(systemsForCategory("BOULDER")).toEqual(["Font", "V-Scale"]);
  });
});

describe("routeGradeCategory", () => {
  it("grades boulders in boulder systems and everything else in roped ones", () => {
    expect(routeGradeCategory("BOULDER")).toBe("BOULDER");
    expect(routeGradeCategory("SPORT")).toBe("ROPED");
    expect(routeGradeCategory("TRAD")).toBe("ROPED");
  });
});
