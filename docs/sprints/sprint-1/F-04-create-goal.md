# F-04 — Create goal and read-only goal lifecycle

## Scope and workflow

Implements **FR-06, FR-07, FR-08, BR-08, BR-10, and NFR-02**. Depends on F-01 authentication, F-02 ownership, and F-03 active template catalog. A Participant selects an active template and submits a total-period target and dates. The API assigns the current participant as owner, validates the request, persists a goal, and returns it. Sprint 1 has no goal edit or delete endpoint.

## Rules, permissions, and validation

Only a Participant can create a goal; a Program Manager receives 403. `template_id` must identify an active template. `target` is a positive decimal within the template's inclusive `min_value`/`max_value`. `start_date` is today or earlier in `APP_TIMEZONE` (`Asia/Bangkok` by default); `end_date` is on or after `start_date`. The client cannot set `participant_id`, timestamps, or IDs. Unknown fields and malformed UUID/date/decimal values are rejected. After session and role checks, a malformed `template_id` returns `400 INVALID_GOAL`; a well-formed missing or inactive ID returns `404 TEMPLATE_NOT_FOUND`. The API checks 401 → 403 → 404 resource → 400 validation, except that a malformed ID receives 400 after session/role checks as defined in `conventions.md`.

## API contract

### `POST /api/goals`

```json
{ "template_id": "uuid", "target": 300, "start_date": "2026-11-01", "end_date": "2026-11-30" }
```

Success `201`:

```json
{ "goal": { "id": "uuid", "participant_id": "uuid", "template_id": "uuid", "target": 300, "start_date": "2026-11-01", "end_date": "2026-11-30" } }
```

| Status | Code | Condition |
|---:|---|---|
| 401 | `SESSION_REQUIRED` | No valid session. |
| 403 | `ROLE_FORBIDDEN` | Program Manager creates a goal. |
| 404 | `TEMPLATE_NOT_FOUND` | Template is missing or inactive. |
| 400 | `INVALID_GOAL` | Bad/unknown field, target/range/date rule failure. |

## UI and persistence

The participant form loads active templates, displays unit/range, validates target and dates, prevents duplicate submit, and shows loading, empty-catalog, validation, forbidden, not-found, success, and retryable-error states. It redirects to the new goal summary after success. Data: `Goal(id, participant_id, template_id, target, start_date, end_date, created_at, updated_at)` with User and ActivityTemplate foreign keys. Migration: the Goal schema migration creates this table, its foreign keys, and participant/template indexes; this feature adds no later schema change. No update/delete migration or API is added.

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-39 | A Participant creates a goal using an active template; the API persists the current participant as owner. |
| AC-40 | A Program Manager cannot create a goal. |
| AC-41 | Missing/inactive template IDs return 404 without creating a goal. |
| AC-42 | Non-positive/out-of-range targets, future starts, end-before-start dates, malformed values, and unknown fields return 400 without partial persistence. |
| AC-43 | Sprint 1 exposes no goal update or delete action. |
| AC-44 | The create-goal UI shows template range/unit and all shared loading, validation, empty, success, and error states. |

## STS for F-04

| Test ID | Linked AC | Level | Preconditions/input | Action | Expected result |
|---|---|---|---|---|---|
| TEST-39 | AC-39 | API/database integration | Participant session, active template, valid body. | POST then GET own goal. | 201; persisted owner is current participant. |
| TEST-40 | AC-40 | API validation/authorization | Manager session; valid body. | POST goal. | 403; no goal row. |
| TEST-41 | AC-41 | API/database integration | Participant session; absent and inactive template IDs. | POST goal. | 404 `TEMPLATE_NOT_FOUND`; no row. |
| TEST-42 | AC-42 | API validation/authorization | Participant session; invalid target/date/body variants. | POST each variant. | 400 `INVALID_GOAL`; no partial row. |
| TEST-42a | AC-42 | Unit | Goal validator with active-template range and fixed `APP_TIMEZONE` date. | Evaluate non-positive/out-of-range targets, future starts, end-before-start, malformed values, and valid boundaries without HTTP/database dependencies. | Validator accepts only valid target/date combinations and returns field-level failures for all invalid cases. |
| TEST-43 | AC-43 | API validation/authorization | Existing owner goal. | Call unsupported PATCH and DELETE goal paths. | 404 `ROUTE_NOT_FOUND`; original goal unchanged. |
| TEST-44 | AC-44 | UI/component | Participant and active/empty catalog fixtures. | Render and submit invalid/valid controlled states. | Guidance/errors visible; valid-goal navigation is requested. |

## Definition of Done

Goal creation persists correct ownership and template link; range/date/active-template tests pass against a migrated database; no edit/delete path exists; and the browser journey is evidenced in a reviewed commit.
