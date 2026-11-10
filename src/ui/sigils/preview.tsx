import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HabitMedal, medalViewport } from './HabitMedal';
import { icons, materials, stageLabels, surfaces, type CraftStage, type MedalIconId, type MedalMaterial } from './medalDesign';
import './showcase.css';

const stages = [1, 2, 3] as const;
const switchableMaterials = ['stone', 'bronze', 'gold', 'platinum'] as const;
const iconChoices = Object.keys(icons) as MedalIconId[];

type CardProps = {
  material: MedalMaterial;
  stage: CraftStage;
  iconId: MedalIconId;
  resonance?: number;
  completed?: boolean;
  subdued?: boolean;
  label: string;
};

function SampleCard({ completed, subdued, label, ...medal }: CardProps) {
  return (
    <button type="button" className="sample-card" data-completed={!!completed} data-subdued={!!subdued}
      aria-label={label + (completed ? '. Отмечено' : '. Без отметки') + '. Пример оформления'}>
      <HabitMedal {...medal} />
      {completed && <svg className="completion-mark" data-layer="completion" aria-hidden="true" viewBox="0 0 24 24">
        <path d="m6 12 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>}
      <strong>{label}</strong>
      <small>{surfaces[medal.material].label} · {medal.stage}</small>
    </button>
  );
}

function Showcase() {
  const [iconId, setIconId] = useState<MedalIconId>('strength');
  const [showRegistration, setShowRegistration] = useState(false);
  const [compactScale, setCompactScale] = useState(false);

  return (
    <main className="sigil-showcase">
      <header className="showcase-header">
        <p className="eyebrow">Relics · Sanctuary</p>
        <h1>Мастерская печатей</h1>
        <p>Шесть материалов, три стадии ремесла. Все печати и отметки на этой странице — демонстрационные.</p>
      </header>

      <section aria-labelledby="craft-title" id="craft">
        <div className="section-heading">
          <div><h2 id="craft-title">Материалы и стадии</h2><p>Один масштаб, одинаковый знак, свет погашен.</p></div>
          <div className="scale-controls"><label className="registration-toggle scale-toggle">
            <input type="checkbox" checked={compactScale} onChange={event => setCompactScale(event.target.checked)} />
            Масштаб карточки
          </label><label className="registration-toggle">
            <input type="checkbox" checked={showRegistration} onChange={event => setShowRegistration(event.target.checked)} />
            Контуры слота
          </label></div>
        </div>
        <div className="material-grid" data-compact={compactScale}>
          {materials.map(material => (
            <article className="material-column" key={material}>
              <h3>{surfaces[material].label}</h3>
              <p className="material-craft">{surfaces[material].craft}</p>
              {stages.map(stage => (
                <figure className="craft-figure" key={stage}>
                  <div className="registered-medal">
                    <HabitMedal material={material} stage={stage} iconId="strength" />
                    {showRegistration && <svg className="registration-overlay" aria-hidden="true" viewBox="0 0 200 200">
                      <rect {...medalViewport} />
                      <path d="M100 61v78M61 100h78" />
                    </svg>}
                  </div>
                  <figcaption><span>0{stage}</span> {stageLabels[stage - 1]}</figcaption>
                </figure>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="compact-title" id="compact">
        <div className="section-heading"><div><h2 id="compact-title">Сравнение в масштабе карточки</h2>
          <p>Средняя стадия каждого материала. Наведите курсор или перейдите к карточке клавишей Tab.</p></div></div>
        <div className="compact-grid">
          {materials.map(material => (
            <SampleCard key={material} material={material} stage={2} iconId="book" label={surfaces[material].label} />
          ))}
        </div>
      </section>

      <section aria-labelledby="icon-title" id="icons">
        <div className="section-heading"><div><h2 id="icon-title">Один знак, четыре оправы</h2>
          <p>Выберите знак. Все четыре печати обновятся сразу.</p></div></div>
        <fieldset className="icon-picker">
          <legend>Знак для демонстрации</legend>
          <div className="icon-options">
            {iconChoices.map(key => (
              <label key={key} className="icon-option">
                <input type="radio" name="icon" value={key} checked={iconId === key} onChange={() => setIconId(key)} />
                <svg aria-hidden="true" viewBox="0 0 48 48"><path d={icons[key].path} /></svg>
                <span>{icons[key].label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="switch-grid" aria-live="polite" aria-label={'Выбран знак «' + icons[iconId].label + '»'}>
          {switchableMaterials.map(material => (
            <figure key={material} className="switch-example">
              <HabitMedal material={material} stage={3} iconId={iconId} />
              <figcaption>{surfaces[material].label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="state-title" id="states">
        <div className="section-heading"><div><h2 id="state-title">Отметка и свет</h2>
          <p>Отметка, приглушение, свет и фокус показаны отдельными слоями.</p></div></div>
        <div className="state-grid">
          <SampleCard material="gold" stage={2} iconId="book" label="Без отметки" />
          <SampleCard material="gold" stage={2} iconId="book" label="Приглушена" subdued />
          <SampleCard material="gold" stage={2} iconId="book" label="Отмечена · свет 0" completed />
          <SampleCard material="gold" stage={2} iconId="book" label="Отмечена · тихая" completed subdued />
          <SampleCard material="gold" stage={2} iconId="book" label="Отмечена · свет ½" completed resonance={.5} />
          <SampleCard material="gold" stage={2} iconId="book" label="Отмечена · свет 1" completed resonance={1} />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('sigils-root')!).render(<Showcase />);
