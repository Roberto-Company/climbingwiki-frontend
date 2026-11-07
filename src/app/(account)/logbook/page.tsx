import { getFormatter, getTranslations } from "next-intl/server";
import { verifySession } from "@/lib/auth/dal";
import { getUserStats, listLogbookEntries } from "@/lib/api";
import { allGrades } from "@/lib/catalog/place-data";
import { loadRouteCards } from "@/lib/users/route-cards";
import { GradeBadge } from "@/components/catalog/RouteBadges";
import { Pagination } from "@/components/catalog/Pagination";
import { LogbookEntryDeleteButton } from "@/components/personal/LogbookEntryDeleteButton";
import { LogbookForm } from "@/components/personal/LogbookForm";
import { AccountHeader } from "@/components/users/AccountHeader";
import { LogbookResultBadge } from "@/components/users/LogbookResultBadge";
import { RouteRow } from "@/components/users/RouteRow";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function LogbookPage({ searchParams }: Props) {
  const [session, t, format, { page: pageParam }] = await Promise.all([
    verifySession(),
    getTranslations(),
    getFormatter(),
    searchParams,
  ]);
  const page = Math.max(0, Number(pageParam) || 0);

  const [entries, stats, grades] = await Promise.all([
    listLogbookEntries({ userId: session.userId, page, sort: "attemptDate,desc" }),
    getUserStats(session.userId),
    allGrades(),
  ]);
  const cards = await loadRouteCards(entries.content.map((entry) => entry.routeId));
  const hardest = grades.find((grade) => grade.id === stats.hardestSendGradeId) ?? null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-14">
      <AccountHeader title={t("Account.logbook.title")}>
        <dl className="flex gap-6 font-sans">
          <Summary label={t("Users.stats.ascents")} value={format.number(stats.ascents)} />
          <Summary label={t("Users.stats.sends")} value={format.number(stats.sends)} />
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">{t("Users.stats.hardest")}</dt>
            <dd className="mt-1.5">{hardest ? <GradeBadge grade={hardest} /> : <span className="text-stone">—</span>}</dd>
          </div>
        </dl>
      </AccountHeader>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <section className="min-w-0">
          {entries.content.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-5 py-10 text-center font-sans text-sm text-stone">
              {t("Account.logbook.empty")}
            </p>
          ) : (
            <ol className="flex flex-col gap-2">
              {entries.content.map((entry) => {
                const card = cards.get(entry.routeId);
                if (!card) {
                  return null;
                }
                return (
                  <RouteRow
                    key={entry.id}
                    card={card}
                    meta={<LogbookResultBadge result={entry.result} />}
                    actions={<LogbookEntryDeleteButton id={entry.id} />}
                  >
                    <p className="mt-1 font-sans text-xs text-stone">
                      <time dateTime={entry.attemptDate}>
                        {format.dateTime(new Date(`${entry.attemptDate}T00:00:00`), { dateStyle: "long" })}
                      </time>
                    </p>
                    {entry.notes && (
                      <p className="mt-2 whitespace-pre-line border-l-2 border-ochre-200 pl-3 font-sans text-sm text-foreground/85">
                        {entry.notes}
                      </p>
                    )}
                  </RouteRow>
                );
              })}
            </ol>
          )}
          <div className="mt-4">
            <Pagination basePath="/logbook" page={entries.page} totalPages={entries.totalPages} />
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-border bg-surface/60 p-5 lg:sticky lg:top-6">
          <h2 className="mb-4 font-display text-xl font-medium text-foreground">{t("Account.logbook.logAscent")}</h2>
          <LogbookForm />
        </aside>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">{label}</dt>
      <dd className="mt-0.5 font-display text-2xl font-medium tabular-nums text-foreground">{value}</dd>
    </div>
  );
}
