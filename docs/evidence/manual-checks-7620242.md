# Sprint 1 manual checks

Tested code commit: `7620242`

## M-01 — no secrets (manual)

PASS. Reviewed tracked files, `.gitignore`, `.env.example`, generated test logs, and test output. No real secrets, passwords, session tokens, or production credentials were committed or logged. Seed credentials are supplied only through the local `SEED_DEMO_PASSWORD` environment variable.

## M-02 — clean setup (manual)

PASS. Started the repository PostgreSQL service, ran migrations and seed, then ran the documented build, unit, API/database, and E2E commands. The results are recorded in `docs/sprints/sprint-1/sts.md`; raw command output is stored beside this file.
