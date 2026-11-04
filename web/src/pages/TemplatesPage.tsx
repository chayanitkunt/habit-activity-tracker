import { useEffect, useState } from 'react';
import type { User } from '../auth/authApi';
import { TemplateForm } from '../components/TemplateForm';
import { TemplateSelector, type ActivityTemplate } from '../components/TemplateSelector';

export const TemplatesPage = ({ user }: { user: User }) => {
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [editing, setEditing] = useState<ActivityTemplate | null>(null);
  const load = async () => { setLoading(true); setError(null); try { const response = await fetch('/api/activity-templates', { credentials: 'include' }); const body = await response.json(); if (!response.ok) throw new Error(body.error?.message || 'Unable to load activity templates.'); setTemplates(body.templates); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load activity templates.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const list = <section className="card" aria-label="Template list"><h1 style={{ fontSize: '1.15rem' }}>Activity templates</h1><p className="muted">{user.role === 'program_manager' ? 'All templates' : 'Available templates'}</p>
    {loading ? <p aria-busy="true">Loading activity templates…</p> : error ? <><p role="alert">{error}</p><button type="button" className="btn-ghost" onClick={() => void load()}>Try again</button></> : <><TemplateSelector templates={templates} />{user.role === 'program_manager' && <ul>{templates.map((template) => <li key={template.id}><button type="button" onClick={() => setEditing(template)}>Edit {template.name}</button></li>)}</ul>}</>}
  </section>;
  return user.role === 'program_manager' ? <div className="grid-2"><TemplateForm onCreated={(template) => setTemplates((current) => [...current, template])} />{editing && <TemplateForm template={editing} onUpdated={(updated) => { setTemplates((current) => current.map((item) => item.id === updated.id ? updated : item)); setEditing(updated); }} />}{list}</div> : list;
};
