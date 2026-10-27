import { useEffect, useRef, useState } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { localDay, spheres, type Activity, type Habit } from './domain/activity';
import { openActivityRepository } from './data/activityRepository';
import AddHabitForm from './components/AddHabitForm';
import SphereIcon from './components/SphereIcon';
import type { HabitInput } from './domain/habit';

type Repository = Awaited<ReturnType<typeof openActivityRepository>>;

export default function App() {
  const [day, setDay] = useState(localDay);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [creatingHabit, setCreatingHabit] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const actionLock = useRef(false);
  const addHabitButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (!isTauri()) return;
    let active = true;
    openActivityRepository().then(async store => {
      const [entries, savedHabits] = await Promise.all([store.list(), store.listHabits()]);
      if (active) { setActivities(entries); setHabits(savedHabits); setRepository(store); }
    }).catch(() => { if (active) setError('Не удалось открыть локальную базу. Перезапустите приложение, чтобы повторить.'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!creatingHabit && !busy && returnFocus.current) {
      addHabitButton.current?.focus();
      returnFocus.current = false;
    }
  }, [creatingHabit, busy]);

  async function perform(action: (store: Repository) => Promise<void>, success: string) {
    if (!repository || actionLock.current) return;
    actionLock.current = true;
    setBusy(true); setError(''); setMessage('');
    let saved = false;
    try {
      await action(repository);
      saved = true;
      setActivities(await repository.list());
      setMessage(success);
    } catch (failure) {
      setError(saved ? 'Изменение сохранено, но журнал не обновился. Перезапустите приложение.'
        : failure instanceof Error && failure.message.startsWith('Выберите') ? failure.message
        : failure instanceof Error && /дат/.test(failure.message) ? failure.message
        : 'Не удалось сохранить изменение. Повторите попытку.');
    } finally { actionLock.current = false; setBusy(false); }
  }

  function log(habit: Habit) {
    void perform(store => store.log(habit, day), 'Отметка сохранена на выбранную дату.');
  }

  async function createHabit(input: HabitInput) {
    await perform(async store => {
      const habit = await store.createHabit(input.name, input.spheres);
      setHabits(current => [...current, habit]);
      setCreatingHabit(false);
    }, 'Привычка сохранена.');
  }

  return <main>
    <header><span className="eyebrow">RELICS · первая эпоха</span><h1>Sanctuary</h1>
      <p>Небольшие действия оставляют след. Возвращайтесь в своём ритме.</p></header>
    {!isTauri() && <p role="status">Просмотр каркаса. Локальное сохранение доступно в приложении Windows или Android.</p>}
    <section aria-labelledby="habits-title">
      <div className="section-heading"><h2 id="habits-title">Отметить действие</h2>
        <button ref={addHabitButton} type="button" disabled={busy || creatingHabit || (isTauri() && !repository)}
          aria-expanded={creatingHabit} aria-controls="create-habit-panel"
          onClick={() => { setError(''); setMessage(''); returnFocus.current = true; setCreatingHabit(true); }}>+ Добавить привычку</button></div>
      {creatingHabit && <div id="create-habit-panel"><AddHabitForm busy={busy} canSave={!!repository}
        onSave={createHabit} onCancel={() => { setCreatingHabit(false); setError(''); }} /></div>}
      <label>Дата <input type="date" value={day} max={localDay()} disabled={busy}
        onChange={event => setDay(event.target.value)} /></label>
      {!isTauri() && <p>В браузерном просмотре привычки из SQLite не загружаются. Можно посмотреть форму создания; сохранение доступно в приложении.</p>}
      <ul className="habits">{habits.map(habit => {
        const done = activities.some(entry => entry.habitId === habit.id && entry.occurredOn === day);
        return <li key={habit.id}><div><strong>{habit.name}</strong>
          <p className="sphere-tags">{habit.spheres.map(sphere => <span key={sphere}><SphereIcon sphere={sphere} />{spheres[sphere]}</span>)}</p></div>
          <button disabled={!repository || busy || done} onClick={() => log(habit)}
            aria-label={`${done ? 'Отмечено' : 'Отметить'}: ${habit.name}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" />
              {done ? <path d="m7 12 3 3 7-7" /> : <path d="M7 12h10M12 7v10" />}</svg>
            {done ? 'Отмечено' : 'Отметить'}</button></li>;
      })}</ul>
      <p role="status" aria-live="polite">{busy ? 'Сохраняем…' : message}</p>
      {error && <p role="alert">{error}</p>}
    </section>
    <section aria-labelledby="journal-title"><h2 id="journal-title">Жизненный журнал</h2>
      {!activities.length && <p>Здесь появятся ваши действия. Начните, когда будет удобно.</p>}
      <ul>{activities.map(entry => <li className="entry" key={entry.id}>
        <div><time dateTime={entry.occurredOn}>{entry.occurredOn}</time> · {entry.habitName}
          <p>{entry.spheres.map(sphere => spheres[sphere]).join(' · ')}</p></div>
        <button disabled={busy} onClick={() => void perform(store => store.remove(entry.id), 'Отметка отменена.')}
          aria-label={`Отменить: ${entry.habitName}, ${entry.occurredOn}`}>Отменить</button>
      </li>)}</ul>
    </section>
    <footer>Локальный журнал · Mastery, Resonance и открытия появятся в следующих срезах.</footer>
  </main>;
}
