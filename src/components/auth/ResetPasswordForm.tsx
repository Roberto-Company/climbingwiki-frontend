"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { resetPasswordAction, type FormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: FormState = {};

type Props = {
  defaultToken?: string;
};

export function ResetPasswordForm({ defaultToken }: Props) {
  const t = useTranslations("Auth.reset");
  const [state, action, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <TextField
        label={t("token")}
        name="token"
        defaultValue={defaultToken}
        error={state.fieldErrors?.token}
        required
      />
      <TextField
        label={t("newPassword")}
        name="newPassword"
        type="password"
        autoComplete="new-password"
        minLength={8}
        error={state.fieldErrors?.newPassword}
        required
      />
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending}>
        {pending ? t("pending") : t("submit")}
      </Button>
    </form>
  );
}
