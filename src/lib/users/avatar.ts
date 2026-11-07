import { isSafeHttpUrl } from "@/lib/url";

export interface AvatarUser {
  id: number;
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

/** The API serves uploaded pictures at this path; the browser gets them through /media/avatars. */
const UPLOADED_AVATAR = /^\/api\/users\/(\d+)\/avatar(?:\?v=(\d+))?$/;

/** Earthy tones from the palette, all dark enough for white initials. */
export const AVATAR_COLORS = ["#46663d", "#2c4226", "#35607e", "#b4532a", "#8a5a1f", "#5b4e7a"] as const;

/**
 * Where the browser loads the picture from, or null to show initials. Uploaded pictures go through
 * this site's own /media route (the API is not public); any other value must be an http(s) URL.
 */
export function avatarSrc(user: Pick<AvatarUser, "id" | "avatarUrl">): string | null {
  const url = user.avatarUrl?.trim();
  if (!url) {
    return null;
  }
  const uploaded = UPLOADED_AVATAR.exec(url);
  if (uploaded) {
    if (Number(uploaded[1]) !== user.id) {
      return null;
    }
    return uploaded[2] ? `/media/avatars/${user.id}?v=${uploaded[2]}` : `/media/avatars/${user.id}`;
  }
  return isSafeHttpUrl(url) ? url : null;
}

/** One or two letters: first and last word of the full name, else the start of the username. */
export function initials(user: Pick<AvatarUser, "username" | "fullName">): string {
  const words = (user.fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (firstLetter(words[0]) + firstLetter(words[words.length - 1])).toUpperCase();
  }
  const source = words[0] ?? user.username;
  return Array.from(source).slice(0, 2).join("").toUpperCase();
}

/** Same username, same colour, on every page. */
export function avatarColor(username: string): string {
  let hash = 0;
  for (const char of username) {
    hash = (hash * 31 + char.codePointAt(0)!) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** The name to show first: the full name if there is one, else the username. */
export function displayName(user: Pick<AvatarUser, "username" | "fullName">): string {
  return user.fullName?.trim() || user.username;
}

function firstLetter(word: string): string {
  return Array.from(word)[0] ?? "";
}
