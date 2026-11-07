import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { listFavorites } from "@/lib/api";
import { loadRouteCards } from "@/lib/users/route-cards";
import { FavoriteButton } from "@/components/personal/FavoriteButton";
import { AccountHeader } from "@/components/users/AccountHeader";
import { RouteRow } from "@/components/users/RouteRow";

export default async function FavoritesPage() {
  const [session, t] = await Promise.all([verifySession(), getTranslations()]);
  const favorites = await listFavorites({ userId: session.userId });
  const cards = await loadRouteCards(favorites.map((favorite) => favorite.routeId));
  const routes = favorites.flatMap((favorite) => cards.get(favorite.routeId) ?? []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-14">
      <AccountHeader
        title={t("Account.favorites.title")}
        subtitle={t("Account.favorites.count", { count: routes.length })}
      />
      {routes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-5 py-10 text-center font-sans text-sm text-stone">
          <p>{t("Account.favorites.empty")}</p>
          <Link href="/zones" className="mt-3 inline-block font-semibold text-moss-600 hover:text-moss-800">
            {t("Account.favorites.browse")} →
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {routes.map((card) => (
            <RouteRow
              key={card.route.id}
              card={card}
              actions={<FavoriteButton routeId={card.route.id} isFavorited isAuthenticated />}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
