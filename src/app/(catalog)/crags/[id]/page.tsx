import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth/session";
import { fetchAllPages, getCrag, listSectors } from "@/lib/api";
import { splitAttribution } from "@/lib/catalog/attribution";
import { bandCounts, gradeHistogram } from "@/lib/catalog/grade-bands";
import { loadOrNotFound } from "@/lib/catalog/page-data";
import { allGrades, nearestPhoto, routesBySector, zoneChain, zoneCrumbs } from "@/lib/catalog/place-data";
import { buildGradeLookup } from "@/lib/catalog/route-summary";
import { toMapPoints } from "@/lib/map/points";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { BandBar } from "@/components/catalog/BandBar";
import { EmptyState } from "@/components/catalog/EmptyState";
import { GradeHistogram } from "@/components/catalog/GradeHistogram";
import { SourceNote } from "@/components/catalog/SourceNote";
import { VerificationBadge } from "@/components/catalog/VerificationBadge";
import { AddLink } from "@/components/catalog/edit/AddLink";
import { CatalogItemToolbar } from "@/components/catalog/edit/CatalogItemToolbar";
import { PlacesMapLazy } from "@/components/map/PlacesMapLazy";
import { PhotoBanner } from "@/components/media/PhotoBanner";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CragDetailPage({ params }: Props) {
  const { id } = await params;
  const cragId = Number(id);
  const crag = await loadOrNotFound(() => getCrag(cragId));

  const [chain, sectors, grades, t, session] = await Promise.all([
    zoneChain(crag.zoneId),
    fetchAllPages((page, size) => listSectors({ cragId, page, size })),
    allGrades(),
    getTranslations(),
    getSession(),
  ]);
  const routes = await routesBySector(sectors.map((sector) => sector.id));
  const lookup = buildGradeLookup(grades);
  const allRoutes = [...routes.values()].flat();
  const bins = gradeHistogram(allRoutes, lookup, grades);
  const cragText = splitAttribution(crag.description);
  const sectorTexts = new Map(sectors.map((sector) => [sector.id, splitAttribution(sector.description)]));

  const sectorPoints = toMapPoints(sectors, "/sectors");
  const mapPoints = sectorPoints.length > 0 ? sectorPoints : toMapPoints([crag], "/crags");

  return (
    <div className="flex flex-1 flex-col">
      <PhotoBanner
        photo={nearestPhoto(chain, crag.name)}
        eyebrow={t("Catalog.crag.eyebrow")}
        title={crag.name}
        crumbs={zoneCrumbs(chain, t("Catalog.zones.title"))}
        facts={
          <>
            <span>{t("Catalog.counts.sectors", { count: sectors.length })}</span>
            <span>{t("Catalog.counts.routes", { count: allRoutes.length })}</span>
            {bins.length > 0 && (
              <span>{t("Catalog.counts.gradeRange", { from: bins[0].grade.label, to: bins[bins.length - 1].grade.label })}</span>
            )}
            {crag.rockType && <span>{crag.rockType}</span>}
            {crag.orientation && <span>{crag.orientation}</span>}
            {crag.altitudeM !== null && <span>{t("Common.meters", { value: crag.altitudeM })}</span>}
          </>
        }
      />

      <div className="mx-auto grid w-full max-w-5xl gap-12 px-6 py-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-10">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <VerificationBadge verified={crag.verified} showVerified />
              <CatalogItemToolbar
                kind="crag"
                item={crag}
                session={session}
                editHref={`/crags/${crag.id}/edit`}
                afterDeletePath={crag.zoneId ? `/zones/${crag.zoneId}` : "/zones"}
                pagePath={`/crags/${crag.id}`}
              />
            </div>
            {cragText.body && <p className="max-w-2xl font-sans text-base leading-7 text-stone">{cragText.body}</p>}
            {crag.approachDescription && (
              <p className="max-w-2xl font-sans text-sm text-stone">
                <span className="font-semibold text-foreground">{t("Catalog.crag.approach")} </span>
                {crag.approachDescription}
              </p>
            )}
          </div>

          <section className="reveal flex flex-col gap-3">
            <h2 className="font-display text-2xl font-medium text-foreground">{t("Catalog.crag.sectors")}</h2>
            {sectors.length === 0 ? (
              <EmptyState message={t("Catalog.crag.noSectors")} />
            ) : (
              <div className="flex flex-col gap-3">
                {sectors.map((sector) => {
                  const sectorRoutes = routes.get(sector.id) ?? [];
                  return (
                    <CatalogCard
                      key={sector.id}
                      href={`/sectors/${sector.id}`}
                      title={sector.name}
                      subtitle={t("Catalog.counts.routes", { count: sectorRoutes.length })}
                      description={sectorTexts.get(sector.id)?.body}
                      badges={sector.verified ? undefined : <VerificationBadge verified={false} />}
                      footer={<BandBar counts={bandCounts(sectorRoutes, lookup)} />}
                    />
                  );
                })}
              </div>
            )}
            {session && <AddLink href={`/sectors/new?cragId=${crag.id}`} label={t("Catalog.edit.add.sector")} />}
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
              <PlacesMapLazy points={mapPoints} label={t("Catalog.map.sectors", { name: crag.name })} className="h-72" />
            ) : (
              <p className="font-sans text-sm text-stone">{t("Catalog.map.noLocation")}</p>
            )}
          </section>
        </aside>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 pb-10">
        <SourceNote sources={[cragText.source, ...[...sectorTexts.values()].map((text) => text.source)]} />
      </div>
    </div>
  );
}
