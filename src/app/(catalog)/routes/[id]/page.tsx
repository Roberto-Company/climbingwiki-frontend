import { notFound } from "next/navigation";
import {
  ApiError,
  getRoute,
  listComments,
  listFavorites,
  listPhotos,
  listPitches,
  listRatings,
  listRouteLists,
} from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import { EmptyState } from "@/components/catalog/EmptyState";
import { FavoriteButton } from "@/components/personal/FavoriteButton";
import { RatingWidget } from "@/components/personal/RatingWidget";
import { AddToListButton } from "@/components/personal/AddToListButton";
import { CommentList } from "@/components/personal/CommentList";
import { CommentForm } from "@/components/personal/CommentForm";
import { PhotoGallery } from "@/components/personal/PhotoGallery";
import { PhotoForm } from "@/components/personal/PhotoForm";
import { LogbookForm } from "@/components/personal/LogbookForm";

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

  const session = await getSession();

  const [pitches, favorites, ratings, comments, photos, userLists] = await Promise.all([
    listPitches({ routeId }),
    listFavorites({ routeId }),
    listRatings({ routeId }),
    listComments({ routeId }),
    listPhotos({ routeId }),
    session ? listRouteLists({ userId: session.userId }) : Promise.resolve([]),
  ]);

  const sortedPitches = [...pitches.content].sort((a, b) => a.orderIndex - b.orderIndex);
  const isFavorited = session ? favorites.some((f) => f.userId === session.userId) : false;
  const average = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length
    : null;
  const userScore = session ? ratings.find((r) => r.userId === session.userId)?.score ?? null : null;

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

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <FavoriteButton routeId={routeId} isFavorited={isFavorited} isAuthenticated={session !== null} />
          <AddToListButton routeId={routeId} userLists={userLists} isAuthenticated={session !== null} />
        </div>
        <div className="mt-4">
          <RatingWidget
            routeId={routeId}
            average={average}
            count={ratings.length}
            userScore={userScore}
            isAuthenticated={session !== null}
          />
        </div>
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

      {session && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-medium text-foreground">Log this climb</h2>
          <LogbookForm routeId={routeId} />
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">Photos</h2>
        <PhotoGallery photos={photos.content} session={session} />
        {session && <PhotoForm routeId={routeId} />}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">Comments</h2>
        <CommentList comments={comments.content} session={session} />
        {session ? (
          <CommentForm routeId={routeId} />
        ) : (
          <p className="font-sans text-sm text-stone">Sign in to leave a comment.</p>
        )}
      </section>
    </div>
  );
}
