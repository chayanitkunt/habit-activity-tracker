import { useEffect, useState } from 'react';
import type { User } from '../auth/authApi';
import { TemplateForm } from '../components/TemplateForm';
import { TemplateSelector, type ActivityTemplate } from '../components/TemplateSelector';

export const TemplatesPage = ({ user }: { user: User }) => {
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const load = async () => { setLoading(true); setError(null); try { const response = await fetch('/api/activity-templates', { credentials: 'include' }); const body = await response.json(); if (!response.ok) throw new Error(body.error?.message || 'Unable to load activity templates.'); setTemplates(body.templates); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load activity templates.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  return <main><h1>Activity templates</h1>{user.role === 'program_manager' && <TemplateForm onCreated={(template) => setTemplates((current) => [...current, template])} />}
    <h2>{user.role === 'program_manager' ? 'All templates' : 'Available templates'}</h2>
    {loading ? <p aria-busy="true">Loading activity templates…</p> : error ? <><p role="alert">{error}</p><button type="button" onClick={() => void load()}>Try again</button></> : <TemplateSelector templates={templates} />}
  </main>;
};
