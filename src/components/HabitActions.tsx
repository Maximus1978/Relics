import type { MouseEvent } from 'react';
import type { Habit } from '../domain/activity';

type Props = {
  habit: Habit;
  disabled: boolean;
  onEdit: () => void;
  onArchive: () => void;
  onRestore: () => void;
};

export default function HabitActions({ habit, disabled, onEdit, onArchive, onRestore }: Props) {
  function act(event: MouseEvent<HTMLButtonElement>, action: () => void) {
    const disclosure = event.currentTarget.closest('details');
    if (disclosure) disclosure.open = false;
    action();
  }

  return <details className="habit-actions" onKeyDown={event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.currentTarget.open = false;
      event.currentTarget.querySelector('summary')?.focus();
    }
  }}>
    <summary id={`habit-actions-${habit.id}`} aria-label={`Действия: ${habit.name}`}>Действия</summary>
    <div className="habit-action-options">
      <button type="button" disabled={disabled} onClick={event => act(event, onEdit)}>Изменить</button>
      {habit.archivedAt === null
        ? <button type="button" disabled={disabled} onClick={event => act(event, onArchive)}>В архив…</button>
        : <button type="button" disabled={disabled} onClick={event => act(event, onRestore)}>Восстановить</button>}
    </div>
  </details>;
}
