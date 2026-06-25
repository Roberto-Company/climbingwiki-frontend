"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPhotoAction, type PersonalFormState } from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: PersonalFormState = {};

type Props = {
  routeId?: number;
  cragId?: number;
};

export function PhotoForm({ routeId, cragId }: Props) {
  const [state, action, pending] = useActionState(createPhotoAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      {routeId !== undefined && <input type="hidden" name="routeId" value={routeId} />}
      {cragId !== undefined && <input type="hidden" name="cragId" value={cragId} />}
      <TextField label="Photo URL" name="url" type="url" required placeholder="https://…" />
      <TextField label="Caption" name="caption" />
      <label className="flex items-center gap-2 font-sans text-sm text-foreground">
        <input type="checkbox" name="isTopo" className="h-4 w-4 rounded border-border" />
        This is a topo
      </label>
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Adding…" : "Add photo"}
      </Button>
    </form>
  );
}
