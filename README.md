# Habit & Activity Tracker

Sprint 1 foundation for the CPE334 Habit and Activity Tracking System. This setup supplies API and web shells, PostgreSQL tooling, and smoke-test harnesses; it intentionally contains no Sprint 1 feature endpoints.

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

`DATABASE_URL` identifies the development database and `TEST_DATABASE_URL` identifies the isolated database erased by the migration smoke test. Never point the test URL to data you need. Required application variables are `SESSION_SECRET`, `DATABASE_URL`, `SESSION_MAX_AGE_HOURS`, `APP_TIMEZONE`, and `SEED_DEMO_PASSWORD`; startup fails fast if they are absent or invalid.

## Run and verify

```sh
npm run dev
npm --workspace web run dev
npm run build
npm test
npm run test:e2e # first run: npx playwright install
```

`npm run migrate` applies SQL migrations transactionally. `npm run seed` is safe to repeat; demo data will arrive with feature-owned schema migrations. `.env` is ignored by Git. The API’s unknown-route response follows the Sprint 1 contract: `404 ROUTE_NOT_FOUND` in the standard error envelope.
