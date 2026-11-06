import { getTranslations } from "next-intl/server";
import { verifySession } from "@/lib/auth/dal";
import { getUser, listFollows } from "@/lib/api";
import { EmptyState } from "@/components/catalog/EmptyState";
import { FollowButton } from "@/components/personal/FollowButton";

export default async function FollowsPage() {
  const [session, t] = await Promise.all([verifySession(), getTranslations()]);
  const follows = await listFollows({ followerId: session.userId });
  const users = await Promise.all(follows.map((follow) => getUser(follow.followedId)));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("Common.yourAccount")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t("Account.follows.title")}</h1>
      </div>
      {users.length === 0 ? (
        <EmptyState message={t("Account.follows.empty")} />
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4"
            >
              <span className="font-display text-lg font-medium text-foreground">{user.username}</span>
              <FollowButton followedId={user.id} isFollowing isAuthenticated />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
