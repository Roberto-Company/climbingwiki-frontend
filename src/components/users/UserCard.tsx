import Link from "next/link";
import type { ReactNode } from "react";
import { displayName } from "@/lib/users/avatar";
import type { UserResponse } from "@/lib/types";
import { Avatar } from "./Avatar";

type Props = {
  user: UserResponse;
  action?: ReactNode;
};

/** A climber in a follow list: picture, names and the start of their bio. */
export function UserCard({ user, action }: Props) {
  const name = displayName(user);
  return (
    <li className="flex items-center gap-4 rounded-lg border border-border bg-surface/60 px-4 py-3 transition-colors hover:border-moss-400">
      <Link href={`/users/${user.id}`} className="group flex min-w-0 flex-1 items-center gap-4">
        <Avatar user={user} size="md" />
        <div className="min-w-0">
          <p className="truncate font-display text-base font-medium text-foreground group-hover:text-moss-800">{name}</p>
          <p className="truncate font-sans text-xs text-stone">
            @{user.username}
            {user.bio && <span className="text-stone/80"> · {user.bio}</span>}
          </p>
        </div>
      </Link>
      {action}
    </li>
  );
}
