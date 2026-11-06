# Roadmap — climbingwiki-frontend

Next.js 16 (App Router) + TypeScript + Tailwind v4 client for the [climbingwiki-backend](https://github.com/Roberto-Company/climbingwiki-backend) REST API.

**Direction:** ClimbingWiki is a portfolio project, not a production service. The goal is a finished, polished, well-tested core that is easy to run and review, rather than maximum feature breadth. Production-only concerns (real email delivery, refresh tokens, hosting) are documented, not built.

Why things are built the way they are: [`DECISIONS.md`](./DECISIONS.md).

## Done

- **Auth:** register, login, logout, email verification and password reset (demo mode: tokens shown on screen, no email is sent). Session in an httpOnly cookie; `src/proxy.ts` guards account pages. The visitor's IP is forwarded on login so the backend can rate-limit per visitor.
- **Catalog browsing:** zones → crags → sectors → routes → pitches, paginated, with route type and grade badges. Route lists get grade and length from the route list response (one request per page).
- **Personal layer:** favorites, ratings (half stars), comments with replies, photos (URL only), logbook, route lists, follows.
- **Search** across routes, crags and zones; **public user profiles**.
- **Languages:** Spanish and English with a header toggle (next-intl, cookie mode, no locale in URLs). First visit follows the browser language, default Spanish.
- **Home page** with live catalog counts and featured zones; **loading, error and 404 pages**; footer with data attribution. Source sentences in imported descriptions are shown once per page as a footnote.
- **Tests:** Vitest unit tests for the pure helpers (`npm test`).

## Next

1. **One-command run:** Dockerfile for this app and a full-stack `docker compose up` (database, backend, frontend, seeded data, demo accounts).
2. **More tests:** a few Playwright end-to-end flows (browse catalog, log in, switch language); component tests where useful.
3. **CI:** GitHub Actions running type-check, lint, tests and build.
4. **README** with screenshots, architecture diagram, demo GIF and an "If this went to production" section.
5. **One standout feature:** crag and sector map (Leaflet + OpenStreetMap), or create/edit forms for catalog data with role checks.
6. **Accessibility and mobile pass** (keyboard navigation, contrast, small screens).

## Known limitations

- Error messages that come from the backend API are in English only.
- Password reset and email verification are demo flows (no email delivery).
- Some account pages fetch each route separately (favorites, logbook, lists). Fine at portfolio scale.
