# F-02 — Role-based access control and private ownership

## Scope and dependencies

Implements **FR-08, FR-14, BR-11, and NFR-02**. Depends on F-01 resolving the authenticated user and is consumed by template, goal, record, progress, and history endpoints. F-02 does not create a new public endpoint or database entity.

## Behavior, rules, and permissions

The API first resolves a session, then enforces endpoint role, then resolves owned resources. Program Managers may create and maintain shared templates, but may not access participant goals, records, progress, or history: every goal-related endpoint returns `403 ROLE_FORBIDDEN` for a Program Manager. Participants may list active templates and operate only on their own goals and their related records/progress/history. There is no consent-based sharing in Sprint 1.

| Request class | Participant | Program Manager |
|---|---|---|
| Template list | allowed | allowed |
| Template create/PATCH | 403 | allowed |
| Goal, record, progress, history | own resources only | 403 `ROLE_FORBIDDEN` |

For a protected request the order is 401 → 403 → 404 → 400 → 409. Cross-participant resources return `404 GOAL_NOT_FOUND` with no private response body. The server, not hidden UI controls, is authoritative.

## API, UI, and data contract

F-02 applies to every protected path in `system-sds.md`; it adds no path or request/success payload of its own. The protected endpoint contract it enforces is:

| Method/path | Participant | Program Manager | Success shape |
|---|---|---|---|
| `POST /api/templates`, `PATCH /api/templates/:id` | 403 | permitted | Feature F-03 template response |
| `GET /api/templates` | permitted | permitted | Feature F-03 catalog response |
| `POST /api/goals`, `GET /api/goals` | own/create permitted | 403 | Feature F-04/goal-list response |
| `GET /api/goals/:id`, `POST/GET /api/goals/:id/records`, `GET /api/goals/:id/progress` | owner only | 403 `ROLE_FORBIDDEN` | Owning feature response |

F-02 errors use the shared shape, for example:

```json
{ "error": { "code": "ROLE_FORBIDDEN", "message": "Your role is not permitted to perform this action.", "details": {} } }
```

The UI hides manager-only controls from participants and does not render private data after a denied response. It shows a safe forbidden/not-found state and preserves no unauthorized payload. Data fields: `User.id`, `User.role`, and ownership foreign keys (`Goal.participant_id`, `ActivityTemplate.created_by`); migration: **no change**. Ownership queries must derive identity from the session, never a client-supplied participant ID.

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-23 | An unauthenticated request to every protected endpoint receives 401 before resource or input evaluation. |
| AC-24 | A Participant cannot create or edit a shared template; the API returns 403 and changes nothing. |
| AC-25 | A Program Manager cannot read, create records for, or obtain progress/history for a participant goal. |
| AC-26 | Participant A requesting Participant B's goal-related resource receives privacy-safe 404 and no B data. |
| AC-27 | The UI does not expose controls disallowed by role and displays safe denial states if the API rejects a direct request. |

## STS for F-02

| Test ID | Linked AC | Level | Preconditions/input | Action | Expected result |
|---|---|---|---|---|---|
| TEST-26 | AC-23 | API validation/authorization | No, revoked, and expired sessions; known protected paths. | Request each path. | 401 `SESSION_REQUIRED`; no resource validation/body. |
| TEST-27 | AC-24 | API/database integration | Participant session and a template payload/existing template. | POST and PATCH templates. | 403 `ROLE_FORBIDDEN`; no row/change. |
| TEST-28 | AC-25 | API validation/authorization | Manager session and participant-owned goal. | GET/post goal, records, progress, and history paths. | 403 `ROLE_FORBIDDEN`; no private data. |
| TEST-29 | AC-26 | API validation/authorization | Participant A session and B-owned goal/records. | Request B resources. | 404 `GOAL_NOT_FOUND`; no B data. |
| TEST-30 | AC-27 | UI/component | Seeded Participant and Manager states. | Render template and goal views, then invoke prohibited action. | Controls are absent; API denial is safely presented. |

## Definition of Done

Role and owner middleware is used by every protected endpoint; authorization tests cover anonymous, wrong-role, and cross-participant paths; UI denial states are implemented; and reviewed test evidence is recorded.
