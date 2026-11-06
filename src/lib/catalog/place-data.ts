import "server-only";

import { cache } from "react";
import { getZone, listGrades, listRoutes } from "@/lib/api";
import type { Crumb } from "@/components/media/PhotoBanner";
import { placePhoto, type Photo } from "@/lib/media/photos";
import type { GradeResponse, RouteResponse, ZoneResponse } from "@/lib/types";

/** Zones nest a few levels at most (region → area); the cap guards against a cycle in bad data. */
const MAX_ZONE_DEPTH = 6;
/** The API's largest page; sectors hold far fewer routes than this. */
const ALL_ROUTES = 100;

/** A zone and its ancestors, outermost first. Cached per request, so pages can call it freely. */
export const zoneChain = cache(async (zoneId: number | null): Promise<ZoneResponse[]> => {
  const chain: ZoneResponse[] = [];
  let nextId = zoneId;
  while (nextId !== null && chain.length < MAX_ZONE_DEPTH) {
    const zone = await getZone(nextId);
    chain.unshift(zone);
    nextId = zone.parentZoneId;
  }
  return chain;
});

/** Breadcrumbs from the zones list down to the last zone in the chain. */
export function zoneCrumbs(chain: readonly ZoneResponse[], zonesLabel: string): Crumb[] {
  return [{ href: "/zones", label: zonesLabel }, ...chain.map((zone) => ({ href: `/zones/${zone.id}`, label: zone.name }))];
}

/**
 * The photo of the nearest place that has one: the crag itself first, then its zones from the
 * innermost out, so a crag in Mula shows Mula, not the whole region.
 */
export function nearestPhoto(chain: readonly ZoneResponse[], cragName?: string): Photo | null {
  for (const name of [cragName, ...chain.toReversed().map((zone) => zone.name)]) {
    const photo = placePhoto(name);
    if (photo) {
      return photo;
    }
  }
  return null;
}

/**
 * Every route of each sector, for crag-level stats. The API filters routes by sector only, so this
 * is one request per sector, sent in parallel.
 */
export async function routesBySector(sectorIds: readonly number[]): Promise<Map<number, RouteResponse[]>> {
  const pages = await Promise.all(sectorIds.map((sectorId) => listRoutes({ sectorId, size: ALL_ROUTES })));
  return new Map(sectorIds.map((sectorId, index) => [sectorId, pages[index].content]));
}

export const allGrades = cache((): Promise<GradeResponse[]> => listGrades());
