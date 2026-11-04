import { Pool } from 'pg';
import { loadConfig } from '../config/env.js';

export const createPool = (connectionString = loadConfig().databaseUrl): Pool =>
  new Pool({ connectionString });

let pool: Pool | undefined;

export const getPool = (): Pool => (pool ??= createPool());

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};
