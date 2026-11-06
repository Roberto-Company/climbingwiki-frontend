import { describe, expect, it } from "vitest";
import { isSafeInternalPath } from "./url";

describe("isSafeInternalPath", () => {
  it("accepts paths on this site", () => {
    expect(isSafeInternalPath("/crags/3")).toBe(true);
    expect(isSafeInternalPath("/zones")).toBe(true);
  });

  it("rejects other sites and odd values", () => {
    expect(isSafeInternalPath("//evil.example/x")).toBe(false);
    expect(isSafeInternalPath("/\\evil.example")).toBe(false);
    expect(isSafeInternalPath("https://evil.example")).toBe(false);
    expect(isSafeInternalPath("crags/3")).toBe(false);
    expect(isSafeInternalPath("")).toBe(false);
  });
});
