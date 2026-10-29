import { useMemo, useState } from 'react';
import { spheres, type Activity, type SphereId } from '../../domain/activity';
import { contributionSphereIds } from '../../domain/contributions';
import { completeWeekWindow, projectSphereContributions, addCalendarDays } from '../../domain/sphereContributions';
import SphereIcon from '../../components/SphereIcon';
import ContributionChart from './ContributionChart';
import { chartValue, formatContribution, weekLabel, type ContributionMode } from './contributionPresentation';
import './rhythm.css';
export default function LifeRhythm({ activities, today, ready }: {
    activities: readonly Activity[];
    today: string;
    ready: boolean;
}) {
    const [weeks, setWeeks] = useState(4);
    const [mode, setMode] = useState<ContributionMode>('units');
    const [visible, setVisible] = useState<Record<SphereId, boolean>>({ body: true, mind: true, relationships: true, work: true, recovery: true });
    const result = useMemo(() => { try {
        const bounds = completeWeekWindow(today, weeks, 1);
        return { projection: projectSphereContributions(activities, { ...bounds, asOfDay: today, weekStartsOn: 1, trendWeeks: weeks }), error: false };
    }
    catch {
        return { projection: null, error: true };
    } }, [activities, today, weeks]);
    const data = result.projection;
    const filtered = contributionSphereIds.filter(s => visible[s]);
    return <section className="life-rhythm" id="life-rhythm" aria-labelledby="rhythm-title">
  <details open className="rhythm-expander">
   <summary><span className="rhythm-emblem" aria-hidden="true">☼</span><div><h2 id="rhythm-title">Жизненный ритм</h2><p>Вклад ваших записей в сферы жизни со временем.</p></div><span className="rhythm-chevron" aria-hidden="true">⌄</span></summary>
   <div className="rhythm-body">
    <div className="rhythm-controls"><div role="group" aria-label="Вид вклада"><button type="button" data-mode="units" aria-pressed={mode === 'units'} onClick={() => setMode('units')}>Вклад (единицы)</button><button type="button" data-mode="shares" aria-pressed={mode === 'shares'} onClick={() => setMode('shares')}>Распределение (%)</button></div>
     <label className="rhythm-period"><span className="visually-hidden">Период графика</span><select aria-label="Период графика" value={weeks} onChange={e => setWeeks(Number(e.target.value))}><option value="4">4 полные недели</option><option value="8">8 полных недель</option></select></label></div>
    {!ready ? <p role="status">Данные журнала пока недоступны. После загрузки появится расчёт.</p> : result.error || !data ? <p role="alert">Не удалось рассчитать вклад: записи содержат несовместимые данные. История не изменена.</p> : <>
     <p className="rhythm-timeframe">{data.trendWindow.startDay} — {addCalendarDays(data.trendWindow.endDayExclusive, -1)} · понедельник–воскресенье. Текущая неполная неделя не включена.</p>
     <div className="rhythm-visual">
      <figure className="rhythm-figure" aria-label={mode === 'units' ? 'Недельный вклад в субъективных единицах' : 'Недельные доли записанного вклада'}>
       <figcaption>{mode === 'units' ? 'Единицы вклада' : 'Доля записанных единиц, %'}</figcaption>
       {!data.period.hasNumericEvidence ? <div className="rhythm-empty">Нет числовых данных за этот период.<p>{data.period.excludedLegacyCount ? 'Старые записи сохранены, но в них ещё не было числового вклада.' : 'Здесь появится вклад записанных активностей.'} Отсутствие записи не означает отсутствие активности.</p></div> : !filtered.length ? <div className="rhythm-empty">Все линии скрыты. Выберите сферы в легенде.</div> : <ContributionChart weeks={data.weeks} mode={mode} visible={visible}/>}
      </figure>
      <fieldset className="rhythm-legend"><legend>{mode === 'units' ? 'За весь период, единицы' : 'За весь период, доли'}</legend>{contributionSphereIds.map((s, i) => <label key={s} data-sphere={s}><input type="checkbox" checked={visible[s]} onChange={e => setVisible({ ...visible, [s]: e.target.checked })}/><SphereIcon sphere={s}/><span>{spheres[s]}</span><span className={'rhythm-line rhythm-line--' + i} aria-hidden="true"/><output>{data.period.hasNumericEvidence ? formatContribution(chartValue(data.period, s, mode), mode) : '—'}</output></label>)}</fieldset>
     </div>
     <div className="rhythm-quality" aria-label="Качество данных"><span>Записей: <strong>{data.period.recordedEventCount}</strong></span><span>С числовым вкладом: <strong>{data.period.includedEventCount}</strong></span><span>Из них со значениями по умолчанию: <strong>{data.period.defaultOriginCount}</strong></span><span>Без весов, вне расчёта: <strong>{data.period.excludedLegacyCount}</strong></span></div>
     <p className="rhythm-explanation">{mode === 'shares' ? 'Доли от всех записанных субъективных единиц; скрытие линий не меняет расчёт. Округление до 0,1 %.' : 'Личные оценки вклада из снимков записей, без максимума или цели.'} {data.period.defaultOriginCount > 0 && 'Значения по умолчанию (5) включены; это не явная настройка пользователя.'} {data.period.excludedLegacyCount > 0 && 'Числовая картина неполная: неизвестные старые значения не восстанавливаются.'} Это не оценка качества жизни.</p>
     {data.weeks.some(w => !w.hasNumericEvidence) && data.period.hasNumericEvidence && <p className="rhythm-explanation">Разрывы линий — недели без числовых данных; неизвестное не считается нулём.</p>}
     <details className="rhythm-table"><summary>Числовые данные по неделям</summary><div className="rhythm-table-scroll" tabIndex={0} role="region" aria-label="Таблица вклада, прокручивается по горизонтали"><table><caption>{mode === 'units' ? 'Субъективные единицы' : 'Доли записанного вклада (%), округлены до 0,1 %'} · все пять сфер, включая скрытые линии</caption><thead><tr><th scope="col">Неделя</th>{contributionSphereIds.map(s => <th scope="col" key={s}>{spheres[s]}</th>)}<th scope="col">Записи / в расчёте / по умолчанию / без весов</th></tr></thead><tbody>{data.weeks.map(w => <tr key={w.startDay}><th scope="row">{weekLabel(w)}</th>{contributionSphereIds.map(s => <td key={s}>{formatContribution(chartValue(w, s, mode), mode)}</td>)}<td>{w.recordedEventCount} / {w.includedEventCount} / {w.defaultOriginCount} / {w.excludedLegacyCount}</td></tr>)}</tbody></table></div></details>
    </>}
   </div>
  </details>
 </section>;
}
