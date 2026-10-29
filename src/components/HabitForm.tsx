import { useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { spheres, type Habit, type SphereId } from '../domain/activity';
import { HabitValidationError, validateHabitInput, type HabitInput } from '../domain/habit';
import { contributionSphereIds, ContributionError, validateContributionProfile } from '../domain/contributions';
import { sphereVisuals } from '../ui/sphereVisuals';
import SphereIcon from './SphereIcon';
type Props = {
    busy: boolean;
    canSave: boolean;
    habit?: Habit;
    saveError: string;
    onSave: (input: HabitInput) => Promise<void>;
    onCancel: () => void;
};
type ErrorState = {
    field: 'name' | 'spheres' | 'contributions';
    message: string;
    sphere?: SphereId;
};
export default function HabitForm({ busy, canSave, habit, saveError, onSave, onCancel }: Props) {
    const [name, setName] = useState(habit?.name ?? '');
    const [selected, setSelected] = useState<SphereId[]>(habit ? [...habit.spheres] : []);
    const [values, setValues] = useState<Record<SphereId, string>>(() => Object.fromEntries(contributionSphereIds.map(id => [id, String(habit?.contributionProfile?.values[id] ?? (habit?.spheres.includes(id) ? 5 : 0))])) as Record<SphereId, string>);
    const [error, setError] = useState<ErrorState | null>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const firstSphereInput = useRef<HTMLInputElement>(null);
    const numericInputs = useRef<Partial<Record<SphereId, HTMLInputElement | null>>>({});
    function toggle(sphere: SphereId, checked: boolean) {
        setSelected(current => checked ? [...current, sphere] : current.filter(id => id !== sphere));
        setValues(current => ({ ...current, [sphere]: checked ? '5' : '0' }));
        setError(null);
    }
    function adjust(sphere: SphereId, value: string) { setValues(current => ({ ...current, [sphere]: value })); setError(null); }
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy || !canSave)
            return;
        try {
            const input = validateHabitInput(name, selected);
            const contributionProfile = validateContributionProfile({ version: 1, origin: 'user', values: Object.fromEntries(contributionSphereIds.map(id => [id, selected.includes(id) ? (values[id].trim() === '' ? NaN : Number(values[id])) : 0])) }, input.spheres);
            setError(null);
            await onSave({ ...input, contributionProfile });
        }
        catch (failure) {
            if (failure instanceof HabitValidationError) {
                setError(failure);
                (failure.field === 'name' ? nameInput : firstSphereInput).current?.focus();
            }
            else if (failure instanceof ContributionError) {
                const sphere = selected.find(id => values[id].trim() === '' || !Number.isInteger(Number(values[id])) || Number(values[id]) < 1 || Number(values[id]) > 10);
                setError({ field: 'contributions', message: failure.message, sphere });
                if (sphere)
                    numericInputs.current[sphere]?.focus();
            }
            else
                throw failure;
        }
    }
    return <form className="creation-form" aria-labelledby="create-habit-title" noValidate onSubmit={event => void submit(event)} onKeyDown={event => { if (event.key === 'Escape' && !busy) {
        event.preventDefault();
        onCancel();
    } }}>
  <h3 id="create-habit-title">{habit ? 'Изменить привычку' : 'Новая привычка'}</h3>
  <p className="habit-form-subtitle">Укажите привычку и её вклад в сферы жизни.</p>
  <div className="habit-name-panel">
   <label className="name-field" htmlFor="habit-name">Название привычки</label>
   <input id="habit-name" ref={nameInput} autoFocus required value={name} disabled={busy} aria-invalid={error?.field === 'name'} aria-describedby={error?.field === 'name' ? 'habit-validation-error' : undefined} onChange={event => { setName(event.target.value); setError(null); }}/>
   {habit?.contributionProfile?.origin === 'legacy-default' && <p className="contribution-default-note">Значения по умолчанию: 5. Сохранение подтвердит профиль только для новых записей.</p>}
  </div>
  <fieldset disabled={busy} aria-describedby="habit-spheres-help">
   <legend>Сферы и вклад</legend>
   <p id="habit-spheres-help">Ваша личная оценка вклада: от 1 до 10. Значения независимы — их не нужно складывать до 10 или 100.</p>
   <div className="sphere-options">{contributionSphereIds.map(sphere => {
            const active = selected.includes(sphere);
            const invalid = error?.field === 'contributions' && error.sphere === sphere;
            return <div className="sphere-contribution-row" data-sphere={sphere} data-selected={active} key={sphere}>
     <label className="sphere-option" htmlFor={'sphere-' + sphere}>
      <input id={'sphere-' + sphere} type="checkbox" name="habit-spheres" value={sphere} checked={active} ref={sphere === 'body' ? firstSphereInput : undefined} aria-invalid={error?.field === 'spheres'} aria-describedby={error?.field === 'spheres' ? 'habit-validation-error' : 'habit-spheres-help'} onChange={event => toggle(sphere, event.target.checked)}/>
      <SphereIcon sphere={sphere}/><span><strong>{spheres[sphere]}</strong><small>{sphereVisuals[sphere].invitation}</small></span>
     </label>
     <div className="contribution-controls">
      <input id={'contribution-number-' + sphere} className="contribution-number" type="number" inputMode="numeric" min={active ? 1 : 0} max="10" step="1" ref={element => { numericInputs.current[sphere] = element; }} disabled={!active || busy} value={active ? values[sphere] : '0'} aria-label={'Вклад в сферу «' + spheres[sphere] + '», единицы'} aria-invalid={invalid} aria-describedby={invalid ? 'habit-validation-error' : 'contribution-hint-' + sphere} onChange={event => adjust(sphere, event.target.value)}/>
      <div className="contribution-scale">
       <input id={'contribution-range-' + sphere} type="range" min={active ? 1 : 0} max="10" step="1" disabled={!active || busy} style={{ '--contribution-fill': active ? Math.max(0, Math.min(100, (Number(values[sphere]) - 1) / 9 * 100)) + '%' : '0%' } as CSSProperties} value={active ? (Number(values[sphere]) || 1) : 0} aria-label={'Настроить вклад в сферу «' + spheres[sphere] + '»'} aria-valuetext={active ? values[sphere] + ' из 10 субъективных единиц' : 'Не выбрана — вклад 0'} onChange={event => adjust(sphere, event.target.value)}/>
       <small id={'contribution-hint-' + sphere}>{active ? <><span>1 · Небольшой</span><span>10 · Очень значимый</span></> : <span>Не выбрана — вклад 0</span>}</small>
      </div>
     </div>
    </div>;
        })}</div>
  </fieldset>
  <p className="contribution-history-note">Это ваша субъективная оценка, не интенсивность и не показатель здоровья. История записей сохранит прежние значения.</p>
  {error && <p id="habit-validation-error" role="alert">{error.message}</p>}
  {!error && saveError && <p role="alert">{saveError}</p>}
  <div className="form-actions"><button className="button-primary" type="submit" disabled={busy || !canSave}>{busy ? 'Сохраняем…' : 'Сохранить'}</button>
   <button type="button" disabled={busy} onClick={onCancel}>Отмена</button></div>
 </form>;
}
