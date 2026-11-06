import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth/session";
import { getCrag, getSector, listRoutes } from "@/lib/api";
import { splitAttribution } from "@/lib/catalog/attribution";
import { gradeHistogram } from "@/lib/catalog/grade-bands";
import { loadOrNotFound } from "@/lib/catalog/page-data";
import { allGrades, nearestPhoto, zoneChain, zoneCrumbs } from "@/lib/catalog/place-data";
import { buildGradeLookup } from "@/lib/catalog/route-summary";
import { toMapPoints } from "@/lib/map/points";
import { EmptyState } from "@/components/catalog/EmptyState";
import { GradeHistogram } from "@/components/catalog/GradeHistogram";
import { Pagination } from "@/components/catalog/Pagination";
import { RouteTable } from "@/components/catalog/RouteTable";
import { SourceNote } from "@/components/catalog/SourceNote";
import { VerificationBadge } from "@/components/catalog/VerificationBadge";
import { AddLink } from "@/components/catalog/edit/AddLink";
import { CatalogItemToolbar } from "@/components/catalog/edit/CatalogItemToolbar";
import { PlacesMapLazy } from "@/components/map/PlacesMapLazy";
import { PhotoBanner } from "@/components/media/PhotoBanner";

/** A whole sector fits on one page; the API's maximum page size is 100. */
const ROUTES_PER_PAGE = 100;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function SectorDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const sectorId = Number(id);
  const page = Number(pageParam) || 0;
  const sector = await loadOrNotFound(() => getSector(sectorId));

  const [crag, routes, grades, t, session] = await Promise.all([
    getCrag(sector.cragId),
    listRoutes({ sectorId, page, size: ROUTES_PER_PAGE }),
    allGrades(),
    getTranslations(),
    getSession(),
  ]);
  const chain = await zoneChain(crag.zoneId);
  const lookup = buildGradeLookup(grades);
  const bins = gradeHistogram(routes.content, lookup, grades);
  const sectorText = splitAttribution(sector.description);
  const routeTexts = new Map(routes.content.map((route) => [route.id, splitAttribution(route.description)]));
  const ownPoint = toMapPoints([sector], "/sectors");
  const mapPoints = ownPoint.length > 0 ? ownPoint : toMapPoints([crag], "/crags");

  return (
    <div className="flex flex-1 flex-col">
      <PhotoBanner
        photo={nearestPhoto(chain, crag.name)}
        eyebrow={t("Catalog.sector.eyebrow")}
        title={sector.name}
        crumbs={[...zoneCrumbs(chain, t("Catalog.zones.title")), { href: `/crags/${crag.id}`, label: crag.name }]}
        facts={
          <>
            <span>{t("Catalog.counts.routes", { count: routes.totalElements })}</span>
            {bins.length > 0 && (
              <span>{t("Catalog.counts.gradeRange", { from: bins[0].grade.label, to: bins[bins.length - 1].grade.label })}</span>
            )}
          </>
        }
      />

      <div className="mx-auto grid w-full max-w-5xl gap-12 px-6 py-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <VerificationBadge verified={sector.verified} showVerified />
              <CatalogItemToolbar
                kind="sector"
                item={sector}
                session={session}
                editHref={`/sectors/${sector.id}/edit`}
                afterDeletePath={`/crags/${sector.cragId}`}
                pagePath={`/sectors/${sector.id}`}
              />
            </div>
            {sectorText.body && <p className="max-w-2xl font-sans text-base leading-7 text-stone">{sectorText.body}</p>}
          </div>

          <section className="reveal flex flex-col gap-3">
            <h2 className="font-display text-2xl font-medium text-foreground">{t("Catalog.sector.routes")}</h2>
            {routes.content.length === 0 ? (
              <EmptyState message={t("Catalog.sector.noRoutes")} />
            ) : (
              <RouteTable routes={routes.content} lookup={lookup} firstNumber={page * ROUTES_PER_PAGE + 1} />
            )}
            {session && <AddLink href={`/routes/new?sectorId=${sector.id}`} label={t("Catalog.edit.add.route")} />}
            <Pagination basePath={`/sectors/${sectorId}`} page={routes.page} totalPages={routes.totalPages} />
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-10 lg:pt-1">
          {bins.length > 0 && (
            <div className="reveal rounded-lg border border-border bg-surface/50 p-5">
              <GradeHistogram bins={bins} />
            </div>
          )}
          <section className="reveal flex flex-col gap-3">
            <h2 className="font-display text-lg font-medium text-foreground">{t("Catalog.map.title")}</h2>
            {mapPoints.length > 0 ? (
              <PlacesMapLazy points={mapPoints} label={t("Catalog.map.sectors", { name: crag.name })} className="h-64" />
            ) : (
              <p className="font-sans text-sm text-stone">{t("Catalog.map.noLocation")}</p>
            )}
          </section>
        </aside>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 pb-10">
        <SourceNote sources={[sectorText.source, ...[...routeTexts.values()].map((text) => text.source)]} />
      </div>
    </div>
  );
}
