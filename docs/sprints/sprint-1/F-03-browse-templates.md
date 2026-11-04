# F-03 — Browse activity templates

## Scope and workflow

Implements **FR-04 and NFR-05** within F-03 Activity Template Catalog. Depends on F-01 and the ActivityTemplate schema. Participants retrieve the shared active catalog; Program Managers retrieve the complete catalog, including inactive templates, so they can maintain shared template data. This contract does not expose private participant data or mutate templates.

### `GET /api/templates`

Success `200`:

```json
{ "templates": [{ "id": "uuid", "name": "Focused reading", "description": "Pages read", "unit": "pages", "min_value": 0, "max_value": 500, "is_active": true }] }
```

Missing or expired session returns `401 SESSION_REQUIRED` in the shared error shape. Sprint 1 defines no query parameters, filters, or pagination; clients must call the path without query parameters. Participants receive active templates only. Program Managers receive both active and inactive templates. The catalog is shared and does not require owner filtering. Check order is 401.

## UI and data

The catalog shows name, description, unit, and allowed range; unit is display-only. It has loading, empty, retryable-error, and populated states. Managers can navigate to create/edit controls; participants cannot. Fields read are `ActivityTemplate.id`, `name`, `description`, `unit`, `min_value`, `max_value`, and `is_active`. Migration: **no change**.

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-35 | An authenticated Participant receives active shared templates with unit and range. |
| AC-35a | An authenticated Program Manager receives active and inactive shared templates with unit and range. |
| AC-36 | Inactive templates are hidden from Participants but remain visible to Program Managers. |
| AC-37 | An unauthenticated catalog request returns 401 with the shared error shape. |
| AC-38 | The catalog UI displays loading, empty, populated, and retryable error states without edit controls for Participants. |

## STS for F-03 browsing

| Test ID | Linked AC | Level | Preconditions/input | Action | Expected result |
|---|---|---|---|---|---|
| TEST-35 | AC-35 | API/database integration | Active templates and a Participant session. | GET templates. | 200; Participant receives the active safe catalog. |
| TEST-35a | AC-35a | API/database integration | Active and inactive templates and a Program Manager session. | GET templates. | 200; Manager receives both templates. |
| TEST-36 | AC-36 | API/database integration | One active and one inactive template; Participant and Manager sessions. | GET templates as each role. | Inactive template is hidden from Participant and visible to Manager. |
| TEST-37 | AC-37 | API validation/authorization | No valid session. | GET templates. | 401 `SESSION_REQUIRED`. |
| TEST-38 | AC-38 | UI/component | Participant and manager fixtures; loading/error stub. | Render catalog in each state. | Required state shown; participant edit controls absent. |
