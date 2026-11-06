"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { deleteCatalogItemAction, type CatalogFormState } from "@/lib/catalog/actions";
import type { CatalogKind } from "@/lib/api/catalog-writes";

const initialState: CatalogFormState = {};

type Props = {
  kind: CatalogKind;
  id: number;
  /** Where to go once the item is gone (usually its parent). */
  redirectTo: string;
};

/** Two-step delete: the first click asks, the second deletes. */
export function DeleteItemButton({ kind, id, redirectTo }: Props) {
  const t = useTranslations();
  const [state, action, pending] = useActionState(deleteCatalogItemAction, initialState);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="rounded-md px-3 py-1.5 font-sans text-sm font-semibold text-stone transition-colors hover:bg-red-700/5 hover:text-red-700"
      >
        {t("Common.delete")}
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-1" aria-live="polite">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="flex flex-wrap items-center gap-2" role="group">
        <span className="font-sans text-sm text-foreground">{t("Catalog.edit.confirmDelete")}</span>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-red-700 px-3 py-1.5 font-sans text-sm font-semibold text-background transition-colors hover:bg-red-800 disabled:opacity-60"
        >
          {pending ? t("Catalog.edit.deleting") : t("Catalog.edit.confirmDeleteYes")}
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          className="rounded-md px-3 py-1.5 font-sans text-sm font-semibold text-moss-600 hover:bg-moss-50"
        >
          {t("Common.cancel")}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="max-w-sm font-sans text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
