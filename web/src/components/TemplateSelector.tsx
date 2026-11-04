export interface ActivityTemplate { id: string; name: string; description: string | null; unit: string; min_value: number; max_value: number; is_active: boolean; }

export const TemplateSelector = ({ templates, onSelect, selectedId }: { templates: ActivityTemplate[]; onSelect?: (template: ActivityTemplate) => void; selectedId?: string | null }) => {
  if (!templates.length) return <p className="empty">No activity templates are available yet.</p>;
  return <ul className="template-list" aria-label="Activity templates">{templates.map((template) => <li className="template-item" key={template.id}>
    {onSelect ? <button type="button" className="template-pick" aria-pressed={selectedId === template.id} onClick={() => onSelect(template)}>{template.name} ({template.unit})</button> : <><strong>{template.name}</strong> ({template.unit})</>}
    <span className="meta">range {template.min_value}–{template.max_value}</span>{!template.is_active && <span className="tag">inactive</span>}
    {template.description && <span className="desc">{template.description}</span>}
  </li>)}</ul>;
};
