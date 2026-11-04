import bcrypt from 'bcryptjs';
import request from 'supertest';
import type { Pool } from 'pg';
import { createApp } from '../../src/app.js';
import { resetTestDatabase } from '../helpers/testDb.js';

let pool: Pool; let goalId: string; let otherGoalId: string; const password = 'test-password';
beforeEach(async () => {
  pool = await resetTestDatabase(); const hash = await bcrypt.hash(password, 12);
  const users = await pool.query<{ id: string; email: string }>("INSERT INTO users(email,password_hash,role) VALUES ('pm@x.com',$1,'program_manager'),('a@x.com',$1,'participant'),('b@x.com',$1,'participant') RETURNING id,email", [hash]);
  const pm = users.rows[0].id; const a = users.rows[1].id; const b = users.rows[2].id;
  const template = await pool.query<{ id: string }>("INSERT INTO activity_templates(name,unit,min_value,max_value,is_active,created_by) VALUES ('Read','pages',0,1000,true,$1) RETURNING id", [pm]);
  goalId = (await pool.query<{ id: string }>("INSERT INTO goals(participant_id,template_id,target,start_date,end_date) VALUES($1,$2,100,'2026-01-01','2026-12-31') RETURNING id", [a, template.rows[0].id])).rows[0].id;
  otherGoalId = (await pool.query<{ id: string }>("INSERT INTO goals(participant_id,template_id,target,start_date,end_date) VALUES($1,$2,100,'2026-01-01','2026-12-31') RETURNING id", [b, template.rows[0].id])).rows[0].id;
});
afterEach(async () => { await pool.end(); });
const login = async (email: string) => { const agent = request.agent(createApp(pool)); await agent.post('/api/auth/login').send({ email, password }).expect(200); return agent; };
describe('F-06 progress endpoint', () => {
  it('returns zero for an empty goal and server-calculated persisted progress', async () => {
    const agent = await login('a@x.com');
    expect((await agent.get(`/api/goals/${goalId}/progress`).expect(200)).body.progress).toMatchObject({ goal_id: goalId, total_recorded: 0, target: 100, percent: 0 });
    await pool.query("INSERT INTO daily_records(goal_id,activity_date,quantity) VALUES($1,'2026-11-01',50.05)", [goalId]);
    expect((await agent.get(`/api/goals/${goalId}/progress?percent=1`).expect(200)).body.progress).toMatchObject({ total_recorded: 50.05, percent: 50.1 });
  });
  it('caps at 100 and protects progress by owner and role', async () => {
    await pool.query("INSERT INTO daily_records(goal_id,activity_date,quantity) VALUES($1,'2026-11-01',150)", [goalId]);
    const owner = await login('a@x.com'); expect((await owner.get(`/api/goals/${goalId}/progress`).expect(200)).body.progress.percent).toBe(100);
    const other = await login('b@x.com'); await other.get(`/api/goals/${goalId}/progress`).expect(404);
    const manager = await login('pm@x.com'); await manager.get(`/api/goals/${goalId}/progress`).expect(403); await manager.get(`/api/goals/${goalId}/records`).expect(403); await manager.get(`/api/goals/${goalId}`).expect(403);
    expect(otherGoalId).toBeTruthy();
  });
});
