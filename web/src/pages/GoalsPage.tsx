import { useEffect, useState } from 'react';
import { GoalPage } from './GoalPage';

interface Goal { id: string; template_id: string; target: number; start_date: string; end_date: string; }

export const GoalsPage = ({ refreshKey = 0 }: { refreshKey?: number }) => {
  const [goals, setGoals] = useState<Goal[]>([]); const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  useEffect(() => { setLoading(true); fetch('/api/goals', { credentials: 'include' }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error?.message || 'Unable to load goals.'); setGoals(body.goals); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load goals.')).finally(() => setLoading(false)); }, [refreshKey]);
  return <section aria-label="My goals"><h2>My goals</h2>{loading ? <p aria-busy="true">Loading goals…</p> : error ? <p role="alert">{error}</p> : goals.length === 0 ? <p>No goals yet.</p> : <ul>{goals.map((goal) => <li key={goal.id}>Target {goal.target}, {goal.start_date} to {goal.end_date} <button type="button" onClick={() => setSelectedGoal(goal)}>Record activity</button></li>)}</ul>}{selectedGoal && <GoalPage goal={selectedGoal} />}</section>;
};
