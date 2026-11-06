import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ApiError,
  getUser,
  getFollow,
  getRoute,
  listFollows,
  listLogbookEntries,
  listRouteLists,
} from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import { FollowButton } from "@/components/personal/FollowButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const userId = Number(id);

  const [user, session, t] = await Promise.all([
    getUser(userId).catch((e) => {
      if (e instanceof ApiError && e.status === 404) notFound();
      throw e;
    }),
    getSession(),
    getTranslations(),
  ]);

  const [logbookPage, lists, followers, following] = await Promise.all([
    listLogbookEntries({ userId, size: 5 }),
    listRouteLists({ userId }),
    listFollows({ followedId: userId }),
    listFollows({ followerId: userId }),
  ]);

  const publicLists = lists.filter((l) => l.isPublic);
  const routes = await Promise.all(logbookPage.content.map((e) => getRoute(e.routeId)));

  const isSelf = session?.userId === userId;
  const isAuthenticated = session !== null;

  let isFollowing = false;
  if (isAuthenticated && !isSelf) {
    isFollowing = await getFollow(session.userId, userId)
      .then(() => true)
      .catch(() => false);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-foreground">{user.username}</h1>
          {user.fullName && (
            <p className="mt-0.5 font-sans text-base text-stone">{user.fullName}</p>
          )}
          {user.bio && (
            <p className="mt-3 font-sans text-sm text-foreground">{user.bio}</p>
          )}
          <div className="mt-3 flex items-center gap-4 font-sans text-sm text-stone">
            <span>
              {t.rich("Users.followers", { count: followers.length, strong: (chunks) => <span className="font-semibold text-foreground">{chunks}</span> })}
            </span>
            <span>
              {t.rich("Users.following", { count: following.length, strong: (chunks) => <span className="font-semibold text-foreground">{chunks}</span> })}
            </span>
            <span>{t("Users.since", { year: new Date(user.createdAt).getFullYear() })}</span>
          </div>
        </div>
        {!isSelf && (
          <FollowButton followedId={userId} isFollowing={isFollowing} isAuthenticated={isAuthenticated} />
        )}
        {isSelf && (
          <Link
            href="/profile"
            className="font-sans text-sm font-medium text-moss-600 hover:text-moss-800"
          >
            {t("Users.editProfile")}
          </Link>
        )}
      </div>

      {logbookPage.content.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            {t("Users.recentAscents")}
          </h2>
          <div className="flex flex-col gap-2">
            {logbookPage.content.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3"
              >
                <Link href={`/routes/${entry.routeId}`} className="font-display text-base font-medium text-foreground hover:text-moss-600">
                  {routes[i].name}
                </Link>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">
                    {t(`LogbookResults.${entry.result}`)}
                  </span>
                  <span className="font-sans text-xs text-stone">{entry.attemptDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {publicLists.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            {t("Users.publicLists")}
          </h2>
          <div className="flex flex-col gap-2">
            {publicLists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="rounded-lg border border-border bg-surface px-4 py-3 hover:border-moss-600 transition-colors block"
              >
                <p className="font-display text-base font-medium text-foreground">{list.name}</p>
                {list.description && (
                  <p className="mt-0.5 font-sans text-xs text-stone">{list.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {logbookPage.content.length === 0 && publicLists.length === 0 && (
        <p className="font-sans text-sm text-stone">{t("Users.noActivity")}</p>
      )}
    </div>
  );
}
