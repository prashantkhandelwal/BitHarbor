---
title: BitHarbor
description: SvelteKit scaffold for browsing and hosting torrent metadata
---

## Overview

BitHarbor is a SvelteKit application for browsing, searching, and hosting
torrent metadata. It provides magnet links and leaves peer discovery,
downloading, and seeding to torrent clients and external trackers.

## Local Development

Install Node.js 22 or later, then run:

```powershell
npm install
npm run dev
```

Open <http://localhost:5173>.

## Validation

```powershell
npm run check
npm run build
```

## Database

SQLite is the default and requires no configuration. It stores data in
`bitharbor.db` in the project directory and creates the initial table when the
application starts. To use another file, copy `.env.example` to `.env` and
change `DATABASE_URL`.

Generate and apply migrations after changing a database schema:

```powershell
npm run db:generate
npm run db:migrate
```

To use PostgreSQL, set both database variables in `.env`:

```dotenv
DATABASE_TYPE=postgres
DATABASE_URL=postgres://bitharbor:bitharbor@localhost:5432/bitharbor
```

Apply the PostgreSQL migration before starting the application. Generated
SQLite migrations are written to `drizzle/sqlite`; PostgreSQL migrations are
written to `drizzle/postgres`.

`DATABASE_TYPE` accepts `sqlite` or `postgres`. An unset value selects SQLite.

Browse, search, detail, and API reads use the selected database. Object storage
and torrent parser boundaries are scaffolded but are not connected to uploads
yet.

## Container

```powershell
docker build -t bitharbor .
docker run --rm -p 3000:3000 bitharbor
```
