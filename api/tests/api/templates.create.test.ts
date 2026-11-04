import bcrypt from 'bcryptjs';
import request from 'supertest';
import { Pool } from 'pg';
import { createApp } from '../../src/app.js';
import { resetTestDatabase, testDatabaseUrl } from '../helpers/testDb.js';

let pool: Pool;
const password = 'test-password';
const payload = { name: 'Focused reading', description: 'Pages read each day', unit: 'pages', min_value: 0, max_value: 500 };
const login = async (email: string) => { const agent = request.agent(createApp(pool)); await agent.post('/api/auth/login').send({ email, password }).expect(200); return agent; };

beforeEach(async () => {
  pool = await resetTestDatabase();
  const hash = await bcrypt.hash(password, 12);
  await pool.query(`INSERT INTO users (email, password_hash, role) VALUES ('pm@example.com', $1, 'program_manager'), ('participant@example.com', $1, 'participant')`, [hash]);
});
afterEach(async () => { if (pool) await pool.end(); });

describe('F-03 template creation', () => {
  it('TEST-03.1 / AC-03.1 creates an active template for a Program Manager', async () => {
    const response = await (await login('pm@example.com')).post('/api/activity-templates').send(payload).expect(201);
    expect(response.body.template).toEqual(expect.objectContaining({ ...payload, is_active: true }));
    const saved = await pool.query('SELECT * FROM activity_templates WHERE id = $1', [response.body.template.id]);
    expect(saved.rows[0].created_by).toBeTruthy();
  });
  it('TEST-03.2 / AC-03.2 rejects a participant without storing a row', async () => {
    const response = await (await login('participant@example.com')).post('/api/activity-templates').send(payload).expect(403);
    expect(response.body.error.code).toBe('ROLE_FORBIDDEN');
    expect((await pool.query('SELECT * FROM activity_templates')).rowCount).toBe(0);
  });
  it('TEST-03.3 / AC-03.3 rejects invalid input without storing a row', async () => {
    const response = await (await login('pm@example.com')).post('/api/activity-templates').send({ ...payload, min_value: 4, max_value: 3, is_active: false }).expect(400);
    expect(response.body.error.code).toBe('INVALID_TEMPLATE');
    expect((await pool.query('SELECT * FROM activity_templates')).rowCount).toBe(0);
  });
  it('TEST-03.4 / AC-03.4 persists after a new database connection', async () => {
    const response = await (await login('pm@example.com')).post('/api/activity-templates').send(payload).expect(201);
    await pool.end();
    pool = new Pool({ connectionString: testDatabaseUrl() });
    const row = await pool.query('SELECT name FROM activity_templates WHERE id = $1', [response.body.template.id]);
    expect(row.rows[0].name).toBe(payload.name);
  });
  it('TEST-03.5 / AC-03.5 requires a session', async () => {
    await request(createApp(pool)).post('/api/activity-templates').send(payload).expect(401);
  });
});
