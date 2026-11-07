"use server";

import { listRoutes } from "@/lib/api";
import type { GradeResponse } from "@/lib/types";
import { cardsForRoutes } from "./route-cards";

export interface RouteOption {
  id: number;
  name: string;
  /** "Crag · Sector", to tell apart routes with the same name. */
  place: string;
  grade: GradeResponse | null;
}

const MIN_QUERY = 2;
const MAX_QUERY = 100;
const MAX_RESULTS = 8;

/** Routes whose name contains the query, for the route pickers. Public data, so no session needed. */
export async function searchRoutesAction(query: string): Promise<RouteOption[]> {
  const name = String(query ?? "").trim().slice(0, MAX_QUERY);
  if (name.length < MIN_QUERY) {
    return [];
  }
  const page = await listRoutes({ name, size: MAX_RESULTS, sort: "name,asc" });
  const cards = await cardsForRoutes(page.content);
  return page.content.map((route) => {
    const card = cards.get(route.id);
    return {
      id: route.id,
      name: route.name,
      place: [card?.cragName, card?.sectorName].filter(Boolean).join(" · "),
      grade: card?.grade ?? null,
    };
  });
}
