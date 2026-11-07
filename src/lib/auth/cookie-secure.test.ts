import { describe, expect, it } from "vitest";
import { isSecureCookie } from "./cookie-secure";

const env = (vars: Record<string, string>) => vars as unknown as NodeJS.ProcessEnv;

describe("isSecureCookie", () => {
  it("is secure in production builds by default", () => {
    expect(isSecureCookie(env({ NODE_ENV: "production" }))).toBe(true);
  });

  it("is not secure in development by default", () => {
    expect(isSecureCookie(env({ NODE_ENV: "development" }))).toBe(false);
  });

  it("can be turned off for the local Docker demo", () => {
    expect(isSecureCookie(env({ NODE_ENV: "production", SESSION_COOKIE_SECURE: "false" }))).toBe(false);
  });

  it("can be forced on, and ignores an empty value", () => {
    expect(isSecureCookie(env({ NODE_ENV: "development", SESSION_COOKIE_SECURE: "true" }))).toBe(true);
    expect(isSecureCookie(env({ NODE_ENV: "production", SESSION_COOKIE_SECURE: "" }))).toBe(true);
  });
});
