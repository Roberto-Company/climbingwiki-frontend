import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth/session";
import { fetchAllPages, getZone, listCrags, listZones } from "@/lib/api";
import { splitAttribution } from "@/lib/catalog/attribution";
import { loadOrNotFound } from "@/lib/catalog/page-data";
import { nearestPhoto, zoneChain, zoneCrumbs } from "@/lib/catalog/place-data";
import { toMapPoints } from "@/lib/map/points";
import { placePhoto } from "@/lib/media/photos";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { SourceNote } from "@/components/catalog/SourceNote";
import { VerificationBadge } from "@/components/catalog/VerificationBadge";
import { AddLink } from "@/components/catalog/edit/AddLink";
import { CatalogItemToolbar } from "@/components/catalog/edit/CatalogItemToolbar";
import { PlacesMapLazy } from "@/components/map/PlacesMapLazy";
import { PhotoBanner } from "@/components/media/PhotoBanner";
import { PhotoCard } from "@/components/media/PhotoCard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ZoneDetailPage({ params }: Props) {
  const { id } = await params;
  const zoneId = Number(id);
  const zone = await loadOrNotFound(() => getZone(zoneId));

  const [chain, childZones, crags, t, session] = await Promise.all([
    zoneChain(zone.id),
    fetchAllPages((page, size) => listZones({ parentZoneId: zoneId, page, size })),
    fetchAllPages((page, size) => listCrags({ zoneId, page, size })),
    getTranslations(),
    getSession(),
  ]);
  const parentPath = zone.parentZoneId ? `/zones/${zone.parentZoneId}` : "/zones";
  const cragTexts = new Map(crags.map((crag) => [crag.id, splitAttribution(crag.description)]));
  const mapPoints = toMapPoints(crags, "/crags");

  return (
    <div className="flex flex-1 flex-col">
      <PhotoBanner
        photo={nearestPhoto(chain)}
        eyebrow={t("Catalog.zone.eyebrow")}
        title={zone.name}
        crumbs={zoneCrumbs(chain.slice(0, -1), t("Catalog.zones.title"))}
        facts={
          <>
            {childZones.length > 0 && <span>{t("Catalog.counts.zones", { count: childZones.length })}</span>}
            <span>{t("Catalog.counts.crags", { count: crags.length })}</span>
          </>
        }
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <VerificationBadge verified={zone.verified} showVerified />
            <CatalogItemToolbar
              kind="zone"
              item={zone}
              session={session}
              editHref={`/zones/${zone.id}/edit`}
              afterDeletePath={parentPath}
              pagePath={`/zones/${zone.id}`}
            />
          </div>
          {zone.description && <p className="max-w-2xl font-sans text-base leading-7 text-stone">{zone.description}</p>}
        </div>

        {(childZones.length > 0 || session) && (
          <section className="reveal flex flex-col gap-4">
            <h2 className="font-display text-2xl font-medium text-foreground">{t("Catalog.zone.subZones")}</h2>
            {childZones.length === 0 ? (
              <EmptyState message={t("Catalog.zone.noSubZones")} />
            ) : (
              <div className="grid auto-rows-[14rem] gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {childZones.map((child) => (
                  <PhotoCard
                    key={child.id}
                    href={`/zones/${child.id}`}
                    title={child.name}
                    photo={placePhoto(child.name)}
                    badges={child.verified ? undefined : <VerificationBadge verified={false} />}
                  />
                ))}
              </div>
            )}
            {session && <AddLink href={`/zones/new?parentZoneId=${zone.id}`} label={t("Catalog.edit.add.subZone")} />}
          </section>
        )}

        <section className="reveal grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-2xl font-medium text-foreground">{t("Catalog.zone.crags")}</h2>
            {crags.length === 0 ? (
              <EmptyState message={t("Catalog.zone.noCrags")} />
            ) : (
              <div className="flex flex-col gap-3">
                {crags.map((crag) => (
                  <CatalogCard
                    key={crag.id}
                    href={`/crags/${crag.id}`}
                    title={crag.name}
                    subtitle={crag.rockType ?? undefined}
                    description={cragTexts.get(crag.id)?.body}
                    badges={crag.verified ? undefined : <VerificationBadge verified={false} />}
                  />
                ))}
              </div>
            )}
            {session && <AddLink href={`/crags/new?zoneId=${zone.id}`} label={t("Catalog.edit.add.crag")} />}
          </div>
          {mapPoints.length > 0 && (
            <PlacesMapLazy
              points={mapPoints}
              label={t("Catalog.map.crags", { name: zone.name })}
              className="h-80 lg:sticky lg:top-6 lg:h-[28rem]"
            />
          )}
        </section>

        <SourceNote sources={[...cragTexts.values()].map((text) => text.source)} />
      </div>
    </div>
  );
}
