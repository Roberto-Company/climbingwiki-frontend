import { notFound } from "next/navigation";
import { ApiError, getRoute, listPitches } from "@/lib/api";
import { EmptyState } from "@/components/catalog/EmptyState";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RouteDetailPage({ params }: Props) {
  const { id } = await params;
  const routeId = Number(id);

  let route;
  try {
    route = await getRoute(routeId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const pitches = await listPitches({ routeId });
  const sortedPitches = [...pitches.content].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
          {route.routeType}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{route.name}</h1>
        {route.firstAscentBy && (
          <p className="mt-2 font-sans text-sm text-stone">
            First ascent: {route.firstAscentBy}
            {route.firstAscentDate && ` (${route.firstAscentDate})`}
          </p>
        )}
        {route.description && <p className="mt-3 max-w-xl font-sans text-base text-stone">{route.description}</p>}
        {route.equipmentNotes && (
          <p className="mt-3 max-w-xl font-sans text-sm text-stone">
            <span className="font-semibold text-foreground">Equipment: </span>
            {route.equipmentNotes}
          </p>
        )}
        {route.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {route.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-moss-50 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-moss-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">Pitches</h2>
        {sortedPitches.length === 0 ? (
          <EmptyState message="No pitch breakdown documented yet." />
        ) : (
          <ol className="flex flex-col gap-3">
            {sortedPitches.map((pitch) => (
              <li key={pitch.id} className="rounded-lg border border-border bg-surface px-5 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-base font-medium text-foreground">Pitch {pitch.orderIndex}</h3>
                  {pitch.lengthM !== null && <span className="font-sans text-xs text-stone">{pitch.lengthM} m</span>}
                </div>
                {pitch.description && <p className="mt-1 font-sans text-sm text-stone">{pitch.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
