# F-06 — Progress calculation and F-07 — History/progress views

## Scope and dependencies

This combined document preserves two feature IDs: **F-06** implements **FR-11, BR-01, BR-02, BR-03**; **F-07** implements **FR-08, FR-11, FR-13, FR-15**. It depends on F-01, F-02, F-04, and F-05. F-06 calculates; F-07 presents an owner-only goal summary and history. Neither feature mutates records, targets, or goals.

## Rules, permissions, and workflow

For an owned goal, the service sums persisted `ActivityRecord.quantity`, calculates `total / target * 100`, rounds one decimal using half-up rounding, and caps the result at 100. `target` is the total for the goal period, not a per-day target. A goal with no records has total 0 and progress 0.0. Two goals using a common template remain independent because records are scoped by goal.

Only the owner Participant accesses progress, history, or goal summary. A Program Manager receives `403 ROLE_FORBIDDEN` for every goal-related endpoint; another Participant receives privacy-safe 404. The protected order is 401 → 403 → 404 → 400. There are no query parameters in Sprint 1.

## API contract

### `GET /api/goals/:id/progress`

Success `200`:

```json
{ "progress": { "goal_id": "uuid", "total_recorded": 150, "target": 300, "percent": 50.0 } }
```

### `GET /api/goals/:id/records`

Success `200`:

```json
{ "records": [{ "id": "uuid", "goal_id": "uuid", "activity_date": "2026-11-04", "quantity": 25, "created_at": "2026-11-04T08:00:00Z" }] }
```

### `GET /api/goals/:id`

Success `200` returns the owner goal, template display fields, and its permitted summary/history. It must not return another participant's data.

For all three paths: 401 `SESSION_REQUIRED` for no session; 403 `ROLE_FORBIDDEN` for a Program Manager; 404 `GOAL_NOT_FOUND` for absent/inaccessible owner resources; 400 `INVALID_GOAL_ID` for malformed ID after session/role checks. Errors use the shared shape.

## UI, fields, and migration

The participant dashboard/goal screen shows goal target, total, rounded/capped percent, chronological history, unit, and loading/empty/success/not-found/forbidden/retryable-error states. It refreshes after record creation. No participant sees another user's view; no manager sees participant details.

Reads use Goal fields, linked template display fields, and `ActivityRecord` fields; calculated values are not persisted. Migration: **no change**. Database aggregation must retain decimal precision until the specified half-up rounding step.

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-45 | Progress equals total recorded quantity divided by total-period target, is half-up rounded to one decimal, and is capped at 100.0. |
| AC-46 | A goal without records returns total 0 and percent 0.0. |
| AC-47 | Records and progress for two goals using the same template are independent. |
| AC-48 | An owner can retrieve their goal summary, chronological history, and computed progress. |
| AC-49 | A manager and another Participant cannot obtain a participant's goal, history, or progress; no private data is exposed. |
| AC-50 | Goal/history UI provides loading, empty, populated, and safe error states. |

## STS for F-06/F-07

| Test ID | Linked AC | Level | Preconditions/input | Action | Expected result |
|---|---|---|---|---|---|
| TEST-45 | AC-45 | Unit | Target 100; totals 50.05 and 150. | Calculate progress. | 50.1 with half-up rule; 100.0 cap. |
| TEST-46 | AC-46 | API/database integration | Owned goal with no records. | GET progress. | 200 with 0 total and 0.0 percent. |
| TEST-47 | AC-47 | API/database integration | Two goals share a template and have distinct records. | GET both progress/history responses. | Separate totals, records, and percentages. |
| TEST-48 | AC-48 | API/database integration | Owner goal with dated records. | GET goal, records, and progress. | 200; persisted history and computed summary returned. |
| TEST-49 | AC-49 | API validation/authorization | Manager, A, and B sessions; B-owned goal. | Request B summary/history/progress as manager/A. | Manager receives 403 `ROLE_FORBIDDEN`; A receives 404 `GOAL_NOT_FOUND`; no B payload. |
| TEST-50 | AC-50 | UI/component | Owner fixtures with empty and populated goals; error stub. | Render dashboard/detail states. | Required states and rendered calculation/history are visible. |

## Definition of Done

The decimal calculation is unit-tested, owner-only summary/history/progress paths are API/database-tested, the critical browser journey reaches a reloaded history/progress view, and no computed value is stored or exposed across ownership boundaries.
