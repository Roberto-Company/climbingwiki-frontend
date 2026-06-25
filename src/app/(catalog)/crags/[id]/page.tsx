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

  const sectors = await listSectors({ cragId });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Crag</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{crag.name}</h1>
        <div className="mt-3 flex flex-wrap gap-3 font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">
          {crag.rockType && <span>{crag.rockType}</span>}
          {crag.orientation && <span>{crag.orientation}</span>}
          {crag.altitudeM !== null && <span>{crag.altitudeM} m</span>}
        </div>
        {crag.description && <p className="mt-3 max-w-xl font-sans text-base text-stone">{crag.description}</p>}
        {crag.approachDescription && (
          <p className="mt-3 max-w-xl font-sans text-sm text-stone">
            <span className="font-semibold text-foreground">Approach: </span>
            {crag.approachDescription}
          </p>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">Sectors</h2>
        {sectors.content.length === 0 ? (
          <EmptyState message="No sectors documented yet in this crag." />
        ) : (
          <div className="flex flex-col gap-3">
            {sectors.content.map((sector) => (
              <CatalogCard key={sector.id} href={`/sectors/${sector.id}`} title={sector.name} description={sector.description} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
