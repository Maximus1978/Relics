import { spheres } from '../../domain/activity';
import type { SelectedDayActivity } from '../../domain/selectedDayActivity';
import type { RelicsModel } from '../../application/useRelicsModel';
import HabitActions from '../../components/HabitActions';
import SphereIcon from '../../components/SphereIcon';
import RelicArt from './RelicArt';
import ShellIcon from './ShellIcon';
import './inventory.css';
import SectionToggle from '../../components/SectionToggle';

export default function RelicInventory({ model, selected, expanded, onToggle }: { model: RelicsModel; selected: SelectedDayActivity; expanded: boolean; onToggle: () => void }) {
  const activeCount = model.habits.filter(habit => habit.archivedAt === null).length;
  return <section className="relic-inventory" aria-labelledby="habits-title" id="inventory">
    <div className="inventory-heading"><div className="inventory-heading__title"><SectionToggle id="inventory-toggle" controls="inventory-body" label={model.showArchived ? 'Архив реликвий' : 'Ваши реликвии'} expanded={expanded} onToggle={onToggle} /><div><h2 id="habits-title" tabIndex={-1}>{model.showArchived ? 'Архив реликвий' : 'Ваши реликвии'}</h2>
      <p>{expanded ? model.showArchived ? 'История остаётся с вами. Привычку можно восстановить.' : 'Привычки, которым вы уделяете внимание.' : model.canSave ? 'Активных привычек: ' + activeCount : 'Данные привычек загружаются…'}</p></div></div>
      <div className="inventory-heading__actions"><button className="button-quiet" ref={model.archiveToggle} onClick={model.toggleArchive} disabled={model.busy || model.managingHabit}>
        {model.showArchived ? 'Активные' : 'Архив привычек'}</button>
        <button className="button-primary" ref={model.addHabitButton} onClick={model.beginCreate} disabled={!model.canSave || model.busy || model.managingHabit} aria-haspopup="dialog"><ShellIcon kind="plus" />Добавить привычку</button></div>
    </div>
    <div className="section-content" id="inventory-body" hidden={!expanded} inert={!expanded}>
    {!model.visibleHabits.length && <p className="inventory-empty">{model.showArchived ? 'В архиве пока нет привычек.' : 'Добавьте привычку, когда будет удобно.'}</p>}
    <ul className="relic-grid" id="habit-list">{model.visibleHabits.map(habit => {
      const done = selected.completedHabitIds.has(habit.id);
      return <li className={`relic-item${done ? ' is-complete' : ''}`} data-habit-id={habit.id} data-sphere={habit.spheres[0]} data-state={done ? 'illuminated' : 'subdued'} key={habit.id}>
        <HabitActions habit={habit} disabled={model.busy || model.managingHabit} onEdit={() => model.beginManagement(habit, 'edit')}
          onArchive={() => model.beginManagement(habit, 'archive')} onRestore={() => model.restoreHabit(habit)} />
        <RelicArt sphere={habit.spheres[0]} illuminated={done} />
        <div className="relic-item__definition"><h4>{habit.name}</h4>
          <p className="sphere-tags">{habit.spheres.map(sphere => <span data-sphere={sphere} key={sphere}><SphereIcon sphere={sphere} />{spheres[sphere]}</span>)}</p></div>
        {!model.showArchived ? <button className="completion-button" disabled={!model.canSave || model.busy || model.managingHabit || done} onClick={() => model.log(habit)} aria-label={`${done ? 'Отмечено' : 'Отметить'}: ${habit.name}`}>
          <ShellIcon kind={done ? 'check' : 'plus'} /><span>{done ? 'Отмечено' : 'Отметить'}</span></button>
          : <button className="restore-button" disabled={model.busy || model.managingHabit} onClick={() => model.restoreHabit(habit)}>Восстановить</button>}
      </li>;
    })}</ul>
    </div>
    <p className="save-status" role="status" aria-live="polite">{model.busy ? 'Сохраняем…' : model.message}</p>
    {model.error && !model.formOpen && <p role="alert">{model.error}</p>}
  </section>;
}
