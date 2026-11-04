# Product Definition of Done — Sprint 1

Work is Done only when all applicable conditions have evidence linked from its issue/PR:

- Approved contract behavior is implemented without unapproved scope changes.
- Planned verification is executed; meaningful unit, API/database, authorization, boundary/negative, and selected E2E tests pass.
- Test results identify commands, tested commit, and outcome. A prior failing TDD test fails on an assertion, not a missing module.
- The implementation and contract have a teammate review, a specific review record, and completed integration into `sprint-1-staging`.
- Setup, migrations, API behavior, and user-facing documentation are current and reproducible from a clean checkout.
- Secrets and real personal data are absent from source, tests, evidence, and logs.
- Incomplete work, skipped checks, risks, and deviations are disclosed as limitations; they are never represented as complete.
- Completion is demonstrated by commits, PR/review records, test output, and runnable behavior—not an AI claim.

A feature contract is merged before its feature implementation PR. Contract-history records the actual merged contract hash as specification-before-code evidence.
