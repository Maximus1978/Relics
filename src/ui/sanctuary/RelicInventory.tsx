import { spheres } from '../../domain/activity';
import type { SelectedDayActivity } from '../../domain/selectedDayActivity';
import type { RelicsModel } from '../../application/useRelicsModel';
import HabitActions from '../../components/HabitActions';
import SectionToggle from '../../components/SectionToggle';
import SphereIcon from '../../components/SphereIcon';
import { displayDay } from '../dates';
import { HabitMedal } from '../sigils/HabitMedal';
import ShellIcon from './ShellIcon';
import './inventory.css';

export default function RelicInventory({ model, selected, expanded, onToggle }: { model: RelicsModel; selected: SelectedDayActivity; expanded: boolean; onToggle: () => void }) {
  const activeCount = model.habits.filter(habit => habit.archivedAt === null).length;
  const unavailable = !model.canSave || model.busy || model.managingHabit;
  const completionUnavailable = unavailable || !selected.day;
  const dateLabel = displayDay(selected.day);

  return <section className="relic-inventory" aria-labelledby="habits-title" id="inventory">
    <div className="inventory-heading"><div className="inventory-heading__title"><SectionToggle id="inventory-toggle" controls="inventory-body" label={model.showArchived ? 'Архив реликвий' : 'Ваши реликвии'} expanded={expanded} onToggle={onToggle} /><div><h2 id="habits-title" tabIndex={-1}>{model.showArchived ? 'Архив реликвий' : 'Ваши реликвии'}</h2>
      <p>{expanded ? model.showArchived ? 'История остаётся с вами. Привычку можно восстановить.' : 'Привычки, которым вы уделяете внимание.' : model.canSave ? 'Активных привычек: ' + activeCount : 'Данные привычек загружаются…'}</p></div></div>
      <div className="inventory-heading__actions"><button className="button-quiet" ref={model.archiveToggle} onClick={model.toggleArchive} disabled={model.busy || model.managingHabit}>
        {model.showArchived ? 'Активные' : 'Архив привычек'}</button>
        <button className="button-primary" ref={model.addHabitButton} onClick={model.beginCreate} disabled={unavailable} aria-haspopup="dialog"><ShellIcon kind="plus" />Добавить привычку</button></div>
    </div>
    <div className="section-content" id="inventory-body" hidden={!expanded} inert={!expanded}>
    {!model.visibleHabits.length && <p className="inventory-empty">{model.showArchived ? 'В архиве пока нет привычек.' : 'Добавьте привычку, когда будет удобно.'}</p>}
    <ul className="relic-grid" id="habit-list">{model.visibleHabits.map(habit => {
      const activityId = selected.activityIdsByHabit.get(habit.id);
      const done = activityId !== undefined;
      const archived = habit.archivedAt !== null;
      const action = done ? 'Отменить отметку' : 'Отметить';
      const face = <>
        {done && <span className="relic-item__check">
          <ShellIcon kind="check" />
          {archived && <span className="relic-item__sr">Есть запись на выбранную дату</span>}
        </span>}
        <span className="relic-item__medal" aria-hidden={!archived}>
          <HabitMedal material="stone" stage={1} resonance={0} iconId={habit.iconId} />
        </span>
        <span className="relic-item__definition">
          <span className="relic-item__name">{habit.name}</span>
          <span className="sphere-tags" id={'habit-spheres-' + habit.id}>{habit.spheres.map(sphere => <span data-sphere={sphere} key={sphere}><SphereIcon sphere={sphere} />{spheres[sphere]}</span>)}</span>
        </span>
      </>;

      return <li className={'relic-item' + (done ? ' is-complete' : '')} data-habit-id={habit.id} data-completed={done} key={habit.id}>
        {archived ? <div className="relic-item__face">{face}</div>
          : <button type="button" className="relic-item__face completion-button"
              aria-disabled={completionUnavailable} aria-pressed={done}
              aria-describedby={'habit-spheres-' + habit.id}
              aria-label={action + ': ' + habit.name + ', ' + dateLabel}
              onClick={() => {
                if (!completionUnavailable) model.toggleCompletion(habit, activityId);
              }}>
              {face}<span className="relic-item__action">{action}</span>
            </button>}
        <HabitActions habit={habit} disabled={unavailable} onEdit={() => model.beginManagement(habit, 'edit')}
          onArchive={() => model.beginManagement(habit, 'archive')} />
        {archived && <button type="button" className="restore-button" id={'restore-habit-' + habit.id} disabled={unavailable}
          aria-label={'Восстановить: ' + habit.name} onClick={() => model.restoreHabit(habit)}>Восстановить</button>}
      </li>;
    })}</ul>
    </div>
    <p className="save-status" role="status" aria-live="polite">{model.busy ? 'Сохраняем…' : model.message}</p>
    {model.error && !model.formOpen && <p role="alert">{model.error}</p>}
  </section>;
}
