import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, isLocale, pickLocale } from "./config";

describe("pickLocale", () => {
  it("prefers the saved choice over the browser languages", () => {
    expect(pickLocale("en", "es-ES,es;q=0.9")).toBe("en");
  });

  it("ignores an unsupported saved value", () => {
    expect(pickLocale("fr", "en-GB,en;q=0.8")).toBe("en");
  });

  it("uses the first supported browser language, ignoring region and q-values", () => {
    expect(pickLocale(undefined, "fr-FR,fr;q=0.9,en-US;q=0.8,es;q=0.7")).toBe("en");
  });

  it("falls back to the default without any usable hint", () => {
    expect(pickLocale(undefined, null)).toBe(DEFAULT_LOCALE);
    expect(pickLocale(undefined, "de-DE,de;q=0.9")).toBe(DEFAULT_LOCALE);
  });
});

describe("isLocale", () => {
  it("accepts only supported locales", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("EN")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
