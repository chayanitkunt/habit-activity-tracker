# Sprint 1 program demonstrations

Release under demonstration: `v0.1.0-sprint1` at `5475faa`. The README contains the reproducible local demo sequence. The records below identify the role, starting state, steps and expected/actual result without claiming screenshots that are not stored in this repository.

## D-01 - Normal domain journey and persistence

- Feature/AC: F-01, F-03, F-04, F-05, F-06/F-07; AC-01, AC-31, AC-39, AC-08, AC-45, AC-48.
- Role: Program Manager creates the shared template; Participant Alice creates a personal goal and record.
- Starting state: local PostgreSQL database migrated and seeded; `pm1@example.com`, `alice@example.com` and `bob@example.com` exist; no real credentials are stored in Git.
- Steps: log in as manager; create a study template; log out; log in as Alice; select the template; create a total-period goal; record a valid value; open progress/history; restart the app; retrieve the same goal, record and computed progress.
- Expected result: the template, owner-bound goal, daily record, progress and history are persisted; progress is calculated from stored records.
- Actual result: the selected E2E journey passed on tested commit `7620242`; the saved result remained available after reload. Evidence: `sprint1-test-e2e-7620242.log`, `e2e/journey.spec.ts`.

## D-02 - Business-rule rejection

- Feature/AC: F-05; AC-14; BR-07; TEST-05.4.
- Role: Participant Alice.
- Starting state: Alice owns a goal and already has one record for the selected calendar date.
- Steps: submit a second record for the same goal and date; inspect the response and then retrieve the record.
- Expected result: `409 DUPLICATE_DAILY_RECORD`; the first quantity remains unchanged; the database unique constraint rejects a direct duplicate.
- Actual result: API/DB tests and the persisted E2E journey passed; the test source asserts one `201` and one `409` for simultaneous duplicate requests. Evidence: `test-excerpts.md`, `sprint1-test-api-7620242.log`, `sprint1-test-e2e-7620242.log`.

## D-03 - Login/logout and forbidden operation

- Feature/AC: F-01, F-02, F-03 edit; AC-05, AC-18, AC-25/26; TEST-05, TEST-18, TEST-28/29.
- Role: Alice attempts to edit a shared template; a Program Manager attempts to access a participant goal.
- Starting state: Alice has a valid session; the template and a private participant goal exist.
- Steps: log in; call `PATCH /api/activity-templates/:id` as Alice; call a goal/record/progress endpoint with a Manager session or another participant's session; log out; retry a protected request.
- Expected result: Participant template edit returns `403 ROLE_FORBIDDEN`; Manager goal-related access returns `403`; another participant's private resource returns `404`; logout makes the session unusable with `401`.
- Actual result: API/DB and E2E tests passed on `7620242`. Evidence: `api/tests/api/templates.update.test.ts`, `api/tests/api/goals.test.ts`, `api/tests/api/auth.test.ts`, `sprint1-test-api-7620242.log`.

## Screenshot status

The repository currently contains textual logs and test-source evidence, but no captured PNG/JPG screen dumps or GitHub/board screenshots. If the course marking process requires image evidence, capture the three scenarios above and add captions using the IDs and release commit already recorded here. Do not describe an uncaptured screenshot as present.
