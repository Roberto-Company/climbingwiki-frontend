"use client";

import Link from "next/link";
import { useActionState } from "react";
import { toggleFavoriteAction, type PersonalFormState } from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";

const initialState: PersonalFormState = {};

type Props = {
  routeId: number;
  isFavorited: boolean;
  isAuthenticated: boolean;
};

export function FavoriteButton({ routeId, isFavorited, isAuthenticated }: Props) {
  const [state, action, pending] = useActionState(toggleFavoriteAction, initialState);

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
        Sign in to favorite
      </Link>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="routeId" value={routeId} />
      <input type="hidden" name="intent" value={isFavorited ? "remove" : "add"} />
      <Button type="submit" variant={isFavorited ? "primary" : "ghost"} disabled={pending}>
        {isFavorited ? "★ Favorited" : "☆ Favorite"}
      </Button>
      {state.error && <p className="mt-1 font-sans text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
