import { HabitMedal } from '../ui/sigils/HabitMedal';
import { icons, type MedalIconId } from '../ui/sigils/medalDesign';
import './habitIcons.css';

type Props = {
  value: MedalIconId;
  onChange: (iconId: MedalIconId) => void;
  disabled: boolean;
};

const choices = Object.keys(icons) as MedalIconId[];

export default function HabitIconPicker({ value, onChange, disabled }: Props) {
  return (
    <fieldset className="habit-icons" disabled={disabled} aria-describedby="habit-icons-help">
      <legend>Значок привычки</legend>
      <p id="habit-icons-help">Выберите один значок. Он сохранится за привычкой независимо от сфер и ритма.</p>
      <div className="habit-icons__layout">
        <figure className="habit-icons__preview">
          <HabitMedal material="stone" stage={1} iconId={value} />
          <figcaption aria-live="polite">{icons[value].label} · камень</figcaption>
        </figure>
        <div className="habit-icons__choices">
          {choices.map(iconId => (
            <label className="habit-icons__option" key={iconId}>
              <input type="radio" name="habit-icon" value={iconId} checked={value === iconId}
                onChange={() => onChange(iconId)} />
              <svg aria-hidden="true" viewBox="0 0 48 48"><path d={icons[iconId].path} /></svg>
              <span>{icons[iconId].label}</span>
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
