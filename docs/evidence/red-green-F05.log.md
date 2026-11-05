# F-05 red run

- Commit: `7f3f6a3`
- Command: `npm --workspace api run test:unit && npm --workspace api run test:api`
- Exit code: `1/1`
- Evidence note: The record tests fail before the record implementation; the API assertions receive 404 Not Found where the intended endpoint responses are expected, and the migration smoke assertion lacks 005-daily-records.sql.

## Raw command output

```text

> @habit-tracker/api@0.1.0 test:unit
> cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects unit --runInBand --passWithNoTests

Running one project: unit
(node:25612) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
FAIL unit tests/unit/record.validator.test.ts
  ● Test suite failed to run

    Configuration error:

    Could not locate module ../../src/validators/record.js mapped as:
    $1.

    Please check your configuration for these entries:
    {
      "moduleNameMapper": {
        "/^(\.{1,2}\/.*)\.js$/": "$1"
      },
      "resolver": undefined
    }

      at createNoMappedModuleFoundError (../node_modules/jest-resolve/build/index.js:1322:17)


Test Suites: 1 failed, 2 passed, 3 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.53 s, estimated 1 s
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
(node:25116) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
FAIL api tests/api/records.test.ts (7.485 s)
  ● F-05 record daily activity › TEST-05.1 / AC-05.1 saves a valid record

    expected 201 "Created", got 404 "Not Found"

      39 |   it('TEST-05.1 / AC-05.1 saves a valid record', async () => {
      40 |     const alice = await login('alice@example.com');
    > 41 |     const response = await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 }).expect(201);
         |                                                                                                                         ^
      42 |     expect(response.body.record).toEqual(expect.objectContaining({ goal_id: aliceGoalId, activity_date: today, quantity: 25 }));
      43 |   });
      44 |

      at Object.<anonymous> (tests/api/records.test.ts:41:121)
      ----
      at Test._assertStatus (../node_modules/supertest/lib/test.js:404:14)
      at ../node_modules/supertest/lib/test.js:460:13
      at Test._assertFunction (../node_modules/supertest/lib/test.js:437:13)
      at Test.assert (../node_modules/supertest/lib/test.js:302:23)
      at localAssert (../node_modules/supertest/lib/test.js:220:38)
      at Server.<anonymous> (../node_modules/supertest/lib/test.js:227:13)

  ● F-05 record daily activity › TEST-05.2 / AC-05.2 accepts inclusive bounds and rejects outside/non-numeric values

    expected 201 "Created", got 404 "Not Found"

      45 |   it('TEST-05.2 / AC-05.2 accepts inclusive bounds and rejects outside/non-numeric values', async () => {
      46 |     const alice = await login('alice@example.com');
    > 47 |     await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: '2026-11-01', quantity: 0 }).expect(201);
         |                                                                                                              ^
      48 |     await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: '2026-11-02', quantity: 500 }).expect(201);
      49 |     for (const [activity_date, quantity] of [['2026-11-03', -0.01], ['2026-11-04', 500.01], ['2026-11-05', '25']] as const) {
      50 |       const response = await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date, quantity }).expect(400);

      at Object.<anonymous> (tests/api/records.test.ts:47:110)
      ----
      at Test._assertStatus (../node_modules/supertest/lib/test.js:404:14)
      at ../node_modules/supertest/lib/test.js:460:13
      at Test._assertFunction (../node_modules/supertest/lib/test.js:437:13)
      at Test.assert (../node_modules/supertest/lib/test.js:302:23)
      at localAssert (../node_modules/supertest/lib/test.js:220:38)
      at Server.<anonymous> (../node_modules/supertest/lib/test.js:227:13)

  ● F-05 record daily activity › TEST-05.3 and TEST-05.7 / AC-05.3, AC-05.7 reject dates outside the goal period and future dates

    expected 400 "Bad Request", got 404 "Not Found"

      56 |     const alice = await login('alice@example.com');
      57 |     for (const activity_date of ['2026-10-31', '2026-11-06']) {
    > 58 |       const response = await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date, quantity: 25 }).expect(400);
         |                                                                                                                    ^
      59 |       expect(response.body.error.code).toBe('INVALID_ACTIVITY_DATE');
      60 |     }
      61 |   });

      at Object.<anonymous> (tests/api/records.test.ts:58:116)
      ----
      at Test._assertStatus (../node_modules/supertest/lib/test.js:404:14)
      at ../node_modules/supertest/lib/test.js:460:13
      at Test._assertFunction (../node_modules/supertest/lib/test.js:437:13)
      at Test.assert (../node_modules/supertest/lib/test.js:302:23)
      at localAssert (../node_modules/supertest/lib/test.js:220:38)
      at Server.<anonymous> (../node_modules/supertest/lib/test.js:227:13)

  ● F-05 record daily activity › TEST-05.4 / AC-05.4 maps duplicate records to 409 and database rejects a direct duplicate

    expected 201 "Created", got 404 "Not Found"

      63 |   it('TEST-05.4 / AC-05.4 maps duplicate records to 409 and database rejects a direct duplicate', async () => {
      64 |     const alice = await login('alice@example.com');
    > 65 |     await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 }).expect(201);
         |                                                                                                        ^
      66 |     await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 50 }).expect(409);
      67 |     await expect(pool.query('INSERT INTO daily_records (goal_id, activity_date, quantity) VALUES ($1, $2, $3)', [aliceGoalId, today, 75])).rejects.toMatchObject({ code: '23505' });
      68 |     expect((await pool.query('SELECT quantity FROM daily_records WHERE goal_id = $1', [aliceGoalId])).rows).toEqual([{ quantity: '25.00' }]);

      at Object.<anonymous> (tests/api/records.test.ts:65:104)
      ----
      at Test._assertStatus (../node_modules/supertest/lib/test.js:404:14)
      at ../node_modules/supertest/lib/test.js:460:13
      at Test._assertFunction (../node_modules/supertest/lib/test.js:437:13)
      at Test.assert (../node_modules/supertest/lib/test.js:302:23)
      at localAssert (../node_modules/supertest/lib/test.js:220:38)
      at Server.<anonymous> (../node_modules/supertest/lib/test.js:227:13)

  ● F-05 record daily activity › TEST-05.4 handles simultaneous duplicate requests as one 201 and one 409

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Array [
    -   201,
    -   409,
    +   404,
    +   404,
      ]

      72 |     const alice = await login('alice@example.com');
      73 |     const responses = await Promise.all([1, 2].map(() => alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 })));
    > 74 |     expect(responses.map((response) => response.status).sort()).toEqual([201, 409]);
         |                                                                 ^
      75 |   });
      76 |
      77 |   it('TEST-05.5 / AC-05.5 hides another participant goal', async () => {

      at Object.<anonymous> (tests/api/records.test.ts:74:65)

  ● F-05 record daily activity › TEST-05.6 / AC-05.6 retrieves saved records for its goal

    expected 201 "Created", got 404 "Not Found"

      82 |   it('TEST-05.6 / AC-05.6 retrieves saved records for its goal', async () => {
      83 |     const alice = await login('alice@example.com');
    > 84 |     await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 }).expect(201);
         |                                                                                                        ^
      85 |     const response = await alice.get(`/api/goals/${aliceGoalId}/records`).expect(200);
      86 |     expect(response.body.records).toEqual([expect.objectContaining({ activity_date: today, quantity: 25 })]);
      87 |   });

      at Object.<anonymous> (tests/api/records.test.ts:84:104)
      ----
      at Test._assertStatus (../node_modules/supertest/lib/test.js:404:14)
      at ../node_modules/supertest/lib/test.js:460:13
      at Test._assertFunction (../node_modules/supertest/lib/test.js:437:13)
      at Test.assert (../node_modules/supertest/lib/test.js:302:23)
      at localAssert (../node_modules/supertest/lib/test.js:220:38)
      at Server.<anonymous> (../node_modules/supertest/lib/test.js:227:13)

  ● F-05 record daily activity › TEST-05.8 / AC-05.8 rejects Program Manager requests after authentication

    expected 403 "Forbidden", got 404 "Not Found"

      89 |   it('TEST-05.8 / AC-05.8 rejects Program Manager requests after authentication', async () => {
      90 |     const manager = await login('pm@example.com');
    > 91 |     await manager.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 }).expect(403);
         |                                                                                                          ^
      92 |   });
      93 |
      94 |   it('requires an authenticated session before all other checks', async () => {

      at Object.<anonymous> (tests/api/records.test.ts:91:106)
      ----
      at Test._assertStatus (../node_modules/supertest/lib/test.js:404:14)
      at ../node_modules/supertest/lib/test.js:460:13
      at Test._assertFunction (../node_modules/supertest/lib/test.js:437:13)
      at Test.assert (../node_modules/supertest/lib/test.js:302:23)
      at localAssert (../node_modules/supertest/lib/test.js:220:38)
      at Server.<anonymous> (../node_modules/supertest/lib/test.js:227:13)

  ● F-05 record daily activity › requires an authenticated session before all other checks

    expected 401 "Unauthorized", got 404 "Not Found"

      93 |
      94 |   it('requires an authenticated session before all other checks', async () => {
    > 95 |     await request(app()).post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 }).expect(401);
         |                                                                                                                 ^
      96 |   });
      97 |
      98 |   it('allows records on distinct goals with the same template and date', async () => {

      at Object.<anonymous> (tests/api/records.test.ts:95:113)
      ----
      at Test._assertStatus (../node_modules/supertest/lib/test.js:404:14)
      at ../node_modules/supertest/lib/test.js:460:13
      at Test._assertFunction (../node_modules/supertest/lib/test.js:437:13)
      at Test.assert (../node_modules/supertest/lib/test.js:302:23)
      at localAssert (../node_modules/supertest/lib/test.js:220:38)
      at Server.<anonymous> (../node_modules/supertest/lib/test.js:227:13)

  ● F-05 record daily activity › allows records on distinct goals with the same template and date

    expected 201 "Created", got 404 "Not Found"

      100 |     const aliceId = (await pool.query<{ id: string }>("SELECT id FROM users WHERE email = 'alice@example.com'")).rows[0].id;
      101 |     const secondGoal = (await pool.query<{ id: string }>("INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, 100, '2026-11-01', '2026-11-05') RETURNING id", [aliceId, templateId])).rows[0].id;
    > 102 |     await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 }).expect(201);
          |                                                                                                        ^
      103 |     await alice.post(`/api/goals/${secondGoal}/records`).send({ activity_date: today, quantity: 25 }).expect(201);
      104 |   });
      105 | });

      at Object.<anonymous> (tests/api/records.test.ts:102:104)
      ----
      at Test._assertStatus (../node_modules/supertest/lib/test.js:404:14)
      at ../node_modules/supertest/lib/test.js:460:13
      at Test._assertFunction (../node_modules/supertest/lib/test.js:437:13)
      at Test.assert (../node_modules/supertest/lib/test.js:302:23)
      at localAssert (../node_modules/supertest/lib/test.js:220:38)
      at Server.<anonymous> (../node_modules/supertest/lib/test.js:227:13)

FAIL api tests/api/smoke.test.ts
  ● SMOKE-2 database reset and migration › migrates an empty independent test database

    expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 0

    @@ -9,9 +9,6 @@
          "name": "003_activity_templates.sql",
        },
        Object {
          "name": "004-goals.sql",
        },
    -   Object {
    -     "name": "005-daily-records.sql",
    -   },
      ]

      3 | import { resetTestDatabase } from '../helpers/testDb.js';
      4 | describe('SMOKE-1 unknown route', () => { it('returns the standard 404 error response', async () => { const response = await request(createApp()).get('/not-a-route'); expect(response.status).toBe(404); expect(response.body).toEqual({ error: { code: 'ROUTE_NOT_FOUND', message: 'The requested route was not found.', details: {} } }); }); });
    > 5 | describe('SMOKE-2 database reset and migration', () => { it('migrates an empty independent test database', async () => { const pool = await resetTestDatabase(); try { expect((await pool.query('SELECT name FROM schema_migrations ORDER BY name')).rows).toEqual([{ name: '001-initialize.sql' }, { name: '002-users-and-sessions.sql' }, { name: '003_activity_templates.sql' }, { name: '004-goals.sql' }, { name: '005-daily-records.sql' }]); } finally { await pool.end(); } }); });
        |                                                                                                                                                                                                                                                            ^
      6 |

      at Object.<anonymous> (tests/api/smoke.test.ts:5:252)

Test Suites: 2 failed, 4 passed, 6 total
Tests:       10 failed, 26 passed, 36 total
Snapshots:   0 total
Time:        25.013 s
Ran all test suites.
npm error Lifecycle script `test:api` failed with error:
npm error code 1
npm error path C:\Users\User\Downloads\habit-activity-tracker\api
npm error workspace @habit-tracker/api@0.1.0
npm error location C:\Users\User\Downloads\habit-activity-tracker\api
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects api --runInBand

```

# F-05 green run

- Commit: `0ea95c1`
- Command: `npm --workspace api run test:unit && npm --workspace api run test:api`
- Exit code: `0/0`
- Evidence note: Record validators/endpoints are present; unit tests passed 7/7 and API tests passed 36/36.

## Raw command output

```text

> @habit-tracker/api@0.1.0 test:unit
> cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects unit --runInBand --passWithNoTests

Running one project: unit
(node:23948) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

Test Suites: 3 passed, 3 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        0.53 s, estimated 1 s
Ran all test suites.


> @habit-tracker/api@0.1.0 test:api
> cross-env NODE_OPTIONS=--experimental-vm-modules jest --selectProjects api --runInBand

Running one project: api
(node:8544) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

Test Suites: 6 passed, 6 total
Tests:       36 passed, 36 total
Snapshots:   0 total
Time:        26.01 s
Ran all test suites.

```

Test-design commit: `7f3f6a3`. Implementation commit: `0ea95c1`. UI work was added later in `e1707e6`; the final release run is recorded separately.
