import { useTranslations } from "next-intl";
import Link from "next/link";
import { logoutAction } from "@/lib/auth/actions";
import { hasMinRole } from "@/lib/auth/roles";
import type { Role } from "@/lib/types";

type Props = {
  user: { username: string; role: Role } | null;
};

export function UserNav({ user }: Props) {
  const t = useTranslations("Nav");

  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm">
        <Link href="/login" className="font-medium text-moss-600 hover:text-moss-800">
          {t("signIn")}
        </Link>
        <Link href="/register" className="font-medium text-moss-600 hover:text-moss-800">
          {t("register")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm">
      <Link href="/favorites" className="font-medium text-stone hover:text-moss-600">
        {t("favorites")}
      </Link>
      <Link href="/logbook" className="font-medium text-stone hover:text-moss-600">
        {t("logbook")}
      </Link>
      <Link href="/lists" className="font-medium text-stone hover:text-moss-600">
        {t("lists")}
      </Link>
      <Link href="/follows" className="font-medium text-stone hover:text-moss-600">
        {t("following")}
      </Link>
      {hasMinRole(user.role, "MODERATOR") && (
        <Link href="/moderation" className="font-medium text-ochre-600 hover:text-moss-600">
          {t("review")}
        </Link>
      )}
      <Link href="/profile" className="font-medium text-foreground hover:text-moss-600">
        {user.username}
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="font-medium text-stone hover:text-moss-600">
          {t("logOut")}
        </button>
      </form>
    </div>
  );
}
