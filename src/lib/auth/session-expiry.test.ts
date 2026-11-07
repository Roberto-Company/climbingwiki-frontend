import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { accountIsGone, sessionWasRejected } from "./session-expiry";

describe("sessionWasRejected", () => {
  it("is true when a request that carried the token gets 401", () => {
    expect(sessionWasRejected(401, true)).toBe(true);
  });

  it("is false for anonymous requests, so a wrong password stays a form error", () => {
    expect(sessionWasRejected(401, false)).toBe(false);
  });

  it("is false for other errors such as 403 (logged in, not allowed)", () => {
    expect(sessionWasRejected(403, true)).toBe(false);
    expect(sessionWasRejected(500, true)).toBe(false);
  });
});

describe("accountIsGone", () => {
  it("is true when looking up the session's own user gives 404", () => {
    expect(accountIsGone(new ApiError(404, "User not found"))).toBe(true);
  });

  it("is false when the API is down or failing, so the header can fall back", () => {
    expect(accountIsGone(new ApiError(503, "Service Unavailable"))).toBe(false);
    expect(accountIsGone(new TypeError("fetch failed"))).toBe(false);
  });
});
