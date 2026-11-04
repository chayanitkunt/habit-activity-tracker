import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { closePool, getPool } from '../db/pool.js';
import { runMigrations } from '../db/migrate.js';

export const runSeed = async (): Promise<void> => {
  const pool = getPool();
  await runMigrations(pool);
  // Demo accounts and templates will be added with feature-owned schema migrations.
  await pool.query('SELECT 1');
};

const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? resolve(process.argv[1]) : '';
if (executedFilePath === currentFilePath) {
  runSeed()
    .then(() => closePool())
    .catch(async (error) => {
      console.error('Seed failed:', error instanceof Error ? error.message : error);
      await closePool();
      process.exitCode = 1;
    });
}
