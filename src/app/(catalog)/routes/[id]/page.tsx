import { SourceNote } from "@/components/catalog/SourceNote";

import { splitAttribution } from "@/lib/catalog/attribution";

import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  ApiError,
  getRoute,
  listComments,
  listFavorites,
  listGrades,
  listPhotos,
  listPitches,
  listRatings,
  listRouteLists,
} from "@/lib/api";
import { getSession } from "@/lib/auth/session";
import { buildGradeLookup, hardestGrade, totalLength } from "@/lib/catalog/route-summary";
import { EmptyState } from "@/components/catalog/EmptyState";
import { GradeBadge, RouteTypeBadge } from "@/components/catalog/RouteBadges";
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

  const [session, t] = await Promise.all([getSession(), getTranslations()]);

  const [pitches, grades, favorites, ratings, comments, photos, userLists] = await Promise.all([
    listPitches({ routeId }),
    listGrades(),
    listFavorites({ routeId }),
    listRatings({ routeId }),
    listComments({ routeId }),
    listPhotos({ routeId }),
    session ? listRouteLists({ userId: session.userId }) : Promise.resolve([]),
  ]);

  const sortedPitches = [...pitches.content].sort((a, b) => a.orderIndex - b.orderIndex);
  const gradeLookup = buildGradeLookup(grades);
  const routeGrade = hardestGrade(sortedPitches, gradeLookup);
  const routeLength = totalLength(sortedPitches);
  const routeText = splitAttribution(route.description);
  const isFavorited = session ? favorites.some((f) => f.userId === session.userId) : false;
  const average = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length
    : null;
  const userScore = session ? ratings.find((r) => r.userId === session.userId)?.score ?? null : null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("Catalog.route.eyebrow")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{route.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <RouteTypeBadge routeType={route.routeType} />
          <GradeBadge grade={routeGrade} />
          {routeLength !== null && <span className="font-sans text-sm text-stone">{t("Common.meters", { value: routeLength })}</span>}
        </div>
        {route.firstAscentBy && (
          <p className="mt-2 font-sans text-sm text-stone">
            {t("Catalog.route.firstAscent", { name: route.firstAscentBy })}
            {route.firstAscentDate && ` (${route.firstAscentDate})`}
          </p>
        )}
        {routeText.body && <p className="mt-3 max-w-xl font-sans text-base text-stone">{routeText.body}</p>}
        {route.equipmentNotes && (
          <p className="mt-3 max-w-xl font-sans text-sm text-stone">
            <span className="font-semibold text-foreground">{t("Catalog.route.equipment")} </span>
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
        <h2 className="font-display text-xl font-medium text-foreground">{t("Catalog.route.pitches")}</h2>
        {sortedPitches.length === 0 ? (
          <EmptyState message={t("Catalog.route.noPitches")} />
        ) : (
          <ol className="flex flex-col gap-3">
            {sortedPitches.map((pitch) => (
              <li key={pitch.id} className="rounded-lg border border-border bg-surface px-5 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-base font-medium text-foreground">
                    {t("Catalog.route.pitch", { number: pitch.orderIndex })}
                  </h3>
                  <div className="flex items-center gap-2">
                    {pitch.lengthM !== null && <span className="font-sans text-xs text-stone">{t("Common.meters", { value: pitch.lengthM })}</span>}
                    <GradeBadge grade={pitch.gradeId !== null ? gradeLookup.get(pitch.gradeId) ?? null : null} />
                  </div>
                </div>
                {pitch.description && <p className="mt-1 font-sans text-sm text-stone">{pitch.description}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>

      {session && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-medium text-foreground">{t("Catalog.route.logThisClimb")}</h2>
          <LogbookForm routeId={routeId} />
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">{t("Catalog.route.photos")}</h2>
        <PhotoGallery photos={photos.content} session={session} />
        {session && <PhotoForm routeId={routeId} />}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-medium text-foreground">{t("Catalog.route.comments")}</h2>
        <CommentList comments={comments.content} session={session} />
        {session ? (
          <CommentForm routeId={routeId} />
        ) : (
          <p className="font-sans text-sm text-stone">{t("Catalog.route.signInToComment")}</p>
        )}
      </section>

      <SourceNote sources={[routeText.source]} />
    </div>
  );
}
