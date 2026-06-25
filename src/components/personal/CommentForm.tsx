"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCommentAction, type PersonalFormState } from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";

const initialState: PersonalFormState = {};

type Props = {
  routeId?: number;
  cragId?: number;
  parentCommentId?: number;
};

export function CommentForm({ routeId, cragId, parentCommentId }: Props) {
  const [state, action, pending] = useActionState(createCommentAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2">
      {routeId !== undefined && <input type="hidden" name="routeId" value={routeId} />}
      {cragId !== undefined && <input type="hidden" name="cragId" value={cragId} />}
      {parentCommentId !== undefined && (
        <input type="hidden" name="parentCommentId" value={parentCommentId} />
      )}
      <textarea
        name="body"
        required
        rows={3}
        placeholder="Share your experience…"
        className="rounded-md border border-border bg-background px-3.5 py-2.5 font-sans text-sm text-foreground outline-none transition-colors focus:border-moss-600"
      />
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Posting…" : "Post comment"}
      </Button>
    </form>
  );
}
