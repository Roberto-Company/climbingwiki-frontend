"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type FormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: FormState = {};

export function RegisterForm() {
  const t = useTranslations("Auth");
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <TextField
        label={t("username")}
        name="username"
        autoComplete="username"
        error={state.fieldErrors?.username}
        required
      />
      <TextField
        label={t("email")}
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
        required
      />
      <TextField
        label={t("password")}
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        error={state.fieldErrors?.password}
        required
      />
      <TextField label={t("fullNameOptional")} name="fullName" autoComplete="name" />
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending}>
        {pending ? t("register.pending") : t("register.submit")}
      </Button>
      <p className="font-sans text-sm text-stone">
        {t("register.haveAccount")}{" "}
        <Link href="/login" className="font-medium text-moss-600 underline">
          {t("register.signIn")}
        </Link>
      </p>
    </form>
  );
}
