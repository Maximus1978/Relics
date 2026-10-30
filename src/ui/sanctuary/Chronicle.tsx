import { useEffect, useRef } from 'react';
import { spheres } from '../../domain/activity';
import type { RelicsModel } from '../../application/useRelicsModel';
import { chronicleGroups, chronicleDay, recordCountLabel } from '../chronicleGroups';
import SphereIcon from '../../components/SphereIcon';
import ShellIcon from './ShellIcon';
import './chronicle.css';
export default function Chronicle({ model }: {
    model: RelicsModel;
}) {
    const groups = chronicleGroups(model.activities);
    const canceled = useRef<{
        id: string;
        next: string | null;
    } | null>(null);
    const orderedIds = groups.flatMap(g => g.entries.map(e => e.id));
    useEffect(() => {
        if (canceled.current && !model.activities.some(a => a.id === canceled.current!.id)) {
            (document.getElementById('cancel-activity-' + canceled.current.next) ?? document.getElementById('journal-title'))?.focus({ preventScroll: true });
            canceled.current = null;
        }
    }, [model.activities]);
    return <section className="chronicle-view" id="chronicle" aria-labelledby="journal-title">
  <header className="chronicle-heading"><div><div className="chronicle-heading__title"><ShellIcon kind="chronicle"/><h1 id="journal-title" tabIndex={-1}>Жизненная хроника</h1></div><p>История записанных активностей. Названия и сферы сохранены такими, какими были в момент отметки.</p></div><span className="chronicle-total" aria-label="Всего записей">{model.canSave ? recordCountLabel(model.activities.length) : '— записей'}</span></header>
  <div className="chronicle-feedback"><p className="save-status" role="status" aria-live="polite">{model.busy ? 'Сохраняем…' : model.message}</p>{model.error && <p role="alert">{model.error}</p>}</div>
  {!model.canSave ? !model.error && <p className="chronicle-empty" role="status">Загружаем хронику…</p> : !groups.length ? <div className="chronicle-empty"><ShellIcon kind="chronicle"/><h2>Здесь пока нет записей</h2><p>Записанные активности появятся в вашей хронике. Начните, когда будет удобно.</p></div> : <div className="chronicle-groups">{groups.map(group => <section className="chronicle-date-group" key={group.day} aria-labelledby={'chronicle-day-' + group.day}>
   <h2 id={'chronicle-day-' + group.day}><time dateTime={group.day}>{chronicleDay(group.day)}</time><span>{recordCountLabel(group.entries.length)}</span></h2>
   <ul>{group.entries.map(entry => <li className="entry" data-activity-id={entry.id} key={entry.id}><span className="entry__symbol" data-sphere={entry.spheres[0]}><SphereIcon sphere={entry.spheres[0]}/></span>
    <div className="entry__details"><time dateTime={entry.occurredOn}>{entry.occurredOn}</time><h3>{entry.habitName}</h3><p className="sphere-tags">{entry.spheres.map(sphere => <span data-sphere={sphere} key={sphere}><SphereIcon sphere={sphere}/>{spheres[sphere]}</span>)}</p></div>
    <button className="button-quiet" id={'cancel-activity-' + entry.id} disabled={model.busy || model.managingHabit} onClick={() => { const index = orderedIds.indexOf(entry.id); canceled.current = { id: entry.id, next: orderedIds[index + 1] ?? orderedIds[index - 1] ?? null }; model.cancelActivity(entry.id); }} aria-label={'Отменить: ' + entry.habitName + ', ' + entry.occurredOn}>Отменить</button>
   </li>)}</ul>
  </section>)}</div>}
 </section>;
}
