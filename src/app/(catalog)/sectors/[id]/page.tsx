import { notFound } from "next/navigation";
import { ApiError, getSector, listRoutes } from "@/lib/api";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { EmptyState } from "@/components/catalog/EmptyState";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SectorDetailPage({ params }: Props) {
  const { id } = await params;
  const sectorId = Number(id);

  let sector;
  try {
    sector = await getSector(sectorId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const routes = await listRoutes({ sectorId });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Sector</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{sector.name}</h1>
        {sector.description && <p className="mt-3 max-w-xl font-sans text-base text-stone">{sector.description}</p>}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">Routes</h2>
        {routes.content.length === 0 ? (
          <EmptyState message="No routes documented yet in this sector." />
        ) : (
          <div className="flex flex-col gap-3">
            {routes.content.map((route) => (
              <CatalogCard
                key={route.id}
                href={`/routes/${route.id}`}
                title={route.name}
                subtitle={route.routeType}
                description={route.description}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
