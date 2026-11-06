import type { Role } from "@/lib/types";

const ROLE_RANK: Record<Role, number> = {
  USER: 0,
  MODERATOR: 1,
  ADMIN: 2,
};

export function hasMinRole(role: Role | null | undefined, minRole: Role): boolean {
  if (!role) {
    return false;
  }
  return ROLE_RANK[role] >= ROLE_RANK[minRole];
}

interface SessionLike {
  userId: number;
  role: Role;
}

/** Mirrors the backend's `isSelfOrModeratorOrAdmin` ownership check. */
export function canModify(session: SessionLike | null, ownerId: number): boolean {
  if (!session) {
    return false;
  }
  return session.userId === ownerId || hasMinRole(session.role, "MODERATOR");
}

interface CatalogItemLike {
  createdById: number | null;
  verified: boolean;
}

/**
 * Mirrors the backend's `CatalogAccess`: moderators and admins can change any climbing data;
 * regular users only their own items that haven't been verified yet.
 */
export function canEditCatalogItem(session: SessionLike | null, item: CatalogItemLike): boolean {
  if (!session) {
    return false;
  }
  if (hasMinRole(session.role, "MODERATOR")) {
    return true;
  }
  return !item.verified && item.createdById === session.userId;
}

export function canVerifyCatalogItems(session: SessionLike | null): boolean {
  return session !== null && hasMinRole(session.role, "MODERATOR");
}
