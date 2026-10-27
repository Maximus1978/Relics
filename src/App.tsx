import { useEffect, useRef, useState } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { localDay, spheres, type Activity, type Habit } from './domain/activity';
import { openActivityRepository } from './data/activityRepository';
import HabitForm from './components/HabitForm';
import HabitActions from './components/HabitActions';
import SphereIcon from './components/SphereIcon';
import { HabitStateError, HabitValidationError, type HabitInput } from './domain/habit';

type Repository = Awaited<ReturnType<typeof openActivityRepository>>;

export default function App() {
  const [day, setDay] = useState(localDay);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [creatingHabit, setCreatingHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [archivingHabit, setArchivingHabit] = useState<Habit | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const actionLock = useRef(false);
  const addHabitButton = useRef<HTMLButtonElement>(null);
  const archiveToggle = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const formOpen = creatingHabit || editingHabit !== null;
  const managingHabit = formOpen || archivingHabit !== null;
  const visibleHabits = habits.filter(habit => (habit.archivedAt !== null) === showArchived);

  useEffect(() => {
    if (!isTauri()) return;
    let active = true;
    openActivityRepository().then(async store => {
      const [entries, savedHabits] = await Promise.all([store.list(), store.listHabits('all')]);
      if (active) { setActivities(entries); setHabits(savedHabits); setRepository(store); }
    }).catch(() => { if (active) setError('Не удалось открыть локальную базу. Перезапустите приложение, чтобы повторить.'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!managingHabit && !busy && returnFocus.current) {
      const target = returnFocus.current.isConnected ? returnFocus.current : archiveToggle.current;
      target?.focus();
      returnFocus.current = null;
    }
  }, [managingHabit, busy]);

  async function perform(action: (store: Repository) => Promise<void>, success: string) {
    if (!repository || actionLock.current) return;
    actionLock.current = true;
    setBusy(true); setError(''); setMessage('');
    let saved = false;
    try {
      await action(repository);
      saved = true;
      const [entries, savedHabits] = await Promise.all([repository.list(), repository.listHabits('all')]);
      setActivities(entries); setHabits(savedHabits);
      setMessage(success);
    } catch (failure) {
      setError(saved ? 'Изменение сохранено, но список не обновился. Перезапустите приложение.'
        : failure instanceof HabitStateError || failure instanceof HabitValidationError ? failure.message
        : failure instanceof Error && failure.message.startsWith('Выберите') ? failure.message
        : failure instanceof Error && /дат/.test(failure.message) ? failure.message
        : 'Не удалось сохранить изменение. Повторите попытку.');
    } finally { actionLock.current = false; setBusy(false); }
  }

  function log(habit: Habit) {
    void perform(store => store.log(habit, day), 'Отметка сохранена на выбранную дату.');
  }

  async function saveHabit(input: HabitInput) {
    await perform(async store => {
      if (editingHabit) await store.updateHabit(editingHabit.id, input.name, input.spheres);
      else { await store.createHabit(input.name, input.spheres); setShowArchived(false); }
      setCreatingHabit(false); setEditingHabit(null);
    }, 'Привычка сохранена.');
  }

  function beginManagement(habit: Habit, action: 'edit' | 'archive') {
    setError(''); setMessage('');
    returnFocus.current = document.getElementById(`habit-actions-${habit.id}`);
    if (action === 'edit') setEditingHabit(habit);
    else setArchivingHabit(habit);
  }

  function cancelManagement() {
    setCreatingHabit(false); setEditingHabit(null); setArchivingHabit(null); setError('');
  }

  return <main>
    <header><span className="eyebrow">RELICS · первая эпоха</span><h1>Sanctuary</h1>
      <p>Небольшие действия оставляют след. Возвращайтесь в своём ритме.</p></header>
    {!isTauri() && <p role="status">Просмотр каркаса. Локальное сохранение доступно в приложении Windows или Android.</p>}
    <section aria-labelledby="habits-title">
      <div className="section-heading"><h2 id="habits-title">Отметить действие</h2>
        <button ref={addHabitButton} type="button" disabled={busy || managingHabit || (isTauri() && !repository)}
          aria-expanded={creatingHabit} aria-controls="create-habit-panel"
          onClick={() => { setError(''); setMessage(''); returnFocus.current = addHabitButton.current; setCreatingHabit(true); }}>+ Добавить привычку</button></div>
      {formOpen && <div id="create-habit-panel"><HabitForm key={editingHabit?.id ?? 'new'} busy={busy} canSave={!!repository}
        habit={editingHabit ?? undefined} saveError={error} onSave={saveHabit} onCancel={cancelManagement} /></div>}
      {archivingHabit && <div className="archive-confirmation" role="group" aria-labelledby="archive-confirm-title"
        onKeyDown={event => { if (event.key === 'Escape' && !busy) { event.preventDefault(); cancelManagement(); } }}>
        <h3 id="archive-confirm-title">В архив: {archivingHabit.name}?</h3>
        <p>Привычка исчезнет из активного списка. Все записи в журнале сохранятся. Вы сможете восстановить её из архива.</p>
        <div className="form-actions"><button type="button" disabled={busy} onClick={() => void perform(async store => {
          await store.archiveHabit(archivingHabit.id); setArchivingHabit(null);
        }, 'Привычка перемещена в архив. История сохранена.')}>В архив</button>
          <button type="button" autoFocus disabled={busy} onClick={cancelManagement}>Отмена</button></div>
      </div>}
      <label>Дата <input type="date" value={day} max={localDay()} disabled={busy || managingHabit}
        onChange={event => setDay(event.target.value)} /></label>
      {!isTauri() && <p>В браузерном просмотре привычки из SQLite не загружаются. Можно посмотреть форму создания; сохранение доступно в приложении.</p>}
      <div className="section-heading"><h3>{showArchived ? 'Архив привычек' : 'Активные привычки'}</h3>
        <button ref={archiveToggle} type="button" disabled={busy || managingHabit} aria-controls="habit-list"
          onClick={() => { setShowArchived(current => !current); setError(''); setMessage(''); }}>
          {showArchived ? 'Активные привычки' : 'Архив привычек'}</button></div>
      {repository && !visibleHabits.length && <p>{showArchived ? 'В архиве пока нет привычек.' : 'Здесь будут ваши активные привычки. Можно добавить новую или восстановить привычку из архива.'}</p>}
      <ul className="habits" id="habit-list">{visibleHabits.map(habit => {
        const done = activities.some(entry => entry.habitId === habit.id && entry.occurredOn === day);
        return <li key={habit.id}><div><strong>{habit.name}</strong>
          <p className="sphere-tags">{habit.spheres.map(sphere => <span key={sphere}><SphereIcon sphere={sphere} />{spheres[sphere]}</span>)}</p></div>
          <div className="habit-controls">{!showArchived && <button disabled={!repository || busy || managingHabit || done} onClick={() => log(habit)}
            aria-label={`${done ? 'Отмечено' : 'Отметить'}: ${habit.name}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" />
              {done ? <path d="m7 12 3 3 7-7" /> : <path d="M7 12h10M12 7v10" />}</svg>
            {done ? 'Отмечено' : 'Отметить'}</button>}
            <HabitActions habit={habit} disabled={!repository || busy || managingHabit}
              onEdit={() => beginManagement(habit, 'edit')} onArchive={() => beginManagement(habit, 'archive')}
              onRestore={() => {
                returnFocus.current = document.getElementById(`habit-actions-${habit.id}`);
                void perform(store => store.restoreHabit(habit.id), 'Привычка возвращена в активный список.');
              }} /></div></li>;
      })}</ul>
      <p role="status" aria-live="polite">{busy ? 'Сохраняем…' : message}</p>
      {error && !formOpen && <p role="alert">{error}</p>}
    </section>
    <section aria-labelledby="journal-title"><h2 id="journal-title">Жизненный журнал</h2>
      {!activities.length && <p>Здесь появятся ваши действия. Начните, когда будет удобно.</p>}
      <ul>{activities.map(entry => <li className="entry" key={entry.id}>
        <div><time dateTime={entry.occurredOn}>{entry.occurredOn}</time> · {entry.habitName}
          <p>{entry.spheres.map(sphere => spheres[sphere]).join(' · ')}</p></div>
        <button disabled={busy || managingHabit} onClick={() => void perform(store => store.remove(entry.id), 'Отметка отменена.')}
          aria-label={`Отменить: ${entry.habitName}, ${entry.occurredOn}`}>Отменить</button>
      </li>)}</ul>
    </section>
    <footer>Локальный журнал · Mastery, Resonance и открытия появятся в следующих срезах.</footer>
  </main>;
}
