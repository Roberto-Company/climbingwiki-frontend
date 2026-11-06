import { SourceNote } from "@/components/catalog/SourceNote";

import { splitAttribution } from "@/lib/catalog/attribution";

import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ApiError, getCrag, listSectors } from "@/lib/api";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CragDetailPage({ params }: Props) {
  const { id } = await params;
  const cragId = Number(id);

  let crag;
  try {
    crag = await getCrag(cragId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const [sectors, t] = await Promise.all([listSectors({ cragId }), getTranslations()]);
  const cragText = splitAttribution(crag.description);
  const sectorTexts = new Map(sectors.content.map((sector) => [sector.id, splitAttribution(sector.description)]));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("Catalog.crag.eyebrow")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{crag.name}</h1>
        <div className="mt-3 flex flex-wrap gap-3 font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">
          {crag.rockType && <span>{crag.rockType}</span>}
          {crag.orientation && <span>{crag.orientation}</span>}
          {crag.altitudeM !== null && <span>{t("Common.meters", { value: crag.altitudeM })}</span>}
        </div>
        {cragText.body && <p className="mt-3 max-w-xl font-sans text-base text-stone">{cragText.body}</p>}
        {crag.approachDescription && (
          <p className="mt-3 max-w-xl font-sans text-sm text-stone">
            <span className="font-semibold text-foreground">{t("Catalog.crag.approach")} </span>
            {crag.approachDescription}
          </p>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">{t("Catalog.crag.sectors")}</h2>
        {sectors.content.length === 0 ? (
          <EmptyState message={t("Catalog.crag.noSectors")} />
        ) : (
          <div className="flex flex-col gap-3">
            {sectors.content.map((sector) => (
              <CatalogCard
                key={sector.id}
                href={`/sectors/${sector.id}`}
                title={sector.name}
                description={sectorTexts.get(sector.id)?.body}
              />
            ))}
          </div>
        )}
      </section>

      <SourceNote sources={[cragText.source, ...[...sectorTexts.values()].map((text) => text.source)]} />
    </div>
  );
}
