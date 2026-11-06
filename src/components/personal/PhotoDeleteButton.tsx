"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { deletePhotoAction, type PersonalFormState } from "@/lib/personal/actions";

const initialState: PersonalFormState = {};

type Props = {
  id: number;
  routeId: number | null;
};

export function PhotoDeleteButton({ id, routeId }: Props) {
  const t = useTranslations("Common");
  const [state, action, pending] = useActionState(deletePhotoAction, initialState);

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {routeId !== null && <input type="hidden" name="routeId" value={routeId} />}
      <button
        type="submit"
        disabled={pending}
        className="font-sans text-xs font-medium text-stone hover:text-red-700"
      >
        {t("delete")}
      </button>
      {state.error && <p className="font-sans text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
