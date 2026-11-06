"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { setVerificationAction, type CatalogFormState } from "@/lib/catalog/actions";
import type { CatalogKind } from "@/lib/api/catalog-writes";

const initialState: CatalogFormState = {};

type Props = {
  kind: CatalogKind;
  id: number;
  verified: boolean;
  pagePath: string;
};

/** Moderators only: flips an item between verified and unverified. */
export function VerifyButton({ kind, id, verified, pagePath }: Props) {
  const t = useTranslations("Catalog.edit");
  const [state, action, pending] = useActionState(setVerificationAction, initialState);
  const style = verified
    ? "text-stone hover:bg-ochre-200/60 hover:text-foreground"
    : "bg-moss-600 text-background hover:bg-moss-800";

  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="verified" value={String(!verified)} />
      <input type="hidden" name="pagePath" value={pagePath} />
      <button
        type="submit"
        disabled={pending}
        className={`rounded-md px-3 py-1.5 font-sans text-sm font-semibold transition-colors disabled:opacity-60 ${style}`}
      >
        {verified ? t("unverify") : t("verify")}
      </button>
      {state.error && <p className="max-w-xs font-sans text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
