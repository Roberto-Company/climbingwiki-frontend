import { useTranslations } from "next-intl";
import Link from "next/link";
import type { CurrentUser } from "@/lib/users/current-user";
import { UserMenu } from "./UserMenu";

type Props = {
  user: CurrentUser | null;
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

  return <UserMenu user={user} />;
}
