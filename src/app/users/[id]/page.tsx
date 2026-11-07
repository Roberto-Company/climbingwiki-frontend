import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getFollow, getUser, getUserStats, listLogbookEntries, listRouteLists } from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import { allGrades } from "@/lib/catalog/place-data";
import { loadOrNotFound, idParam } from "@/lib/catalog/page-data";
import { displayName } from "@/lib/users/avatar";
import { loadRouteCards } from "@/lib/users/route-cards";
import { GradeBadge } from "@/components/catalog/RouteBadges";
import { FollowButton } from "@/components/personal/FollowButton";
import { Avatar } from "@/components/users/Avatar";
import { LogbookResultBadge } from "@/components/users/LogbookResultBadge";
import { RouteRow } from "@/components/users/RouteRow";

type Props = {
  params: Promise<{ id: string }>;
};

const RECENT_ASCENTS = 8;

export default async function UserProfilePage({ params }: Props) {
  const userId = idParam((await params).id);
  if (userId === null) {
    notFound();
  }

  const [user, stats, session, t, format] = await Promise.all([
    loadOrNotFound(() => getUser(userId)),
    loadOrNotFound(() => getUserStats(userId)),
    getSession(),
    getTranslations(),
    getFormatter(),
  ]);

  const isSelf = session?.userId === userId;
  const [logbook, lists, grades, isFollowing] = await Promise.all([
    listLogbookEntries({ userId, size: RECENT_ASCENTS, sort: "attemptDate,desc" }),
    listRouteLists({ userId }),
    allGrades(),
    session && !isSelf
      ? getFollow(session.userId, userId).then(
          () => true,
          () => false,
        )
      : Promise.resolve(false),
  ]);
  const cards = await loadRouteCards(logbook.content.map((entry) => entry.routeId));
  const publicLists = lists.filter((list) => list.isPublic);
  const hardest = grades.find((grade) => grade.id === stats.hardestSendGradeId) ?? null;
  const name = displayName(user);
  const showsRole = user.role !== "USER";

  return (
    <div className="flex flex-1 flex-col">
      <header className="relative isolate overflow-hidden bg-night text-white">
        <div className="contours absolute inset-0 -z-10 text-moss-400/25" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/70 to-night/30" />
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-8 pt-14 sm:flex-row sm:items-end">
          <Avatar user={user} size="xl" className="rise-in ring-4 ring-night shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)]" />
          <div className="rise-in min-w-0 flex-1" style={{ "--delay": "80ms" } as React.CSSProperties}>
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ochre-200">
              {t("Users.eyebrow")}
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium leading-tight sm:text-5xl">{name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-sm text-white/75">
              <span>@{user.username}</span>
              {showsRole && (
                <span className="rounded-full border border-ochre-200/50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ochre-200">
                  {t(`Roles.${user.role}`)}
                </span>
              )}
              <span>{t("Users.since", { date: format.dateTime(new Date(user.createdAt), { year: "numeric", month: "long" }) })}</span>
            </p>
            {user.bio && (
              <p className="mt-4 max-w-2xl whitespace-pre-line font-sans text-base leading-relaxed text-white/90">{user.bio}</p>
            )}
          </div>
          <div className="rise-in shrink-0" style={{ "--delay": "140ms" } as React.CSSProperties}>
            {isSelf ? (
              <Link
                href="/profile"
                className="inline-flex items-center rounded-md border border-white/40 px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t("Users.editProfile")}
              </Link>
            ) : (
              <div className="rounded-md bg-chalk px-1 py-0.5">
                <FollowButton followedId={userId} isFollowing={isFollowing} isAuthenticated={session !== null} />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-surface/70">
        <dl className="mx-auto grid w-full max-w-5xl grid-cols-3 gap-px px-6 sm:grid-cols-5">
          <Stat label={t("Users.stats.ascents")} value={format.number(stats.ascents)} />
          <Stat label={t("Users.stats.sends")} value={format.number(stats.sends)} />
          <Stat
            label={t("Users.stats.hardest")}
            value={hardest ? <GradeBadge grade={hardest} /> : <span className="text-stone">—</span>}
          />
          <Stat label={t("Users.stats.followers")} value={format.number(stats.followers)} />
          <Stat label={t("Users.stats.following")} value={format.number(stats.following)} />
        </dl>
      </div>

      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_18rem]">
        <section aria-labelledby="ascents-heading" className="min-w-0">
          <SectionHeading id="ascents-heading">{t("Users.recentAscents")}</SectionHeading>
          {logbook.content.length === 0 ? (
            <EmptyHint
              text={isSelf ? t("Users.noAscentsSelf") : t("Users.noAscents", { name })}
              action={isSelf ? { href: "/logbook", label: t("Users.logFirst") } : undefined}
            />
          ) : (
            <ol className="flex flex-col gap-2">
              {logbook.content.map((entry) => {
                const card = cards.get(entry.routeId);
                if (!card) {
                  return null;
                }
                const date = new Date(`${entry.attemptDate}T00:00:00`);
                return (
                  <RouteRow
                    key={entry.id}
                    card={card}
                    leading={
                      <time
                        dateTime={entry.attemptDate}
                        className="flex w-11 shrink-0 flex-col items-center rounded-md border border-border bg-background py-1 font-sans leading-none"
                      >
                        <span className="text-base font-semibold tabular-nums text-foreground">
                          {format.dateTime(date, { day: "numeric" })}
                        </span>
                        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone">
                          {format.dateTime(date, { month: "short" })}
                        </span>
                      </time>
                    }
                    meta={<LogbookResultBadge result={entry.result} />}
                  />
                );
              })}
            </ol>
          )}
          {isSelf && logbook.totalElements > RECENT_ASCENTS && (
            <Link href="/logbook" className="mt-4 inline-block font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
              {t("Users.fullLogbook")} →
            </Link>
          )}
        </section>

        <aside aria-labelledby="lists-heading">
          <SectionHeading id="lists-heading">{t("Users.publicLists")}</SectionHeading>
          {publicLists.length === 0 ? (
            <EmptyHint text={t("Users.noLists")} />
          ) : (
            <ul className="flex flex-col gap-2">
              {publicLists.map((list) => (
                <li key={list.id}>
                  <Link
                    href={`/lists/${list.id}`}
                    className="block rounded-lg border border-border bg-surface/60 px-4 py-3 transition-colors hover:border-moss-400 hover:bg-moss-50/60"
                  >
                    <p className="font-display text-base font-medium text-foreground">{list.name}</p>
                    {list.description && <p className="mt-0.5 line-clamp-2 font-sans text-xs text-stone">{list.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:px-2">
      <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">{label}</dt>
      <dd className="font-display text-2xl font-medium tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-stone">
      {children}
    </h2>
  );
}

function EmptyHint({ text, action }: { text: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-5 py-8 text-center font-sans text-sm text-stone">
      <p>{text}</p>
      {action && (
        <Link href={action.href} className="mt-3 inline-block font-semibold text-moss-600 hover:text-moss-800">
          {action.label} →
        </Link>
      )}
    </div>
  );
}
