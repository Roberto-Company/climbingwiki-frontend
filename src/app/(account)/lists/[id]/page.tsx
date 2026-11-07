import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getRouteList, getUser, listListRoutes } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { canModify } from "@/lib/auth/roles";
import { EmptyState } from "@/components/catalog/EmptyState";
import { RouteListEditForm } from "@/components/personal/RouteListEditForm";
import { RemoveFromListButton } from "@/components/personal/RemoveFromListButton";
import { AddRouteToListForm } from "@/components/personal/AddRouteToListForm";
import { Avatar } from "@/components/users/Avatar";
import { RouteRow } from "@/components/users/RouteRow";
import { displayName } from "@/lib/users/avatar";
import { loadRouteCards } from "@/lib/users/route-cards";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RouteListDetailPage({ params }: Props) {
  const { id } = await params;
  const listId = Number(id);
  const [session, t] = await Promise.all([verifySession(), getTranslations()]);

  let list;
  try {
    list = await getRouteList(listId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const isOwner = canModify(session, list.userId);
  if (!list.isPublic && !isOwner) {
    notFound();
  }

  const [listRoutes, owner] = await Promise.all([listListRoutes({ listId }), getUser(list.userId)]);
  const cards = await loadRouteCards(listRoutes.map((entry) => entry.routeId));
  const routes = listRoutes.flatMap((entry) => cards.get(entry.routeId) ?? []);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("Account.list.eyebrow")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{list.name}</h1>
        {list.description && <p className="mt-2 font-sans text-base text-stone">{list.description}</p>}
        <Link href={`/users/${owner.id}`} className="mt-4 inline-flex items-center gap-2 font-sans text-sm text-stone hover:text-moss-800">
          <Avatar user={owner} size="xs" />
          <span>{t("Account.list.by", { name: displayName(owner) })}</span>
        </Link>
      </div>

      {isOwner && (
        <div className="rounded-lg border border-border bg-surface px-5 py-4">
          <RouteListEditForm list={list} />
        </div>
      )}

      {routes.length === 0 ? (
        <EmptyState message={t("Account.list.empty")} />
      ) : (
        <ol className="flex flex-col gap-2">
          {routes.map((card) => (
            <RouteRow
              key={card.route.id}
              card={card}
              actions={isOwner ? <RemoveFromListButton listId={listId} routeId={card.route.id} /> : undefined}
            />
          ))}
        </ol>
      )}

      {isOwner && (
        <section className="flex flex-col gap-3 border-t border-border pt-6">
          <h2 className="font-display text-xl font-medium text-foreground">{t("Account.list.addRoute")}</h2>
          <AddRouteToListForm listId={listId} />
        </section>
      )}
    </div>
  );
}
