import { Router } from 'express';
import type { Pool } from 'pg';
import type { AppConfig } from '../config/env.js';
import type { AuthenticatedRequest } from '../auth/types.js';
import { AppError, ErrorCode } from '../errors.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { requireOwnedGoal } from '../middleware/goalOwnership.js';
import { AuthService } from '../services/auth.service.js';
import { isUuid, validateGoal } from '../validators/goal.js';

const goalColumns = "id, participant_id, template_id, target, to_char(start_date, 'YYYY-MM-DD') AS start_date, to_char(end_date, 'YYYY-MM-DD') AS end_date, created_at, updated_at";
const mapGoal = (row: Record<string, unknown>) => ({ ...row, target: Number(row.target), start_date: String(row.start_date), end_date: String(row.end_date) });

export const createGoalsRouter = (pool: Pool, config: AppConfig): Router => {
  const router = Router();
  const authService = new AuthService(pool, config);
  router.post('/', requireAuth(authService), requireRole('participant'), async (request, response, next) => {
    try {
      const validation = validateGoal(request.body, config.appTimezone);
      if (!validation.valid) {
        const code = typeof request.body?.template_id === 'string' && !isUuid(request.body.template_id) ? ErrorCode.INVALID_GOAL_ID : ErrorCode.INVALID_GOAL;
        throw new AppError(400, code, 'The goal is invalid.', validation.details);
      }
      const template = await pool.query<{ id: string; is_active: boolean }>('SELECT id, is_active FROM activity_templates WHERE id = $1', [validation.value.template_id]);
      if (!template.rowCount || !template.rows[0].is_active) throw new AppError(404, ErrorCode.TEMPLATE_NOT_FOUND, 'The activity template was not found.');
      const user = (request as AuthenticatedRequest).user!;
      const result = await pool.query(`INSERT INTO goals (participant_id, template_id, target, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING ${goalColumns}`, [user.id, validation.value.template_id, validation.value.target, validation.value.start_date, validation.value.end_date]);
      response.status(201).json({ goal: mapGoal(result.rows[0]) });
    } catch (error) { next(error); }
  });
  router.get('/', requireAuth(authService), requireRole('participant'), async (request, response, next) => {
    try {
      const user = (request as AuthenticatedRequest).user!;
      const result = await pool.query(`SELECT ${goalColumns} FROM goals WHERE participant_id = $1 ORDER BY start_date ASC, created_at ASC`, [user.id]);
      response.status(200).json({ goals: result.rows.map(mapGoal) });
    } catch (error) { next(error); }
  });
  router.get('/:id', requireAuth(authService), requireRole('participant'), requireOwnedGoal(pool), (request, response) => {
    response.status(200).json({ goal: (request as AuthenticatedRequest).goal });
  });
  return router;
};
