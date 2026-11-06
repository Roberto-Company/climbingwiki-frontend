export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Used when neither the cookie nor the browser's languages name a supported locale. */
export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_COOKIE_NAME = "cw_locale";

export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Chooses the interface language: the saved choice first, then the browser's preferred languages
 * (in `Accept-Language` order, ignoring region and q-values), then the default.
 */
export function pickLocale(savedLocale: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(savedLocale)) {
    return savedLocale;
  }
  const preferred = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().split("-")[0])
    .find(isLocale);
  return preferred ?? DEFAULT_LOCALE;
}
