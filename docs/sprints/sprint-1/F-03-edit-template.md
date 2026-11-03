# F-03 — Edit activity template metadata

## Contract status

The canonical feature ID is **F-03**. Template editing is part of the existing activity-template catalog feature. S1-01 remains unchanged: F-11 continues to mean the later reminder/schedule placeholder.

## Behavior and workflow

A Program Manager opens an existing active template, edits permitted metadata, and submits a PATCH. The API authenticates the manager, confirms the template exists and is editable, validates the request, and persists the update. A Participant may list and use the shared template but cannot edit it. The unit is immutable in Sprint 1 because existing goals and records depend on its meaning.

Allowed fields: `name`, `description`, `min_value`, `max_value`, and `is_active` if deactivation is approved by the catalog policy. For this baseline, deactivation is represented but must not remove a template referenced by existing goals. Forbidden field: `unit`. Identity, creator, timestamps, and IDs are server-owned.

## API contract

### `PATCH /api/templates/:templateId`

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

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-17 | A Program Manager can update permitted template metadata and receives the persisted result. |
| AC-18 | A Participant's PATCH request is rejected by backend authorization. |
| AC-19 | A PATCH containing `unit` is rejected with `UNIT_IMMUTABLE`; the stored unit is unchanged. |
| AC-20 | Invalid names, numeric ranges, unknown fields, or malformed values return 400 without a partial update. |
| AC-21 | Existing goals and records remain linked and interpretable after an allowed metadata update. |
| AC-22 | Missing/inaccessible template IDs do not disclose another resource and return the documented not-found response. |
| AC-23 | A concurrent conflicting update returns 409 and does not silently discard a manager's change. |

## Definition of Done for F-03 template editing

The manager PATCH endpoint, allowed-field validation, immutable-unit rejection, transaction/partial-update protection, and backend role checks are implemented. API/database tests cover manager success, participant denial, unknown/malformed fields, unit immutability, persistence, and conflict behavior. The UI displays loading/success/error states. The contract remains separate from F-11 reminder work.

