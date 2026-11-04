import { useEffect, useState } from 'react';
import { RecordForm } from '../components/RecordForm';
import type { ActivityTemplate } from '../components/TemplateSelector';
import { ProgressBar } from '../components/ProgressBar';
import { HistoryTable } from '../components/HistoryTable';

interface Goal { id: string; template_id: string; target: number; start_date: string; end_date: string; }
interface DailyRecord { id: string; activity_date: string; quantity: number; }

export const GoalPage = ({ goal }: { goal: Goal }) => {
  const [template, setTemplate] = useState<ActivityTemplate | null>(null);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [percent, setPercent] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const load = async () => {
    try {
      const [templatesResponse, recordsResponse, progressResponse] = await Promise.all([
        fetch('/api/activity-templates', { credentials: 'include' }),
        fetch(`/api/goals/${goal.id}/records`, { credentials: 'include' }),
        fetch(`/api/goals/${goal.id}/progress`, { credentials: 'include' }),
      ]);
      const templatesBody = await templatesResponse.json(); const recordsBody = await recordsResponse.json(); const progressBody = await progressResponse.json();
      if (progressResponse.status === 404) throw new Error('Goal not found');
      if (!templatesResponse.ok || !recordsResponse.ok || !progressResponse.ok) throw new Error(progressBody.error?.message || recordsBody.error?.message || 'Unable to load activity history.');
      setTemplate((templatesBody.templates as ActivityTemplate[]).find((item) => item.id === goal.template_id) ?? null);
      setRecords(recordsBody.records);
      setPercent(progressBody.progress.percent);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to load activity history.'); }
  };
  useEffect(() => { void load(); }, [goal.id]);
  return <section aria-label="Goal activity">
    <h3>Record activity</h3><p>Goal period: {goal.start_date} to {goal.end_date}</p>
    {template ? <RecordForm goalId={goal.id} minValue={template.min_value} maxValue={template.max_value} unit={template.unit} onSaved={() => { void load(); }} /> : <p role="alert">The activity template is unavailable.</p>}
    {percent === null && !message ? <p aria-busy="true">Loading goal…</p> : percent !== null && <ProgressBar percent={percent} />}
    {message && <p role="alert">{message}</p>}
    <h4>History</h4><HistoryTable records={records} />
  </section>;
};
