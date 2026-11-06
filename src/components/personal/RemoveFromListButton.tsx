"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { removeRouteFromListAction, type PersonalFormState } from "@/lib/personal/actions";

const initialState: PersonalFormState = {};

type Props = {
  listId: number;
  routeId: number;
};

export function RemoveFromListButton({ listId, routeId }: Props) {
  const t = useTranslations("Common");
  const [state, action, pending] = useActionState(removeRouteFromListAction, initialState);

  return (
    <form action={action}>
      <input type="hidden" name="listId" value={listId} />
      <input type="hidden" name="routeId" value={routeId} />
      <button
        type="submit"
        disabled={pending}
        className="font-sans text-xs font-medium text-stone hover:text-red-700"
      >
        {t("remove")}
      </button>
      {state.error && <p className="font-sans text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
