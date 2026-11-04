import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Pool } from 'pg';
import { closePool, getPool } from './pool.js';

const migrationDirectory = join(dirname(fileURLToPath(import.meta.url)), 'migrations');

export const runMigrations = async (pool: Pool = getPool()): Promise<void> => {
  await pool.query(
    'CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())'
  );

  const files = (await readdir(migrationDirectory)).filter((file) => file.endsWith('.sql')).sort();

  for (const name of files) {
    const existing = await pool.query('SELECT 1 FROM schema_migrations WHERE name = $1', [name]);
    if (existing.rowCount && existing.rowCount > 0) {
      continue;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const sql = await readFile(join(migrationDirectory, name), 'utf8');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? resolve(process.argv[1]) : '';
if (executedFilePath === currentFilePath) {
  runMigrations()
    .then(() => closePool())
    .catch(async (error) => {
      console.error('Migration failed:', error instanceof Error ? error.message : error);
      await closePool();
      process.exitCode = 1;
    });
}
