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

## Accounts and invites

Uploading torrents, managing categories, and creating invites require an account. Registration is invite-only, and each invite code can be used once.

Set a private bootstrap code in `.env` before creating the first account:

```dotenv
INITIAL_INVITE_CODE=replace-with-a-long-random-code
```

Open `/register` and use that code for the first account. After logging in, use the Invites page to generate single-use codes for other users. Remove `INITIAL_INVITE_CODE` from the environment after the first account has been created; the redeemed code cannot be reused even if the setting remains present.

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
