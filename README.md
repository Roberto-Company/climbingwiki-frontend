# ClimbingWiki — frontend

[![CI](https://github.com/Roberto-Company/climbingwiki-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Roberto-Company/climbingwiki-frontend/actions/workflows/ci.yml)

Web client for **ClimbingWiki**, a community wiki and logbook for rock climbing: zones → crags → sectors → routes → pitches, with grades, ratings, comments, photos, route lists and a personal logbook.

> Portfolio project. Not a production service. The API lives in [climbingwiki-backend](https://github.com/Roberto-Company/climbingwiki-backend).

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a custom palette (chalk, moss, ochre) and Fraunces/Inter typography
- **next-intl**: Spanish and English, switched from the header
- **Leaflet** + react-leaflet with OpenTopoMap tiles for the maps
- **Vitest** for unit tests

## Features

- Browse the catalog from zone to pitch: photo headers of the real places, breadcrumbs, a topographic map of crags and sectors, a routes-by-grade chart and a guidebook-style route table with grades coloured by difficulty band
- Add and edit climbing data: new additions are marked **unverified** until a moderator verifies them
- Moderation: a review page lists unverified data for moderators to check and verify; moderators can delete any comment or photo
- Search routes, crags and zones
- Accounts: register, log in, email verification and password reset (demo mode, no email is sent)
- Personal layer: favorites, half-star ratings, threaded comments, photos, route lists, logbook, following other climbers, public profiles
- Loading, error and 404 pages; data attribution shown once per page; a photo credits page (all photos from Wikimedia Commons)

## Run it

### Whole stack with Docker (one command)

Clone both repos next to each other, then from the backend repo:

```bash
git clone https://github.com/Roberto-Company/climbingwiki-backend.git
git clone https://github.com/Roberto-Company/climbingwiki-frontend.git
cd climbingwiki-backend
docker compose up --build    # open http://localhost:3000
```

Demo accounts (password `climbing-demo`): `demo` (climber), `moderator`, `admin`. See the backend README for details.

### Frontend development

Requires Node 24 and the backend running on `http://localhost:8080` (for example `docker compose up -d db backend` in the backend repo).

```bash
cp .env.example .env.local   # API_BASE_URL; adjust if needed
npm install
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint |

| Variable | Default | Purpose |
|---|---|---|
| `API_BASE_URL` | `http://localhost:8080/api` | Backend URL, read at runtime by the Next.js server |
| `SESSION_COOKIE_SECURE` | `true` in production builds | Set `false` to serve a production build over plain HTTP (the Docker demo does) |

## Project layout

```
messages/            es.json, en.json (all interface text)
src/app/             routes: (auth), (catalog), (account), search, users
src/components/      auth, catalog, personal, i18n, ui
src/i18n/            locale selection, request config, language switch action
src/lib/api/         one typed client per backend resource
src/lib/auth/        session cookie, server actions, role checks
src/proxy.ts         redirects for account and auth pages
```

## Docs

- [`doc/ROADMAP.md`](doc/ROADMAP.md): what's done and what's next
- [`doc/DECISIONS.md`](doc/DECISIONS.md): why things are built the way they are

## Data and licences

Crag locations © OpenStreetMap contributors (ODbL). Route data from theCrag contributors (CC BY-NC-SA). Because of the latter, ClimbingWiki must stay non-commercial.
