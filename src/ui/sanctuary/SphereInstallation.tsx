import { spheres, type SphereId } from '../../domain/activity';
import { recentActivity } from '../../domain/recentActivity';
import type { SelectedDayActivity } from '../../domain/selectedDayActivity';
import SphereGem from './SphereGem';
import SanctuaryRune from './SanctuaryRune';
import { sanctuaryArt } from './art';
import './installation.css';

const sphereOrder = Object.keys(spheres) as SphereId[];
const positions: Record<SphereId, [number, number]> = { body: [50, 14], mind: [85, 37], relationships: [80, 74], work: [20, 74], recovery: [15, 37] };

function RecordedRing({ count }: { count: number }) {
  return <div className="recorded-ring" aria-label={`${count} из 7 календарных дней с записями`}>
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle className="recorded-ring__track" cx="50" cy="50" r="41" /><circle className="recorded-ring__value" cx="50" cy="50" r="41" pathLength="7" strokeDasharray={`${count} 7`} transform="rotate(-90 50 50)" /></svg>
    <span><strong>{count}<small>/7</small></strong><em>дней с записями</em></span>
  </div>;
}

function BalanceWheel({ observation, selected }: { observation: ReturnType<typeof recentActivity>; selected: SelectedDayActivity }) {
  return <div className="balance-center">
    <div className="balance-wheel" role="img" aria-label={`Руна Sanctuary: ${observation.represented} из 5 сфер за ${observation.startOn} — ${observation.endOn}. Камни: записи на ${selected.day || 'невыбранную дату'}; ${sphereOrder.map(sphere => `${spheres[sphere]} — ${selected.illuminated[sphere] ? 'есть запись' : 'нет записи'}`).join('; ')}.`}>
      <img className="balance-wheel__frame" src={sanctuaryArt.wheel} width="640" height="640" alt="" aria-hidden="true" />
      <SanctuaryRune represented={observation.represented} />
      {sphereOrder.map(sphere => <span key={sphere} className="wheel-gem" data-sphere={sphere} data-state={selected.illuminated[sphere] ? 'illuminated' : 'subdued'}
        style={{ left: `${positions[sphere][0]}%`, top: `${positions[sphere][1]}%` }}><SphereGem sphere={sphere} illuminated={selected.illuminated[sphere]} /></span>)}
    </div>
    <div className="balance-caption"><h2>Грани вашей жизни</h2><p><strong>{observation.represented} из 5 сфер</strong> представлены в записях</p><span>за последние 7 календарных дней</span></div>
  </div>;
}

export default function SphereInstallation({ observation, selected }: { observation: ReturnType<typeof recentActivity>; selected: SelectedDayActivity }) {
  return <section className="world-installation" aria-label="Пять сфер и круг наблюдений">
    {sphereOrder.map(sphere => <article className={`sphere-shrine sphere-shrine--${sphere}`} data-sphere={sphere} data-state={selected.illuminated[sphere] ? 'illuminated' : 'subdued'} key={sphere} aria-label={`${spheres[sphere]}: ${selected.illuminated[sphere] ? 'есть запись' : 'нет записи'} на ${selected.day || 'невыбранную дату'}. ${observation.counts[sphere]} дней с записями за последние 7 календарных дней.`}>
      <div className="sphere-shrine__cavity" /><img className="sphere-shrine__architecture" src={sanctuaryArt.shrine} width="512" height="1024" alt="" aria-hidden="true" />
      <div className="sphere-shrine__content"><span className="sphere-shrine__symbol"><SphereGem sphere={sphere} illuminated={selected.illuminated[sphere]} /></span><h2>{spheres[sphere]}</h2><RecordedRing count={observation.counts[sphere]} /></div>
    </article>)}
    <BalanceWheel observation={observation} selected={selected} />
    <p className="observation-period"><span>Камни: {selected.day || 'выберите дату'} · свет означает запись. Без записи — без оценки.</span><span>Кольца и руна: {observation.startOn} — {observation.endOn} · последние 7 дней.</span></p>
  </section>;
}
