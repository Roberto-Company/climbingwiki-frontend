import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { listRouteLists } from "@/lib/api";
import { EmptyState } from "@/components/catalog/EmptyState";
import { RouteListForm } from "@/components/personal/RouteListForm";
import { AccountHeader } from "@/components/users/AccountHeader";

export default async function ListsPage() {
  const [session, t] = await Promise.all([verifySession(), getTranslations()]);
  const lists = await listRouteLists({ userId: session.userId });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-14">
      <AccountHeader title={t("Account.lists.title")} />

      {lists.length === 0 ? (
        <EmptyState message={t("Account.lists.empty")} />
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
                    {t("Common.public")}
                  </span>
                )}
              </div>
              {list.description && <p className="mt-1 font-sans text-sm text-stone">{list.description}</p>}
            </Link>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-3 border-t border-border pt-6">
        <h2 className="font-display text-xl font-medium text-foreground">{t("Account.lists.create")}</h2>
        <RouteListForm />
      </section>
    </div>
  );
}
