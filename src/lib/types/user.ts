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
  email: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  role: Role;
  createdAt: string;
}
