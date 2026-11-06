import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { getRoute, listFavorites } from "@/lib/api";
import { EmptyState } from "@/components/catalog/EmptyState";
import { FavoriteButton } from "@/components/personal/FavoriteButton";

export default async function FavoritesPage() {
  const [session, t] = await Promise.all([verifySession(), getTranslations()]);
  const favorites = await listFavorites({ userId: session.userId });
  const routes = await Promise.all(favorites.map((favorite) => getRoute(favorite.routeId)));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("Common.yourAccount")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t("Account.favorites.title")}</h1>
      </div>
      {routes.length === 0 ? (
        <EmptyState message={t("Account.favorites.empty")} />
      ) : (
        <div className="flex flex-col gap-3">
          {routes.map((route) => (
            <div
              key={route.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4"
            >
              <Link href={`/routes/${route.id}`} className="flex-1">
                <h3 className="font-display text-lg font-medium text-foreground">{route.name}</h3>
                <p className="font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">
                  {t(`Catalog.routeTypes.${route.routeType}`)}
                </p>
              </Link>
              <FavoriteButton routeId={route.id} isFavorited isAuthenticated />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
