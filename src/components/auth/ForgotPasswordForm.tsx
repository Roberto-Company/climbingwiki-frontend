"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction, type FormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: FormState = {};

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
        required
      />
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      {state.resetToken && (
        <FormMessage variant="success">
          Development mode — no email is sent yet. Reset token:{" "}
          <span className="font-mono">{state.resetToken}</span>.{" "}
          <Link
            href={`/reset-password?token=${encodeURIComponent(state.resetToken)}`}
            className="font-medium underline"
          >
            Continue to reset password
          </Link>
        </FormMessage>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send reset token"}
      </Button>
    </form>
  );
}
