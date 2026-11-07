import { describe, expect, it } from "vitest";
import { AVATAR_MAX_BYTES, BIO_MAX, FULL_NAME_MAX, checkAvatarFile, parseProfileForm } from "./profile-form";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

describe("parseProfileForm", () => {
  it("trims the values", () => {
    expect(parseProfileForm(form({ fullName: "  Jane Climber ", bio: " Limestone fan " }))).toEqual({
      ok: true,
      value: { fullName: "Jane Climber", bio: "Limestone fan" },
    });
  });

  it("turns blank fields into null so they are cleared", () => {
    expect(parseProfileForm(form({ fullName: "   ", bio: "" }))).toEqual({
      ok: true,
      value: { fullName: null, bio: null },
    });
    expect(parseProfileForm(new FormData())).toEqual({ ok: true, value: { fullName: null, bio: null } });
  });

  it("keeps line breaks in the bio, normalised to \\n", () => {
    const result = parseProfileForm(form({ bio: "Line one\r\nLine two" }));
    expect(result).toEqual({ ok: true, value: { fullName: null, bio: "Line one\nLine two" } });
  });

  it("rejects values over the API limits", () => {
    expect(parseProfileForm(form({ fullName: "x".repeat(FULL_NAME_MAX + 1) }))).toEqual({
      ok: false,
      field: "fullName",
      error: "nameTooLong",
    });
    expect(parseProfileForm(form({ bio: "x".repeat(BIO_MAX + 1) }))).toEqual({
      ok: false,
      field: "bio",
      error: "bioTooLong",
    });
    expect(parseProfileForm(form({ bio: "x".repeat(BIO_MAX) })).ok).toBe(true);
  });
});

describe("checkAvatarFile", () => {
  it("accepts a small JPEG, PNG or WebP", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) {
      expect(checkAvatarFile(new File(["abc"], "me", { type }))).toBeNull();
    }
  });

  it("requires a non-empty file", () => {
    expect(checkAvatarFile(null)).toBe("pictureRequired");
    expect(checkAvatarFile("text")).toBe("pictureRequired");
    expect(checkAvatarFile(new File([], "me.png", { type: "image/png" }))).toBe("pictureRequired");
  });

  it("rejects other types and oversized files", () => {
    expect(checkAvatarFile(new File(["<svg/>"], "me.svg", { type: "image/svg+xml" }))).toBe("pictureInvalid");
    const big = new File([new Uint8Array(AVATAR_MAX_BYTES + 1)], "me.png", { type: "image/png" });
    expect(checkAvatarFile(big)).toBe("pictureTooLarge");
  });
});
