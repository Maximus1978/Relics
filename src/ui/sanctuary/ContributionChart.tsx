import { useEffect, useRef } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { contributionSphereIds } from '../../domain/contributions';
import { spheres, type SphereId } from '../../domain/activity';
import { addCalendarDays, type ContributionBucket } from '../../domain/sphereContributions';
import { chartColors, chartDashes, chartValue, shortDay, type ContributionMode } from './contributionPresentation';
export default function ContributionChart({ buckets, daily, mode, visible, active }: {
    buckets: ContributionBucket[];
    daily: boolean;
    mode: ContributionMode;
    visible: Record<SphereId, boolean>;
    active: boolean;
}) {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!active || !host.current)
            return;
        const container = host.current;
        const data: uPlot.AlignedData = [buckets.map((_, i) => i), ...contributionSphereIds.map(s => buckets.map(w => chartValue(w, s, mode)))];
        const plot = new uPlot({ width: Math.max(240, container.clientWidth), height: 232, padding: [16, 18, 0, 4], legend: { show: false }, select: { show: false, left: 0, top: 0, width: 0, height: 0 }, cursor: { drag: { x: false, y: false }, points: { show: false } },
            scales: { x: { time: false, range: [-.08, buckets.length - .92] }, y: { range: mode === 'shares' ? [0, 100] : (_u, _min, max) => [0, Math.max(1, max * 1.15)] } },
            axes: [{ stroke: '#c3beaf', font: '12px Segoe UI', size: 52, space: 65, splits: () => buckets.map((_, i) => i), values: (plot, values) => values.map(i => plot.width < 600 && buckets.length > 4 && i % 2 !== 0 ? '' : shortDay(buckets[i].startDay) + (daily ? '' : '\n' + shortDay(addCalendarDays(buckets[i].endDayExclusive, -1)))), grid: { stroke: '#c3beaf0e' }, ticks: { stroke: '#c3beaf33' } },
                { stroke: '#c3beaf', font: '12px Segoe UI', size: 47, space: 36, values: (_u, values) => values.map(v => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(v)), grid: { stroke: '#c3beaf1a' }, ticks: { stroke: '#c3beaf33' } }],
            series: [{}, ...contributionSphereIds.map((sphere, i) => ({ label: spheres[sphere], stroke: chartColors[sphere], width: 2, dash: chartDashes[i], show: visible[sphere], spanGaps: false, points: { show: true, size: 6, fill: chartColors[sphere] } }))]
        }, data, container);
        container.dataset.visibleSeries = plot.series.slice(1).filter(s => s.show).map(s => s.label).join(',');
        const observer = new ResizeObserver(entries => { const width = Math.floor(entries[0].contentRect.width); if (width > 0)
            plot.setSize({ width: Math.max(240, width), height: 232 }); });
        observer.observe(container);
        return () => { observer.disconnect(); plot.destroy(); };
    }, [buckets, daily, mode, visible, active]);
    return <div className="rhythm-plot" ref={host} aria-hidden="true"/>;
}
