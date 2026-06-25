"use client";

import { useActionState } from "react";
import { deleteLogbookEntryAction, type PersonalFormState } from "@/lib/personal/actions";

const initialState: PersonalFormState = {};

type Props = {
  id: number;
};

export function LogbookEntryDeleteButton({ id }: Props) {
  const [state, action, pending] = useActionState(deleteLogbookEntryAction, initialState);

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="font-sans text-xs font-medium text-stone hover:text-red-700"
      >
        Delete
      </button>
      {state.error && <p className="font-sans text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
