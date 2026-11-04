import { Router } from 'express';
import type { Pool } from 'pg';
import type { AppConfig } from '../config/env.js';
import type { AuthenticatedRequest } from '../auth/types.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { requireOwnedGoal } from '../middleware/goalOwnership.js';
import { AuthService } from '../services/auth.service.js';
import { calculateProgress } from '../services/progress.js';

export const createProgressRouter = (pool: Pool, config: AppConfig): Router => {
  const router = Router({ mergeParams: true });
  const auth = new AuthService(pool, config);
  router.get('/', requireAuth(auth), requireRole('participant'), requireOwnedGoal(pool), async (request, response, next) => {
    try {
      const goal = (request as AuthenticatedRequest).goal!;
      const result = await pool.query<{ quantity: number }>('SELECT quantity FROM daily_records WHERE goal_id = $1', [goal.id]);
      const progress = calculateProgress(goal.target, result.rows.map((row) => Number(row.quantity)));
      response.json({ progress: { goal_id: goal.id, total_recorded: progress.totalRecorded, target: goal.target, percent: progress.percent } });
    } catch (error) { next(error); }
  });
  return router;
};
