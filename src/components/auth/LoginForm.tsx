"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: FormState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <TextField
        label="Username"
        name="username"
        autoComplete="username"
        error={state.fieldErrors?.username}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        required
      />
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex justify-between font-sans text-sm text-stone">
        <Link href="/forgot-password" className="font-medium text-moss-600 underline">
          Forgot password?
        </Link>
        <Link href="/register" className="font-medium text-moss-600 underline">
          Create an account
        </Link>
      </div>
    </form>
  );
}
