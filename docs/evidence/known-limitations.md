# Sprint 1 known limitations and incomplete work

These items are intentionally disclosed and are not presented as completed Sprint 1 behavior:

- No registration, password reset, rate limiting or CSRF tokens beyond the SameSite cookie policy.
- No goal or daily-record edit/delete in Sprint 1.
- F-11/FR-16 remains the S1-01 Sprint 3 reminder/schedule placeholder; Sprint 1 sends no notifications.
- Template unit remains immutable in Sprint 1. Further unit-lock and activation/deactivation UI refinements are deferred as stated by the contract.
- Docker production packaging, CI/CD and GCP deployment are Lab 5 work; the Sprint 1 evidence is local build/test evidence.
- A separate raw red log was not preserved for every feature, so the evidence names the test-design and green implementation commits without claiming unavailable red output.
- The repository currently has textual program/workflow evidence but no PNG/JPG screenshots or board screenshot. This must remain disclosed if visual evidence is requested.
- The release's recorded S1-10 run reports 8 unit, 44 API/DB and 3 E2E tests passing with zero reported failures or skips; a later local recheck initially encountered a stopped PostgreSQL service and passed after the service was started.
