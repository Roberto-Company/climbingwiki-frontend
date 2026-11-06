"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { verifyEmailAction, type FormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: FormState = {};

export function VerifyEmailForm() {
  const t = useTranslations("Auth.verify");
  const [state, action, pending] = useActionState(verifyEmailAction, initialState);

  if (state.success) {
    return <FormMessage variant="success">{t("done")}</FormMessage>;
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <TextField
        label={t("token")}
        name="token"
        error={state.fieldErrors?.token}
        required
      />
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending}>
        {pending ? t("pending") : t("submit")}
      </Button>
    </form>
  );
}
