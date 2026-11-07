import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { listFollows } from "@/lib/api";
import { loadUsersById } from "@/lib/users/load-users";
import { FollowButton } from "@/components/personal/FollowButton";
import { AccountHeader } from "@/components/users/AccountHeader";
import { UserCard } from "@/components/users/UserCard";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function FollowsPage({ searchParams }: Props) {
  const [session, t, { tab }] = await Promise.all([verifySession(), getTranslations(), searchParams]);
  const showFollowers = tab === "followers";

  const [following, followers] = await Promise.all([
    listFollows({ followerId: session.userId }),
    listFollows({ followedId: session.userId }),
  ]);
  const followingIds = new Set(following.map((follow) => follow.followedId));
  const shownIds = showFollowers ? followers.map((follow) => follow.followerId) : [...followingIds];
  const usersById = await loadUsersById(shownIds);
  const users = shownIds.flatMap((id) => usersById.get(id) ?? []);

  const tabs = [
    { href: "/follows", label: t("Account.follows.following", { count: following.length }), isActive: !showFollowers },
    {
      href: "/follows?tab=followers",
      label: t("Account.follows.followers", { count: followers.length }),
      isActive: showFollowers,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-14">
      <AccountHeader title={t("Account.follows.title")} />
      <nav aria-label={t("Account.follows.title")} className="-mt-2 flex gap-1 rounded-lg bg-surface p-1 font-sans text-sm">
        {tabs.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.isActive ? "page" : undefined}
            className={`flex-1 rounded-md px-4 py-2 text-center font-semibold transition-colors ${
              item.isActive ? "bg-background text-foreground shadow-sm" : "text-stone hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {users.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-5 py-10 text-center font-sans text-sm text-stone">
          {showFollowers ? t("Account.follows.noFollowers") : t("Account.follows.empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              action={<FollowButton followedId={user.id} isFollowing={followingIds.has(user.id)} isAuthenticated />}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
