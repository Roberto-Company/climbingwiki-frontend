"use client";

import { useActionState, useEffect, useRef } from "react";
import { addRouteToListAction, type PersonalFormState } from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: PersonalFormState = {};

type Props = {
  listId: number;
};

export function AddRouteToListByIdForm({ listId }: Props) {
  const [state, action, pending] = useActionState(addRouteToListAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="flex items-end gap-3">
      <input type="hidden" name="listId" value={listId} />
      <TextField label="Route ID" name="routeId" type="number" required />
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add route"}
      </Button>
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
    </form>
  );
}
