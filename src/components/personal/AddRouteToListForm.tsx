"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { addRouteToListAction, type PersonalFormState } from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { RoutePicker } from "@/components/users/RoutePicker";

const initialState: PersonalFormState = {};

type Props = {
  listId: number;
};

export function AddRouteToListForm({ listId }: Props) {
  const t = useTranslations();
  const [state, action, pending] = useActionState(addRouteToListAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="listId" value={listId} />
      <RoutePicker label={t("Personal.routePicker.label")} resetKey={state.success ? state : undefined} />
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? t("Common.adding") : t("Personal.lists.addRoute")}
      </Button>
    </form>
  );
}
