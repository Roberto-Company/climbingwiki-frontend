"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { useActionState, useState, useTransition } from "react";
import { updateCommentAction, deleteCommentAction, type PersonalFormState } from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";
import type { CommentResponse } from "@/lib/types";
import { displayName, type AvatarUser } from "@/lib/users/avatar";
import { Avatar } from "@/components/users/Avatar";

const initialState: PersonalFormState = {};

export type CommentAuthor = AvatarUser;

type Props = {
  comment: CommentResponse;
  /** Null when the author's account no longer exists. */
  author: CommentAuthor | null;
  canModify: boolean;
};

export function CommentItem({ comment, author, canModify }: Props) {
  const t = useTranslations("Common");
  const tc = useTranslations("Personal.comments");
  const format = useFormatter();
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, setUpdateState] = useState<PersonalFormState>(initialState);
  const [updatePending, startUpdateTransition] = useTransition();
  const [deleteState, deleteAction, deletePending] = useActionState(deleteCommentAction, initialState);

  function handleUpdate(formData: FormData) {
    startUpdateTransition(async () => {
      const result = await updateCommentAction(updateState, formData);
      setUpdateState(result);
      if (result.success) {
        setIsEditing(false);
      }
    });
  }

  if (isEditing) {
    return (
      <form
        action={handleUpdate}
        className="flex flex-col gap-2 rounded-lg border border-border bg-surface px-4 py-3"
      >
        <input type="hidden" name="id" value={comment.id} />
        <input type="hidden" name="ownerId" value={comment.userId} />
        {comment.routeId !== null && <input type="hidden" name="routeId" value={comment.routeId} />}
        {comment.cragId !== null && <input type="hidden" name="cragId" value={comment.cragId} />}
        {comment.parentCommentId !== null && (
          <input type="hidden" name="parentCommentId" value={comment.parentCommentId} />
        )}
        <textarea
          name="body"
          defaultValue={comment.body}
          required
          rows={3}
          className="rounded-md border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-moss-600"
        />
        {updateState.error && <p className="font-sans text-xs text-red-700">{updateState.error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={updatePending} className="px-3 py-1.5 text-xs">
            {t("save")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="px-3 py-1.5 text-xs"
            onClick={() => setIsEditing(false)}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-surface/60 px-4 py-3">
      {author ? (
        <Link href={`/users/${author.id}`} className="shrink-0" tabIndex={-1} aria-hidden="true">
          <Avatar user={author} size="sm" />
        </Link>
      ) : (
        <span className="h-8 w-8 shrink-0 rounded-full bg-border" aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 font-sans text-sm">
          {author ? (
            <Link href={`/users/${author.id}`} className="font-semibold text-foreground hover:text-moss-800 hover:underline">
              {displayName(author)}
            </Link>
          ) : (
            <span className="font-semibold text-stone">{tc("deletedUser")}</span>
          )}
          <time dateTime={comment.createdAt} className="text-xs text-stone">
            {format.dateTime(new Date(comment.createdAt), { dateStyle: "medium" })}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-line break-words font-sans text-sm text-foreground">{comment.body}</p>
        <div className="mt-2 flex items-center gap-3 font-sans text-xs text-stone empty:hidden">
          {canModify && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="font-medium text-moss-600 hover:text-moss-800"
              >
                {t("edit")}
              </button>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={comment.id} />
                {comment.routeId !== null && <input type="hidden" name="routeId" value={comment.routeId} />}
                <button
                  type="submit"
                  disabled={deletePending}
                  className="font-medium text-stone hover:text-red-700"
                >
                  {t("delete")}
                </button>
              </form>
            </>
          )}
        </div>
        {deleteState.error && <p className="mt-1 font-sans text-xs text-red-700">{deleteState.error}</p>}
      </div>
    </div>
  );
}
