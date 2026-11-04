# Sprint 1 history evidence

Release code was tested before the release tag. The tagged release is `v0.1.0-sprint1` at commit `5475faa` (`release(sprint1): integrate Sprint 1 (#32)`). The S1-10 test run was performed on staging commit `7620242`; the later commits `e3222f4` and `5475faa` contain the release integration and do not change the tested feature code other than the documented release merge.

| Area | Test-design or contract commit | Implementation/integration commit | Evidence |
|---|---|---|---|
| S1-03 setup | `7f4f91f` | `7f4f91f` | Project skeleton and test harness |
| F-01 auth | `28f75fa` | `589172e`, `11b5729` | Auth acceptance tests and session contract fixes |
| F-02/F-03 templates | contract history `9f16bde` | `2620169` | Create/browse templates |
| F-04 goals | `015f923`, `66a4575` | `db13132` | Goal validation and inactive-template coverage |
| F-05 records | `7f3f6a3` | implementation commit recorded in branch history | Duplicate, date, range and ownership tests |
| F-06 progress/history | `14d42e3` | `037fc27` | Progress calculation and journey tests |
| F-03 edit template | contract alignment `bc454cf` | `6337c49`, integrated at `7620242` | Manager-only metadata update |
| S1-10 release docs | — | `fea196a`, `d379929`, `e3222f4`, `5475faa` | Demo, test results and release integration |

The repository does not preserve a separate raw red-log file for every feature. This report therefore identifies the recorded test-design commits without claiming unavailable red-output evidence.
