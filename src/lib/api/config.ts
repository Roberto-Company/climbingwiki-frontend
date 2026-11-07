// The backend is only called from the Next.js server (Server Components and Server Actions),
// so the URL is read at runtime: one Docker image works with any backend address.
// NEXT_PUBLIC_API_BASE_URL is still accepted for older .env.local files.
export const API_BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080/api";
