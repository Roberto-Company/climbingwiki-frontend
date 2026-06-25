import { listZones } from "@/lib/api";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";
import { Pagination } from "@/components/catalog/Pagination";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ZonesPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 0;
  const zones = await listZones({ rootOnly: true, page });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">Zones</h1>
      </div>
      {zones.content.length === 0 ? (
        <EmptyState message="No zones have been documented yet." />
      ) : (
        <div className="flex flex-col gap-3">
          {zones.content.map((zone) => (
            <CatalogCard key={zone.id} href={`/zones/${zone.id}`} title={zone.name} description={zone.description} />
          ))}
        </div>
      )}
      <Pagination basePath="/zones" page={zones.page} totalPages={zones.totalPages} />
    </div>
  );
}
