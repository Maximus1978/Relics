import { useId } from 'react';
import { spheres, type SphereId } from '../../domain/activity';
import { recentActivity } from '../../domain/recentActivity';
import SphereIcon from '../../components/SphereIcon';
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

function BalanceWheel({ observation }: { observation: ReturnType<typeof recentActivity> }) {
  const identifier = useId().replaceAll(':', '');
  return <div className="balance-center">
    <div className="balance-wheel" role="img" aria-label={`За последние 7 дней в записях представлены ${observation.represented} из 5 сфер`}>
      <img className="balance-wheel__frame" src={sanctuaryArt.wheel} width="640" height="640" alt="" aria-hidden="true" />
      <svg className="balance-wheel__geometry" viewBox="0 0 100 100" aria-hidden="true">
        <defs><radialGradient id={`${identifier}-glow`}><stop stopColor="#ffe2a2" stopOpacity=".45" /><stop offset="1" stopColor="#cf9e52" stopOpacity="0" /></radialGradient><linearGradient id={`${identifier}-gold`} x2=".6" y2="1"><stop stopColor="#fff1bd" /><stop offset=".45" stopColor="#cf9f54" /><stop offset="1" stopColor="#624927" /></linearGradient></defs>
        <circle cx="50" cy="50" r="34" fill={`url(#${identifier}-glow)`} />
        <g fill="none" stroke="#b89a61" strokeOpacity=".62" strokeWidth=".35"><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="23" /><path d="M50 20v60M20 50h60M29 29l42 42m0-42L29 71M50 20l29 39-47 15 0-48 47 15-29 39" /></g>
        <path d="m50 27 5 17 17 6-17 5-5 18-5-18-17-5 17-6Z" fill={`url(#${identifier}-gold)`} stroke="#ffe4ad" strokeWidth=".5" />
        <path d="m50 38 3 10 10 2-10 3-3 10-3-10-10-3 10-2Z" fill="#fff0cb" />
      </svg>
      {sphereOrder.map(sphere => <span key={sphere} className={`wheel-gem${observation.counts[sphere] ? ' is-observed' : ''}`} data-sphere={sphere}
        style={{ left: `${positions[sphere][0]}%`, top: `${positions[sphere][1]}%` }}><SphereIcon sphere={sphere} /></span>)}
    </div>
    <div className="balance-caption"><h2>Грани вашей жизни</h2><p><strong>{observation.represented} из 5 сфер</strong> представлены в записях</p><span>за последние 7 календарных дней</span></div>
  </div>;
}

export default function SphereInstallation({ observation }: { observation: ReturnType<typeof recentActivity> }) {
  return <section className="world-installation" aria-label="Пять сфер и круг наблюдений">
    {sphereOrder.map(sphere => <article className={`sphere-shrine sphere-shrine--${sphere}`} data-sphere={sphere} key={sphere}>
      <div className="sphere-shrine__cavity" /><img className="sphere-shrine__architecture" src={sanctuaryArt.shrine} width="512" height="1024" alt="" aria-hidden="true" />
      <div className="sphere-shrine__content"><span className="sphere-shrine__symbol"><SphereIcon sphere={sphere} /></span><h2>{spheres[sphere]}</h2><RecordedRing count={observation.counts[sphere]} /></div>
    </article>)}
    <BalanceWheel observation={observation} />
    <p className="observation-period">Записанные дни: {observation.startOn} — {observation.endOn}. Дни без записей не оцениваются.</p>
  </section>;
}
