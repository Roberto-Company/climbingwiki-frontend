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
