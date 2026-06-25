# Roadmap — FrontendApp

Separate repo/folder from `BackendApi`, per explicit user decision. Stack: **Next.js + TypeScript** (App Router). Nothing scaffolded yet — this is the plan for when scaffolding starts.

## Target structure

```
FrontendApp/
├── doc/
│   └── ROADMAP.md
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (catalog)/
│   │   │   ├── zones/page.tsx            # top-level zone list (recursive tree)
│   │   │   ├── zones/[id]/page.tsx       # zone detail -> child zones/crags
│   │   │   ├── crags/[id]/page.tsx       # crag detail -> sectors
│   │   │   ├── sectors/[id]/page.tsx     # sector detail -> routes
│   │   │   └── routes/[id]/page.tsx      # route detail -> pitches, comments, photos, ratings
│   │   ├── (account)/
│   │   │   ├── profile/page.tsx
│   │   │   ├── logbook/page.tsx
│   │   │   ├── favorites/page.tsx
│   │   │   ├── follows/page.tsx
│   │   │   └── lists/page.tsx            # RouteList + lists/[id] for ListRoute entries
│   │   ├── layout.tsx
│   │   └── page.tsx                      # landing/home
│   ├── components/
│   │   ├── ui/          # design-system primitives (Button, Input, Pagination, etc.)
│   │   ├── catalog/     # RouteCard, GradeBadge, ZoneTree, TagPill
│   │   ├── auth/        # LoginForm, RegisterForm, AuthGuard
│   │   └── personal/    # RatingStars, FavoriteButton, CommentList, LogbookForm
│   ├── lib/
│   │   ├── api/         # one typed client module per resource (zones.ts, routes.ts, auth.ts, ...)
│   │   ├── auth/        # token storage + auth context/provider
│   │   └── types/       # TS types mirroring backend Request/Response DTOs
│   ├── hooks/           # useAuth, usePaginatedQuery, etc.
│   └── styles/
├── public/
├── .env.local            # NEXT_PUBLIC_API_BASE_URL, etc.
└── package.json
```

### Why this shape

- **Route groups `(auth)` / `(catalog)` / `(account)`** keep URL structure flat (`/login`, `/zones/12`) while letting each area have its own layout (e.g. `(account)` gets an auth-guarded layout, `(auth)` doesn't).
- **`lib/api/*` mirrors backend controllers 1:1** (`ZoneController` → `zones.ts`, `AuthController` → `auth.ts`, etc.) so adding a backend resource has an obvious frontend home.
- **`lib/types` mirrors backend DTOs** (`RouteRequest`/`RouteResponse` → `Route` types) — keeps the contract explicit instead of `any`-typed fetches.
- Server state (catalog data, personal data) goes through **TanStack Query** wrapping `lib/api/*`; the backend's `PagedResponse<T>` envelope (`content`/`page`/`size`/`totalElements`/`totalPages`) maps directly onto a paginated query hook.
- Auth: backend issues a stateless JWT (24h, no refresh) — store it client-side (httpOnly cookie via a Next.js route handler proxy is preferable to `localStorage` for XSS resistance) and attach `Authorization: Bearer` on every request via the `lib/api` client.

## Phases

### Phase 0 — Scaffold
- `create-next-app` (TypeScript, App Router, ESLint)
- Tailwind (or chosen styling approach) + base design tokens
- `lib/api` base client (fetch wrapper, base URL from env, error envelope handling matching backend's `GlobalExceptionHandler` status codes)
- `lib/types` stubs for all 12 backend resources + auth DTOs

### Phase 1 — Auth
- Register / login / logout, token storage, `AuthGuard`/middleware for protected routes
- Email verification + forgot/reset password flows (backend stubs tokens via response/log — frontend just needs the three endpoints wired, no email UI needed yet)
- Role-aware UI (USER/MODERATOR/ADMIN) gating write actions on wiki resources

### Phase 2 — Catalog browsing (read-only)
- Zone (recursive) → Crag → Sector → Route → Pitch navigation
- Tag and Grading System/Grade display
- Pagination/sorting UI wired to the 9 paginated list endpoints (Route, Crag, Sector, Zone, Tag, Pitch, Comment, Photo, LogbookEntry)
- Map/coordinates display for sector- and route-level lat/lng where present

### Phase 3 — Personal layer
- Favorites, Follows, Ratings (half-star), Comments, Photos (URL-only, no upload), Logbook entries, RouteList/ListRoute
- Ownership-aware UI (edit/delete only shown for the owning user, mirroring backend's `isSelfOrModeratorOrAdmin`)

### Phase 4 — Catalog write/admin
- Create/edit/delete for wiki resources (Zone/Crag/Sector/Route/Pitch/Tag), gated to authenticated users per backend policy
- Admin-only `User` management screen

### Phase 5 — Search/filtering
- Blocked until backend search/filtering beyond exact-match ships (`KNOWN_ISSUES.md` in `BackendApi`) and real data is loaded — UI can stub this with the current equality filters in the meantime

### Phase 6 — Polish & deploy
- Responsive breakpoints, accessibility pass, loading/error states, Lighthouse pass
- Deployment target (decided alongside `BackendApi`'s own deployment-prep step, currently also not started)

## Dependencies on BackendApi

- Two pending SQL migrations (ratings half-star, auth tokens) must run before Phase 1 (password reset) and Phase 3 (ratings) can be tested end-to-end against real data.
- OpenBeta import / grade seeding is owned by a separate session — Phase 2 catalog browsing has no real data to render until that lands.
