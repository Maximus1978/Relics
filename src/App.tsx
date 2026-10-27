import { useEffect, useRef, useState } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { localDay, spheres, type Activity, type Habit, type SphereId } from './domain/activity';
import { openActivityRepository } from './data/activityRepository';
import HabitForm from './components/HabitForm';
import HabitActions from './components/HabitActions';
import SphereIcon from './components/SphereIcon';
import SphereMedallion from './components/SphereMedallion';
import SanctuaryScene from './components/SanctuaryScene';
import { sphereVisuals } from './ui/sphereVisuals';
import { displayDay, yesterday } from './ui/dates';
import { HabitStateError, HabitValidationError, type HabitInput } from './domain/habit';

type Repository = Awaited<ReturnType<typeof openActivityRepository>>;

export default function App() {
  const native = isTauri();
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
    let active = true;
    const opening = native ? openActivityRepository()
      : import('./preview/sanctuaryPreview').then(preview => preview.createSanctuaryPreview());
    opening.then(async store => {
      const [entries, savedHabits] = await Promise.all([store.list(), store.listHabits('all')]);
      if (active) { setActivities(entries); setHabits(savedHabits); setRepository(store); }
    }).catch(() => { if (active) setError(native ? 'Не удалось открыть локальную базу. Перезапустите приложение, чтобы повторить.' : 'Не удалось открыть демонстрацию. Обновите страницу.'); });
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
      setMessage(native ? success : `Демонстрация: ${success} Изменения только в памяти этой страницы.`);
    } catch (failure) {
      setError(saved ? native ? 'Изменение сохранено, но список не обновился. Перезапустите приложение.' : 'Демонстрация изменена, но список не обновился. Обновите страницу.'
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

  return <main id="main-content">
    <a className="skip-link" href="#habits-title">Перейти к привычкам</a>
    <header className="masthead">
      <a className="brand" href="#main-content" aria-label="Relics — начало страницы">
        <svg className="brand-mark" viewBox="0 0 40 48" aria-hidden="true"><path d="M20 2 37 24 20 46 3 24ZM20 9v30M10 24h20m-15-8 5 8-5 8m10-16-5 8 5 8" /></svg>
        <span>Relics<span className="brand-caption">Жизнь оставляет след</span></span>
      </a>
      <span className="storage-note"><span className="status-dot" />{native ? 'Локально · без спешки' : 'Браузерная демонстрация'}</span>
    </header>
    {!native && <aside className="preview-notice" aria-label="Режим демонстрации">
      <strong>Демонстрация</strong><span>Вымышленные данные. Можно попробовать действия; изменения не сохраняются и исчезнут после обновления страницы.</span>
    </aside>}
    <section className="hero" aria-labelledby="sanctuary-title">
      <div className="hero-copy"><span className="eyebrow"><span className="tiny-diamond" />Первая эпоха · ваше убежище</span>
        <h1 id="sanctuary-title">Sanctuary</h1>
        <p>Маленькие действия.<br /><em>Ваша большая история.</em></p>
        <span className="hero-note">Возвращайтесь в своём ритме. Здесь нет спешки.</span>
      </div>
      <SanctuaryScene />
      <span className="hero-ornament" aria-hidden="true">◇</span>
    </section>
    <section className="sphere-overview" aria-labelledby="spheres-title">
      <div className="section-kicker"><h2 id="spheres-title">Пять граней жизни</h2><span>Разные стороны вашего пути</span></div>
      <ul className="sphere-gallery">{(Object.keys(spheres) as SphereId[]).map(sphere => <li key={sphere} data-sphere={sphere}>
        <SphereMedallion sphere={sphere} illuminated />
        <div><h3>{spheres[sphere]}</h3><p className="gemstone-name">{sphereVisuals[sphere].gemstone}</p></div>
      </li>)}</ul>
    </section>
    <section className="daily-section" aria-labelledby="habits-title">
      <div className="section-heading collection-heading"><div><span className="eyebrow">Ежедневный путь</span><h2 id="habits-title" tabIndex={-1}>Ваши привычки</h2>
        <p>Выберите, чему хочется уделить внимание.</p></div>
        <button ref={addHabitButton} className="button-primary" type="button" disabled={busy || managingHabit || !repository}
          aria-expanded={creatingHabit} aria-controls="create-habit-panel"
          onClick={() => { setError(''); setMessage(''); returnFocus.current = addHabitButton.current; setCreatingHabit(true); }}>
          <span aria-hidden="true">+</span> Добавить привычку</button></div>
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
      <div className="date-toolbar">
        <div className="date-shortcuts" role="group" aria-label="Быстрый выбор даты">
          <button type="button" aria-pressed={day === localDay()} disabled={busy || managingHabit} onClick={() => setDay(localDay())}>Сегодня</button>
          <button type="button" aria-pressed={day === yesterday()} disabled={busy || managingHabit} onClick={() => setDay(yesterday())}>Вчера</button>
        </div>
        <label className="date-picker"><span>Выбрать дату</span><input type="date" value={day} max={localDay()} disabled={busy || managingHabit}
          onChange={event => setDay(event.target.value)} /></label>
        <p className="selected-date">{displayDay(day)}</p>
      </div>
      <div className="list-heading"><h3>{showArchived ? 'Архив привычек' : 'Активные привычки'}</h3>
        <button ref={archiveToggle} className="button-quiet" type="button" disabled={busy || managingHabit} aria-controls="habit-list"
          onClick={() => { setShowArchived(current => !current); setError(''); setMessage(''); }}>
          {showArchived ? 'К активным привычкам' : 'Архив привычек'}<span aria-hidden="true">↗</span></button></div>
      {!repository && !error && <p role="status">Открываем ваши привычки…</p>}
      {repository && !visibleHabits.length && <div className="empty-state"><p>{showArchived ? 'В архиве пока тихо.' : 'Место для того, что вам близко.'}</p>
        <span>{showArchived ? 'Здесь можно будет найти и восстановить привычки.' : 'Добавьте привычку или верните знакомую из архива.'}</span></div>}
      <ul className="habit-grid" id="habit-list">{visibleHabits.map(habit => {
        const done = activities.some(entry => entry.habitId === habit.id && entry.occurredOn === day);
        return <li className={`habit-card${done && !showArchived ? ' is-complete' : ''}`} key={habit.id} data-habit-id={habit.id} data-sphere={habit.spheres[0]}>
          <div className="habit-identity"><SphereMedallion sphere={habit.spheres[0]} ornamented={false} />
            <div className="habit-copy"><h4>{habit.name}</h4><p>{sphereVisuals[habit.spheres[0]].invitation}</p></div>
            <HabitActions habit={habit} disabled={!repository || busy || managingHabit}
              onEdit={() => beginManagement(habit, 'edit')} onArchive={() => beginManagement(habit, 'archive')}
              onRestore={() => {
                returnFocus.current = document.getElementById(`habit-actions-${habit.id}`);
                void perform(store => store.restoreHabit(habit.id), 'Привычка возвращена в активный список.');
              }} /></div>
          <div className="habit-bottom"><p className="sphere-tags">{habit.spheres.map(sphere => <span key={sphere} data-sphere={sphere}><SphereIcon sphere={sphere} />{spheres[sphere]}</span>)}</p>
            {!showArchived && <button className="completion-button" disabled={!repository || busy || managingHabit || done} onClick={() => log(habit)}
              aria-label={`${done ? 'Отмечено' : 'Отметить'}: ${habit.name}`}>
              <svg className="line-icon" viewBox="0 0 24 24" aria-hidden="true">
                {done ? <path d="m5 12 4 4L19 6" /> : <path d="M5 12h14M12 5v14" />}</svg>
              {done ? 'Отмечено' : 'Отметить'}</button>}
          </div></li>;
      })}</ul>
      <p className="save-status" role="status" aria-live="polite">{busy ? 'Сохраняем…' : message}</p>
      {error && !formOpen && <p role="alert">{error}</p>}
    </section>
    <section className="journal-section" aria-labelledby="journal-title">
      <details className="journal">
        <summary><svg className="line-icon journal-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v18M9 7h6m-6 4h6m-6 4h4" /></svg>
          <span><h2 id="journal-title">Жизненный журнал</h2><span className="journal-description">Каждая запись — часть вашей истории</span></span>
          <span className="journal-count">{activities.length} записей</span><span className="journal-chevron" aria-hidden="true">⌄</span>
        </summary>
        {!activities.length && <p className="journal-empty">Здесь появятся ваши действия. Начните, когда будет удобно.</p>}
        <ul>{activities.map(entry => <li className="entry" key={entry.id}>
          <div><time dateTime={entry.occurredOn}>{entry.occurredOn}</time><h3>{entry.habitName}</h3>
            <p className="sphere-tags">{entry.spheres.map(sphere => <span key={sphere} data-sphere={sphere}><SphereIcon sphere={sphere} />{spheres[sphere]}</span>)}</p></div>
          <button className="button-quiet" disabled={busy || managingHabit} onClick={() => void perform(store => store.remove(entry.id), 'Отметка отменена.')}
            aria-label={`Отменить: ${entry.habitName}, ${entry.occurredOn}`}>Отменить</button>
        </li>)}</ul>
      </details>
    </section>
    <footer><span className="tiny-diamond" aria-hidden="true" /><p>Путь складывается из того, что вам важно.</p><span>{native ? 'Sanctuary · локальная история' : 'Демонстрация · без сохранения'}</span></footer>
  </main>;
}
