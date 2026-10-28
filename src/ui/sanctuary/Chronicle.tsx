import type { RefObject } from 'react';
import { spheres } from '../../domain/activity';
import type { RelicsModel } from '../../application/useRelicsModel';
import SphereIcon from '../../components/SphereIcon';
import ShellIcon from './ShellIcon';
import './chronicle.css';

type Props = { model: RelicsModel; open: boolean; onToggle: (open: boolean) => void; reference: RefObject<HTMLDetailsElement | null> };

export default function Chronicle({ model, open, onToggle, reference }: Props) {
  return <section className="chronicle-panel" aria-labelledby="journal-title" id="chronicle">
    <details className="chronicle" ref={reference} open={open} onToggle={event => onToggle(event.currentTarget.open)}>
      <summary><ShellIcon kind="chronicle" /><h2 id="journal-title">Жизненная хроника</h2><span>{model.activities.length} записей</span><span className="chronicle-chevron" aria-hidden="true">⌄</span></summary>
      {!model.activities.length && <p>Здесь появятся ваши действия. Начните, когда будет удобно.</p>}
      <ul>{model.activities.map(entry => <li className="entry" key={entry.id}><span className="entry__symbol" data-sphere={entry.spheres[0]}><SphereIcon sphere={entry.spheres[0]} /></span>
        <div><time dateTime={entry.occurredOn}>{entry.occurredOn}</time><h3>{entry.habitName}</h3><p>{entry.spheres.map(sphere => spheres[sphere]).join(' · ')}</p></div>
        <button className="button-quiet" disabled={model.busy || model.managingHabit} onClick={() => model.cancelActivity(entry.id)} aria-label={`Отменить: ${entry.habitName}, ${entry.occurredOn}`}>Отменить</button></li>)}</ul>
    </details>
  </section>;
}
