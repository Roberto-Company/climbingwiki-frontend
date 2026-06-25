"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addRouteToListAction, type PersonalFormState } from "@/lib/personal/actions";
import type { RouteListResponse } from "@/lib/types";

const initialState: PersonalFormState = {};

type Props = {
  routeId: number;
  userLists: RouteListResponse[];
  isAuthenticated: boolean;
};

export function AddToListButton({ routeId, userLists, isAuthenticated }: Props) {
  const [state, action, pending] = useActionState(addRouteToListAction, initialState);

  if (!isAuthenticated) {
    return null;
  }

  if (userLists.length === 0) {
    return (
      <Link href="/lists" className="font-sans text-sm font-medium text-moss-600 hover:text-moss-800">
        Create a list to save this route
      </Link>
    );
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="routeId" value={routeId} />
      <select
        name="listId"
        defaultValue=""
        required
        className="rounded-md border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none focus:border-moss-600"
      >
        <option value="" disabled>
          Add to list…
        </option>
        {userLists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800"
      >
        Add
      </button>
      {state.error && <p className="font-sans text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
