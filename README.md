# Habit & Activity Tracker

Sprint 1 implementation for the CPE334 Habit and Activity Tracking System. The selected context is study habits (Theme 8). Participants create personal total-period goals, record one valid activity per goal/day, and review private progress/history. Program Managers maintain the shared activity-template catalog but cannot access participant goals, records, progress, or history.

## Prerequisites

- Node.js 22.x or 24.x (see `package.json`)
- PostgreSQL 16+, installed locally or started using Docker Compose

Docker Compose is optional when PostgreSQL is already installed. To start only the database (published on host port 5433 to avoid an existing local PostgreSQL service on 5432):

```sh
docker compose up -d --wait postgres
```

## Configure and prepare the database

Install dependencies, then create a local environment file. The example values are intentionally synthetic.

```sh
npm install
cp .env.example .env
createdb habit_tracker_test
npm run migrate
npm run seed
```

With Docker Compose, ensure the separate test database exists (safe to repeat):

```sh
docker compose exec -T postgres sh -c "psql -U habit -d habit_tracker -tAc \"SELECT 1 FROM pg_database WHERE datname = 'habit_tracker_test'\" | grep -q 1 || createdb -U habit habit_tracker_test"
```

`DATABASE_URL` identifies the development database and `TEST_DATABASE_URL` identifies the isolated database erased by the migration smoke test. Never point the test URL to data you need. Required application variables are `SESSION_SECRET`, `DATABASE_URL`, `SESSION_TTL`, `APP_TIMEZONE`, and `SEED_DEMO_PASSWORD`; startup fails fast if they are absent or invalid.

## Sprint 1 authentication

The seeded users are `pm1@example.com`, `alice@example.com`, and `bob@example.com`; all use
the configured `SEED_DEMO_PASSWORD`. Authentication uses server-side sessions with hashed
opaque tokens and a 24-hour default lifetime. Login and logout are under `/api/auth`; the
current-user endpoint is available at both `/api/auth/me` and the baseline-compatible `/api/me`.

Registration, password reset, rate limiting, and CSRF tokens beyond the SameSite cookie policy
are outside the S1-04 scope and remain known limitations.

## Sprint 1 demo sequence

Use a local seeded database only. Do not publish the configured `SEED_DEMO_PASSWORD`; each seeded account uses the password from the local `.env` file.

1. Start PostgreSQL, apply migrations, and seed the local database:

   ```sh
   docker compose up -d --wait postgres
   npm run migrate
   npm run seed
   ```

2. Start the API and web client with `npm run dev` and `npm --workspace web run dev`.
3. Sign in as `pm1@example.com` and create a study template, for example `Reading Pages`, unit `pages`, minimum `0`, and maximum `100`.
4. Log out. Sign in as `alice@example.com`, select `Reading Pages`, create a goal with target `100`, and choose a start/end calendar date that is today or earlier in `APP_TIMEZONE`.
5. Record `50` for the selected goal and date. Confirm the page shows `50.0%` progress and one history row.
6. Submit another record for the same goal and date. Confirm the request is rejected with the duplicate-entry message (`409 DUPLICATE_DAILY_RECORD`) and the original record remains unchanged.
7. Stop and restart the API/web processes, sign in again as Alice, and confirm the goal, `50.0%` progress, and history row persist.
8. Verify the forbidden operation: while signed in as Alice, no template edit control is shown. If the API is called directly, `PATCH /api/templates/:id` returns `403 ROLE_FORBIDDEN` and the template is unchanged.
9. Log out and confirm the session is cleared.

The manager and participant histories remain private. F-11/FR-16 is still the Sprint 3 reminder/schedule placeholder; Sprint 1 sends no notifications.

## Run and verify

```sh
npm run dev
npm --workspace web run dev
npm run build
npm test
npm run test:e2e # first run: npx playwright install
```

`npm run migrate` applies SQL migrations transactionally. `npm run seed` is safe to repeat and creates the local demo data. `.env` is ignored by Git. The API’s unknown-route response follows the Sprint 1 contract: `404 ROUTE_NOT_FOUND` in the standard error envelope.
