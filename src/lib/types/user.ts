export type Role = "USER" | "MODERATOR" | "ADMIN";

export interface UserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  role: Role | null;
}

export interface UserResponse {
  id: number;
  username: string;
  /** Only present for the user themselves or an admin; null otherwise. */
  email: string | null;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  role: Role;
  createdAt: string;
}

/** The fields a user edits on their own profile. Null clears the field. */
export interface ProfileRequest {
  fullName: string | null;
  bio: string | null;
}

/** Activity counts shown on a profile. `sends` counts redpoints, flashes and onsights. */
export interface UserStatsResponse {
  ascents: number;
  sends: number;
  hardestSendGradeId: number | null;
  favorites: number;
  followers: number;
  following: number;
}
