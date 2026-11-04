# F-03 — Create activity template

## Scope and workflow

Implements **FR-03, BR-10, and NFR-05** within F-03 Activity Template Catalog. Depends on F-01 and F-02. Template editing is separately specified by the existing `F-03-edit-template.md`.

A Program Manager enters a name, optional description, immutable unit, and inclusive numeric range. The API authenticates/authorizes, validates, creates the template with `created_by` set from the session, and returns it. Participants cannot create templates.

## Validation, API, UI, and data

`name` is required and non-blank; `description` is optional; `unit` is required and non-blank; `min_value` and `max_value` are numeric decimals and `min_value <= max_value`. IDs, `created_by`, `is_active`, and timestamps are server-owned. Unknown fields are rejected. A manager form validates fields, prevents duplicate submission while saving, and displays loading, success, validation, forbidden, and retryable error states.

### `POST /api/templates`

```json
{ "name": "Focused reading", "description": "Pages read", "unit": "pages", "min_value": 0, "max_value": 500 }
```

Success `201`:

```json
{ "template": { "id": "uuid", "name": "Focused reading", "description": "Pages read", "unit": "pages", "min_value": 0, "max_value": 500, "is_active": true } }
```

| Status | Code | Condition |
|---:|---|---|
| 401 | `SESSION_REQUIRED` | No valid session. |
| 403 | `ROLE_FORBIDDEN` | Participant attempts creation. |
| 400 | `INVALID_TEMPLATE` | Missing/invalid field, invalid range, or unknown field. |

Checks follow 401 → 403 → 400. Data: create/use `ActivityTemplate(id, name, description, unit, min_value, max_value, is_active, created_by, created_at, updated_at)`, range constraint, and User foreign key. Migration: the ActivityTemplate schema migration creates this table, its User foreign key, range constraint, and active-catalog index; this feature adds no later schema change.

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-31 | A Program Manager can create a valid active template and receive its persisted server-owned fields. |
| AC-32 | Missing/blank name or unit, malformed decimal, inverted range, and unknown fields return 400 without a row. |
| AC-33 | A Participant receives 403 when creating a template and no template is stored. |
| AC-34 | The creation UI exposes loading, valid-range guidance, success, and safe error states. |

## STS for F-03 creation

| Test ID | Linked AC | Level | Preconditions/input | Action | Expected result |
|---|---|---|---|---|---|
| TEST-31 | AC-31 | API/database integration | Manager session; valid payload. | POST template, inspect persisted row, then GET list. | 201 response returns the template; database row has `created_by` equal to the manager; active catalog returns it. |
| TEST-32 | AC-32 | API/database integration | Manager session; invalid variants. | POST each payload. | 400 `INVALID_TEMPLATE`; no partial row. |
| TEST-33 | AC-33 | API validation/authorization | Participant session; valid payload. | POST template. | 403; no row. |
| TEST-34 | AC-34 | UI/component | Manager screen state. | Submit invalid then valid template through controlled API responses. | Inline/API error then visible created catalog item. |
