import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth/session";
import { listCrags, listZones } from "@/lib/api";
import { placePhoto } from "@/lib/media/photos";
import { VerificationBadge } from "@/components/catalog/VerificationBadge";
import { AddLink } from "@/components/catalog/edit/AddLink";
import { EmptyState } from "@/components/catalog/EmptyState";
import { Pagination } from "@/components/catalog/Pagination";
import { PhotoBanner } from "@/components/media/PhotoBanner";
import { PhotoCard } from "@/components/media/PhotoCard";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ZonesPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 0;
  const [zones, t, session] = await Promise.all([listZones({ rootOnly: true, page }), getTranslations(), getSession()]);
  // Each card says what is inside; page metadata gives the counts without loading the items.
  const counts = await Promise.all(
    zones.content.map(async (zone) => {
      const [children, crags] = await Promise.all([listZones({ parentZoneId: zone.id, size: 1 }), listCrags({ zoneId: zone.id, size: 1 })]);
      return { zones: children.totalElements, crags: crags.totalElements };
    }),
  );

  return (
    <div className="flex flex-1 flex-col">
      <PhotoBanner photo={null} eyebrow={t("Common.catalog")} title={t("Catalog.zones.title")} />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        {zones.content.length === 0 ? (
          <EmptyState message={t("Catalog.zones.empty")} />
        ) : (
          <div className="grid auto-rows-[16rem] gap-4 sm:grid-cols-2">
            {zones.content.map((zone, index) => (
              <PhotoCard
                key={zone.id}
                href={`/zones/${zone.id}`}
                title={zone.name}
                photo={placePhoto(zone.name)}
                featured
                sizes="(min-width: 640px) 50vw, 100vw"
                badges={zone.verified ? undefined : <VerificationBadge verified={false} />}
                meta={[
                  counts[index].zones > 0 ? t("Catalog.counts.zones", { count: counts[index].zones }) : null,
                  counts[index].crags > 0 ? t("Catalog.counts.crags", { count: counts[index].crags }) : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </div>
        )}
        {session && <AddLink href="/zones/new" label={t("Catalog.edit.add.zone")} />}
        <Pagination basePath="/zones" page={zones.page} totalPages={zones.totalPages} />
      </div>
    </div>
  );
}
