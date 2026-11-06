"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { createRouteListAction, type PersonalFormState } from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: PersonalFormState = {};

export function RouteListForm() {
  const t = useTranslations();
  const [state, action, pending] = useActionState(createRouteListAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <TextField label={t("Personal.lists.name")} name="name" required error={state.fieldErrors?.name} />
      <TextField label={t("Common.description")} name="description" />
      <label className="flex items-center gap-2 font-sans text-sm text-foreground">
        <input type="checkbox" name="isPublic" className="h-4 w-4 rounded border-border" />
        {t("Personal.lists.makePublic")}
      </label>
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? t("Personal.lists.creating") : t("Personal.lists.create")}
      </Button>
    </form>
  );
}
