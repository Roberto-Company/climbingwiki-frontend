import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { listCrags, listRoutes, listZones } from "@/lib/api";
import type { CragResponse, ZoneResponse } from "@/lib/types";
import { getSession } from "@/lib/auth/session";
import { PHOTOS, zonePhoto } from "@/lib/media/photos";
import { toMapPoints } from "@/lib/map/points";
import { PhotoCard } from "@/components/media/PhotoCard";
import { PhotoCredit } from "@/components/media/PhotoCredit";
import { PlacesMapLazy } from "@/components/map/PlacesMapLazy";

const HERO = PHOTOS["catalonia-cave-roof"];
const LOGBOOK_PHOTO = PHOTOS["margalef-overhang"];
const MAX_AREAS = 6;
const MAX_CRAGS_ON_MAP = 100;

type Area = { zone: ZoneResponse; cragCount: number };

type CatalogOverview = {
  zoneCount: number;
  cragCount: number;
  routeCount: number;
  areas: Area[];
  crags: CragResponse[];
};

/**
 * The areas shown are the sub-zones of the first top-level zone (the region), which is how a
 * regional guide opens. Counts come from page metadata, so those requests ask for one item.
 */
async function loadOverview(): Promise<CatalogOverview | null> {
  try {
    const [zones, crags, routes, roots] = await Promise.all([
      listZones({ size: 1 }),
      listCrags({ size: MAX_CRAGS_ON_MAP }),
      listRoutes({ size: 1 }),
      listZones({ rootOnly: true, size: MAX_AREAS }),
    ]);
    const region = roots.content[0];
    const areaZones = region ? (await listZones({ parentZoneId: region.id, size: MAX_AREAS })).content : [];
    const shown = areaZones.length > 0 ? areaZones : roots.content;
    const cragCounts = await Promise.all(shown.map((zone) => listCrags({ zoneId: zone.id, size: 1 })));
    return {
      zoneCount: zones.totalElements,
      cragCount: crags.totalElements,
      routeCount: routes.totalElements,
      areas: shown.map((zone, index) => ({ zone, cragCount: cragCounts[index].totalElements })),
      crags: crags.content,
    };
  } catch {
    // The home page should still render when the API is down; the catalog pages report the error.
    return null;
  }
}

export default async function Home() {
  const [overview, session, t, tCounts, tMap] = await Promise.all([
    loadOverview(),
    getSession(),
    getTranslations("Home"),
    getTranslations("Catalog.counts"),
    getTranslations("Catalog.map"),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden bg-night text-white">
        <Image
          src={HERO.image}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="settle -z-10 object-cover"
          style={{ objectPosition: HERO.focus }}
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-night/85 via-night/50 to-night/5" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-night/80 to-transparent" />

        <div className="flex min-h-[min(82vh,760px)] flex-col justify-end px-6 pb-10 pt-24 sm:px-16">
          <p className="rise-in font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ochre-200">{t("eyebrow")}</p>
          <h1
            className="rise-in mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.02] sm:text-7xl"
            style={{ "--delay": "80ms" } as React.CSSProperties}
          >
            {t("heroTitle")}
          </h1>
          <p className="rise-in mt-5 max-w-lg font-sans text-lg leading-7 text-white/85" style={{ "--delay": "160ms" } as React.CSSProperties}>
            {t("tagline")}
          </p>

          <form
            action="/search"
            role="search"
            className="rise-in mt-8 flex w-full max-w-xl overflow-hidden rounded-md bg-background shadow-lg shadow-black/20 focus-within:ring-2 focus-within:ring-ochre-400"
            style={{ "--delay": "240ms" } as React.CSSProperties}
          >
            <label htmlFor="hero-search" className="sr-only">
              {t("heroSearchLabel")}
            </label>
            <input
              id="hero-search"
              type="search"
              name="q"
              required
              placeholder={t("heroSearchLabel")}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 font-sans text-base text-foreground placeholder:text-stone outline-none"
            />
            <button type="submit" className="bg-moss-600 px-5 font-sans text-sm font-semibold text-white transition-colors hover:bg-moss-800">
              {t("heroSearchButton")}
            </button>
          </form>

          {overview ? (
            <dl
              aria-label={t("statsLabel")}
              className="rise-in mt-12 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/20 pt-5"
              style={{ "--delay": "320ms" } as React.CSSProperties}
            >
              {[
                { value: overview.zoneCount, label: t("stats.zones", { count: overview.zoneCount }) },
                { value: overview.cragCount, label: t("stats.crags", { count: overview.cragCount }) },
                { value: overview.routeCount, label: t("stats.routes", { count: overview.routeCount }) },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <dd className="font-display text-3xl font-medium tabular-nums">{stat.value}</dd>
                  <dt className="font-sans text-sm text-white/75">{stat.label}</dt>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-12 max-w-md font-sans text-sm text-white/80">{t("unavailable")}</p>
          )}
        </div>
        <PhotoCredit photo={HERO} className="absolute bottom-2 left-4 right-4 text-right sm:left-auto" />
      </section>

      {overview && overview.areas.length > 0 && (
        <section className="reveal mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-medium text-foreground sm:text-4xl">{t("zonesTitle")}</h2>
              <p className="mt-3 font-sans text-base leading-7 text-stone">{t("zonesIntro")}</p>
            </div>
            <Link href="/zones" className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
              {t("allZones")}
            </Link>
          </div>
          <div className="grid auto-rows-[15rem] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {overview.areas.map(({ zone, cragCount }, index) => (
              <div key={zone.id} className={index === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
                <PhotoCard
                  href={`/zones/${zone.id}`}
                  title={zone.name}
                  photo={zonePhoto(zone.name)}
                  meta={tCounts("crags", { count: cragCount })}
                  featured={index === 0}
                  sizes={index === 0 ? "(min-width: 1024px) 33vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {overview && (
        <section className="reveal border-y border-border bg-surface/50">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div>
              <h2 className="font-display text-3xl font-medium text-foreground">{t("mapTitle")}</h2>
              <p className="mt-3 font-sans text-sm text-stone">{t("mapIntro")}</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-1.5 font-sans text-sm lg:grid-cols-1">
                {overview.crags.map((crag) => (
                  <li key={crag.id}>
                    <Link href={`/crags/${crag.id}`} className="text-foreground hover:text-moss-600 hover:underline">
                      {crag.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <PlacesMapLazy points={toMapPoints(overview.crags, "/crags")} label={tMap("all")} className="h-[26rem]" />
          </div>
        </section>
      )}

      <section className="reveal mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={LOGBOOK_PHOTO.image}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: LOGBOOK_PHOTO.focus }}
            />
          </div>
          <figcaption className="mt-2">
            <PhotoCredit photo={LOGBOOK_PHOTO} variant="plain" />
          </figcaption>
        </figure>
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ochre-600">{t("logbook.eyebrow")}</p>
          <h2 className="mt-3 font-display text-4xl font-medium leading-tight text-foreground">{t("logbook.title")}</h2>
          <p className="mt-4 max-w-md font-sans text-base leading-7 text-stone">{t("logbook.body")}</p>
          <Link
            href={session ? "/logbook" : "/register"}
            className="mt-8 inline-flex rounded-md bg-moss-600 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-moss-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre-400"
          >
            {session ? t("logbook.ctaSignedIn") : t("logbook.cta")}
          </Link>
        </div>
      </section>
    </main>
  );
}
