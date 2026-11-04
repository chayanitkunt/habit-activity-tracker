# Required test excerpts

## Domain rule: duplicate daily record

Source: `api/tests/api/records.test.ts`, `TEST-05.4 / AC-05.4`.

The test creates a record for a goal/date, submits the same goal/date again, and expects `409`. It also checks the database unique constraint directly and covers concurrent requests so that only one request succeeds.

The recorded test-design commit is `7f3f6a3` (`test(F-05): add failing record tests (AC-05.1..05.8)`). The implementation is verified by the S1-10 API result on `7620242`. A standalone raw red log for the earlier commit was not retained and is not represented as passing evidence.

## Role/ownership restriction

Source: `api/tests/api/goals.test.ts`, `TEST-04.6 / AC-04.6`.

The test creates a goal owned by Bob, authenticates as Alice, requests Bob's goal by ID, and expects `404`; the response does not disclose the private resource. The same suite also checks that a Program Manager receives `403` for goal creation.

The recorded test-design commit is `015f923` (`test(F-04): add failing goal tests`). The passing result is included in the S1-10 API run on `7620242`. A standalone raw red log for the earlier commit was not retained.
