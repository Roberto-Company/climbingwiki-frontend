import type { CatalogKind } from "@/lib/api/catalog-writes";

/** One entry in the moderators' review queue (`GET /api/moderation/unverified`). */
export interface UnverifiedItem {
  kind: CatalogKind;
  id: number;
  /** For a pitch, its route's name. */
  name: string;
  pitchNumber: number | null;
  parentId: number | null;
  parentName: string | null;
  createdById: number | null;
  createdByUsername: string | null;
}
