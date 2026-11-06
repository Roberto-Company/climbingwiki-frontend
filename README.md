# ClimbingWiki — frontend

Web client for **ClimbingWiki**, a community wiki and logbook for rock climbing: zones → crags → sectors → routes → pitches, with grades, ratings, comments, photos, route lists and a personal logbook.

> Portfolio project. Not a production service. The API lives in [climbingwiki-backend](https://github.com/Roberto-Company/climbingwiki-backend).

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a custom palette (chalk, moss, ochre) and Fraunces/Inter typography
- **next-intl**: Spanish and English, switched from the header
- **Vitest** for unit tests

## Features

- Browse the catalog from zone to pitch, with route type, grade and length badges
- Search routes, crags and zones
- Accounts: register, log in, email verification and password reset (demo mode, no email is sent)
- Personal layer: favorites, half-star ratings, threaded comments, photos, route lists, logbook, following other climbers, public profiles
- Loading, error and 404 pages; data attribution shown once per page

## Run locally

Requires Node 24 and the backend running on `http://localhost:8080` (see the backend README).

```bash
cp .env.example .env.local   # then adjust if needed
npm install
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint |

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
