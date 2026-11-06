"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useActionState } from "react";
import { toggleFollowAction, type PersonalFormState } from "@/lib/personal/actions";
import { Button } from "@/components/ui/Button";

const initialState: PersonalFormState = {};

type Props = {
  followedId: number;
  isFollowing: boolean;
  isAuthenticated: boolean;
};

export function FollowButton({ followedId, isFollowing, isAuthenticated }: Props) {
  const t = useTranslations("Personal.follow");
  const [state, action, pending] = useActionState(toggleFollowAction, initialState);

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
        {t("signIn")}
      </Link>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="followedId" value={followedId} />
      <input type="hidden" name="intent" value={isFollowing ? "remove" : "add"} />
      <Button type="submit" variant={isFollowing ? "primary" : "ghost"} disabled={pending}>
        {isFollowing ? t("following") : t("follow")}
      </Button>
      {state.error && <p className="mt-1 font-sans text-xs text-red-700">{state.error}</p>}
    </form>
  );
}
