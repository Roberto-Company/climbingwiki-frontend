import { describe, expect, it } from "vitest";
import { healthUrl, phaseAfterCheck, WAKE_GIVE_UP_MS } from "./backend-wake";

describe("healthUrl", () => {
  it("points at the actuator health check on the API's origin", () => {
    expect(healthUrl("http://backend:8080/api")).toBe("http://backend:8080/actuator/health");
    expect(healthUrl("https://api.climbingwiki.example/api/")).toBe(
      "https://api.climbingwiki.example/actuator/health",
    );
  });
});

describe("phaseAfterCheck", () => {
  const start = 1_000_000;

  it("treats the page error as a real failure when the API was up from the start", () => {
    expect(phaseAfterCheck({ isUp: true, wasWaking: false, startedAt: start, now: start })).toBe("failed");
  });

  it("keeps waiting while the API is still down", () => {
    expect(phaseAfterCheck({ isUp: false, wasWaking: false, startedAt: start, now: start })).toBe("waking");
    expect(phaseAfterCheck({ isUp: false, wasWaking: true, startedAt: start, now: start + 60_000 })).toBe("waking");
  });

  it("is ready to reload the page once a sleeping API answers", () => {
    expect(phaseAfterCheck({ isUp: true, wasWaking: true, startedAt: start, now: start + 40_000 })).toBe("ready");
  });

  it("gives up after the waiting limit", () => {
    expect(
      phaseAfterCheck({ isUp: false, wasWaking: true, startedAt: start, now: start + WAKE_GIVE_UP_MS }),
    ).toBe("gaveUp");
  });
});
