import bcrypt from 'bcryptjs';
import request from 'supertest';
import type { Pool } from 'pg';
import { createApp } from '../../src/app.js';
import { resetTestDatabase } from '../helpers/testDb.js';

let pool: Pool;
const password = 'test-password';
const login = async (email: string) => { const agent = request.agent(createApp(pool)); await agent.post('/api/auth/login').send({ email, password }); return agent; };
beforeEach(async () => {
  pool = await resetTestDatabase(); const hash = await bcrypt.hash(password, 12);
  const users = await pool.query(`INSERT INTO users (email, password_hash, role) VALUES ('pm@example.com', $1, 'program_manager'), ('participant@example.com', $1, 'participant') RETURNING id`, [hash]);
  await pool.query(`INSERT INTO activity_templates (name, unit, min_value, max_value, is_active, created_by) VALUES ('Study Time', 'minutes', 1, 720, true, $1), ('Meditation', 'minutes', 1, 120, false, $1)`, [users.rows[0].id]);
});
afterEach(async () => { if (pool) await pool.end(); });
describe('F-03 template browsing', () => {
  it('TEST-03.7 / AC-03.6 participant gets active templates only', async () => { const r = await (await login('participant@example.com')).get('/api/activity-templates').expect(200); expect(r.body.templates.map((t: { name: string }) => t.name)).toEqual(['Study Time']); });
  it('TEST-03.8 / AC-03.7 requires a session', async () => { await request(createApp(pool)).get('/api/activity-templates').expect(401); });
  it('TEST-03.9 / AC-03.8 hides inactive Meditation from a participant', async () => { const r = await (await login('participant@example.com')).get('/api/activity-templates'); expect(r.body.templates.some((t: { name: string }) => t.name === 'Meditation')).toBe(false); });
  it('TEST-03.10 / AC-03.9 shows inactive Meditation to a Program Manager', async () => { const r = await (await login('pm@example.com')).get('/api/activity-templates').expect(200); expect(r.body.templates.map((t: { name: string }) => t.name)).toEqual(expect.arrayContaining(['Study Time', 'Meditation'])); });
});
