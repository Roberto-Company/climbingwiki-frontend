import { describe, expect, it } from "vitest";
import { MAX_TICKS, showsCounts, tickStep } from "./histogram-ticks";

describe("tickStep", () => {
  it("labels every bar when they fit", () => {
    expect(tickStep(1)).toBe(1);
    expect(tickStep(MAX_TICKS)).toBe(1);
  });

  it("labels every second bar on a French scale from 6a to 9a", () => {
    expect(tickStep(19)).toBe(2);
  });

  it("labels every third bar on a long YDS scale", () => {
    expect(tickStep(29)).toBe(3);
  });

  it("never shows more than MAX_TICKS labels", () => {
    for (let bins = 1; bins <= 60; bins++) {
      expect(Math.ceil(bins / tickStep(bins))).toBeLessThanOrEqual(MAX_TICKS);
    }
  });
});

describe("showsCounts", () => {
  it("prints counts over the bars only while there is room for them", () => {
    expect(showsCounts(MAX_TICKS)).toBe(true);
    expect(showsCounts(MAX_TICKS + 1)).toBe(false);
  });
});
