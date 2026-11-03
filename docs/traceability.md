# Requirements traceability — Sprint 1 baseline

| Requirement | Feature | Sprint | Acceptance criterion / test |
|---|---|---|---|
| FR-01 | F-01 | S1 | AC-01 valid login returns session; invalid credentials return 401. |
| FR-02 | F-01 | S1 | AC-02 `/me` returns current user and logout invalidates session. |
| FR-03 | F-03 | S1 | AC-03 manager creates template with valid fields. |
| FR-04 | F-03 | S1 | AC-04 authenticated user lists templates; unit is returned read-only. |
| FR-05 | F-03 | S1 | AC-05 manager PATCH succeeds for allowed fields and rejects `unit`. |
| FR-06 | F-04 | S1 | AC-06 participant creates a goal for a template. |
| FR-07 | F-04/F-08 | S1 | AC-07 invalid target/date input returns 400. |
| FR-08 | F-02/F-04 | S1 | AC-08 participant A cannot read participant B's goal. |
| FR-09 | F-05 | S1 | AC-09 participant records a valid daily quantity. |
| FR-10 | F-05 | S1 | AC-10 second record for same goal/date returns 409 and original remains unchanged. |
| FR-11 | F-06 | S1 | AC-11 total/target is half-up rounded to one decimal and capped at 100. |
| FR-12 | F-05/F-08 | S1 | AC-12 invalid range, future, and out-of-period dates return 400. |
| FR-13 | F-05/F-07 | S1 | AC-13 two goals using one template have independent records/progress. |
| FR-14 | F-02 | S1 | AC-14 manager and another participant receive 403/404 per policy and no private body. |
| FR-15 | F-07/F-09 | S1 | AC-15 screens show loading, empty, success, and error states. |
| FR-16 | F-11 | S3 | AC-16 schedule representation is persisted/displayed without notification dispatch. |
| BR-01 | F-06 | S1 | T-01 period-total target calculation. |
| BR-02 | F-06 | S1 | T-02 formula unit test. |
| BR-03 | F-06 | S1 | T-03 half-up and cap test. |
| BR-04 | F-05 | S1 | T-04 unique `(goal_id, activity_date)` and duplicate rejection. |
| BR-05 | F-05 | S1 | T-05 same-template goal isolation. |
| BR-06 | F-05/F-08 | S1 | T-06 inclusive min/max and outside-range tests. |
| BR-07 | F-08 | S1 | T-07 Asia/Bangkok date-boundary test. |
| BR-08 | F-04/F-08 | S1 | T-08 start today/past accepted; end before start rejected. |
| BR-09 | F-05/F-08 | S1 | T-09 outside-goal-period rejection. |
| BR-10 | F-03/F-04 | S1 | T-10 goal mutation is unavailable; template unit PATCH is rejected. |
| BR-11 | F-02/F-11 | S1/S3 | T-11 permission matrix and no-notification test. |
| NFR-01 | F-10 | S2 | N-01 p95 read/API ≤500 ms at 100k records. |
| NFR-02 | F-02/F-10 | S1 | N-02 all protected endpoint auth tests. |
| NFR-03 | F-01/F-10 | S1 | N-03 bcrypt cost and log inspection. |
| NFR-04 | F-08/F-10 | S1 | N-04 UTC persistence/timezone tests. |
| NFR-05 | F-08 | S1 | N-05 error schema contract test. |
| NFR-06 | F-10 | S1 | N-06 coverage report ≥90% for rules and endpoint permissions. |
| NFR-07 | F-10 | S3 | N-07 secret/deployment and restore exercise. |

## Coverage gaps and approved changes

Coverage gaps: none for the approved Sprint 1 baseline. F-11 and NFR-01/NFR-07 are intentionally planned outside Sprint 1 and are mapped to their later sprint. Approved changes: AD-01 through AD-17 in `srs.md`; no unapproved requirement changes.

