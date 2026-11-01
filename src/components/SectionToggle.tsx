import './sectionToggle.css';
export default function SectionToggle({ id, controls, label, expanded, onToggle }: {
  id: string; controls: string; label: string; expanded: boolean; onToggle: () => void;
}) {
  const action = (expanded ? 'Свернуть' : 'Развернуть') + ' раздел «' + label + '»';
  return <button type="button" className="section-toggle" id={id} aria-label={action} title={action}
    aria-expanded={expanded} aria-controls={controls} onClick={event => {
      if (expanded && document.getElementById(controls)?.contains(document.activeElement)) event.currentTarget.focus();
      onToggle();
    }}><span aria-hidden="true">⌄</span></button>;
}
