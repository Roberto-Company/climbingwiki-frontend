# Roadmap — climbingwiki-frontend

Next.js 16 (App Router) + TypeScript + Tailwind v4 client for the [climbingwiki-backend](https://github.com/Roberto-Company/climbingwiki-backend) REST API.

**Direction:** ClimbingWiki is a portfolio project, hosted on free tiers as a public demo (non-commercial). The goal is a finished, polished, well-tested core rather than maximum feature breadth. Concerns that only matter at real scale (refresh tokens, paid hosting) are documented, not built.

Why things are built the way they are: [`DECISIONS.md`](./DECISIONS.md).

## Done

- **Auth:** register, login, logout, email verification and password reset (demo mode: tokens shown on screen, no email is sent). Session in an httpOnly cookie; `src/proxy.ts` guards account pages. The visitor's IP is forwarded on login so the backend can rate-limit per visitor.
- **Catalog browsing:** zones → crags → sectors → routes → pitches, paginated, with route type and grade badges. Route lists get grade and length from the route list response (one request per page).
- **Personal layer:** favorites, ratings (half stars), comments with replies, photos (URL only), logbook, route lists, follows.
- **Catalog editing:** signed-in climbers add and edit zones, crags, sectors, routes and pitches. Their additions are marked **unverified** until a moderator verifies them; owners can change their own unverified items, moderators can edit, delete and verify anything. A new route can take its grade and length straight away (saved as pitch 1).
- **Search** across routes, crags and zones; **public user profiles**.
- **Languages:** Spanish and English with a header toggle (next-intl, cookie mode, no locale in URLs). First visit follows the browser language, default Spanish.
- **Home page** with live catalog counts and featured zones; **loading, error and 404 pages**; footer with data attribution. Source sentences in imported descriptions are shown once per page as a footnote.
- **Tests:** Vitest unit tests for the pure helpers (`npm test`).

## Next

1. **Moderation:** a page listing unverified data to review; moderators delete comments and photos.
2. **Going online safely:** password reset that doesn't show its token, a "waking up the server…" message while the free backend starts, demo accounts.
3. **Map** of crags and sectors (Leaflet + OpenStreetMap).
4. **Deploy** (Vercel free plan), then **CI** (GitHub Actions: type-check, lint, tests, build) and a **README** with the live link and screenshots.
5. **Accessibility and mobile pass** (keyboard navigation, contrast, small screens).
6. Nice-to-haves: grade filters and sorting, logbook stats, tags, a few Playwright end-to-end flows.

## Known limitations

- Error messages that come from the backend API are in English only.
- Password reset and email verification are demo flows (no email delivery).
- Some account pages fetch each route separately (favorites, logbook, lists). Fine at portfolio scale.
