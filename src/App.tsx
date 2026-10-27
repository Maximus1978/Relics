import { useEffect, useRef, useState } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { localDay, sampleHabits, spheres, type Activity, type Habit } from './domain/activity';
import { openActivityRepository } from './data/activityRepository';

type Repository = Awaited<ReturnType<typeof openActivityRepository>>;

export default function App() {
  const [day, setDay] = useState(localDay);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const actionLock = useRef(false);

  useEffect(() => {
    if (!isTauri()) return;
    let active = true;
    openActivityRepository().then(async store => {
      const entries = await store.list();
      if (active) { setActivities(entries); setRepository(store); }
    }).catch(() => { if (active) setError('Не удалось открыть локальную базу. Перезапустите приложение, чтобы повторить.'); });
    return () => { active = false; };
  }, []);

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

  return <main>
    <header><span className="eyebrow">RELICS · первая эпоха</span><h1>Sanctuary</h1>
      <p>Небольшие действия оставляют след. Возвращайтесь в своём ритме.</p></header>
    {!isTauri() && <p role="status">Просмотр каркаса. Локальное сохранение доступно в приложении Windows или Android.</p>}
    <section aria-labelledby="habits-title">
      <h2 id="habits-title">Отметить действие</h2>
      <label>Дата <input type="date" value={day} max={localDay()} disabled={busy}
        onChange={event => setDay(event.target.value)} /></label>
      <ul className="habits">{sampleHabits.map(habit => {
        const done = activities.some(entry => entry.habitId === habit.id && entry.occurredOn === day);
        return <li key={habit.id}><div><strong>{habit.name}</strong>
          <p>{habit.spheres.map(sphere => spheres[sphere]).join(' · ')}</p></div>
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
