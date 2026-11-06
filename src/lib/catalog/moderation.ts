import type { CatalogKind } from "@/lib/api/catalog-writes";
import type { UnverifiedItem } from "@/lib/types";

const KIND_ORDER: readonly CatalogKind[] = ["zone", "crag", "sector", "route", "pitch"];

const PAGE_PATHS: Record<Exclude<CatalogKind, "pitch">, string> = {
  zone: "/zones",
  crag: "/crags",
  sector: "/sectors",
  route: "/routes",
};

/** Where to look at an item; pitches are shown on their route's page. */
export function itemHref(item: UnverifiedItem): string {
  if (item.kind === "pitch") {
    return `/routes/${item.parentId}`;
  }
  return `${PAGE_PATHS[item.kind]}/${item.id}`;
}

export interface KindGroup {
  kind: CatalogKind;
  items: UnverifiedItem[];
}

/** Zones → pitches, leaving out kinds with nothing to review. */
export function groupByKind(items: readonly UnverifiedItem[]): KindGroup[] {
  return KIND_ORDER.map((kind) => ({ kind, items: items.filter((entry) => entry.kind === kind) })).filter(
    (group) => group.items.length > 0,
  );
}
