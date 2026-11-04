import { Pool } from 'pg';
import { runMigrations } from '../../src/db/migrate.js';

export const testDatabaseUrl = (): string => {
  const value = process.env.TEST_DATABASE_URL;
  if (!value) {
    throw new Error('Set TEST_DATABASE_URL for database tests.');
  }
  return value;
};

export const resetTestDatabase = async (): Promise<Pool> => {
  const pool = new Pool({ connectionString: testDatabaseUrl() });
  await pool.query('DROP SCHEMA public CASCADE');
  await pool.query('CREATE SCHEMA public');
  await runMigrations(pool);
  return pool;
};
