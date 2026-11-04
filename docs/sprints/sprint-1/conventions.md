# Sprint 1 engineering conventions

## API errors and protected-request order

Every error response is JSON:

```json
{ "error": { "code": "STABLE_CODE", "message": "Human-readable explanation.", "details": {} } }
```

`code` is stable and machine-readable. `message` is safe to show to a user. `details` is an object and must not disclose passwords, sessions, or another participant's resource. A successful response never uses this shape.

Protected endpoints check, and return the first applicable result, in this order: **401 session → 403 role → 404 resource/ownership → 400 request/domain validation → 409 conflicting state**. A participant requesting another participant's private goal, record, history, or progress receives the documented privacy-safe 404.

For a path ID, authenticate and authorize before validating its syntax. A malformed ID then returns 400; a syntactically valid ID that is absent, inactive where applicable, or hidden by ownership returns 404. An unmatched HTTP method/path returns `404 ROUTE_NOT_FOUND`.

| Status | Meaning | Standard codes used in Sprint 1 |
|---:|---|---|
| 400 | Valid session/role/resource, invalid input or domain rule | `INVALID_LOGIN_REQUEST`, `INVALID_TEMPLATE`, `INVALID_TEMPLATE_UPDATE`, `UNIT_IMMUTABLE`, `INVALID_GOAL`, `INVALID_GOAL_ID`, `INVALID_ACTIVITY_DATE`, `INVALID_QUANTITY` |
| 401 | Missing, revoked, or expired session; invalid credentials | `SESSION_REQUIRED`, `INVALID_CREDENTIALS` |
| 403 | Authenticated role is not permitted | `ROLE_FORBIDDEN` |
| 404 | Missing resource, intentionally hidden private resource, or unmatched route | `TEMPLATE_NOT_FOUND`, `GOAL_NOT_FOUND`, `ROUTE_NOT_FOUND` |
| 409 | Duplicate or concurrent conflicting state | `DUPLICATE_DAILY_RECORD`, `TEMPLATE_UPDATE_CONFLICT` |
| 500 | Unexpected failure | `INTERNAL_ERROR` |

The status, field names, and check order are the ones in `docs/system-sds.md`; feature contracts cannot redefine them.

## Test levels

| Level | Purpose |
|---|---|
| Unit | Pure domain rules, decimal rounding, date/range boundaries, and mapping functions without HTTP or a database. |
| API validation/authorization | HTTP request/response behavior, error shape, authentication, role, and ownership order. |
| API/database integration | API behavior against a real migrated test database, including transactions and constraints. |
| Database integration | Schema-level foreign key, uniqueness, and persistence behavior. |
| UI/component | Rendered UI state and interaction behavior with controlled API boundaries; no browser journey required. |
| UI/E2E | Browser-visible critical journey through real UI/API boundaries. |

Each planned test has at least one linked AC; each AC has at least one planned test. Tests use synthetic accounts and data only.
