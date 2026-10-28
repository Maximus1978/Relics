import { useRef, useState } from 'react';
import { localDay } from './domain/activity';
import { recentActivity } from './domain/recentActivity';
import { useRelicsModel } from './application/useRelicsModel';
import HabitForm from './components/HabitForm';
import { displayDay } from './ui/dates';
import SphereInstallation from './ui/sanctuary/SphereInstallation';
import RelicInventory from './ui/sanctuary/RelicInventory';
import Chronicle from './ui/sanctuary/Chronicle';
import WorldDialog from './ui/sanctuary/WorldDialog';
import RelicArt from './ui/sanctuary/RelicArt';
import ShellIcon from './ui/sanctuary/ShellIcon';
import { sanctuaryArt } from './ui/sanctuary/art';
import './ui/sanctuary/shell.css';

export default function App() {
  const model = useRelicsModel();
  const [journalOpen, setJournalOpen] = useState(false);
  const journal = useRef<HTMLDetailsElement>(null);
  const observation = recentActivity(model.activities, localDay());

  function navigate(destination: 'sanctuary' | 'chronicle' | 'archive') {
    if (model.busy || model.managingHabit) return;
    if (destination === 'chronicle') {
      setJournalOpen(true);
      requestAnimationFrame(() => { journal.current?.scrollIntoView({ block: 'nearest' }); journal.current?.querySelector('summary')?.focus(); });
    } else {
      model.setShowArchived(destination === 'archive');
      document.getElementById(destination === 'archive' ? 'inventory' : 'main-content')?.scrollIntoView({ block: 'start' });
    }
  }

  return <div className="sanctuary-app">
    <div className="world-backdrop" aria-hidden="true"><img src={sanctuaryArt.environment} className="sanctuary-scene" width="1672" height="941" alt="" fetchPriority="high" /></div>
    <a className="skip-link" href="#habits-title">Перейти к реликвиям</a>
    <aside className="app-rail">
      <a className="app-brand" href="#main-content" aria-label="Relics — Sanctuary"><svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 2 37 24 20 46 3 24ZM20 9v30M10 24h20m-15-8 5 8-5 8m10-16-5 8 5 8" /></svg><span>Relics<small>Жизнь как приключение</small></span></a>
      <nav aria-label="Разделы Relics"><button aria-current={!model.showArchived ? 'page' : undefined} onClick={() => navigate('sanctuary')}><ShellIcon kind="sanctuary" /><span>Sanctuary</span></button>
        <button onClick={() => navigate('chronicle')}><ShellIcon kind="chronicle" /><span>Хроника</span></button>
        <button aria-current={model.showArchived ? 'page' : undefined} onClick={() => navigate('archive')}><ShellIcon kind="archive" /><span>Архив</span></button></nav>
      <div className="rail-reflection"><span aria-hidden="true">◇</span><p>«Маленькие действия оставляют большую историю».</p><span aria-hidden="true">◇</span></div>
      <p className={model.native ? 'rail-status' : 'preview-notice'}>{model.native ? 'Локально · офлайн' : 'Демонстрация. Вымышленные данные; изменения не сохраняются.'}</p>
    </aside>
    <main className="sanctuary-main" id="main-content">
      <header className="world-heading"><div><h1>Sanctuary</h1><p>Ваше убежище · первая эпоха</p></div><div className="world-heading__date"><span className="world-heading__sun" aria-hidden="true">☼</span><span>{displayDay(model.day)}<small>{model.native ? 'Локально · в своём ритме' : 'Демонстрация · без сохранения'}</small></span></div></header>
      <SphereInstallation observation={observation} />
      <RelicInventory model={model} />
      <Chronicle model={model} open={journalOpen} onToggle={setJournalOpen} reference={journal} />
    </main>
    <nav className="mobile-navigation" aria-label="Разделы на узком экране"><button onClick={() => navigate('sanctuary')}><ShellIcon kind="sanctuary" /><span>Sanctuary</span></button><button onClick={() => navigate('chronicle')}><ShellIcon kind="chronicle" /><span>Хроника</span></button><button onClick={() => navigate('archive')}><ShellIcon kind="archive" /><span>Архив</span></button></nav>
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
