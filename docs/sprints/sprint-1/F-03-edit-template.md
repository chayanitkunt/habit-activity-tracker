# F-03 — Edit activity template metadata

## Contract status

The canonical feature ID is **F-03**. Template editing is part of the existing activity-template catalog feature. S1-01 remains unchanged: F-11 continues to mean the later reminder/schedule placeholder.

Related requirements: FR-03, FR-04, FR-05, BR-06, BR-10, BR-11, NFR-05. Dependencies: F-01 authentication, F-02 role/ownership middleware, the ActivityTemplate schema, and the shared API conventions.

## Behavior and workflow

A Program Manager opens an existing active template, edits permitted metadata, and submits a PATCH. The API authenticates the manager, confirms the template exists and is editable, validates the request, and persists the update. A Participant may list and use the shared template but cannot edit it. The unit is immutable in Sprint 1 because existing goals and records depend on its meaning.

Allowed fields: `name`, `description`, `min_value`, and `max_value`. `is_active` is not changed by this contract. Forbidden field: `unit`. Identity, creator, active state, timestamps, and IDs are server-owned.

## API contract

### `PATCH /api/templates/:id`

Request example:

```json
{
  "name": "Focused reading",
  "description": "Pages read from the selected study material",
  "min_value": 0,
  "max_value": 500
}
```

Success: `200` with the complete updated template, including the unchanged `unit`.

```json
{
  "template": {
    "id": "uuid",
    "name": "Focused reading",
    "description": "Pages read from the selected study material",
    "unit": "pages",
    "min_value": 0,
    "max_value": 500,
    "is_active": true
  }
}
```

Errors:

| Status | Code | Condition |
|---:|---|---|
| 401 | `SESSION_REQUIRED` | No valid session. |
| 403 | `ROLE_FORBIDDEN` | Participant attempts to edit a template. |
| 404 | `TEMPLATE_NOT_FOUND` | Template is absent or not available under the privacy policy. |
| 400 | `INVALID_TEMPLATE_UPDATE` | Empty name, invalid range, unknown field, or malformed value. |
| 409 | `TEMPLATE_UPDATE_CONFLICT` | Concurrent update or catalog state conflict. |

The API uses the shared check order 401 → 403 → 404 → 400 → 409. A request containing `unit`, even if its value is unchanged, is rejected with `400 UNIT_IMMUTABLE`; it is never silently ignored.

## Validation, persistence, and permissions

`name` is required and bounded; `min_value` and `max_value` are decimals with `min_value <= max_value`; all values use the template's declared numeric precision. Existing records are not rewritten when metadata changes. The unit is immutable, and a template used by a goal cannot be deleted through this contract. The manager role is enforced by the API, not only by hidden UI controls.

## UI behavior and migration

The manager edit form loads the current template, shows unit as read-only, validates the name/range, disables duplicate submission while saving, and displays loading, success, validation, forbidden, not-found, and conflict states. Participant users see no edit control and remain protected if they call the API directly. Migration: add no new table; use the existing ActivityTemplate fields and `updated_at` timestamp for conditional updates.

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-17 | A Program Manager can update permitted template metadata and receives the persisted result. |
| AC-18 | A Participant's PATCH request is rejected by backend authorization. |
| AC-19 | A PATCH containing `unit` is rejected with `UNIT_IMMUTABLE`; the stored unit is unchanged. |
| AC-20 | Invalid names, numeric ranges, unknown fields, or malformed values return 400 without a partial update. |
| AC-21 | Existing goals and records remain linked and interpretable after an allowed metadata update. |
| AC-22 | Missing/inaccessible template IDs do not disclose another resource and return the documented not-found response. |

## STS for F-03

| Test ID | Linked AC | Level | Preconditions/input | Action | Expected result |
|---|---|---|---|---|---|
| TEST-17 | AC-17 | API/database integration | Manager session and active template. | PATCH allowed metadata. | 200; reload shows persisted update. |
| TEST-18 | AC-18 | API validation/authorization | Participant session and shared template. | PATCH template metadata. | 403; template unchanged. |
| TEST-19 | AC-19 | API/database integration | Existing template has unit `pages`. | PATCH with `unit`. | 400 `UNIT_IMMUTABLE`; stored unit unchanged. |
| TEST-20 | AC-20 | API/database integration | Manager session and active template. | Submit empty name, min > max, unknown field, malformed decimal. | 400 for each; no partial update. |
| TEST-21 | AC-21 | Database integration | Goal and record reference template. | Apply allowed metadata update and reload goal/record. | Links and historical unit meaning remain intact. |
| TEST-22 | AC-22 | API validation/authorization | Manager requests inaccessible ID. | PATCH unknown ID. | 404 with no private resource detail. |

## Definition of Done for F-03 template editing

The manager PATCH endpoint, allowed-field validation, immutable-unit rejection, transaction/partial-update protection, and backend role checks are implemented. API/database tests cover manager success, participant denial, unknown/malformed fields, unit immutability, persistence, and conflict behavior. The UI displays loading/success/error states. The contract remains separate from F-11 reminder work.
