# F-04 red run

- Commit: `015f923`
- Command: `npm --workspace api run test:unit && npm --workspace api run test:api`
- Exit code: `1/1`
- Evidence note: The intended tests failed before the goal implementation, but the failure includes missing implementation/schema setup (goal.js module and goals table), so this is historical red evidence and not a clean assertion-only TDD run.

## Raw command output

```text

> @habit-tracker/api@0.1.0 test:unit
> cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects unit --runInBand --passWithNoTests

Running one project: unit
FAIL unit tests/unit/goal.validator.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../../src/validators/goal.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

      at createNoMappedModuleFoundError (../node_modules/jest-resolve/build/index.js:1322:17)

(node:11268) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.448 s, estimated 1 s
Ran all test suites.
npm error Lifecycle script `test:unit` failed with error:
npm error code 1
npm error path C:\Users\User\Downloads\habit-activity-tracker\api
npm error workspace @habit-tracker/api@0.1.0
npm error location C:\Users\User\Downloads\habit-activity-tracker\api
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects unit --runInBand --passWithNoTests


> @habit-tracker/api@0.1.0 test:api
> cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects api --runInBand

Running one project: api
(node:27148) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
FAIL api tests/api/goals.test.ts
  ● F-04 create personal goal › TEST-04.1 / AC-04.1 creates a valid goal including one-day period

    error: relation "goals" does not exist

      20 |   inactiveTemplateId = templates.rows.find((row) => row.name === 'Meditation')!.id;
      21 |   const bobId = users.rows.find((row) => row.email === 'bob@example.com')!.id;
    > 22 |   bobGoalId = (await pool.query<{ id: string }>('INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, 20, CURRENT_DATE, CURRENT_DATE) RETURNING id', [bobId, templateId])).rows[0].id;
         |                ^
      23 | });
      24 |
      25 | afterEach(async () => { if (pool) await pool.end(); });

      at ../node_modules/pg-pool/index.js:45:11
      at Object.<anonymous> (tests/api/goals.test.ts:22:16)

  ● F-04 create personal goal › TEST-04.2 / AC-04.2 rejects invalid target/date and unknown or inactive templates

    error: relation "goals" does not exist

      20 |   inactiveTemplateId = templates.rows.find((row) => row.name === 'Meditation')!.id;
      21 |   const bobId = users.rows.find((row) => row.email === 'bob@example.com')!.id;
    > 22 |   bobGoalId = (await pool.query<{ id: string }>('INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, 20, CURRENT_DATE, CURRENT_DATE) RETURNING id', [bobId, templateId])).rows[0].id;
         |                ^
      23 | });
      24 |
      25 | afterEach(async () => { if (pool) await pool.end(); });

      at ../node_modules/pg-pool/index.js:45:11
      at Object.<anonymous> (tests/api/goals.test.ts:22:16)

  ● F-04 create personal goal › TEST-04.3 / AC-04.3 ignores a spoofed participantId and uses the session owner

    error: relation "goals" does not exist

      20 |   inactiveTemplateId = templates.rows.find((row) => row.name === 'Meditation')!.id;
      21 |   const bobId = users.rows.find((row) => row.email === 'bob@example.com')!.id;
    > 22 |   bobGoalId = (await pool.query<{ id: string }>('INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, 20, CURRENT_DATE, CURRENT_DATE) RETURNING id', [bobId, templateId])).rows[0].id;
         |                ^
      23 | });
      24 |
      25 | afterEach(async () => { if (pool) await pool.end(); });

      at ../node_modules/pg-pool/index.js:45:11
      at Object.<anonymous> (tests/api/goals.test.ts:22:16)

  ● F-04 create personal goal › TEST-04.4 / AC-04.4 lists only the current participant goals

    error: relation "goals" does not exist

      20 |   inactiveTemplateId = templates.rows.find((row) => row.name === 'Meditation')!.id;
      21 |   const bobId = users.rows.find((row) => row.email === 'bob@example.com')!.id;
    > 22 |   bobGoalId = (await pool.query<{ id: string }>('INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, 20, CURRENT_DATE, CURRENT_DATE) RETURNING id', [bobId, templateId])).rows[0].id;
         |                ^
      23 | });
      24 |
      25 | afterEach(async () => { if (pool) await pool.end(); });

      at ../node_modules/pg-pool/index.js:45:11
      at Object.<anonymous> (tests/api/goals.test.ts:22:16)

  ● F-04 create personal goal › TEST-04.5 / AC-04.5 rejects Program Manager goal creation

    error: relation "goals" does not exist

      20 |   inactiveTemplateId = templates.rows.find((row) => row.name === 'Meditation')!.id;
      21 |   const bobId = users.rows.find((row) => row.email === 'bob@example.com')!.id;
    > 22 |   bobGoalId = (await pool.query<{ id: string }>('INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, 20, CURRENT_DATE, CURRENT_DATE) RETURNING id', [bobId, templateId])).rows[0].id;
         |                ^
      23 | });
      24 |
      25 | afterEach(async () => { if (pool) await pool.end(); });

      at ../node_modules/pg-pool/index.js:45:11
      at Object.<anonymous> (tests/api/goals.test.ts:22:16)

  ● F-04 create personal goal › TEST-04.6 / AC-04.6 hides another participant goal with 404

    error: relation "goals" does not exist

      20 |   inactiveTemplateId = templates.rows.find((row) => row.name === 'Meditation')!.id;
      21 |   const bobId = users.rows.find((row) => row.email === 'bob@example.com')!.id;
    > 22 |   bobGoalId = (await pool.query<{ id: string }>('INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, 20, CURRENT_DATE, CURRENT_DATE) RETURNING id', [bobId, templateId])).rows[0].id;
         |                ^
      23 | });
      24 |
      25 | afterEach(async () => { if (pool) await pool.end(); });

      at ../node_modules/pg-pool/index.js:45:11
      at Object.<anonymous> (tests/api/goals.test.ts:22:16)

  ● F-04 create personal goal › TEST-04.7 rejects unauthenticated goal requests

    error: relation "goals" does not exist

      20 |   inactiveTemplateId = templates.rows.find((row) => row.name === 'Meditation')!.id;
      21 |   const bobId = users.rows.find((row) => row.email === 'bob@example.com')!.id;
    > 22 |   bobGoalId = (await pool.query<{ id: string }>('INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, 20, CURRENT_DATE, CURRENT_DATE) RETURNING id', [bobId, templateId])).rows[0].id;
         |                ^
      23 | });
      24 |
      25 | afterEach(async () => { if (pool) await pool.end(); });

      at ../node_modules/pg-pool/index.js:45:11
      at Object.<anonymous> (tests/api/goals.test.ts:22:16)

FAIL api tests/api/smoke.test.ts
  ● SMOKE-2 database reset and migration › migrates an empty independent test database

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 0

    @@ -6,9 +6,6 @@
          "name": "002-users-and-sessions.sql",
        },
        Object {
          "name": "003_activity_templates.sql",
        },
    -   Object {
    -     "name": "004-goals.sql",
    -   },
      ]

      3 | import { resetTestDatabase } from '../helpers/testDb.js';
      4 | describe('SMOKE-1 unknown route', () => { it('returns the standard 404 error response', async () => { const response = await request(createApp()).get('/not-a-route'); expect(response.status).toBe(404); expect(response.body).toEqual({ error: { code: 'ROUTE_NOT_FOUND', message: 'The requested route was not found.', details: {} } }); }); });
    > 5 | describe('SMOKE-2 database reset and migration', () => { it('migrates an empty independent test database', async () => { const pool = await resetTestDatabase(); try { expect((await pool.query('SELECT name FROM schema_migrations ORDER BY name')).rows).toEqual([{ name: '001-initialize.sql' }, { name: '002-users-and-sessions.sql' }, { name: '003_activity_templates.sql' }, { name: '004-goals.sql' }]); } finally { await pool.end(); } }); });
        |                                                                                                                                                                                                                                                            ^
      6 |

      at Object.<anonymous> (tests/api/smoke.test.ts:5:252)

Test Suites: 2 failed, 3 passed, 5 total
Tests:       8 failed, 17 passed, 25 total
Snapshots:   0 total
Time:        14.795 s, estimated 18 s
Ran all test suites.
npm error Lifecycle script `test:api` failed with error:
npm error code 1
npm error path C:\Users\User\Downloads\habit-activity-tracker\api
npm error workspace @habit-tracker/api@0.1.0
npm error location C:\Users\User\Downloads\habit-activity-tracker\api
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects api --runInBand

```

# F-04 green run

- Commit: `db13132`
- Command: `npm --workspace api run test:unit && npm --workspace api run test:api`
- Exit code: `0/0`
- Evidence note: Goal validator and goal endpoint implementation are present; unit and API suites passed.

## Raw command output

```text

> @habit-tracker/api@0.1.0 test:unit
> cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects unit --runInBand --passWithNoTests

Running one project: unit
(node:22228) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.472 s, estimated 1 s
Ran all test suites.


> @habit-tracker/api@0.1.0 test:api
> cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects api --runInBand

Running one project: api
(node:29380) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

Test Suites: 5 passed, 5 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        16.939 s
Ran all test suites.

```

Test-design commit: `015f923`. Implementation commit: `db13132`. Later UI/inactive-template coverage was added in subsequent commits and is covered by the release run.
