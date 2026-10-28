import { spheres } from '../../domain/activity';
import type { RelicsModel } from '../../application/useRelicsModel';
import { localDay } from '../../domain/activity';
import { yesterday } from '../dates';
import HabitActions from '../../components/HabitActions';
import SphereIcon from '../../components/SphereIcon';
import RelicArt from './RelicArt';
import ShellIcon from './ShellIcon';
import './inventory.css';

export default function RelicInventory({ model }: { model: RelicsModel }) {
  return <section className="relic-inventory" aria-labelledby="habits-title" id="inventory">
    <div className="inventory-heading"><div><h2 id="habits-title" tabIndex={-1}>{model.showArchived ? 'Архив реликвий' : 'Ваши реликвии'}</h2>
      <p>{model.showArchived ? 'История остаётся с вами. Привычку можно восстановить.' : 'Привычки, которым вы уделяете внимание.'}</p></div>
      <div className="inventory-heading__actions"><button className="button-quiet" ref={model.archiveToggle} onClick={model.toggleArchive} disabled={model.busy || model.managingHabit}>
        {model.showArchived ? 'Активные' : 'Архив привычек'}</button>
        <button className="button-primary" ref={model.addHabitButton} onClick={model.beginCreate} disabled={!model.canSave || model.busy || model.managingHabit} aria-haspopup="dialog"><ShellIcon kind="plus" />Добавить привычку</button></div>
    </div>
    <div className="inventory-date"><div className="date-shortcuts" role="group" aria-label="Быстрый выбор даты">
      <button aria-pressed={model.day === localDay()} disabled={model.busy || model.managingHabit} onClick={() => model.setDay(localDay())}>Сегодня</button>
      <button aria-pressed={model.day === yesterday()} disabled={model.busy || model.managingHabit} onClick={() => model.setDay(yesterday())}>Вчера</button></div>
      <label>Выбрать дату<input type="date" value={model.day} max={localDay()} disabled={model.busy || model.managingHabit} onChange={event => model.setDay(event.target.value)} /></label>
    </div>
    {!model.visibleHabits.length && <p className="inventory-empty">{model.showArchived ? 'В архиве пока нет привычек.' : 'Добавьте привычку, когда будет удобно.'}</p>}
    <ul className="relic-grid" id="habit-list">{model.visibleHabits.map(habit => {
      const done = model.activities.some(entry => entry.habitId === habit.id && entry.occurredOn === model.day);
      return <li className={`relic-item${done && !model.showArchived ? ' is-complete' : ''}`} data-habit-id={habit.id} data-sphere={habit.spheres[0]} key={habit.id}>
        <HabitActions habit={habit} disabled={model.busy || model.managingHabit} onEdit={() => model.beginManagement(habit, 'edit')}
          onArchive={() => model.beginManagement(habit, 'archive')} onRestore={() => model.restoreHabit(habit)} />
        <RelicArt sphere={habit.spheres[0]} />
        <div className="relic-item__definition"><h4>{habit.name}</h4>
          <p className="sphere-tags">{habit.spheres.map(sphere => <span data-sphere={sphere} key={sphere}><SphereIcon sphere={sphere} />{spheres[sphere]}</span>)}</p></div>
        {!model.showArchived ? <button className="completion-button" disabled={!model.canSave || model.busy || model.managingHabit || done} onClick={() => model.log(habit)} aria-label={`${done ? 'Отмечено' : 'Отметить'}: ${habit.name}`}>
          <ShellIcon kind={done ? 'check' : 'plus'} /><span>{done ? 'Отмечено' : 'Отметить'}</span></button>
          : <button className="restore-button" disabled={model.busy || model.managingHabit} onClick={() => model.restoreHabit(habit)}>Восстановить</button>}
      </li>;
    })}</ul>
    <p className="save-status" role="status" aria-live="polite">{model.busy ? 'Сохраняем…' : model.message}</p>
    {model.error && !model.formOpen && <p role="alert">{model.error}</p>}
  </section>;
}
