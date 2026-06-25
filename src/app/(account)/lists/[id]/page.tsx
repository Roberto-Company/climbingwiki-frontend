import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, getRoute, getRouteList, listListRoutes } from "@/lib/api";
import { verifySession } from "@/lib/auth/dal";
import { canModify } from "@/lib/auth/roles";
import { EmptyState } from "@/components/catalog/EmptyState";
import { RouteListEditForm } from "@/components/personal/RouteListEditForm";
import { RemoveFromListButton } from "@/components/personal/RemoveFromListButton";
import { AddRouteToListByIdForm } from "@/components/personal/AddRouteToListByIdForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RouteListDetailPage({ params }: Props) {
  const { id } = await params;
  const listId = Number(id);
  const session = await verifySession();

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

  const listRoutes = await listListRoutes({ listId });
  const routes = await Promise.all(listRoutes.map((entry) => getRoute(entry.routeId)));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Route list</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{list.name}</h1>
        {list.description && <p className="mt-2 font-sans text-base text-stone">{list.description}</p>}
      </div>

      {isOwner && (
        <div className="rounded-lg border border-border bg-surface px-5 py-4">
          <RouteListEditForm list={list} />
        </div>
      )}

      {routes.length === 0 ? (
        <EmptyState message="No routes in this list yet." />
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
                  {route.routeType}
                </p>
              </Link>
              {isOwner && <RemoveFromListButton listId={listId} routeId={route.id} />}
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <section className="flex flex-col gap-3 border-t border-border pt-6">
          <h2 className="font-display text-xl font-medium text-foreground">Add a route by ID</h2>
          <AddRouteToListByIdForm listId={listId} />
        </section>
      )}
    </div>
  );
}
