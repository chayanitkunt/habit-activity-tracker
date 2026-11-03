# Sprint 1 Software Test Specification

## Scope and test evidence

This STS covers the requested contracts F-01, F-05, and the template-editing contract stored in `F-03-edit-template.md`. F-11 remains the S1-01 reminder/schedule placeholder. Tests are planned at unit, API/integration, database, and selected UI/end-to-end levels. Each test records its precondition, action, and observable result. Actual test file names, command output, pass/fail counts, and tested commit must be filled in when implementation exists; this document is the pre-implementation contract.

## Test cases

| ID | AC | Level | Preconditions / input | Action | Expected result |
|---|---|---|---|---|---|
| TEST-01 | AC-01 | API integration | Seeded Participant credentials are valid. | POST login with correct credentials. | 200, secure session cookie, correct safe user/role. |
| TEST-02 | AC-02 | API integration | Unknown email or wrong password. | POST login. | 401 `INVALID_CREDENTIALS`; no account-existence detail. |
| TEST-03 | AC-03 | API integration | Participant A session active. | GET `/api/me`. | 200 with A's safe identity only. |
| TEST-04 | AC-04 | API integration | No cookie, revoked session, and expired session cases. | Call `/api/me` and a protected endpoint. | 401; no private response body. |
| TEST-05 | AC-05 | API integration | Active session exists. | POST logout, then reuse cookie. | First response 204; subsequent protected call 401. |
| TEST-06 | AC-06 | Unit/security | User created through seed/service. | Inspect stored password and captured logs. | bcrypt hash only; no plaintext password or credential log. |
| TEST-07 | AC-07 | API integration | Successful login over configured environment. | Inspect `Set-Cookie`. | `HttpOnly`, `SameSite=Lax`, `Secure` outside local development, correct expiry. |
| TEST-08 | AC-08 | API/database integration | Participant owns a valid goal; date is in period; quantity is in range. | POST one record, then GET records. | 201 and the same persisted record is returned. |
| TEST-09 | AC-09 | API authorization | Program Manager session and participant goal. | POST record for that goal. | 403 `ROLE_FORBIDDEN`; no record stored. |
| TEST-10 | AC-10 | API authorization | Participant A session; Participant B goal. | POST record using B's goal ID. | 404 privacy-safe denial; no record or B data exposed. |
| TEST-11 | AC-11 | API validation | Goal is active; tomorrow is generated in `Asia/Bangkok`. | POST record with future date. | 400 `INVALID_ACTIVITY_DATE`. |
| TEST-12 | AC-12 | API validation | Goal has inclusive start/end dates. | POST before start and after end. | Each request returns 400; no row stored. |
| TEST-13 | AC-13 | Unit/API boundary | Template range is inclusive `[0, 500]`. | Submit 0, 500, -0.01, and 500.01. | Boundary values accepted; outside values rejected with 400. |
| TEST-14 | AC-14 | API/database integration | One record already exists for goal/date. | POST a second quantity for same goal/date. | 409 `DUPLICATE_DAILY_RECORD`; first quantity unchanged. |
| TEST-15 | AC-15 | Database integration | Two goals use the same template and date. | POST one record to each goal. | Both inserts succeed and remain independently queryable. |
| TEST-16 | AC-16 | API validation | Bad date syntax and non-numeric quantity. | POST malformed payloads. | 400 stable error shape; no partial insert. |
| TEST-17 | AC-17 | API/database integration | Manager session and active template. | PATCH allowed metadata. | 200; reload shows persisted update. |
| TEST-18 | AC-18 | API authorization | Participant session and shared template. | PATCH template metadata. | 403 `ROLE_FORBIDDEN`; template unchanged. |
| TEST-19 | AC-19 | API validation/database | Existing template has unit `pages`. | PATCH with `unit: "hours"` or same unit. | 400 `UNIT_IMMUTABLE`; stored unit remains `pages`. |
| TEST-20 | AC-20 | API/database integration | Manager session and active template. | Submit empty name, min > max, unknown field, and malformed decimal. | 400 for each; no partial update. |
| TEST-21 | AC-21 | Database integration | Goal and record reference template. | Apply allowed template metadata update and reload goal/record. | Foreign keys and historical unit meaning remain intact. |
| TEST-22 | AC-22 | API authorization | Manager requests absent/inaccessible template ID. | PATCH unknown ID. | 404 `TEMPLATE_NOT_FOUND`; no private resource detail. |
| TEST-23 | AC-23 | Database/API integration | Two manager updates use the same version/lock token. | Submit both updates concurrently. | One succeeds; conflicting request returns 409; no silent lost update. |
| TEST-24 | AC-01, AC-08, AC-14 | UI/E2E | Seeded accounts, template, and empty goal state. | Login, create/select goal, record valid date, repeat same date, reload history. | Normal journey persists; duplicate error is visible; original record remains. |
| TEST-25 | AC-18, AC-19 | UI/API integration | Participant session and template page. | Attempt template edit and unit change through UI/API. | Backend rejects both; UI shows permission/validation error. |

## Required execution matrix

| Area | Minimum evidence |
|---|---|
| Unit/domain | Progress/date/value and session-policy tests with pass count. |
| API/database | Login/session, record persistence/duplicate, ownership, template update/unit immutability, and conflict tests against a real test database. |
| UI/E2E | One normal login-to-record-and-reload journey plus a visible rejection. |
| Security | Unauthenticated, wrong-role, cross-participant, and participant-template-edit cases. |

## Definition of Done for this STS

Every planned AC has an executed test or an explicitly recorded exception. Test names/files, commands, results, and tested commit are recorded. Domain tests include negative and boundary cases; API/database tests use real persistence and backend authorization; the selected UI journey is exercised; failures/skips are disclosed; teammate review and integration are complete; and the contract filename matches the canonical feature ID.

