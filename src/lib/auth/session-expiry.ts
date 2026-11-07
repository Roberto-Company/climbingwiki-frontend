import { ApiError } from "@/lib/api/errors";

/** Route handler that clears the session cookie and sends the visitor to the login page. */
export const SESSION_EXPIRED_PATH = "/session-expired";

/**
 * The API answers 401 to a request that carried a token when the token is invalid, expired or
 * belongs to a deleted account. Anonymous 401s (a wrong password) are ordinary form errors.
 */
export function sessionWasRejected(status: number, sentToken: boolean): boolean {
  return sentToken && status === 401;
}

/** Looking up the session's own user gave 404: the account was deleted. */
export function accountIsGone(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
