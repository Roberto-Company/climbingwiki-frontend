import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { listCrags, listRoutes, listZones } from "@/lib/api";
import type { ZoneResponse } from "@/lib/types";
import { getSession } from "@/lib/auth/session";
import { CatalogCard } from "@/components/catalog/CatalogCard";

const FEATURED_ZONE_COUNT = 4;

type CatalogOverview = {
  zoneCount: number;
  cragCount: number;
  routeCount: number;
  featuredZones: ZoneResponse[];
};

/** Counts come from page metadata, so each request asks for a single item. */
async function loadOverview(): Promise<CatalogOverview | null> {
  try {
    const [zones, crags, routes, rootZones] = await Promise.all([
      listZones({ size: 1 }),
      listCrags({ size: 1 }),
      listRoutes({ size: 1 }),
      listZones({ rootOnly: true, size: FEATURED_ZONE_COUNT }),
    ]);
    return {
      zoneCount: zones.totalElements,
      cragCount: crags.totalElements,
      routeCount: routes.totalElements,
      featuredZones: rootZones.content,
    };
  } catch {
    // The home page should still render when the API is down; the catalog pages report the error.
    return null;
  }
}

export default async function Home() {
  const [overview, session, t] = await Promise.all([loadOverview(), getSession(), getTranslations("Home")]);

  const stats = overview && [
    { value: overview.zoneCount, label: t("stats.zones", { count: overview.zoneCount }) },
    { value: overview.cragCount, label: t("stats.crags", { count: overview.cragCount }) },
    { value: overview.routeCount, label: t("stats.routes", { count: overview.routeCount }) },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <section className="grid gap-12 px-6 py-20 sm:px-16 sm:py-28 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div className="max-w-2xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">{t("eyebrow")}</p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] text-foreground sm:text-7xl">
            ClimbingWiki
          </h1>
          <div className="mt-6 h-1 w-16 bg-moss-600" />
          <p className="mt-6 max-w-md font-sans text-lg leading-7 text-stone">{t("tagline")}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/zones"
              className="rounded-md bg-moss-600 px-5 py-2.5 font-sans text-sm font-semibold text-background transition-colors hover:bg-moss-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-400"
            >
              {t("browseZones")}
            </Link>
            {!session && (
              <Link
                href="/register"
                className="rounded-md px-5 py-2.5 font-sans text-sm font-semibold text-moss-600 transition-colors hover:bg-moss-50"
              >
                {t("createAccount")}
              </Link>
            )}
          </div>
        </div>

        {stats ? (
          <dl
            aria-label={t("statsLabel")}
            className="grid grid-cols-3 gap-6 border-t-4 border-ochre-400 pt-6 lg:grid-cols-1 lg:border-t-0 lg:border-l-4 lg:pl-8 lg:pt-0"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse lg:flex-row lg:items-baseline lg:gap-3">
                <dt className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-stone">{stat.label}</dt>
                <dd className="font-display text-4xl font-medium text-foreground sm:text-5xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="rounded-lg border border-dashed border-border px-5 py-6 font-sans text-sm text-stone">
            {t("unavailable")}
          </p>
        )}
      </section>

      {overview && overview.featuredZones.length > 0 && (
        <section className="flex flex-col gap-5 border-t border-border bg-surface/40 px-6 py-14 sm:px-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-medium text-foreground">{t("startExploring")}</h2>
            <Link href="/zones" className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
              {t("allZones")}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {overview.featuredZones.map((zone) => (
              <CatalogCard key={zone.id} href={`/zones/${zone.id}`} title={zone.name} description={zone.description} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-border px-6 py-14 sm:px-16">
        <h2 className="font-display text-2xl font-medium text-foreground">{t("features.title")}</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {(["guide", "log", "community"] as const).map((feature, index) => (
            <li key={feature} className="flex flex-col gap-2">
              <span className="font-display text-3xl font-medium text-ochre-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-sans text-base leading-7 text-stone">{t(`features.${feature}`)}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
