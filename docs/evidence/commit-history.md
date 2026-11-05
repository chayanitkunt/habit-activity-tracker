# Sprint 1 history evidence

Release code was tested before the release tag. The tagged release is `v0.1.0-sprint1` at commit `5475faa` (`release(sprint1): integrate Sprint 1 (#32)`). The S1-10 test run was performed on staging commit `7620242`; the later commits `e3222f4` and `5475faa` contain the release integration and do not change the tested feature code other than the documented release merge.

| Area | Test-design or contract commit | Implementation/integration commit | Evidence |
|---|---|---|---|
| S1-03 setup | `7f4f91f` | `7f4f91f` | Project skeleton and test harness |
| F-01 auth | `28f75fa` | `589172e`, `11b5729` | Auth acceptance tests and session contract fixes |
| F-02/F-03 templates | contract history `9f16bde` | `2620169` | Create/browse templates; GitHub PR #15 contains one implementation commit rather than a separate recorded red-test commit |
| F-04 goals | `015f923`, `66a4575` | `db13132` | Goal validation and inactive-template coverage |
| F-05 records | `7f3f6a3` | `0ea95c1`, `e1707e6` | API/validator and record-form implementation; merged by PR #20 at `f65eff3` |
| F-06 progress/history | `14d42e3` | `037fc27`, `19f9a3c`, `05234e3` | Progress endpoint, goal page/journey, and UI work; merged by PR #22 at `b73287c` |
| F-03 edit template | contract alignment `bc454cf` | `6337c49`, `95dc02a`, `bc454cf`, `2d1da88`, `be05bd2`, `d45b800` | Manager-only metadata update and contract/UI alignment; merged by PR #27 at `7620242` |
| S1-10 release docs | — | `fea196a`, `d379929`, `e3222f4`, `5475faa` | Demo, test results and release integration |

Raw red/green logs are preserved for the sampled F-04 and F-05 rule work in `docs/evidence/red-green-F04.log.md` and `red-green-F05.log.md`. A separate red log was not reconstructed for every feature, so no unavailable red output is claimed for the remaining features.
