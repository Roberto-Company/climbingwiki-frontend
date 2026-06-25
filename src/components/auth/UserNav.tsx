import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";
import type { Role } from "@/lib/types";

type Props = {
  user: { username: string; role: Role } | null;
};

export function UserNav({ user }: Props) {
  if (!user) {
    return (
      <div className="flex items-center gap-4 font-sans text-sm">
        <Link href="/login" className="font-medium text-moss-600 hover:text-moss-800">
          Sign in
        </Link>
        <Link href="/register" className="font-medium text-moss-600 hover:text-moss-800">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 font-sans text-sm">
      <Link href="/profile" className="font-medium text-foreground hover:text-moss-600">
        {user.username}
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="font-medium text-stone hover:text-moss-600">
          Log out
        </button>
      </form>
    </div>
  );
}
