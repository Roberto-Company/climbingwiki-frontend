/**
 * Whether the session cookie gets the Secure flag: on in production builds by default.
 * SESSION_COOKIE_SECURE=false lets the local Docker demo (a production build served on plain
 * http://localhost) keep its session in every browser, Safari included.
 */
export function isSecureCookie(env: NodeJS.ProcessEnv = process.env): boolean {
  const override = env.SESSION_COOKIE_SECURE;
  if (override !== undefined && override !== "") {
    return override !== "false";
  }
  return env.NODE_ENV === "production";
}
