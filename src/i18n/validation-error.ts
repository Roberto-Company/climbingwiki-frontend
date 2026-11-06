import "server-only";
import type { Messages } from "next-intl";
import { getTranslations } from "next-intl/server";

export type ValidationErrorKey = keyof Messages["Errors"];

/** A form error in the visitor's language, for server actions to return. */
export async function validationError(key: ValidationErrorKey): Promise<{ error: string }> {
  const t = await getTranslations("Errors");
  return { error: t(key) };
}
