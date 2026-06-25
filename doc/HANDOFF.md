# Handoff — FrontendApp (2026-06-25)

Written so a Claude Code session whose primary working directory is `FrontendApp` (not `BackendApi`) has everything needed to pick this up cold. Frontend session handoffs live **here**, in `FrontendApp/doc`, not mixed into `BackendApi/doc`.

## Where things stand

- **Phase 0 (scaffold), Phase 1 (auth), and Phase 2 (catalog browsing) are all done.**
- **Migration applied:** `BackendApi/database/alter_auth_tokens.sql` was run against the local `climbingwiki-db` MySQL container this session (user-approved) — `users` now has `email_verified`, `verification_token`, `verification_token_expires_at`, `reset_token`, `reset_token_expires_at`. The other pending migration, `alter_ratings_half_star.sql`, is still **not** applied (needed for Phase 3 ratings UI).
- **Important Next.js 16 fact:** `middleware.ts` is deprecated and renamed to **`proxy.ts`** (exported function name `proxy`, same level as `app/`, so here it's `src/proxy.ts`). This codebase postdates this assistant's training data — confirmed from the actual docs bundled in `node_modules/next/dist/docs/`, not from memory. If you're not sure whether a Next.js convention you "remember" still applies, check there first.

### Phase 0 recap

- Next.js 16.2.9 (TypeScript, App Router, ESLint, Tailwind v4, `src/` dir, `@/*` alias, Turbopack).
- Nature palette in `src/app/globals.css`: chalk paper background, moss-green/sandstone-ochre brand colors, Fraunces (display) + Inter (body). No auto dark mode — light-only is the deliberate direction.
- `lib/api` (`client.ts`/`config.ts`/`errors.ts`): `apiFetch<T>`, `API_BASE_URL` from `NEXT_PUBLIC_API_BASE_URL`, `ApiError`/`ValidationErrors` matching the backend's `GlobalExceptionHandler`.
  - **Bug fixed this session:** `apiFetch` only special-cased HTTP 204 for empty bodies, but Spring returns HTTP **200 with an empty body** for `void`-returning controller methods (e.g. `/auth/verify-email`, `/auth/reset-password`), which crashed `response.json()` with `SyntaxError: Unexpected end of JSON input`. Fixed by reading `response.text()` first and only `JSON.parse`-ing if non-empty. Caught via real end-to-end testing, not by reasoning about it — worth remembering when adding new endpoints that return `void`.
- `lib/types` (19 files, barrel `index.ts`): mirrors all 40 backend DTOs 1:1. `UpsertResult` deliberately skipped (never serializes — create-vs-update signaled by HTTP status, not body). Two grade enums (`GradingTypes.Roped`, `GradingTypes.Boulder`) not yet mirrored — no DTO references them yet; add when Phase 2 grade-display needs them.

### Phase 1 — Auth (this session)

**Decision made (not asked, per user: "go as you like, remember the style constraints"):** httpOnly cookie session, set server-side only, **never** `localStorage` — matches both `ROADMAP.md`'s own recommendation and the security rules (never store sessions client-side-readable).

**Architecture — Server Actions, not hand-rolled API routes.** Checked the actual Next.js 16 docs (`02-guides/authentication.md`) since this is the framework's current recommended pattern for this exact case (forms + cookies + redirects), and it's also less code than Route Handlers + client-side `fetch`.

- `src/lib/auth/constants.ts` — `SESSION_COOKIE_NAME` (`cw_session`), `SESSION_MAX_AGE_SECONDS` (24h, matches JWT lifetime).
- `src/lib/auth/session.ts` (`server-only`) — `Session = {token, userId, username, role}`. `createSession`/`deleteSession`/`getSession` via `next/headers` `cookies()` (now async — `await cookies()`). Cookie stores the whole session as JSON (not just the raw JWT), since `LoginResponse` already hands back `userId`/`username`/`role` decoded — no need to decode the JWT ourselves. `getSession()` returns `null` on missing/malformed cookie (defensive `try/catch` around `JSON.parse`), used for **optimistic/display** purposes only (e.g. root layout nav).
- `src/lib/auth/dal.ts` — `verifySession()` (React `cache()` + `redirect("/login")` if absent). This is the **authoritative** check — call it inside the page/action that needs the data, not just in a layout. The official Next.js docs explicitly warn that layout-only checks don't re-run on client-side partial navigation, so don't rely on a shared `(account)/layout.tsx` for gating; check inside each protected page instead. `(account)/profile/page.tsx` does this.
- `src/lib/auth/roles.ts` — `hasMinRole(role, minRole)`, ranks USER < MODERATOR < ADMIN. Not used yet — for Phase 4 write-gating.
- `src/lib/auth/actions.ts` (`"use server"`) — `loginAction`, `registerAction`, `logoutAction`, `verifyEmailAction`, `forgotPasswordAction`, `resetPasswordAction`. All call `apiFetch` against the real backend, map `ApiError` → a shared `FormState` (`{error?, fieldErrors?, success?, resetToken?}`) consumed by `useActionState` in the form components. **Note:** `registerAction` always sends `role: null` — confirmed in `AuthService.register` that the backend force-overwrites role to `USER` server-side regardless of what's submitted, so there's no point exposing a role field in the UI.
- `src/proxy.ts` — optimistic, cookie-**presence**-only check (no JWT decode, no backend call — matches the docs' "optimistic checks" guidance for Proxy/Middleware). Redirects unauthenticated users away from `/profile`, and authenticated users away from `/login`/`/register`. **Extend `PROTECTED_ROUTES` here when Phase 3 adds `/logbook`, `/favorites`, `/follows`, `/lists`.**
- UI: `(auth)/layout.tsx` (centered card shell) + `login`, `register`, `verify-email`, `forgot-password`, `reset-password` pages, each backed by a Client Component form (`src/components/auth/*Form.tsx`) using `useActionState`. `(account)/profile/page.tsx` is the first real protected page — shows username + role badge + logout. Root `layout.tsx` now reads the session (display-only) and renders a header with `UserNav` (login/register links or username + logout).
- Minimal UI primitives added: `src/components/ui/Button.tsx`, `TextField.tsx`, `FormMessage.tsx` — on-palette, used by all the auth forms.
- **Deliberately skipped Zod** despite the TS rule "use Zod for schema validation" — the backend already does real `@Valid` validation and returns field-level errors (`Record<field, message>`), surfaced via `fieldErrors`. Duplicating those same rules into a frontend Zod schema would create two sources of truth that can silently drift. Relying on HTML5 input attributes (`required`, `type`, `minLength`) for baseline UX plus the backend's real errors as the authority. Revisit if a form ever needs client-only validation with no backend equivalent.
- **`forgot-password` dev-mode UX:** the backend returns the reset token directly in the response body (no email infra yet — see `BackendApi` handoff), so the form displays it on-screen with a "Development mode" label and a direct link to `/reset-password?token=...`. Same idea for `verify-email`: no email delivery, so it's a manual token-paste form. Replace this UX once the backend wires real email delivery.

**Verified end-to-end** against the real backend + MySQL (not just `tsc`/`eslint`/`build`): register → login → profile → logout, `/profile` redirect when logged out, `/login` redirect when logged in, forgot-password → reset-password (old password rejected after reset, new password accepted), verify-email (confirmed `email_verified` flipped in DB). All via Playwright against `npm run dev` + `mvnw spring-boot:run`.

### Phase 2 — Catalog browsing (read-only)

**Backend gap found and closed first.** Reading `ZoneController`/`CragController`/`SectorController`/`RouteController` showed none of them had parent-filter query params (only `PitchController`'s `?routeId=` did). Asked the user; chose adding the params to `BackendApi` over client-side filtering (see `DECISIONS.md` D23). Added in `BackendApi` this session (separate repo, also committed/pushed there with user approval):
- `GET /api/zones?parentZoneId=<id>` and `?rootOnly=true` (mutually exclusive; `rootOnly` exists because a single nullable param can't mean both "no filter" and "filter for null parent" — see D24).
- `GET /api/crags?zoneId=<id>`, `GET /api/sectors?cragId=<id>`, `GET /api/routes?sectorId=<id>`.
- 12 new backend tests added (service + controller layers), full suite green (484/484), server restarted and smoke-tested via `curl` before frontend work resumed.

**`lib/api` resource clients** (`src/lib/api/`): one file per catalog resource — `zones.ts`, `crags.ts`, `sectors.ts`, `routes.ts`, `pitches.ts`, `tags.ts`, `grading-systems.ts`, `grades.ts` — each wrapping `apiFetch` with a typed `list*`/`get*` pair. Shared `query.ts` exports `toQueryString()` (object → `?key=value` string, skipping `undefined`) and `PageParams` (`page?`, `size?`, `sort?`). `GradingSystem`/`Grade` list functions return plain arrays, not `PagedResponse<T>` — confirmed from the actual controller source, those two resources were never paginated server-side (D27). All re-exported from the `lib/api` barrel (`index.ts`).

**Catalog page shells** (`src/app/(catalog)/`), all plain `async` Server Components (no client state — D25):
- `zones/page.tsx` — root zones (`rootOnly: true`), paginated.
- `zones/[id]/page.tsx` — one zone: its sub-zones (`parentZoneId`) and its crags (`zoneId`).
- `crags/[id]/page.tsx` — one crag: rock type/orientation/altitude/approach, and its sectors (`cragId`).
- `sectors/[id]/page.tsx` — one sector: its routes (`sectorId`), each tagged with `routeType`.
- `routes/[id]/page.tsx` — one route: first-ascent info, equipment notes, tag chips, and its pitches (`routeId`) sorted by `orderIndex`.
- All detail pages call `ApiError`-aware fetch + `notFound()` on a real 404 from the backend (verified live: `/zones/999999` → Next.js 404 page).
- Shared presentational pieces in `src/components/catalog/`: `CatalogCard` (link card), `EmptyState`, `Pagination` (prev/next via `?page=`, only rendered when `totalPages > 1`).
- Root `layout.tsx` header now has a "Zones" nav link into the catalog.

**Verified end-to-end against the live backend** (not just `tsc`/`eslint`/`next build`, all of which were also run and pass clean): Playwright through `/zones` → `/zones/1` (empty sub-zone/crag states render correctly) → `/sectors/1` (the leftover dev sector "Pared de Sant Jeroni" with 3 routes: "Aresta Nord (renamed)", "Fissura Central", "Bloc del Mirador") → `/routes/1` (tag chip "classic" rendered, empty pitch state) → `/crags/1` ("Montserrat", conglomerate, screenshot-checked against the nature palette — chalk/moss/ochre, Fraunces headings, no dark-mode/neon look).

- **Next action when resuming:** Phase 3 in `ROADMAP.md` — the "personal layer" (logbook, favorites, follows, route lists, ratings, comments, photos). Needs `alter_ratings_half_star.sql` applied first for the ratings UI (still pending, same ask-first boundary as `alter_auth_tokens.sql` was). `proxy.ts`'s `PROTECTED_ROUTES` needs extending to cover the new personal-layer pages (currently only `/profile`). Catalog pages still only render the leftover dev test data — real content depends on the separate OpenBeta import/grade-seeding session.

## Project context (read `ROADMAP.md` for the full plan)

- **What it is:** Next.js + TypeScript frontend for the ClimbingWiki REST API (separate repo/folder from the backend, by explicit user decision).
- **Backend:** `C:\Users\robec\Desktop\spring-boot-projects\ClimbingWikiProject\BackendApi` — Spring Boot, 12 REST resources (Zone→Crag→Sector→Route→Pitch + Tag/GradingSystem/Grade + personal layer: Comment/Photo/LogbookEntry/Rating/Favorite/Follow/RouteList/ListRoute/User), JWT auth (24h, no refresh, `Authorization: Bearer` header), 3-tier roles (USER/MODERATOR/ADMIN), `PagedResponse<T>` envelope on 9 list endpoints, controllers under `/api/<resource>` (default port 8080, no context-path), Swagger at `/swagger-ui/index.html`. Runs via `mvnw spring-boot:run`; needs the `climbingwiki-db` MySQL Docker container (`docker ps` to check, it was already running this session).
- **Backend's own handoff** (`BackendApi/doc/HANDOFF.md`) and roadmap (`BackendApi/doc/ROADMAP.md`) are the source of truth for backend state — don't duplicate them here, just cross-reference.

## Cross-cutting constraints carried over from BackendApi

- **Don't touch DB seeding/import** — a different session owns grade seeding (`seed-grades` profile) and OpenBeta import (`openbeta-import` profile). Catalog browsing (Phase 2) is built and verified against the live API, but still has no real content to render until that lands — only leftover dev test data exists today.
- **One pending backend SQL migration remains:** `alter_ratings_half_star.sql` (the other, `alter_auth_tokens.sql`, was applied this session). Ratings UI (Phase 3) can be built against the API contract regardless, but won't be testable end-to-end against real data until it runs — same "ask the user first" boundary applies (which is how `alter_auth_tokens.sql` got applied this session: asked first, user approved, then ran it).
- **Don't touch `spring-boot-projects/climbingWikiLoc`** — unrelated practice project, different package/stack, do not confuse with this frontend.

## Open decisions not yet made

- **Deployment target:** tied to `BackendApi`'s own not-yet-started deployment prep (see backend ROADMAP.md "Not started" section).

(Auth token storage was the other open decision — resolved this session: httpOnly cookie via Server Actions, see Phase 1 section above.)
