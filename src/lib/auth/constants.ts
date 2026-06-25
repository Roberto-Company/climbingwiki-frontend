export const SESSION_COOKIE_NAME = "cw_session";

/** Matches the backend JWT lifetime (24h, no refresh) so the cookie never outlives the token. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;
