import { apiFetch } from "./client";
import type {
  CragRequest,
  CragResponse,
  PitchRequest,
  PitchResponse,
  RouteRequest,
  RouteResponse,
  SectorRequest,
  SectorResponse,
  ZoneRequest,
  ZoneResponse,
} from "@/lib/types";

/** Climbing data that can be added, edited, deleted and verified. */
export type CatalogKind = "zone" | "crag" | "sector" | "route" | "pitch";

interface CatalogTypes {
  zone: { request: ZoneRequest; response: ZoneResponse };
  crag: { request: CragRequest; response: CragResponse };
  sector: { request: SectorRequest; response: SectorResponse };
  route: { request: RouteRequest; response: RouteResponse };
  pitch: { request: PitchRequest; response: PitchResponse };
}

export type CatalogRequest<K extends CatalogKind> = CatalogTypes[K]["request"];
export type CatalogResponse<K extends CatalogKind> = CatalogTypes[K]["response"];

export const CATALOG_PATHS: Record<CatalogKind, string> = {
  zone: "/zones",
  crag: "/crags",
  sector: "/sectors",
  route: "/routes",
  pitch: "/pitches",
};

export function createCatalogItem<K extends CatalogKind>(
  kind: K,
  body: CatalogRequest<K>,
  token: string,
): Promise<CatalogResponse<K>> {
  return apiFetch<CatalogResponse<K>>(CATALOG_PATHS[kind], { method: "POST", body, token });
}

export function updateCatalogItem<K extends CatalogKind>(
  kind: K,
  id: number,
  body: CatalogRequest<K>,
  token: string,
): Promise<CatalogResponse<K>> {
  return apiFetch<CatalogResponse<K>>(`${CATALOG_PATHS[kind]}/${id}`, { method: "PUT", body, token });
}

export function deleteCatalogItem(kind: CatalogKind, id: number, token: string): Promise<void> {
  return apiFetch<void>(`${CATALOG_PATHS[kind]}/${id}`, { method: "DELETE", token });
}

/** Moderators and admins only. */
export function setCatalogItemVerified<K extends CatalogKind>(
  kind: K,
  id: number,
  verified: boolean,
  token: string,
): Promise<CatalogResponse<K>> {
  return apiFetch<CatalogResponse<K>>(`${CATALOG_PATHS[kind]}/${id}/verification`, {
    method: "PUT",
    body: { verified },
    token,
  });
}
