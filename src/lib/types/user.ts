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
