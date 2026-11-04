import { FormEvent, useState } from 'react';

const todayBangkok = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export const RecordForm = ({ goalId, minValue, maxValue, unit, onSaved }: { goalId: string; minValue: number; maxValue: number; unit: string; onSaved?: () => void }) => {
  const [quantity, setQuantity] = useState('');
  const [activityDate, setActivityDate] = useState(todayBangkok());
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true); setErrors({}); setMessage(null);
    try {
      const response = await fetch(`/api/goals/${goalId}/records`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_date: activityDate, quantity: Number(quantity) }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrors(body.error?.details ?? {});
        setMessage(body.error?.code === 'DUPLICATE_DAILY_RECORD' ? 'A record already exists for this date.' : body.error?.message ?? 'Unable to save activity.');
        return;
      }
      setQuantity(''); setMessage('Activity saved.'); onSaved?.();
    } catch { setMessage('Unable to save activity. Please try again.'); }
    finally { setSaving(false); }
  };

  return <form onSubmit={submit} aria-label="Record daily activity">
    <p>Valid range: {minValue}–{maxValue} {unit}</p>
    <label>Activity value<input type="number" min={minValue} max={maxValue} step="any" value={quantity} onChange={(event) => setQuantity(event.target.value)} required /></label>
    {errors.quantity && <p role="alert">{errors.quantity}</p>}
    <label>Record date<input type="date" value={activityDate} onChange={(event) => setActivityDate(event.target.value)} required /></label>
    {errors.activity_date && <p role="alert">{errors.activity_date}</p>}
    {message && <p role={Object.keys(errors).length || message.startsWith('A record') ? 'alert' : 'status'}>{message}</p>}
    <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save activity'}</button>
  </form>;
};
