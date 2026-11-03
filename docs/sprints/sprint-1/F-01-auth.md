# F-01 — Authentication and session lifecycle

## Contract status

Sprint 1 contract, Part A. This contract implements the shared requirements FR-01, FR-02, NFR-02, NFR-03 and AD-16.

## Behavior and workflow

1. A user submits an email and password to the login endpoint.
2. The API normalizes the email, loads the user, and compares the password with bcrypt.
3. On success, the API creates an opaque server-side session, sets a secure cookie, and returns the current user's safe identity and role.
4. Protected requests resolve the session to the current user before authorization and domain validation.
5. `/api/me` returns only the current user's safe identity and role.
6. Logout revokes the current session and clears the cookie. Reusing that session is rejected.

Invalid credentials use the same generic error regardless of whether the email exists. Passwords, session secrets, and cookies are never returned or logged.

## Permissions and dependencies

Login is available to seeded Participants and Program Managers. `/api/me` and logout require the current authenticated session. F-02 consumes the resolved user/role for ownership and role checks. Dependencies are the User and Session tables, bcrypt, secure cookie configuration, and a configured session secret.

## API contract

### `POST /api/auth/login`

Request:

```json
{ "email": "participant@example.test", "password": "<development-password>" }
```

Success: `200` with `Set-Cookie` and:

```json
{ "user": { "id": "uuid", "email": "participant@example.test", "role": "PARTICIPANT" } }
```

Invalid credentials or malformed login: `401` with `INVALID_CREDENTIALS`; validation must not disclose which field was wrong.

### `GET /api/me`

Requires a valid session. Success: `200` with the safe user object above. Missing, revoked, or expired session: `401 SESSION_REQUIRED`.

### `POST /api/auth/logout`

Requires a valid session. Success: `204`, session revoked and cookie cleared. Missing or expired session: `401 SESSION_REQUIRED`.

## Data and security rules

`User.email` is normalized and unique. `User.password_hash` contains only a bcrypt hash with cost factor 12 or stronger. `Session` stores a hash of a random opaque session identifier, `user_id`, `created_at`, `expires_at`, and optional `revoked_at`; the raw session identifier is held only in the client cookie. The default session lifetime is 24 hours and is configurable through `SESSION_TTL`.

The cookie is `HttpOnly`, `Secure` outside local development, `SameSite=Lax`, and scoped to the application. State-changing cookie requests require CSRF protection. Session lookup rejects revoked or expired sessions. Unexpected authentication failures return a generic server error without credential details.

## Acceptance criteria

| ID | Observable outcome |
|---|---|
| AC-01 | Valid seeded credentials return 200, create a session, and identify the correct role. |
| AC-02 | Invalid credentials return 401 with the stable error shape and reveal no account-existence detail. |
| AC-03 | `/api/me` returns only the authenticated user's safe identity and role. |
| AC-04 | A missing, revoked, or expired session receives 401 on protected endpoints. |
| AC-05 | Logout returns 204, clears the cookie, revokes the session, and prevents reuse. |
| AC-06 | Password storage and application logs contain no plaintext password. |
| AC-07 | The session cookie is not readable by client-side scripts and has the required security attributes. |

## Definition of Done for F-01

The login, current-user, and logout endpoints are implemented; bcrypt and session expiry are configured; API tests cover valid/invalid login and session rejection; protected endpoint middleware uses the current user; secrets are externalized; a teammate reviews the contract and implementation; and test output is recorded against the release commit.

