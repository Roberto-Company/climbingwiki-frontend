"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import {
  updateRouteListAction,
  deleteRouteListAction,
  type PersonalFormState,
} from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { FormMessage } from "@/components/ui/FormMessage";
import type { RouteListResponse } from "@/lib/types";

const initialState: PersonalFormState = {};

type Props = {
  list: RouteListResponse;
};

export function RouteListEditForm({ list }: Props) {
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(
    async (prevState: PersonalFormState, formData: FormData) => {
      const result = await updateRouteListAction(prevState, formData);
      if (result.success) {
        setIsEditing(false);
      }
      return result;
    },
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(deleteRouteListAction, initialState);

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="font-sans text-sm font-medium text-moss-600 hover:text-moss-800"
        >
          {t("Common.edit")}
        </button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={list.id} />
          <button
            type="submit"
            disabled={deletePending}
            className="font-sans text-sm font-medium text-stone hover:text-red-700"
          >
            {t("Personal.lists.deleteList")}
          </button>
        </form>
        {deleteState.error && <p className="font-sans text-xs text-red-700">{deleteState.error}</p>}
      </div>
    );
  }

  return (
    <form action={updateAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={list.id} />
      <input type="hidden" name="ownerId" value={list.userId} />
      <TextField label={t("Personal.lists.name")} name="name" defaultValue={list.name} required />
      <TextField label={t("Common.description")} name="description" defaultValue={list.description ?? ""} />
      <label className="flex items-center gap-2 font-sans text-sm text-foreground">
        <input type="checkbox" name="isPublic" defaultChecked={list.isPublic} className="h-4 w-4 rounded border-border" />
        {t("Personal.lists.public")}
      </label>
      {updateState.error && <FormMessage variant="error">{updateState.error}</FormMessage>}
      <div className="flex gap-2">
        <Button type="submit" disabled={updatePending} className="px-3 py-1.5 text-xs">
          {t("Common.save")}
        </Button>
        <Button type="button" variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => setIsEditing(false)}>
          {t("Common.cancel")}
        </Button>
      </div>
    </form>
  );
}
