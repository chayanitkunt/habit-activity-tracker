# GitHub review and merge evidence

Source: the public repository's GitHub PR pages and GitHub API, checked on 2026-11-05 (Asia/Bangkok). GitHub timestamps below are shown exactly as returned in UTC. The account mapping used in the contribution table is:

- A = Kulchaya Paipinij (`chayongchaya`), student ID `67070503406`.
- B = Chayanit Kuntanarumitkul (`chayanitkunt`), student ID `67070503408`.

## Contract and baseline PRs

| PR | GitHub title | Author | Base <- head | Approval | Merge result |
|---:|---|---|---|---|---|
| [#3](https://github.com/chayanitkunt/habit-activity-tracker/pull/3) | S1-01: Sprint 1 Baseline Documentation | A / `chayongchaya` | `sprint-1-staging` <- `docs/sprint1-baseline` | B / `chayanitkunt`, APPROVED 2026-11-03 18:48:22Z | MERGED 2026-11-03 18:50:50Z; merge `0a4c6e0` |
| [#5](https://github.com/chayanitkunt/habit-activity-tracker/pull/5) | S1-02A: Sprint 1 Engineering Contracts - Part A | A / `chayongchaya` | `sprint-1-staging` <- `docs/sprint1-contracts-a` | B / `chayanitkunt`, APPROVED 2026-11-04 04:58:54Z | MERGED 2026-11-04 05:01:59Z; merge `6fdeec8` |
| [#7](https://github.com/chayanitkunt/habit-activity-tracker/pull/7) | S1-02B Sprint 1 engineering contracts, Part B | B / `chayanitkunt` | `sprint-1-staging` <- `docs/sprint1-contracts-b` | A / `chayongchaya`, APPROVED 2026-11-04 06:55:32Z | MERGED 2026-11-04 07:01:26Z; merge `9f16bde` |
| [#9](https://github.com/chayanitkunt/habit-activity-tracker/pull/9) | S1-02: Sprint 1 Engineering Contracts (Parts A-B) | A / `chayongchaya` | `sprint-1-staging` <- `docs/sprint1-contracts-followup` | B / `chayanitkunt`, APPROVED 2026-11-04 07:22:09Z | MERGED 2026-11-04 07:26:56Z; merge `231c6b6` |

Review comments recorded by GitHub include: PR #3 confirmed traceability, progress cap, daily uniqueness, Asia/Bangkok date boundaries, privacy, SDS and GCP alignment; PR #5 confirmed F-01/F-03/F-05 API, permissions, timezone and STS/E2E mapping; PR #7 confirmed F-11/FR-16 remained Sprint 3, manager `403`, cross-participant `404`, bidirectional AC/STS coverage and conventions/SDS alignment; PR #9 confirmed actual contract hashes, SDS/STS reconciliation and Sprint 3 scope for F-11/FR-16.

## Implementation PRs

| PR | GitHub title | Author | Base <- head | Approval | Merge result |
|---:|---|---|---|---|---|
| [#11](https://github.com/chayanitkunt/habit-activity-tracker/pull/11) | S1-03: Project Skeleton, Config, DB Tooling and Test Harness | B / `chayanitkunt` | `sprint-1-staging` <- `feature/setup-skeleton` | A / `chayongchaya`, APPROVED 2026-11-04 08:49:13Z | MERGED 2026-11-04 08:50:45Z; merge `2404a5e` |
| [#13](https://github.com/chayanitkunt/habit-activity-tracker/pull/13) | Feature/f 01 auth | A / `chayongchaya` | `sprint-1-staging` <- `feature/F-01-auth` | B / `chayanitkunt`, APPROVED 2026-11-04 09:31:50Z | MERGED 2026-11-04 09:33:23Z; merge `aec0891` |
| [#15](https://github.com/chayanitkunt/habit-activity-tracker/pull/15) | Feature-03: create and browse activity templates | B / `chayanitkunt` | `sprint-1-staging` <- `feature/F-02-F-03-templates` | A / `chayongchaya`, APPROVED 2026-11-04 10:26:54Z | MERGED 2026-11-04 10:28:27Z; merge `d712e31` |
| [#18](https://github.com/chayanitkunt/habit-activity-tracker/pull/18) | F-04: Implement Goal Creation API, Validation, and UI | A / `chayongchaya` | `sprint-1-staging` <- `feature/F-04-create-goal` | B / `chayanitkunt`, APPROVED 2026-11-04 10:46:19Z | MERGED 2026-11-04 10:57:24Z; merge `c05f258` |
| [#20](https://github.com/chayanitkunt/habit-activity-tracker/pull/20) | Feature5 : record daily | B / `chayanitkunt` | `sprint-1-staging` <- `feature/F-05-record-daily` | A / `chayongchaya`, APPROVED 2026-11-04 12:41:53Z | MERGED 2026-11-04 12:43:54Z; merge `f65eff3` |
| [#22](https://github.com/chayanitkunt/habit-activity-tracker/pull/22) | Feature 6 : progress history | B / `chayanitkunt` | `sprint-1-staging` <- `feature/F-06-progress-history` | A / `chayongchaya`, APPROVED 2026-11-04 13:12:24Z and 14:10:07Z | MERGED 2026-11-04 14:12:55Z; merge `b73287c` |
| [#25](https://github.com/chayanitkunt/habit-activity-tracker/pull/25) | F-11: Implement Activity Template Editing for Managers | A / `chayongchaya` | `main` <- `feature/F-11-edit-template` | B / `chayanitkunt`, APPROVED 2026-11-04 15:18:41Z | MERGED 2026-11-04 15:21:43Z; merge `4666ff3` |
| [#27](https://github.com/chayanitkunt/habit-activity-tracker/pull/27) | F-11: Implement Activity Template Editing for Managers | A / `chayongchaya` | `sprint-1-staging` <- `feature/F-11-edit-template` | B / `chayanitkunt`, APPROVED 2026-11-04 15:50:31Z | MERGED 2026-11-04 15:52:00Z; merge `7620242` |

Review comments recorded by GitHub include: PR #11 confirmed the Express/Vite skeleton, standard error envelope, environment validation, Docker port mapping and isolated test database; PR #13 confirmed bcrypt, hashed session tokens, cookie attributes, role middleware, migration compatibility and auth tests; PR #15 confirmed database checks, PM-only creation, role-filtered catalog, idempotent seeds and noted that browser E2E should be added once Chromium was available; PR #18 confirmed timezone-aware goal validation and privacy-safe `404` ownership checks; PR #20 confirmed the unique `(goal_id, activity_date)` constraint, `403` versus `404`, Asia/Bangkok injectable clock, range boundaries and concurrent `201`/`409` handling; PR #22 confirmed server-side progress calculation, half-up one-decimal rounding, cap at 100, privacy boundaries, UI states and the complete E2E journey.

For PR #25, GitHub records an approval and merge into `main`, followed by the corrective [PR #28](https://github.com/chayanitkunt/habit-activity-tracker/pull/28), which was approved by B and merged into `main` at 2026-11-04 15:49:02Z with merge `5b99718`; its review explicitly says the revert restored the intended branch workflow. PR #27 is the corrected staging merge.

## Release and closeout PRs

| PR | GitHub title | Author | Base <- head | Approval | Result |
|---:|---|---|---|---|---|
| [#28](https://github.com/chayanitkunt/habit-activity-tracker/pull/28) | Revert F-11 merge from main | A / `chayongchaya` | `main` <- `revert/s1-09-main` | B / `chayanitkunt`, APPROVED 2026-11-04 15:47:46Z | MERGED 2026-11-04 15:49:02Z; merge `5b99718` |
| [#29](https://github.com/chayanitkunt/habit-activity-tracker/pull/29) | docs: Finalize Sprint 1 Release Documentation and Test Evidence | A / `chayongchaya` | `sprint-1-staging` <- `docs/sprint1-release` | B / `chayanitkunt`, APPROVED 2026-11-04 16:20:29Z | MERGED 2026-11-04 16:21:52Z; merge `e3222f4` |
| [#31](https://github.com/chayanitkunt/habit-activity-tracker/pull/31) | release(sprint1): integrate Sprint 1 | A / `chayongchaya` | `main` <- `sprint-1-staging` | B / `chayanitkunt`, APPROVED 2026-11-04 16:35:11Z; closed without merge | CLOSED; superseded by PR #32 |
| [#32](https://github.com/chayanitkunt/habit-activity-tracker/pull/32) | release(sprint1): integrate Sprint 1 | B / `chayanitkunt` | `main` <- `sprint-1-staging` | A / `chayongchaya`, APPROVED 2026-11-04 16:46:00Z | MERGED 2026-11-04 16:47:08Z; merge `5475faa` |

PR #29's review specifically confirmed the README demo, STS counts (8 unit, 44 API/DB, 3 E2E), raw logs, documentation-only scope and no changes to application code or the S1-01 baseline. PR #32's review specifically confirmed the same test counts, M-01/M-02, RBAC/privacy, Sprint 3 scope for F-11/FR-16, README alignment and readiness for release tagging.

## Release tag

GitHub release [Sprint 1 Release](https://github.com/chayanitkunt/habit-activity-tracker/releases/tag/v0.1.0-sprint1) is tagged `v0.1.0-sprint1` at full commit `5475faabca23ee74ecfb28428289dfbb075116cb`, published 2026-11-04 16:48:49Z. This is the same merge commit as PR #32.
