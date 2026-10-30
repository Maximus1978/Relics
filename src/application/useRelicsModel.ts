import { ContributionError } from '../domain/contributions';
import { useEffect, useRef, useState } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { localDay, type Activity, type Habit } from '../domain/activity';
import { openActivityRepository } from '../data/activityRepository';
import { HabitStateError, HabitValidationError, type HabitInput } from '../domain/habit';

type Repository = Awaited<ReturnType<typeof openActivityRepository>>;

export function useRelicsModel() {
  const native = isTauri();
  const [day, setDay] = useState(localDay);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [creatingHabit, setCreatingHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [archivingHabit, setArchivingHabit] = useState<Habit | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [repository, setRepository] = useState<Repository | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const actionLock = useRef(false);
  const addHabitButton = useRef<HTMLButtonElement>(null);
  const archiveToggle = useRef<HTMLButtonElement>(null);
  const backupButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const formOpen = creatingHabit || editingHabit !== null;
  const managingHabit = formOpen || archivingHabit !== null || backupOpen;
  const visibleHabits = habits.filter(habit => (habit.archivedAt !== null) === showArchived);

  useEffect(() => {
    let active = true;
    const opening = native ? openActivityRepository()
      : import('../preview/sanctuaryPreview').then(preview => preview.createSanctuaryPreview());
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
        : failure instanceof ContributionError || failure instanceof HabitStateError || failure instanceof HabitValidationError ? failure.message
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
      if (editingHabit) await store.updateHabit(editingHabit.id, input.name, input.spheres, input.contributionProfile);
      else { await store.createHabit(input.name, input.spheres, input.contributionProfile); setShowArchived(false); }
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


  function beginCreate() {
    setError(''); setMessage('');
    returnFocus.current = addHabitButton.current;
    setCreatingHabit(true);
  }

  function restoreHabit(habit: Habit) {
    returnFocus.current = document.getElementById(`habit-actions-${habit.id}`);
    void perform(store => store.restoreHabit(habit.id), 'Привычка возвращена в активный список.');
  }

  function archiveHabit() {
    if (!archivingHabit) return;
    void perform(async store => { await store.archiveHabit(archivingHabit.id); setArchivingHabit(null); },
      'Привычка перемещена в архив. История сохранена.');
  }

  function toggleArchive() {
    setShowArchived(current => !current); setError(''); setMessage('');
  }

  function cancelActivity(id: string) {
    void perform(store => store.remove(id), 'Отметка отменена.');
  }

  function openBackup() {
    if (busy || managingHabit) return;
    returnFocus.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : backupButton.current;
    setBackupOpen(true);
  }

  function closeBackup() { if (!busy) setBackupOpen(false); }

  async function backupOperation<Result>(action: () => Promise<Result>, refresh = false): Promise<Result> {
    if (actionLock.current || (refresh && !repository)) throw new Error('Дождитесь завершения текущей операции.');
    actionLock.current = true;
    setBusy(true);
    try {
      const result = await action();
      if (refresh && repository) {
        try {
          const [entries, savedHabits] = await Promise.all([repository.list(), repository.listHabits('all')]);
          setActivities(entries); setHabits(savedHabits); setShowArchived(false);
          setError(''); setMessage('Данные восстановлены из резервной копии.');
        } catch {
          setRepository(null);
          const refreshError = 'Данные восстановлены, но экран не обновился. Закройте и откройте приложение. Защитная копия сохранена в папке recovery.';
          setError(refreshError);
          throw new Error(refreshError);
        }
      }
      return result;
    } finally { actionLock.current = false; setBusy(false); }
  }

  return { native, day, setDay, activities, habits, visibleHabits, showArchived, setShowArchived, toggleArchive,
    creatingHabit, editingHabit, archivingHabit, formOpen, managingHabit, canSave: !!repository,
    message, error, busy, addHabitButton, archiveToggle, beginCreate, beginManagement, cancelManagement,
    saveHabit, archiveHabit, restoreHabit, log, cancelActivity,
    backupOpen, backupButton, openBackup, closeBackup, backupOperation };
}

export type RelicsModel = ReturnType<typeof useRelicsModel>;
