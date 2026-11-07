/**
 * Free hosting puts the API to sleep when nobody uses it, and the first request after that can take
 * up to a minute. When a page fails, the error page checks the API's health and, if it is asleep,
 * waits for it and reloads instead of showing a dead end.
 */

/** How often the error page asks whether the API is up. */
export const WAKE_POLL_MS = 5_000;

/** Stop waiting after this long: something else is wrong. */
export const WAKE_GIVE_UP_MS = 120_000;

/** Time limit for one health check, so a sleeping API doesn't hold the status route open. */
export const HEALTH_TIMEOUT_MS = 4_000;

export type WakePhase = "checking" | "waking" | "failed" | "gaveUp";

/** The API's health check, on the same origin as its base URL (e.g. http://backend:8080/api). */
export function healthUrl(apiBaseUrl: string): string {
  return new URL("/actuator/health", apiBaseUrl).toString();
}

type CheckResult = {
  isUp: boolean;
  /** Whether the API was found asleep earlier on this error page. */
  wasWaking: boolean;
  startedAt: number;
  now: number;
};

/**
 * What the error page does after a health check. "ready" means the API woke up and the page should
 * be loaded again; "failed" means the API was fine all along, so the error is a real one.
 */
export function phaseAfterCheck({ isUp, wasWaking, startedAt, now }: CheckResult): WakePhase | "ready" {
  if (isUp) {
    return wasWaking ? "ready" : "failed";
  }
  return now - startedAt >= WAKE_GIVE_UP_MS ? "gaveUp" : "waking";
}
