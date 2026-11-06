import { notFound } from "next/navigation";
import { ApiError, getSector, listGrades, listPitches, listRoutes } from "@/lib/api";
import { buildGradeLookup, hardestGrade, totalLength } from "@/lib/catalog/route-summary";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { Pagination } from "@/components/catalog/Pagination";
import { GradeBadge, RouteTypeBadge } from "@/components/catalog/RouteBadges";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function SectorDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const sectorId = Number(id);
  const page = Number(pageParam) || 0;

  let sector;
  try {
    sector = await getSector(sectorId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const [routes, grades] = await Promise.all([listRoutes({ sectorId, page }), listGrades()]);
  const gradeLookup = buildGradeLookup(grades);
  // One request per listed route (max one page). Replace with a batched endpoint if pages grow.
  const pitchPages = await Promise.all(routes.content.map((route) => listPitches({ routeId: route.id })));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Sector</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{sector.name}</h1>
        {sector.description && <p className="mt-3 max-w-xl font-sans text-base text-stone">{sector.description}</p>}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">
          Routes
          {routes.totalElements > 0 && (
            <span className="ml-2 font-sans text-sm font-normal text-stone">({routes.totalElements})</span>
          )}
        </h2>
        {routes.content.length === 0 ? (
          <EmptyState message="No routes documented yet in this sector." />
        ) : (
          <div className="flex flex-col gap-3">
            {routes.content.map((route, index) => {
              const pitches = pitchPages[index].content;
              const length = totalLength(pitches);
              return (
                <CatalogCard
                  key={route.id}
                  href={`/routes/${route.id}`}
                  title={route.name}
                  description={route.description}
                  badges={
                    <>
                      {length !== null && <span className="font-sans text-xs text-stone">{length} m</span>}
                      <RouteTypeBadge routeType={route.routeType} />
                      <GradeBadge grade={hardestGrade(pitches, gradeLookup)} />
                    </>
                  }
                />
              );
            })}
          </div>
        )}
        <Pagination basePath={`/sectors/${sectorId}`} page={routes.page} totalPages={routes.totalPages} />
      </section>
    </div>
  );
}
