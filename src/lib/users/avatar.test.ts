import { describe, expect, it } from "vitest";
import { AVATAR_COLORS, avatarColor, avatarSrc, displayName, initials } from "./avatar";

describe("avatarSrc", () => {
  it("maps an uploaded picture to this site's media route, keeping the version", () => {
    expect(avatarSrc({ id: 7, avatarUrl: "/api/users/7/avatar?v=1700000000000" })).toBe(
      "/media/avatars/7?v=1700000000000",
    );
    expect(avatarSrc({ id: 7, avatarUrl: "/api/users/7/avatar" })).toBe("/media/avatars/7");
  });

  it("ignores an uploaded path that belongs to another user", () => {
    expect(avatarSrc({ id: 7, avatarUrl: "/api/users/8/avatar?v=1" })).toBeNull();
  });

  it("keeps external http(s) pictures", () => {
    expect(avatarSrc({ id: 7, avatarUrl: "https://example.com/me.jpg" })).toBe("https://example.com/me.jpg");
  });

  it("returns null for missing or unsafe values", () => {
    expect(avatarSrc({ id: 7, avatarUrl: null })).toBeNull();
    expect(avatarSrc({ id: 7, avatarUrl: "  " })).toBeNull();
    expect(avatarSrc({ id: 7, avatarUrl: "javascript:alert(1)" })).toBeNull();
    expect(avatarSrc({ id: 7, avatarUrl: "/api/users/7/avatar?v=1&x=<script>" })).toBeNull();
  });
});

describe("initials", () => {
  it("uses the first and last word of the full name", () => {
    expect(initials({ username: "jane", fullName: "Jane van der Climber" })).toBe("JC");
  });

  it("falls back to the start of a single name or the username", () => {
    expect(initials({ username: "jane", fullName: "Jane" })).toBe("JA");
    expect(initials({ username: "demo", fullName: null })).toBe("DE");
    expect(initials({ username: "x", fullName: "   " })).toBe("X");
  });

  it("handles letters outside the basic Latin range", () => {
    expect(initials({ username: "user", fullName: "Ángel Ñúñez" })).toBe("ÁÑ");
  });
});

describe("avatarColor", () => {
  it("is stable for a username and comes from the palette", () => {
    expect(avatarColor("demo")).toBe(avatarColor("demo"));
    expect(AVATAR_COLORS).toContain(avatarColor("demo"));
  });

  it("spreads different usernames over several colours", () => {
    const colors = new Set(["demo", "admin", "moderator", "jane", "bob", "alex", "sam"].map(avatarColor));
    expect(colors.size).toBeGreaterThan(2);
  });
});

describe("displayName", () => {
  it("prefers the full name, else the username", () => {
    expect(displayName({ username: "demo", fullName: "Demo Climber" })).toBe("Demo Climber");
    expect(displayName({ username: "demo", fullName: " " })).toBe("demo");
    expect(displayName({ username: "demo" })).toBe("demo");
  });
});
