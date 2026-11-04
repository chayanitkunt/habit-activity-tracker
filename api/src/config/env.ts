import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env from current working directory
dotenv.config();

// Also check project root .env if running from inside api/ or another subdirectory
const rootEnvPath = resolve(fileURLToPath(new URL('../../../.env', import.meta.url)));
if (existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

export interface AppConfig {
  sessionSecret: string;
  databaseUrl: string;
  sessionMaxAgeHours: number;
  appTimezone: string;
  seedDemoPassword: string;
  appEnv: string;
}

const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const loadConfig = (): AppConfig => {
  const sessionMaxAgeHours = Number(required('SESSION_MAX_AGE_HOURS'));
  if (!Number.isInteger(sessionMaxAgeHours) || sessionMaxAgeHours <= 0) {
    throw new Error('SESSION_MAX_AGE_HOURS must be a positive integer.');
  }

  const appTimezone = required('APP_TIMEZONE');
  try {
    Intl.DateTimeFormat('en-US', { timeZone: appTimezone });
  } catch {
    throw new Error('APP_TIMEZONE must be a valid IANA time zone.');
  }

  const databaseUrl = required('DATABASE_URL');
  try {
    new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid connection URL.');
  }

  return {
    sessionSecret: required('SESSION_SECRET'),
    databaseUrl,
    sessionMaxAgeHours,
    appTimezone,
    seedDemoPassword: required('SEED_DEMO_PASSWORD'),
    appEnv: process.env.APP_ENV?.trim() || 'development',
  };
};
