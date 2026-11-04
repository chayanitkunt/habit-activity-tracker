import { Router } from 'express';
import type { Pool } from 'pg';
import type { AuthenticatedRequest } from '../auth/types.js';
import type { AppConfig } from '../config/env.js';
import { AppError, ErrorCode } from '../errors.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { AuthService } from '../services/auth.service.js';
import { validateTemplate, validateTemplateUpdate } from '../validators/template.js';

const templateColumns = 'id, name, description, unit, min_value, max_value, is_active, updated_at';
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
  router.patch('/:id', requireAuth(authService), requireRole('program_manager'), async (request, response, next) => {
    try {
      const id = String(request.params.id);
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
        throw new AppError(400, ErrorCode.INVALID_TEMPLATE_UPDATE, 'The template id is invalid.');
      }
      const existing = await pool.query<{ id: string; min_value: number; max_value: number }>('SELECT id, min_value, max_value FROM activity_templates WHERE id = $1', [id]);
      if (!existing.rowCount) throw new AppError(404, ErrorCode.TEMPLATE_NOT_FOUND, 'The activity template was not found.');
      const validation = validateTemplateUpdate(request.body);
      if (!validation.valid) {
        const code = Object.prototype.hasOwnProperty.call(validation.details, 'unit') ? ErrorCode.UNIT_IMMUTABLE : ErrorCode.INVALID_TEMPLATE_UPDATE;
        throw new AppError(400, code, 'The activity template update is invalid.', validation.details);
      }
      const nextMin = validation.value.min_value ?? Number(existing.rows[0].min_value);
      const nextMax = validation.value.max_value ?? Number(existing.rows[0].max_value);
      if (nextMin > nextMax) throw new AppError(400, ErrorCode.INVALID_TEMPLATE_UPDATE, 'The activity template update is invalid.', { max_value: 'Maximum value must be greater than or equal to the minimum value.' });
      const entries = Object.entries(validation.value);
      const values: unknown[] = [];
      const assignments = entries.map(([field, value], index) => { values.push(value); return `${field} = $${index + 1}`; });
      values.push(id);
      const result = await pool.query(`UPDATE activity_templates SET ${assignments.join(', ')}, updated_at = now() WHERE id = $${values.length} RETURNING ${templateColumns}`, values);
      if (!result.rowCount) throw new AppError(409, ErrorCode.TEMPLATE_UPDATE_CONFLICT, 'The activity template could not be updated.');
      response.status(200).json({ template: mapTemplate(result.rows[0]) });
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        next(new AppError(409, ErrorCode.TEMPLATE_UPDATE_CONFLICT, 'The activity template could not be updated.'));
        return;
      }
      next(error);
    }
  });
  return router;
};
