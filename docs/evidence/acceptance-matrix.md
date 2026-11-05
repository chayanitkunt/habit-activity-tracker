# Sprint 1 acceptance evidence matrix

Results below refer to the S1-10 run recorded in `docs/sprints/sprint-1/sts.md`, tested on staging commit `7620242`.

| Contract area | Acceptance/test IDs | Actual test file(s) | Result |
|---|---|---|---|
| F-01 authentication | AC-01..AC-07 | `api/tests/api/auth.test.ts`, `e2e/auth.spec.ts` | PASS where covered; AC-02a has no automated test and AC-06/07 are partial (see rows) |
| F-02 create/access | AC-23..AC-30 | `api/tests/api/templates.create.test.ts`, `api/tests/api/templates.list.test.ts` | PASS; role visibility and persistence covered |
| F-03 browse/edit | AC-31..AC-38, AC-17..AC-22 | `api/tests/api/templates.list.test.ts`, `api/tests/api/templates.update.test.ts` | PASS; unit immutability and manager-only edit covered |
| F-04 goals | AC-39..AC-44 | `api/tests/api/goals.test.ts`, `api/tests/unit/goal.validator.test.ts` | PASS where covered; AC-43 has no automated test and AC-44 has build/E2E-only evidence |
| F-05 records | AC-08..AC-16 | `api/tests/api/records.test.ts`, `api/tests/unit/record.validator.test.ts` | PASS; duplicate, date and range cases covered |
| F-06 progress | AC-45..AC-47 | `api/tests/api/progress.test.ts`, `api/tests/unit/progress.test.ts` | PASS; persisted calculation, cap and rounding covered |
| F-07 history/views | AC-48..AC-50 | `e2e/journey.spec.ts` and goal-page implementation | PASS where covered; AC-50 has build/E2E-only evidence |
| Cross-cutting security | TEST-24, TEST-25, M-01, M-02 | `e2e/journey.spec.ts`, `docs/evidence/manual-checks-7620242.md` | PASS |

Current automated-test inventory after the rounding and cumulative-target regressions: build pending re-run; unit 9 tests; API/database 45 tests; E2E 3 tests. The historical S1-10 result at `7620242` remains 8/8 unit, 44/44 API/database, and 3/3 E2E. Manual checks are reported separately.

## Detailed per-AC execution map

This table expands the grouped summary above into one row per Sprint 1 acceptance criterion. `PASS` refers to the recorded S1-10 run on `7620242`; UI/component rows are covered by the production build and the selected E2E journey where stated.

| AC | Planned test ID | Actual test file/name | Result |
|---|---|---|---|
| AC-01 | TEST-01 | `api/tests/api/auth.test.ts` - valid login | PASS |
| AC-02 | TEST-02 | `api/tests/api/auth.test.ts` - generic invalid credentials | PASS |
| AC-02a | TEST-02a | No automated test | No test |
| AC-03 | TEST-03 | `api/tests/api/auth.test.ts` - current user | PASS |
| AC-04 | TEST-04 | `api/tests/api/auth.test.ts` - missing/revoked/expired session | PASS |
| AC-05 | TEST-05 | `api/tests/api/auth.test.ts` - logout and session reuse | PASS |
| AC-06 | TEST-06 | `api/tests/api/auth.test.ts` — `TEST-01.6 / AC-01.6 stores bcrypt hashes rather than plaintext passwords` | PASS for bcrypt storage only; no log inspection test |
| AC-07 | TEST-07 | `api/tests/api/auth.test.ts` — `TEST-01.1 / AC-01.1 valid login returns safe user and sets a secure session cookie` | PASS for `HttpOnly` and `SameSite=Lax` only; no `Secure` or expiry assertion |
| AC-08 | TEST-08 | `api/tests/api/records.test.ts` - save and retrieve record | PASS |
| AC-09 | TEST-09 | `api/tests/api/records.test.ts` - Manager record rejection | PASS |
| AC-10 | TEST-10 | `api/tests/api/records.test.ts` - cross-participant record rejection | PASS |
| AC-11 | TEST-11 | `api/tests/api/records.test.ts` - future date | PASS |
| AC-12 | TEST-12 | `api/tests/api/records.test.ts` - date outside goal | PASS |
| AC-13 | TEST-13, TEST-13a | `api/tests/api/records.test.ts`; `api/tests/unit/record.validator.test.ts` - inclusive bounds | PASS |
| AC-14 | TEST-14 | `api/tests/api/records.test.ts` — `TEST-05.4 / AC-05.4 maps duplicate records to 409 and database rejects a direct duplicate` | PASS |
| AC-15 | TEST-15 | `api/tests/api/records.test.ts` - two goals same template/date | PASS |
| AC-16 | TEST-16 | `api/tests/api/records.test.ts` - malformed date/quantity | PASS |
| AC-17 | TEST-17 | `api/tests/api/templates.update.test.ts` - Manager metadata update | PASS |
| AC-18 | TEST-18 | `api/tests/api/templates.update.test.ts` - Participant gets 403 | PASS |
| AC-19 | TEST-19 | `api/tests/api/templates.update.test.ts` - unit immutable | PASS |
| AC-20 | TEST-20 | `api/tests/api/templates.update.test.ts` - invalid update variants | PASS |
| AC-21 | TEST-21 | `api/tests/api/templates.update.test.ts` - existing records preserved | PASS |
| AC-22 | TEST-22 | `api/tests/api/templates.update.test.ts` - unknown ID/unauthenticated | PASS |
| AC-23 | TEST-26 | `api/tests/api/auth.test.ts`, `goals.test.ts`, `records.test.ts`, `templates*.test.ts`, `progress.test.ts` - protected requests | PASS |
| AC-24 | TEST-27 | `api/tests/api/templates.create.test.ts`, `templates.update.test.ts` - Participant template operations | PASS |
| AC-25 | TEST-28 | `api/tests/api/goals.test.ts`, `records.test.ts`, `progress.test.ts` - Manager goal-related access | PASS |
| AC-26 | TEST-29 | `api/tests/api/goals.test.ts`, `records.test.ts`, `progress.test.ts` - cross-participant privacy | PASS |
| AC-27 | TEST-30, TEST-25 | `e2e/journey.spec.ts`, `api/tests/api/templates.update.test.ts` - safe role denial | PASS |
| AC-31 | TEST-31 | `api/tests/api/templates.create.test.ts` - valid Manager template | PASS |
| AC-32 | TEST-32 | `api/tests/api/templates.create.test.ts` - invalid template input | PASS |
| AC-33 | TEST-33 | `api/tests/api/templates.create.test.ts` - Participant create rejection | PASS |
| AC-34 | TEST-34 | No automated test (`web/src/components/TemplateForm.tsx`; verified by build/E2E only) | No automated test (verified by build/E2E only) |
| AC-35 | TEST-35 | `api/tests/api/templates.list.test.ts` - Participant active catalog | PASS |
| AC-35a | TEST-35a | `api/tests/api/templates.list.test.ts` - Manager active/inactive catalog | PASS |
| AC-36 | TEST-36 | `api/tests/api/templates.list.test.ts` - inactive visibility | PASS |
| AC-37 | TEST-37 | `api/tests/api/templates.list.test.ts` - unauthenticated catalog | PASS |
| AC-38 | TEST-38 | No automated test (`web/src/components/TemplateSelector.tsx`, `TemplatesPage.tsx`; verified by build/E2E only) | No automated test (verified by build/E2E only) |
| AC-39 | TEST-39 | `api/tests/api/goals.test.ts` - valid goal owner | PASS |
| AC-40 | TEST-40 | `api/tests/api/goals.test.ts` - Manager goal rejection | PASS |
| AC-41 | TEST-41 | `api/tests/api/goals.test.ts` - missing/inactive template | PASS |
| AC-42 | TEST-42, TEST-42a | `api/tests/api/goals.test.ts`, `api/tests/unit/goal.validator.test.ts` - invalid goal | PASS |
| AC-43 | TEST-43 | No automated test | No test |
| AC-44 | TEST-44 | No automated test (`web/src/pages/NewGoalPage.tsx`, `GoalsPage.tsx`; verified by build/E2E only) | No automated test (verified by build/E2E only) |
| AC-45 | TEST-45 | `api/tests/unit/progress.test.ts` - formula/rounding/cap | PASS |
| AC-46 | TEST-46 | `api/tests/api/progress.test.ts` - empty goal | PASS |
| AC-47 | TEST-47 | `api/tests/api/progress.test.ts`, `records.test.ts` - independent goals | PASS |
| AC-48 | TEST-48 | `api/tests/api/progress.test.ts`, `e2e/journey.spec.ts` - owner history/progress | PASS |
| AC-49 | TEST-49 | `api/tests/api/progress.test.ts`, `goals.test.ts`, `records.test.ts` - Manager/other participant restriction | PASS |
| AC-50 | TEST-50 | No automated test (`web/src/pages/GoalPage.tsx`, `ProgressBar.tsx`, `HistoryTable.tsx`; verified by build/E2E only) | No automated test (verified by build/E2E only) |

The original contracts intentionally leave AC-28 to AC-30 and TEST-23 unassigned; they are not missing rows. This is recorded in `contract-history.md` and preserves the reviewed ID sequence.
