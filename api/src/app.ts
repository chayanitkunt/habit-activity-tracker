import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import type { Pool } from 'pg';
import { loadConfig } from './config/env.js';
import { getPool } from './db/pool.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createAuthRouter, createCurrentUserRouter } from './routes/auth.routes.js';

export const createApp = (pool: Pool = getPool()): Express => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/auth', createAuthRouter(pool, loadConfig()));
  app.use('/api', createCurrentUserRouter(pool, loadConfig()));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
