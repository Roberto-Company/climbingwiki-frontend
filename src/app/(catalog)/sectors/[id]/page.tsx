import { SourceNote } from "@/components/catalog/SourceNote";

import { splitAttribution } from "@/lib/catalog/attribution";

import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ApiError, getSector, listGrades, listRoutes } from "@/lib/api";
import { buildGradeLookup } from "@/lib/catalog/route-summary";
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

  const [routes, grades, t] = await Promise.all([
    listRoutes({ sectorId, page }),
    listGrades(),
    getTranslations(),
  ]);
  const gradeLookup = buildGradeLookup(grades);
  const sectorText = splitAttribution(sector.description);
  const routeTexts = new Map(routes.content.map((route) => [route.id, splitAttribution(route.description)]));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("Catalog.sector.eyebrow")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{sector.name}</h1>
        {sectorText.body && <p className="mt-3 max-w-xl font-sans text-base text-stone">{sectorText.body}</p>}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">
          {t("Catalog.sector.routes")}
          {routes.totalElements > 0 && (
            <span className="ml-2 font-sans text-sm font-normal text-stone">({routes.totalElements})</span>
          )}
        </h2>
        {routes.content.length === 0 ? (
          <EmptyState message={t("Catalog.sector.noRoutes")} />
        ) : (
          <div className="flex flex-col gap-3">
            {routes.content.map((route) => {
              const length = route.totalLengthM;
              const grade = route.hardestGradeId !== null ? (gradeLookup.get(route.hardestGradeId) ?? null) : null;
              return (
                <CatalogCard
                  key={route.id}
                  href={`/routes/${route.id}`}
                  title={route.name}
                  description={routeTexts.get(route.id)?.body}
                  badges={
                    <>
                      {length !== null && <span className="font-sans text-xs text-stone">{t("Common.meters", { value: length })}</span>}
                      <RouteTypeBadge routeType={route.routeType} />
                      <GradeBadge grade={grade} />
                    </>
                  }
                />
              );
            })}
          </div>
        )}
        <Pagination basePath={`/sectors/${sectorId}`} page={routes.page} totalPages={routes.totalPages} />
      </section>

      <SourceNote sources={[sectorText.source, ...[...routeTexts.values()].map((text) => text.source)]} />
    </div>
  );
}
