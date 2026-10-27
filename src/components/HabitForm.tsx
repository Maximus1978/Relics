import { useRef, useState, type FormEvent } from 'react';
import { spheres, type Habit, type SphereId } from '../domain/activity';
import { HabitValidationError, validateHabitInput, type HabitInput } from '../domain/habit';
import SphereIcon from './SphereIcon';

type Props = {
  busy: boolean;
  canSave: boolean;
  habit?: Habit;
  saveError: string;
  onSave: (input: HabitInput) => Promise<void>;
  onCancel: () => void;
};

export default function HabitForm({ busy, canSave, habit, saveError, onSave, onCancel }: Props) {
  const [name, setName] = useState(habit?.name ?? '');
  const [selected, setSelected] = useState<SphereId[]>(habit ? [...habit.spheres] : []);
  const [validationError, setValidationError] = useState<HabitValidationError | null>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const firstSphereInput = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !canSave) return;
    let input: HabitInput;
    try {
      input = validateHabitInput(name, selected);
    } catch (error) {
      if (error instanceof HabitValidationError) {
        setValidationError(error);
        (error.field === 'name' ? nameInput : firstSphereInput).current?.focus();
      }
      return;
    }
    setValidationError(null);
    await onSave(input);
  }

  return <form className="creation-form" aria-labelledby="create-habit-title" noValidate onSubmit={event => void submit(event)}
    onKeyDown={event => {
      if (event.key === 'Escape' && !busy) { event.preventDefault(); onCancel(); }
    }}>
    <h3 id="create-habit-title">{habit ? 'Изменить привычку' : 'Новая привычка'}</h3>
    <label className="name-field" htmlFor="habit-name">Название привычки</label>
    <input id="habit-name" ref={nameInput} autoFocus required value={name} disabled={busy}
      aria-invalid={validationError?.field === 'name'}
      aria-describedby={validationError?.field === 'name' ? 'habit-validation-error' : undefined}
      onChange={event => { setName(event.target.value); setValidationError(null); }} />
    <fieldset disabled={busy} aria-describedby={validationError?.field === 'spheres' ? 'habit-validation-error' : 'habit-spheres-help'}>
      <legend>Сферы жизни</legend>
      <p id="habit-spheres-help">Выберите одну или несколько сфер.</p>
      <div className="sphere-options">{(Object.keys(spheres) as SphereId[]).map(sphere => <label className="sphere-option" data-sphere={sphere} key={sphere}>
        <input type="checkbox" name="habit-spheres" value={sphere} checked={selected.includes(sphere)}
          ref={sphere === 'body' ? firstSphereInput : undefined}
          onChange={event => {
            const checked = event.target.checked;
            setSelected(current => checked ? [...current, sphere] : current.filter(item => item !== sphere));
            setValidationError(null);
          }} />
        <SphereIcon sphere={sphere} /><span>{spheres[sphere]}</span>
      </label>)}</div>
    </fieldset>
    {validationError && <p id="habit-validation-error" role="alert">{validationError.message}</p>}
    {!validationError && saveError && <p role="alert">{saveError}</p>}
    <div className="form-actions"><button className="button-primary" type="submit" disabled={busy || !canSave}>{busy ? 'Сохраняем…' : 'Сохранить'}</button>
      <button type="button" disabled={busy} onClick={onCancel}>Отмена</button></div>
  </form>;
}
