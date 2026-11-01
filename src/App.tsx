import { useEffect, useRef, useState } from 'react';
import { medallionIllumination } from './domain/medallionIllumination';
import { useLocalDay } from './application/useLocalDay';
import { useRelicsModel } from './application/useRelicsModel';
import { useSectionPreferences } from './application/useSectionPreferences';
import HabitForm from './components/HabitForm';
import { yesterday } from './ui/dates';
import SphereInstallation from './ui/sanctuary/SphereInstallation';
import RelicInventory from './ui/sanctuary/RelicInventory';
import Chronicle from './ui/sanctuary/Chronicle';
import LifeRhythm from './ui/sanctuary/LifeRhythm';
import WorldDialog from './ui/sanctuary/WorldDialog';
import BackupDialog from './ui/sanctuary/BackupDialog';
import RelicArt from './ui/sanctuary/RelicArt';
import ShellIcon from './ui/sanctuary/ShellIcon';
import { sanctuaryArt } from './ui/sanctuary/art';
import './ui/sanctuary/shell.css';

export default function App() {
  const model = useRelicsModel();
  const sections = useSectionPreferences();
  const [view, setView] = useState<'sanctuary'|'chronicle'>('sanctuary');
  const [navigationRevision, setNavigationRevision] = useState(0);
  const focusTarget = useRef('sanctuary-title');
  const destination = view === 'chronicle' ? 'chronicle' : model.showArchived ? 'archive' : 'sanctuary';
  useEffect(() => {
    if (!navigationRevision) return;
    window.scrollTo({ top:0, behavior:'instant' });
    document.getElementById(focusTarget.current)?.focus({preventScroll:true});
  }, [navigationRevision]);
  const today = useLocalDay();
  const illumination = medallionIllumination(model.activities, model.day, today);
  const selected = illumination.selected;

  function navigate(destination: 'sanctuary' | 'chronicle' | 'archive') {
    if (model.busy || model.managingHabit) return;
    setView(destination === 'chronicle' ? 'chronicle' : 'sanctuary');
    if (destination !== 'chronicle') model.setShowArchived(destination === 'archive');
    focusTarget.current = destination === 'chronicle' ? 'journal-title' : destination === 'archive' ? 'habits-title' : 'sanctuary-title';
    setNavigationRevision(revision => revision + 1);
  }

  return <div className="sanctuary-app">
    <div className="world-backdrop" aria-hidden="true"><img src={sanctuaryArt.environment} className="sanctuary-scene" width="1672" height="941" alt="" fetchPriority="high" /></div>
    <a className="skip-link" href={view === 'chronicle' ? '#journal-title' : '#habits-title'}>{view === 'chronicle' ? 'Перейти к хронике' : 'Перейти к реликвиям'}</a>
    <aside className="app-rail">
      <a className="app-brand" onClick={event => {event.preventDefault();navigate('sanctuary');}} href="#main-content" aria-label="Relics — Sanctuary"><svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 2 37 24 20 46 3 24ZM20 9v30M10 24h20m-15-8 5 8-5 8m10-16-5 8 5 8" /></svg><span>Relics<small>Жизнь как приключение</small></span></a>
      <nav aria-label="Разделы Relics"><button data-nav="sanctuary" aria-current={destination === 'sanctuary' ? 'page' : undefined} onClick={() => navigate('sanctuary')}><ShellIcon kind="sanctuary" /><span>Sanctuary</span></button>
        <button data-nav="chronicle" aria-current={destination === 'chronicle' ? 'page' : undefined} onClick={() => navigate('chronicle')}><ShellIcon kind="chronicle" /><span>Хроника</span></button>
        <button data-nav="archive" aria-current={destination === 'archive' ? 'page' : undefined} onClick={() => navigate('archive')}><ShellIcon kind="archive" /><span>Архив</span></button>
        <button data-backup ref={model.backupButton} disabled={model.busy || model.managingHabit} onClick={model.openBackup}><ShellIcon kind="backup" /><span>Резервная копия</span></button></nav>
      <div className="rail-reflection"><span aria-hidden="true">◇</span><p>«Маленькие действия оставляют большую историю».</p><span aria-hidden="true">◇</span></div>
      <p className={model.native ? 'rail-status' : 'preview-notice'}>{model.native ? 'Локально · офлайн' : 'Демонстрация. Вымышленные данные; изменения не сохраняются.'}</p>
    </aside>
    <main className="sanctuary-main" id="main-content" data-view={destination} aria-labelledby={destination === 'chronicle' ? 'journal-title' : destination === 'archive' ? 'habits-title' : 'sanctuary-title'}>
      <p className="view-announcement" role="status" aria-live="polite">{destination === 'chronicle' ? 'Открыта Жизненная хроника' : destination === 'archive' ? 'Открыт архив привычек' : 'Открыт Sanctuary'}</p>
      {/* Keep inactive Sanctuary inert to retain chart preferences; Chronicle mounts only in its own view. */}
      <div className="sanctuary-view" hidden={view === 'chronicle'} inert={view === 'chronicle'}>
      <header className="world-heading"><div><h1 id="sanctuary-title" tabIndex={-1}>Sanctuary</h1><p>Ваше убежище · первая эпоха</p></div>
        <div className="world-heading__date"><span className="world-heading__sun" aria-hidden="true">☼</span><div className="date-shortcuts" role="group" aria-label="Быстрый выбор даты">
          <button aria-pressed={model.day === today} disabled={model.busy || model.managingHabit} onClick={() => model.setDay(today)}>Сегодня</button>
          <button aria-pressed={model.day === yesterday()} disabled={model.busy || model.managingHabit} onClick={() => model.setDay(yesterday())}>Вчера</button></div>
          <label>Дата отметки<input type="date" value={model.day} max={today} disabled={model.busy || model.managingHabit} onChange={event => model.setDay(event.target.value)} /></label></div>
      </header>
      <SphereInstallation illumination={illumination} />
      <RelicInventory model={model} selected={selected} expanded={sections.preferences.inventoryExpanded} onToggle={() => sections.setExpanded('inventoryExpanded', !sections.preferences.inventoryExpanded)} />
      <LifeRhythm activities={model.activities} today={today} ready={model.canSave} expanded={sections.preferences.rhythmExpanded} onToggle={() => sections.setExpanded('rhythmExpanded', !sections.preferences.rhythmExpanded)} />
      </div>
      {view === 'chronicle' && <Chronicle model={model} />}
    </main>
    <nav className="mobile-navigation" aria-label="Разделы на узком экране"><button data-nav="sanctuary" aria-current={destination === 'sanctuary' ? 'page' : undefined} onClick={() => navigate('sanctuary')}><ShellIcon kind="sanctuary" /><span>Sanctuary</span></button><button data-nav="chronicle" aria-current={destination === 'chronicle' ? 'page' : undefined} onClick={() => navigate('chronicle')}><ShellIcon kind="chronicle" /><span>Хроника</span></button><button data-nav="archive" aria-current={destination === 'archive' ? 'page' : undefined} onClick={() => navigate('archive')}><ShellIcon kind="archive" /><span>Архив</span></button><button aria-label="Резервная копия" disabled={model.busy || model.managingHabit} onClick={model.openBackup}><ShellIcon kind="backup" /><span>Копия</span></button></nav>
    {model.backupOpen && <BackupDialog model={model} />}
    {model.formOpen && <WorldDialog labelledBy="create-habit-title" busy={model.busy} onClose={model.cancelManagement}>
      <div className="habit-editor"><div className="habit-editor__art"><RelicArt sphere={model.editingHabit?.spheres[0] ?? 'recovery'} /><p>Одна привычка может объединять несколько граней жизни.</p></div>
        <HabitForm key={model.editingHabit?.id ?? 'new'} busy={model.busy} canSave={model.canSave} habit={model.editingHabit ?? undefined} saveError={model.error} onSave={model.saveHabit} onCancel={model.cancelManagement} /></div>
    </WorldDialog>}
    {model.archivingHabit && <WorldDialog labelledBy="archive-confirm-title" busy={model.busy} onClose={model.cancelManagement}>
      <div className="archive-confirmation"><ShellIcon kind="archive" /><h3 id="archive-confirm-title">В архив: {model.archivingHabit.name}?</h3><p>Привычка исчезнет из активного списка. Все записи в хронике сохранятся. Вы сможете восстановить её из архива.</p>
        <div className="form-actions"><button autoFocus onClick={model.cancelManagement} disabled={model.busy}>Отмена</button><button className="button-primary" onClick={model.archiveHabit} disabled={model.busy}>В архив</button></div></div>
    </WorldDialog>}
  </div>;
}
