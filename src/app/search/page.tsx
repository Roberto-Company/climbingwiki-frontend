import Link from "next/link";
import { listRoutes, listCrags, listZones } from "@/lib/api";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-medium text-foreground">Search</h1>
          <p className="mt-3 font-sans text-base text-stone">
            Type a name in the search bar to find routes, crags, or zones.
          </p>
        </div>
      </div>
    );
  }

  const [routes, crags, zones] = await Promise.all([
    listRoutes({ name: query, size: 10 }),
    listCrags({ name: query, size: 10 }),
    listZones({ name: query, size: 10 }),
  ]);

  const totalResults = routes.totalElements + crags.totalElements + zones.totalElements;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Search results</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">
          &ldquo;{query}&rdquo;
        </h1>
        <p className="mt-1 font-sans text-sm text-stone">
          {totalResults === 0 ? "No results found." : `${totalResults} result${totalResults !== 1 ? "s" : ""}`}
        </p>
      </div>

      {routes.content.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Routes ({routes.totalElements})
          </h2>
          <div className="flex flex-col gap-2">
            {routes.content.map((route) => (
              <Link
                key={route.id}
                href={`/routes/${route.id}`}
                className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 hover:border-moss-600 transition-colors"
              >
                <span className="font-display text-base font-medium text-foreground">{route.name}</span>
                <span className="shrink-0 font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">
                  {route.routeType}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {crags.content.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Crags ({crags.totalElements})
          </h2>
          <div className="flex flex-col gap-2">
            {crags.content.map((crag) => (
              <Link
                key={crag.id}
                href={`/crags/${crag.id}`}
                className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3 hover:border-moss-600 transition-colors"
              >
                <span className="font-display text-base font-medium text-foreground">{crag.name}</span>
                {crag.rockType && (
                  <span className="shrink-0 font-sans text-xs text-stone">{crag.rockType}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {zones.content.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-stone">
            Zones ({zones.totalElements})
          </h2>
          <div className="flex flex-col gap-2">
            {zones.content.map((zone) => (
              <Link
                key={zone.id}
                href={`/zones/${zone.id}`}
                className="rounded-lg border border-border bg-surface px-4 py-3 hover:border-moss-600 transition-colors block"
              >
                <span className="font-display text-base font-medium text-foreground">{zone.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalResults === 0 && (
        <p className="font-sans text-sm text-stone">
          Try a different search term, or{" "}
          <Link href="/zones" className="font-medium text-moss-600 hover:text-moss-800">
            browse all zones
          </Link>
          .
        </p>
      )}
    </div>
  );
}
