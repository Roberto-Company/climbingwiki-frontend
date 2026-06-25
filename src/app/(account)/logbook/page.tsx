import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { getRoute, listLogbookEntries } from "@/lib/api";
import { EmptyState } from "@/components/catalog/EmptyState";
import { Pagination } from "@/components/catalog/Pagination";
import { LogbookForm } from "@/components/personal/LogbookForm";
import { LogbookEntryDeleteButton } from "@/components/personal/LogbookEntryDeleteButton";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function LogbookPage({ searchParams }: Props) {
  const session = await verifySession();
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 0;

  const entries = await listLogbookEntries({ userId: session.userId, page });
  const routes = await Promise.all(entries.content.map((entry) => getRoute(entry.routeId)));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Your account</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">Logbook</h1>
      </div>

      {entries.content.length === 0 ? (
        <EmptyState message="No logged ascents yet." />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.content.map((entry, i) => (
            <div key={entry.id} className="rounded-lg border border-border bg-surface px-5 py-4">
              <div className="flex items-baseline justify-between gap-4">
                <Link href={`/routes/${entry.routeId}`} className="font-display text-base font-medium text-foreground">
                  {routes[i].name}
                </Link>
                <span className="font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">
                  {entry.result.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1 font-sans text-xs text-stone">{entry.attemptDate}</p>
              {entry.notes && <p className="mt-2 font-sans text-sm text-stone">{entry.notes}</p>}
              <div className="mt-2">
                <LogbookEntryDeleteButton id={entry.id} />
              </div>
            </div>
          ))}
        </div>
      )}
      <Pagination basePath="/logbook" page={entries.page} totalPages={entries.totalPages} />

      <section className="flex flex-col gap-3 border-t border-border pt-6">
        <h2 className="font-display text-xl font-medium text-foreground">Log an ascent</h2>
        <LogbookForm />
      </section>
    </div>
  );
}
