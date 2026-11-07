import "server-only";

import { getCrag, getRoute, getSector } from "@/lib/api";
import { allGrades } from "@/lib/catalog/place-data";
import { buildGradeLookup } from "@/lib/catalog/route-summary";
import type { GradeResponse, RouteResponse } from "@/lib/types";

/** A route with what a personal list needs to show next to its name. */
export interface RouteCard {
  route: RouteResponse;
  grade: GradeResponse | null;
  sectorName: string | null;
  cragId: number | null;
  cragName: string | null;
}

async function settledMap<T>(ids: readonly number[], load: (id: number) => Promise<T>): Promise<Map<number, T>> {
  const unique = [...new Set(ids)];
  const results = await Promise.allSettled(unique.map(load));
  const map = new Map<number, T>();
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      map.set(unique[index], result.value);
    }
  });
  return map;
}

/**
 * Loads routes with their grade, sector and crag. Each sector and crag is fetched once however many
 * routes share it. Routes that no longer exist are left out, so a deleted route never breaks a page.
 */
export async function loadRouteCards(routeIds: readonly number[]): Promise<Map<number, RouteCard>> {
  return cardsForRoutes([...(await settledMap(routeIds, getRoute)).values()]);
}

/** Same as loadRouteCards, for routes already loaded (search results). */
export async function cardsForRoutes(list: readonly RouteResponse[]): Promise<Map<number, RouteCard>> {
  const routes = new Map(list.map((route) => [route.id, route]));
  const lookup = buildGradeLookup(await allGrades());
  const sectors = await settledMap([...routes.values()].map((route) => route.sectorId), getSector);
  const crags = await settledMap([...sectors.values()].map((sector) => sector.cragId), getCrag);

  const cards = new Map<number, RouteCard>();
  for (const [id, route] of routes) {
    const sector = sectors.get(route.sectorId) ?? null;
    const crag = sector ? (crags.get(sector.cragId) ?? null) : null;
    cards.set(id, {
      route,
      grade: route.hardestGradeId !== null ? (lookup.get(route.hardestGradeId) ?? null) : null,
      sectorName: sector?.name ?? null,
      cragId: crag?.id ?? null,
      cragName: crag?.name ?? null,
    });
  }
  return cards;
}
