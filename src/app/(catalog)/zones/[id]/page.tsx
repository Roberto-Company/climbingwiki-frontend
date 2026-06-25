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

  const [childZones, crags] = await Promise.all([
    listZones({ parentZoneId: zoneId }),
    listCrags({ zoneId }),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Zone</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{zone.name}</h1>
        {zone.description && <p className="mt-3 max-w-xl font-sans text-base text-stone">{zone.description}</p>}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">Sub-zones</h2>
        {childZones.content.length === 0 ? (
          <EmptyState message="No sub-zones documented yet." />
        ) : (
          <div className="flex flex-col gap-3">
            {childZones.content.map((child) => (
              <CatalogCard key={child.id} href={`/zones/${child.id}`} title={child.name} description={child.description} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">Crags</h2>
        {crags.content.length === 0 ? (
          <EmptyState message="No crags documented yet in this zone." />
        ) : (
          <div className="flex flex-col gap-3">
            {crags.content.map((crag) => (
              <CatalogCard
                key={crag.id}
                href={`/crags/${crag.id}`}
                title={crag.name}
                subtitle={crag.rockType ?? undefined}
                description={crag.description}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
