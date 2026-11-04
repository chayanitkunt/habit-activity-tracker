export interface RecordInput {
  activity_date: string;
  quantity: number;
}

export type RecordValidationResult =
  | { valid: true; value: RecordInput }
  | { valid: false; field: 'activity_date' | 'quantity'; details: Record<string, string> };

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const allowedFields = new Set(['activity_date', 'quantity']);

export const isCalendarDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !datePattern.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

export const validateRecord = (input: unknown): RecordValidationResult => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, field: 'quantity', details: { body: 'An activity record object is required.' } };
  }
  const body = input as Record<string, unknown>;
  const unknown = Object.keys(body).find((key) => !allowedFields.has(key));
  if (unknown) return { valid: false, field: 'quantity', details: { [unknown]: 'This field is not allowed.' } };
  if (typeof body.quantity !== 'number' || !Number.isFinite(body.quantity)) {
    return { valid: false, field: 'quantity', details: { quantity: 'Quantity must be a finite number.' } };
  }
  if (!isCalendarDate(body.activity_date)) {
    return { valid: false, field: 'activity_date', details: { activity_date: 'Activity date must be a valid calendar date.' } };
  }
  return { valid: true, value: { quantity: body.quantity, activity_date: body.activity_date } };
};

export const validateQuantityRange = (quantity: number, min: number, max: number): RecordValidationResult | null => {
  if (quantity < min || quantity > max) {
    return { valid: false, field: 'quantity', details: { quantity: `Quantity must be between ${min} and ${max}.` } };
  }
  return null;
};
