"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import type { CatalogFormState } from "@/lib/catalog/actions";

type CatalogAction = (state: CatalogFormState, formData: FormData) => Promise<CatalogFormState>;
/** Usually an API response; only its string and number fields fill the form. */
export type InitialValues = Readonly<Record<string, unknown>>;

const initialState: CatalogFormState = {};

/** Form state plus helpers: the value to show in a field and its translated error. */
export function useCatalogForm(action: CatalogAction, initialValues: InitialValues) {
  const t = useTranslations("Catalog.edit.errors");
  const [state, formAction, pending] = useActionState(action, initialState);

  const value = (name: string): string => {
    const submitted = state.values?.[name];
    if (submitted !== undefined) {
      return submitted;
    }
    const initial = initialValues[name];
    return typeof initial === "string" || typeof initial === "number" ? String(initial) : "";
  };

  const errorFor = (name: string): string | undefined => {
    const code = state.fieldErrors?.[name];
    return code ? t(code) : undefined;
  };

  return { state, formAction, pending, value, errorFor };
}
