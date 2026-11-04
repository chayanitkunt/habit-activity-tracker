# Sprint 1 contract history

This log records the actual merge commit for each contract. A row is added only after the relevant documentation PR is merged; a commit hash is never invented or substituted with an implementation commit.

| Date (Asia/Bangkok) | Merge commit hash | Change | Justification |
|---|---|---|---|
| 2026-11-04 | 9f16bde | `conventions.md` | Shared error/status/check-order contract merged before S1-03. |
| 2026-11-04 | 9f16bde | F-02 access-control contract | Specification merged before F-02 implementation. |
| 2026-11-04 | 9f16bde | F-03 create/browse contracts | Specification merged before F-03 implementation; edit contract remains S1-02A. |
| 2026-11-04 | 9f16bde | F-04 create-goal contract | Specification merged before F-04 implementation. |
| 2026-11-04 | 9f16bde | F-06/F-07 progress-history contract | Specification merged before F-06 implementation. |
| 2026-11-04 | 9f16bde | `dod.md` and history log | Product completion/evidence standard merged with S1-02B. |
| 2026-11-04 | Pending merge | Clarified manager goal access, malformed-ID/unknown-route behavior, test levels, and validator unit coverage | Locks Manager goal endpoints to 403 before ownership lookup; distinguishes malformed IDs (400) from missing/inaccessible IDs (404); adds validator unit tests; aligns test levels in F-01, F-03-edit, F-05, and `sts.md` with shared conventions. |

## Recording procedure

After each merge to `sprint-1-staging`, update the corresponding `Pending merge` cell with that PR's merge commit hash in a separate documentation commit. Preserve the row date, describe any scope change, and state its justification. This follow-up is evidence logging; it must not alter an already approved contract silently.

## Reserved IDs

`AC-28` through `AC-30` are intentionally unassigned. `TEST-23` is intentionally unassigned; `TEST-24` and `TEST-25` are the selected E2E/UI tests owned by S1-02A. The gaps avoid renumbering already reviewed Part A identifiers.
