# Required test excerpts

Execution result for both excerpts: API suite passed `44/44` on tested commit `7620242`; full output is in `sprint1-test-api-7620242.log`.

## Domain rule: duplicate daily record - BR-07 / TEST-05.4 / AC-05.4

Source: `api/tests/api/records.test.ts`.

```ts
it('TEST-05.4 / AC-05.4 maps duplicate records to 409 and database rejects a direct duplicate', async () => {
  const alice = await login('alice@example.com');
  await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 }).expect(201);
  await alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 50 }).expect(409);
  await expect(pool.query('INSERT INTO daily_records (goal_id, activity_date, quantity) VALUES ($1, $2, $3)', [aliceGoalId, today, 75])).rejects.toMatchObject({ code: '23505' });
  expect((await pool.query('SELECT quantity FROM daily_records WHERE goal_id = $1', [aliceGoalId])).rows).toEqual([{ quantity: '25.00' }]);
});
```

The same file also asserts the concurrent result:

```ts
const responses = await Promise.all([1, 2].map(() => alice.post(`/api/goals/${aliceGoalId}/records`).send({ activity_date: today, quantity: 25 })));
expect(responses.map((response) => response.status).sort()).toEqual([201, 409]);
```

Test-design commit: `7f3f6a3` (`test(F-05): add failing record tests (AC-05.1..05.8)`). Implementation commits: `0ea95c1`, `e1707e6`; merged by PR #20 at `f65eff3`. A standalone raw red log for the earlier commit was not retained, so it is disclosed rather than represented as passing evidence.

## Ownership restriction - TEST-04.6 / AC-04.6

Source: `api/tests/api/goals.test.ts`.

```ts
it('TEST-04.6 / AC-04.6 hides another participant goal with 404', async () => {
  const agent = await login('alice@example.com');
  await agent.get(`/api/goals/${bobGoalId}`).expect(404);
});
```

This proves that Alice cannot retrieve Bob's private goal by ID. The same API suite contains the role restriction for a Manager:

```ts
it('TEST-04.5 / AC-04.5 rejects Program Manager goal creation', async () => {
  await agent.post('/api/goals').send({ template_id: templateId, target: 10, start_date: '2026-11-04', end_date: '2026-11-04' }).expect(403);
});
```

Test-design commit: `015f923` (`test(F-04): add failing goal tests`). Implementation commits: `db13132`, `e66cb9c`, `66a4575`; merged by PR #18 at `c05f258`. A standalone raw red log for the earlier commit was not retained.
