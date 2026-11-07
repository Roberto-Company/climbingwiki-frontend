import type { ProfileRequest } from "@/lib/types";

/** Same limits as the API (ProfileRequest in the backend). */
export const FULL_NAME_MAX = 150;
export const BIO_MAX = 1000;

/** Pictures arrive resized by the browser; this only stops oversized uploads early. */
export const AVATAR_MAX_BYTES = 900 * 1024;
export const AVATAR_TYPES: readonly string[] = ["image/jpeg", "image/png", "image/webp"];

export type ProfileFieldError = "nameTooLong" | "bioTooLong";
export type AvatarFileError = "pictureRequired" | "pictureInvalid" | "pictureTooLarge";

export type ProfileParse =
  | { ok: true; value: ProfileRequest }
  | { ok: false; field: "fullName" | "bio"; error: ProfileFieldError };

function optionalText(data: FormData, key: string): string | null {
  const value = String(data.get(key) ?? "").trim();
  return value === "" ? null : value;
}

/** Blank fields become null, which clears them. Line breaks in the bio are kept. */
export function parseProfileForm(data: FormData): ProfileParse {
  const fullName = optionalText(data, "fullName");
  const bio = optionalText(data, "bio")?.replace(/\r\n/g, "\n") ?? null;
  if (fullName !== null && fullName.length > FULL_NAME_MAX) {
    return { ok: false, field: "fullName", error: "nameTooLong" };
  }
  if (bio !== null && bio.length > BIO_MAX) {
    return { ok: false, field: "bio", error: "bioTooLong" };
  }
  return { ok: true, value: { fullName, bio } };
}

/** Checks the uploaded file before it is sent on to the API (which checks the bytes again). */
export function checkAvatarFile(file: FormDataEntryValue | null): AvatarFileError | null {
  if (!(file instanceof Blob) || file.size === 0) {
    return "pictureRequired";
  }
  if (!AVATAR_TYPES.includes(file.type)) {
    return "pictureInvalid";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return "pictureTooLarge";
  }
  return null;
}
