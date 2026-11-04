import express, { Express } from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());

  // Feature routes are intentionally introduced by their own Sprint 1 issues.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
