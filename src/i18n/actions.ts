"use server";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE_MAX_AGE_SECONDS, LOCALE_COOKIE_NAME } from "./config";

/** Saves the interface language. Setting a cookie in an action re-renders the current page. */
export async function setLocaleAction(locale: string): Promise<void> {
  if (!isLocale(locale)) {
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    sameSite: "lax",
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
  });
}
