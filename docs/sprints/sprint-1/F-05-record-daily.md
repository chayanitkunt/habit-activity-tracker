# F-05 — Record daily activity

## Contract status

Sprint 1 contract. This contract implements FR-09, FR-12, FR-13, BR-04, BR-05, BR-06, BR-07, BR-09, and depends on F-01, F-02, F-04, and F-08.

## Behavior and workflow

An authenticated Participant submits a quantity and a calendar date for one of their goals. The API loads the goal with its template, validates ownership and all domain constraints, then inserts one immutable activity record in a transaction. The record is returned after persistence. A duplicate date for the same goal is rejected; no existing row is updated or deleted.

The same calendar date may be recorded for two different goals, including two goals using the same template, because the uniqueness scope is the goal, not the template or participant.

## Domain rules and validation

- The goal must belong to the current Participant. Program Managers and other Participants cannot record against it.
- `activity_date` is a calendar date interpreted in `APP_TIMEZONE`, default `Asia/Bangkok`; timestamps are stored in UTC.
- The date must be today or earlier and within the goal's inclusive `start_date`/`end_date`.
- `quantity` must be numeric, non-negative where the template permits it, and within the template's inclusive `min_value`/`max_value`.
- The database enforces unique `(goal_id, activity_date)` as the final duplicate guard.
- A duplicate returns 409 and leaves the original quantity unchanged.
- Record creation does not recalculate or mutate the goal target. Progress reads the persisted records and applies F-06's total-period calculation.

## API contract

### `POST /api/goals/:goalId/records`

Request:

```json
{ "activity_date": "2026-11-04", "quantity": 25 }
```

Success: `201`:

```json
{
  "record": {
    "id": "uuid",
    "goal_id": "uuid",
    "activity_date": "2026-11-04",
    "quantity": 25,
    "created_at": "2026-11-04T08:00:00Z"
  }
}
```

Errors use the shared shape `{ "error": { "code": "...", "message": "...", "details": {} } }`:

| Status | Code | Condition |
|---:|---|---|
| 401 | `SESSION_REQUIRED` | No valid session. |
| 403 | `ROLE_FORBIDDEN` | Authenticated Program Manager attempts record creation. |
| 404 | `GOAL_NOT_FOUND` | Goal is not accessible to the current Participant. |
| 400 | `INVALID_ACTIVITY_DATE` | Malformed, future, outside-period, or wrong-timezone date. |
| 400 | `INVALID_QUANTITY` | Non-numeric or out-of-template-range quantity. |
| 409 | `DUPLICATE_DAILY_RECORD` | Record already exists for this goal/date. |

Checks occur in the common order 401 → 403 → 404 → 400 → 409. The API does not expose another user's goal existence.

## Data and transaction design

`ActivityRecord(id, goal_id, activity_date, quantity, created_at)` has a foreign key to Goal and a unique composite index on `(goal_id, activity_date)`. The API validates against the selected goal's template inside the transaction, then inserts. A unique-constraint conflict is translated to `DUPLICATE_DAILY_RECORD`; it cannot overwrite an existing record. Deleting records is not part of this contract.

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-08 | An owner Participant can create a valid record and retrieve the persisted result. |
| AC-09 | A Program Manager cannot create a record for a participant goal. |
| AC-10 | A Participant cannot create a record for another Participant's goal and receives no private data. |
| AC-11 | A future date is rejected using Asia/Bangkok calendar semantics. |
| AC-12 | A date outside the inclusive goal period is rejected. |
| AC-13 | Quantities at the inclusive template bounds are accepted; values outside them are rejected. |
| AC-14 | A second record for the same goal/date returns 409 and the first quantity remains unchanged. |
| AC-15 | Two goals on one template can each have a record for the same date without collision. |
| AC-16 | Malformed date and quantity inputs return 400 in the shared error shape. |

## Definition of Done for F-05

The endpoint, ownership checks, timezone/date/value validation, transaction, and unique constraint are implemented. Unit tests cover boundary calculations/validation; API/database tests cover persistence, duplicate rejection, role and cross-owner access; the critical UI journey records and reloads history; a review verifies no overwrite path exists; and test evidence is tied to a reviewed commit.

