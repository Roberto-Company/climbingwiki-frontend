# Roadmap — climbingwiki-frontend

Next.js 16 (App Router) + TypeScript + Tailwind v4 client for the [climbingwiki-backend](https://github.com/Roberto-Company/climbingwiki-backend) REST API.

**Direction:** ClimbingWiki is a portfolio project, hosted on free tiers as a public demo (non-commercial). The goal is a finished, polished, well-tested core rather than maximum feature breadth. Concerns that only matter at real scale (refresh tokens, paid hosting) are documented, not built.

Why things are built the way they are: [`DECISIONS.md`](./DECISIONS.md).

## Done

- **Auth:** register, login, logout, email verification and password reset (demo mode: tokens shown on screen, no email is sent). Session in an httpOnly cookie; `src/proxy.ts` guards account pages. The visitor's IP is forwarded on login so the backend can rate-limit per visitor.
- **Catalog browsing:** zones → crags → sectors → routes → pitches, paginated, with route type and grade badges. Route lists get grade and length from the route list response (one request per page).
- **Personal layer:** favorites, ratings (half stars), comments with replies, photos (URL only), logbook, route lists, follows.
- **Catalog editing:** signed-in climbers add and edit zones, crags, sectors, routes and pitches. Their additions are marked **unverified** until a moderator verifies them; owners can change their own unverified items, moderators can edit, delete and verify anything. A new route can take its grade and length straight away (saved as pitch 1).
- **Moderation:** `/moderation` (moderators and admins, linked as "Review" in the header) lists unverified data grouped by kind, with where it sits and who added it, and a verify button on each row. Moderators can delete any comment or photo.
- **Search** across routes, crags and zones; **public user profiles**.
- **Languages:** Spanish and English with a header toggle (next-intl, cookie mode, no locale in URLs). First visit follows the browser language, default Spanish.
- **Visual design:** photo hero and photo cards for the areas (real Wikimedia Commons photos of each place, credited on the photo and on `/credits`), topographic contour texture, page banners with breadcrumbs, routes-by-grade charts, difficulty bars per sector, a guidebook-style route table, CSS-only motion (entrance, scroll reveal, hover) that switches off with `prefers-reduced-motion`.
- **Maps:** Leaflet with muted OpenTopoMap tiles on the home page (every crag), zone pages (crags) and crag/sector pages (sectors).
- **Home page** with live catalog counts, the region's areas and a map; **loading, error and 404 pages**; footer with data attribution. Source sentences in imported descriptions are shown once per page as a footnote.
- **Tests:** Vitest unit tests for the pure helpers (`npm test`).

## Next

1. **Going online safely:** password reset that doesn't show its token, a "waking up the server…" message while the free backend starts, demo accounts.
2. **Deploy** (Vercel free plan), then **CI** (GitHub Actions: type-check, lint, tests, build) and a **README** with the live link and screenshots.
3. **Accessibility and mobile pass** (keyboard navigation, contrast, small screens).
4. Nice-to-haves: grade filters and sorting, logbook stats, tags, a few Playwright end-to-end flows.

## Known limitations

- Error messages that come from the backend API are in English only.
- Password reset and email verification are demo flows (no email delivery).
- **Next.js 16.2.9 has published security advisories** (fixed in 16.4+); upgrade before deploying.
- The header has no mobile menu yet: on phones the links wrap onto a second line and the header search is hidden (the home page has its own).
- Crag pages load routes with one request per sector (the API filters routes by sector only).
- Some account pages fetch each route separately (favorites, logbook, lists). Fine at portfolio scale.
