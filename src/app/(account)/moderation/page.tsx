import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { canVerifyCatalogItems } from "@/lib/auth/roles";
import { listUnverifiedItems } from "@/lib/api";
import { groupByKind, itemHref } from "@/lib/catalog/moderation";
import type { UnverifiedItem } from "@/lib/types";
import { EmptyState } from "@/components/catalog/EmptyState";
import { VerifyButton } from "@/components/catalog/edit/VerifyButton";

const PAGE_PATH = "/moderation";

export default async function ModerationPage() {
  const session = await verifySession();
  if (!canVerifyCatalogItems(session)) {
    redirect("/");
  }
  const [items, t] = await Promise.all([listUnverifiedItems(session.token), getTranslations("Moderation")]);
  const groups = groupByKind(items);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("eyebrow")}</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t("title")}</h1>
        <p className="mt-3 max-w-xl font-sans text-sm text-stone">{t("intro")}</p>
      </div>
      {groups.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        groups.map((group) => (
          <section key={group.kind} aria-labelledby={`review-${group.kind}`} className="flex flex-col gap-3">
            <h2 id={`review-${group.kind}`} className="flex items-baseline gap-3 font-display text-xl text-foreground">
              {t(`groups.${group.kind}`)}
              <span className="font-sans text-xs font-semibold uppercase tracking-wide text-stone">
                {t("count", { count: group.items.length })}
              </span>
            </h2>
            <ul className="flex flex-col gap-2">
              {group.items.map((item) => (
                <ReviewRow key={`${item.kind}-${item.id}`} item={item} t={t} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

type Translate = Awaited<ReturnType<typeof getTranslations<"Moderation">>>;

function ReviewRow({ item, t }: { item: UnverifiedItem; t: Translate }) {
  const title = item.kind === "pitch" ? t("pitchName", { route: item.name, number: item.pitchNumber ?? 0 }) : item.name;

  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-ochre-600 bg-surface px-5 py-3">
      <div className="min-w-0 flex-1">
        <Link href={itemHref(item)} className="font-display text-lg font-medium text-foreground hover:text-moss-600">
          {title}
        </Link>
        <p className="font-sans text-xs text-stone">
          {item.parentName && item.kind !== "pitch" && <>{t("inParent", { name: item.parentName })} · </>}
          {t("addedBy")}{" "}
          {item.createdById && item.createdByUsername ? (
            <Link href={`/users/${item.createdById}`} className="font-semibold text-moss-600 hover:text-moss-800">
              {item.createdByUsername}
            </Link>
          ) : (
            t("unknownAuthor")
          )}
        </p>
      </div>
      <VerifyButton kind={item.kind} id={item.id} verified={false} pagePath={PAGE_PATH} />
    </li>
  );
}
