"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { createLogbookEntryAction, type PersonalFormState } from "@/lib/personal/actions";
import type { LogbookEntryResult } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: PersonalFormState = {};

const RESULTS: LogbookEntryResult[] = ["ATTEMPT", "TOP_ROPE", "REDPOINT", "FLASH", "ONSIGHT"];

type Props = {
  routeId?: number;
};

export function LogbookForm({ routeId }: Props) {
  const t = useTranslations();
  const [state, action, pending] = useActionState(createLogbookEntryAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      {routeId !== undefined ? (
        <input type="hidden" name="routeId" value={routeId} />
      ) : (
        <TextField label={t("Common.routeId")} name="routeId" type="number" required error={state.fieldErrors?.routeId} />
      )}
      <TextField label={t("Personal.logbook.date")} name="attemptDate" type="date" required error={state.fieldErrors?.attemptDate} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="result" className="font-sans text-sm font-medium text-foreground">
          {t("Personal.logbook.result")}
        </label>
        <select
          id="result"
          name="result"
          required
          defaultValue="ATTEMPT"
          className="rounded-md border border-border bg-background px-3.5 py-2.5 font-sans text-base text-foreground outline-none focus:border-moss-600"
        >
          {RESULTS.map((result) => (
            <option key={result} value={result}>
              {t(`LogbookResults.${result}`)}
            </option>
          ))}
        </select>
      </div>
      <TextField label={t("Personal.logbook.notes")} name="notes" />
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? t("Common.saving") : t("Personal.logbook.submit")}
      </Button>
    </form>
  );
}
