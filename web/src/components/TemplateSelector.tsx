export interface ActivityTemplate { id: string; name: string; description: string | null; unit: string; min_value: number; max_value: number; is_active: boolean; }

export const TemplateSelector = ({ templates, onSelect }: { templates: ActivityTemplate[]; onSelect?: (template: ActivityTemplate) => void }) => {
  if (!templates.length) return <p>No activity templates are available yet.</p>;
  return <ul aria-label="Activity templates">{templates.map((template) => <li key={template.id}>
    {onSelect ? <button type="button" onClick={() => onSelect(template)}>{template.name} ({template.unit})</button> : <><strong>{template.name}</strong> ({template.unit})</>}
    <span> — {template.min_value}–{template.max_value}</span>{template.description && <span>: {template.description}</span>}{!template.is_active && <span> (inactive)</span>}
  </li>)}</ul>;
};
