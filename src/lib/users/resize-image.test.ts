import { describe, expect, it } from "vitest";
import { centerSquare } from "./resize-image";

describe("centerSquare", () => {
  it("crops the sides of a landscape picture", () => {
    expect(centerSquare(4000, 3000)).toEqual({ sx: 500, sy: 0, side: 3000 });
  });

  it("crops the top and bottom of a portrait picture", () => {
    expect(centerSquare(3000, 4000)).toEqual({ sx: 0, sy: 500, side: 3000 });
  });

  it("keeps a square picture whole", () => {
    expect(centerSquare(512, 512)).toEqual({ sx: 0, sy: 0, side: 512 });
  });

  it("rounds odd offsets to whole pixels", () => {
    expect(centerSquare(101, 100)).toEqual({ sx: 1, sy: 0, side: 100 });
  });
});
