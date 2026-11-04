import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { closePool, getPool } from '../db/pool.js';
import { runMigrations } from '../db/migrate.js';
import { loadConfig } from '../config/env.js';

export const runSeed = async (): Promise<void> => {
  const pool = getPool();
  await runMigrations(pool);
  const config = loadConfig();
  const passwordHash = await bcrypt.hash(config.seedDemoPassword, 12);
  const accounts = [
    ['pm1@example.com', 'program_manager'],
    ['alice@example.com', 'participant'],
    ['bob@example.com', 'participant'],
  ] as const;
  for (const [email, role] of accounts) {
    await pool.query(
      `INSERT INTO users (email, password_hash, role, is_active)
       VALUES ($1, $2, $3, true)
       ON CONFLICT ((lower(email))) DO UPDATE
       SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, is_active = true, updated_at = now()`,
      [email, passwordHash, role]
    );
  }
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
