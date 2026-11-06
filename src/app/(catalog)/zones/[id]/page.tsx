import { SourceNote } from "@/components/catalog/SourceNote";

import { splitAttribution } from "@/lib/catalog/attribution";

import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth/session";
import { VerificationBadge } from "@/components/catalog/VerificationBadge";
import { CatalogItemToolbar } from "@/components/catalog/edit/CatalogItemToolbar";
import { AddLink } from "@/components/catalog/edit/AddLink";
import { notFound } from "next/navigation";
import { ApiError, getZone, listCrags, listZones } from "@/lib/api";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ZoneDetailPage({ params }: Props) {
  const { id } = await params;
  const zoneId = Number(id);

  let zone;
  try {
    zone = await getZone(zoneId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const [childZones, crags, t, tEdit, session] = await Promise.all([
    listZones({ parentZoneId: zoneId }),
    listCrags({ zoneId }),
    getTranslations("Catalog.zone"),
    getTranslations("Catalog.edit.add"),
    getSession(),
  ]);
  const parentPath = zone.parentZoneId ? `/zones/${zone.parentZoneId}` : "/zones";
  const cragTexts = new Map(crags.content.map((crag) => [crag.id, splitAttribution(crag.description)]));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("eyebrow")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{zone.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
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
        {zone.description && <p className="mt-3 max-w-xl font-sans text-base text-stone">{zone.description}</p>}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">{t("subZones")}</h2>
        {childZones.content.length === 0 ? (
          <EmptyState message={t("noSubZones")} />
        ) : (
          <div className="flex flex-col gap-3">
            {childZones.content.map((child) => (
              <CatalogCard
                key={child.id}
                href={`/zones/${child.id}`}
                title={child.name}
                description={child.description}
                badges={<VerificationBadge verified={child.verified} />}
              />
            ))}
          </div>
        )}
        {session && <AddLink href={`/zones/new?parentZoneId=${zone.id}`} label={tEdit("subZone")} />}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">{t("crags")}</h2>
        {crags.content.length === 0 ? (
          <EmptyState message={t("noCrags")} />
        ) : (
          <div className="flex flex-col gap-3">
            {crags.content.map((crag) => (
              <CatalogCard
                key={crag.id}
                href={`/crags/${crag.id}`}
                title={crag.name}
                subtitle={crag.rockType ?? undefined}
                description={cragTexts.get(crag.id)?.body}
                badges={<VerificationBadge verified={crag.verified} />}
              />
            ))}
          </div>
        )}
        {session && <AddLink href={`/crags/new?zoneId=${zone.id}`} label={tEdit("crag")} />}
      </section>

      <SourceNote sources={[...cragTexts.values()].map((text) => text.source)} />
    </div>
  );
}
