import { describe, expect, it } from "vitest";
import { buildClientIpHeaders, pickClientIp } from "./client-ip-headers";

describe("pickClientIp", () => {
  it("returns null without a header", () => {
    expect(pickClientIp(null)).toBeNull();
  });

  it("takes the last entry, the one written by the nearest proxy", () => {
    expect(pickClientIp("6.6.6.6, 198.51.100.7")).toBe("198.51.100.7");
  });

  it("ignores empty entries", () => {
    expect(pickClientIp("198.51.100.7, ,")).toBe("198.51.100.7");
  });
});

describe("buildClientIpHeaders", () => {
  it("sends nothing without a visitor IP", () => {
    expect(buildClientIpHeaders(null, "a-secret")).toEqual({});
  });

  it("sends only X-Forwarded-For when no proxy secret is configured", () => {
    expect(buildClientIpHeaders("198.51.100.7", undefined)).toEqual({
      "X-Forwarded-For": "198.51.100.7",
    });
  });

  it("treats a blank secret as not configured", () => {
    expect(buildClientIpHeaders("198.51.100.7", "  ")).toEqual({
      "X-Forwarded-For": "198.51.100.7",
    });
  });

  it("adds X-Client-IP and the secret when a proxy secret is configured", () => {
    expect(buildClientIpHeaders("198.51.100.7", "a-secret")).toEqual({
      "X-Forwarded-For": "198.51.100.7",
      "X-Client-IP": "198.51.100.7",
      "X-Proxy-Secret": "a-secret",
    });
  });
});
