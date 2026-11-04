import { FormEvent, useState } from 'react';
import type { ActivityTemplate } from './TemplateSelector';

type FieldErrors = Record<string, string>;
const initial = { name: '', description: '', unit: '', min_value: '', max_value: '' };

export const TemplateForm = ({ onCreated }: { onCreated: (template: ActivityTemplate) => void }) => {
  const [values, setValues] = useState(initial); const [errors, setErrors] = useState<FieldErrors>({}); const [saving, setSaving] = useState(false); const [message, setMessage] = useState<string | null>(null);
  const update = (field: keyof typeof initial, value: string) => setValues((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setErrors({}); setMessage(null); setSaving(true);
    try {
      const response = await fetch('/api/activity-templates', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, min_value: Number(values.min_value), max_value: Number(values.max_value) }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) { setErrors(body.error?.details ?? {}); setMessage(body.error?.message ?? 'Unable to save the template.'); return; }
      onCreated(body.template); setValues(initial); setMessage('Activity template created.');
    } catch { setMessage('Unable to save the template. Please try again.'); } finally { setSaving(false); }
  };
  return <form className="card" onSubmit={submit} aria-label="Create activity template">
    <h2>Create activity template</h2>
    <label>Name<input value={values.name} onChange={(e) => update('name', e.target.value)} required /></label>{errors.name && <p role="alert">{errors.name}</p>}
    <label>Description<textarea value={values.description} onChange={(e) => update('description', e.target.value)} /></label>{errors.description && <p role="alert">{errors.description}</p>}
    <label>Unit<input value={values.unit} onChange={(e) => update('unit', e.target.value)} required /></label>{errors.unit && <p role="alert">{errors.unit}</p>}
    <label>Minimum value<input type="number" min="0" step="any" value={values.min_value} onChange={(e) => update('min_value', e.target.value)} required /></label>{errors.min_value && <p role="alert">{errors.min_value}</p>}
    <label>Maximum value<input type="number" min="0" step="any" value={values.max_value} onChange={(e) => update('max_value', e.target.value)} required /></label>{errors.max_value && <p role="alert">{errors.max_value}</p>}
    <p className="muted">Minimum value may be equal to maximum value.</p>{message && <p role={Object.keys(errors).length ? 'alert' : 'status'}>{message}</p>}
    <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save template'}</button>
  </form>;
};
