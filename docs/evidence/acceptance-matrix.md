# Sprint 1 acceptance evidence matrix

Results below refer to the S1-10 run recorded in `docs/sprints/sprint-1/sts.md`, tested on staging commit `7620242`.

| Contract area | Acceptance/test IDs | Actual test file(s) | Result |
|---|---|---|---|
| F-01 authentication | AC-01..AC-07 | `api/tests/api/auth.test.ts`, `e2e/auth.spec.ts` | PASS; included in 44 API and 3 E2E tests |
| F-02 create/access | AC-23..AC-30 | `api/tests/api/templates.create.test.ts`, `api/tests/api/templates.list.test.ts` | PASS; role visibility and persistence covered |
| F-03 browse/edit | AC-31..AC-38, AC-17..AC-22 | `api/tests/api/templates.list.test.ts`, `api/tests/api/templates.update.test.ts` | PASS; unit immutability and manager-only edit covered |
| F-04 goals | AC-39..AC-44 | `api/tests/api/goals.test.ts`, `api/tests/unit/goal.validator.test.ts` | PASS; one-day, ownership and inactive-template cases covered |
| F-05 records | AC-08..AC-16 | `api/tests/api/records.test.ts`, `api/tests/unit/record.validator.test.ts` | PASS; duplicate, date and range cases covered |
| F-06 progress | AC-45..AC-47 | `api/tests/api/progress.test.ts`, `api/tests/unit/progress.test.ts` | PASS; persisted calculation, cap and rounding covered |
| F-07 history/views | AC-48..AC-50 | `e2e/journey.spec.ts` and goal-page implementation | PASS in selected journey; see STS for scope |
| Cross-cutting security | TEST-24, TEST-25, M-01, M-02 | `e2e/journey.spec.ts`, `docs/evidence/manual-checks-7620242.md` | PASS |

Automated result totals: build PASS; unit 8/8; API/database 44/44; E2E 3/3; zero reported failures or skips. Manual checks are reported separately.
