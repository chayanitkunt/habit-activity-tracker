export interface TemplateInput { name: string; description: string | null; unit: string; min_value: number; max_value: number; }
export type TemplateValidationResult = { valid: true; value: TemplateInput } | { valid: false; details: Record<string, string> };
const allowedFields = new Set(['name', 'description', 'unit', 'min_value', 'max_value']);

export const validateTemplate = (input: unknown): TemplateValidationResult => {
  const details: Record<string, string> = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { valid: false, details: { body: 'A template object is required.' } };
  const body = input as Record<string, unknown>;
  for (const key of Object.keys(body)) if (!allowedFields.has(key)) details[key] = 'This field is not allowed.';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const unit = typeof body.unit === 'string' ? body.unit.trim() : '';
  if (!name) details.name = 'Name is required.';
  if (!unit) details.unit = 'Unit is required.';
  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') details.description = 'Description must be text.';
  const min = body.min_value;
  const max = body.max_value;
  if (typeof min !== 'number' || !Number.isFinite(min)) details.min_value = 'Minimum value must be a number.';
  if (typeof max !== 'number' || !Number.isFinite(max)) details.max_value = 'Maximum value must be a number.';
  if (typeof min === 'number' && min < 0) details.min_value = 'Minimum value cannot be negative.';
  if (typeof min === 'number' && typeof max === 'number' && Number.isFinite(min) && Number.isFinite(max) && min > max) details.max_value = 'Maximum value must be greater than or equal to the minimum value.';
  if (Object.keys(details).length) return { valid: false, details };
  return { valid: true, value: { name, description: typeof body.description === 'string' ? body.description.trim() || null : null, unit, min_value: min as number, max_value: max as number } };
};
