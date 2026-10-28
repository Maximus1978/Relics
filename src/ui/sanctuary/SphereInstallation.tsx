import { spheres, type SphereId } from '../../domain/activity';
import SphereGem from './SphereGem';
import SanctuaryRune from './SanctuaryRune';
import type { MedallionIllumination } from '../../domain/medallionIllumination';
import { sanctuaryArt } from './art';
import './installation.css';

const sphereOrder = Object.keys(spheres) as SphereId[];

function RecordedRing({ count }: { count: number }) {
  return <div className="recorded-ring" aria-label={`${count} из 7 календарных дней с записями`}>
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle className="recorded-ring__track" cx="50" cy="50" r="41" /><circle className="recorded-ring__value" cx="50" cy="50" r="41" pathLength="7" strokeDasharray={`${count} 7`} transform="rotate(-90 50 50)" /></svg>
    <span><strong>{count}<small>/7</small></strong><em>дней с записями</em></span>
  </div>;
}

function BalanceWheel({ illumination }: { illumination: MedallionIllumination }) {
  const {recent:observation, selected} = illumination;
  const names = {dormant:'Тишина',awakening:'Пробуждение',harmony:'Гармония',radiance:'Полное сияние'};
  return <div className="balance-center">
    <div className="balance-wheel" role="img" data-state={illumination.state} aria-label={`Руна Sanctuary — ${names[illumination.state]}. Наблюдения за ${observation.startOn} — ${observation.endOn}. Камни: записи на ${selected.day || 'невыбранную дату'}; ${sphereOrder.map(sphere => `${spheres[sphere]} — ${selected.illuminated[sphere] ? 'есть запись' : 'нет записи'}`).join('; ')}.`}>
      <SanctuaryRune illumination={illumination} />
    </div>
    <div className="balance-caption"><h2>{names[illumination.state]}</h2><p><strong>{observation.represented} из 5 сфер</strong> представлены в записях</p><span>за последние 7 календарных дней</span></div>
  </div>;
}

export default function SphereInstallation({ illumination }: { illumination: MedallionIllumination }) {
  const {recent:observation, selected} = illumination;
  return <section className="world-installation" aria-label="Пять сфер и круг наблюдений">
    {sphereOrder.map(sphere => <article className={`sphere-shrine sphere-shrine--${sphere}`} data-sphere={sphere} data-state={selected.illuminated[sphere] ? 'illuminated' : 'subdued'} key={sphere} aria-label={`${spheres[sphere]}: ${selected.illuminated[sphere] ? 'есть запись' : 'нет записи'} на ${selected.day || 'невыбранную дату'}. ${observation.counts[sphere]} дней с записями за последние 7 календарных дней.`}>
      <div className="sphere-shrine__cavity" /><img className="sphere-shrine__architecture" src={sanctuaryArt.shrine} width="512" height="1024" alt="" aria-hidden="true" />
      <div className="sphere-shrine__content"><span className="sphere-shrine__symbol"><SphereGem sphere={sphere} illuminated={selected.illuminated[sphere]} /></span><h2>{spheres[sphere]}</h2><RecordedRing count={observation.counts[sphere]} /></div>
    </article>)}
    <BalanceWheel illumination={illumination} />
    <p className="observation-period"><span>Камни: {selected.day || 'выберите дату'} · свет означает запись. Без записи — без оценки.</span><span>Кольца и руна: {observation.startOn} — {observation.endOn} · последние 7 дней.</span></p>
  </section>;
}
