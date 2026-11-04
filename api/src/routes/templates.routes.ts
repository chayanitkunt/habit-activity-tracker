import { Router } from 'express';
import type { Pool } from 'pg';
import type { AuthenticatedRequest } from '../auth/types.js';
import type { AppConfig } from '../config/env.js';
import { AppError, ErrorCode } from '../errors.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { AuthService } from '../services/auth.service.js';
import { validateTemplate } from '../validators/template.js';

const templateColumns = 'id, name, description, unit, min_value, max_value, is_active';
const mapTemplate = (row: Record<string, unknown>) => ({ ...row, min_value: Number(row.min_value), max_value: Number(row.max_value) });

export const createTemplatesRouter = (pool: Pool, config: AppConfig): Router => {
  const router = Router();
  const authService = new AuthService(pool, config);
  router.post('/', requireAuth(authService), requireRole('program_manager'), async (request, response, next) => {
    try {
      const validation = validateTemplate(request.body);
      if (!validation.valid) throw new AppError(400, ErrorCode.INVALID_TEMPLATE, 'The activity template is invalid.', validation.details);
      const user = (request as AuthenticatedRequest).user!;
      const { name, description, unit, min_value, max_value } = validation.value;
      const result = await pool.query(`INSERT INTO activity_templates (name, description, unit, min_value, max_value, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${templateColumns}`, [name, description, unit, min_value, max_value, user.id]);
      response.status(201).json({ template: mapTemplate(result.rows[0]) });
    } catch (error) { next(error); }
  });
  router.get('/', requireAuth(authService), async (request, response, next) => {
    try {
      const user = (request as AuthenticatedRequest).user!;
      const visibility = user.role === 'program_manager' ? '' : 'WHERE is_active = true';
      const result = await pool.query(`SELECT ${templateColumns} FROM activity_templates ${visibility} ORDER BY created_at ASC, name ASC`);
      response.status(200).json({ templates: result.rows.map(mapTemplate) });
    } catch (error) { next(error); }
  });
  return router;
};
