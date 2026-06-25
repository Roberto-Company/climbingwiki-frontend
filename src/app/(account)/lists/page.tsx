import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { listRouteLists } from "@/lib/api";
import { EmptyState } from "@/components/catalog/EmptyState";
import { RouteListForm } from "@/components/personal/RouteListForm";

export default async function ListsPage() {
  const session = await verifySession();
  const lists = await listRouteLists({ userId: session.userId });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">Your account</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">Your lists</h1>
      </div>

      {lists.length === 0 ? (
        <EmptyState message="You haven't created any route lists yet." />
      ) : (
        <div className="flex flex-col gap-3">
          {lists.map((list) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="block rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-moss-400 hover:bg-moss-50"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-lg font-medium text-foreground">{list.name}</h3>
                {list.isPublic && (
                  <span className="shrink-0 font-sans text-xs font-semibold uppercase tracking-wide text-moss-600">
                    Public
                  </span>
                )}
              </div>
              {list.description && <p className="mt-1 font-sans text-sm text-stone">{list.description}</p>}
            </Link>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-3 border-t border-border pt-6">
        <h2 className="font-display text-xl font-medium text-foreground">Create a list</h2>
        <RouteListForm />
      </section>
    </div>
  );
}
