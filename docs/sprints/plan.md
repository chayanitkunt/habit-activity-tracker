# Three-sprint plan — Part D

## Sprint 1 — Recording baseline

Goal: deliver a secure, testable study-habit recording flow with private participant history, manager-owned templates, valid daily records, and computed progress.

Features: F-01 through F-10 (with F-11 specified but deferred to S3).

Dependencies: S1-00 repository/staging baseline; relational schema; authentication/session design; API and UI skeleton; local PostgreSQL test database. CI is Lab 5 work.

Completion outcome: SRS, feature inventory, traceability, SDS, API contracts, role matrix, migrations/seed approach, and a working vertical slice for login → template selection → goal → daily record → history/progress. All FR/BR/NFR IDs are mapped, duplicate records are rejected, dates use `APP_TIMEZONE`, and cross-participant/manager privacy tests pass.

Why feasible: the context is deliberately one domain (study habits), the data model has five core entities, goal mutation and notifications are excluded, and the progress calculation is deterministic. Shared validation and a small endpoint set keep the implementation bounded.

Remaining work: goal revisions, streaks, richer summaries, reminder representation, performance hardening, production deployment, and recovery exercise.

## Sprint 2 — Goal evolution and insights

Goal: support controlled goal revisions and useful history summaries without compromising the immutable record audit trail.

Features: extend F-04, F-06, F-07, and F-10.

Dependencies: Sprint 1 goal/record schema and ownership; decision on revision effective dates; performance baseline.

Completion outcome: versioned goal revisions with explicit effective dates, streak/history logic, summary views, migration coverage, and NFR-01 performance evidence.

Remaining work: reminder/schedule representation and deployment/recovery evidence.

## Sprint 3 — Reminder placeholders and production readiness

Goal: represent reminder schedules and complete deployable operational foundations without sending notifications.

Features: F-11 and remaining F-10 work; FR-16 and NFR-07.

Dependencies: Sprint 2 goal revision semantics; TA scope decision AD-17; Cloud deployment accounts and Secret Manager.

Completion outcome: schedule placeholder API/UI/data model, explicit no-notification behavior, GCP deployment pipeline, managed secrets, backup/restore evidence, and operational documentation.

Remaining work: any future notification provider, channels, consent/opt-in, and sharing policy require a new approved scope decision.

## Cross-document completion check

Every FR-01..FR-16, BR-01..BR-11, and NFR-01..NFR-07 has an entry in `srs.md`, a feature/sprint mapping in `features.md`, and an AC/test mapping in `traceability.md`. The SDS covers all Sprint 1 endpoints, ownership, check order, authentication, deployment components, and UI states. Approved changes and the Thursday workshop answer for F-11 are recorded as AD-01..AD-17.

