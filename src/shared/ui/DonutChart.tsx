import type { ReactNode } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '@/shared/lib/cn'
import { toPercent } from '@/shared/lib/format'

export interface DonutDatum {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutDatum[]
  size?: number
  thickness?: number
  centerValue?: ReactNode
  centerLabel?: ReactNode
  showLegend?: boolean
  legendPosition?: 'right' | 'bottom'
  className?: string
}

export function DonutChart({
  data,
  size = 220,
  thickness = 28,
  centerValue,
  centerLabel,
  showLegend = true,
  legendPosition = 'right',
  className
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const chartData = total > 0 ? data.filter((d) => d.value > 0) : [{ label: '—', value: 1, color: '#e2e8f0' }]

  return (
    <div className={cn('flex items-center gap-8', legendPosition === 'bottom' && 'flex-col gap-5', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <filter id="donut-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.14" />
              </filter>
            </defs>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={size / 2 - thickness}
              outerRadius={size / 2 - 2}
              startAngle={90}
              endAngle={-270}
              paddingAngle={total > 0 ? 2 : 0}
              cornerRadius={6}
              stroke="#ffffff"
              strokeWidth={2}
              filter="url(#donut-shadow)"
            >
              {chartData.map((d) => (
                <Cell key={d.label} fill={d.color} />
              ))}
            </Pie>
            {total > 0 && (
              <Tooltip
                formatter={(v, n) => [`${v} (${toPercent(Number(v), total)}%)`, n]}
                contentStyle={{ borderRadius: 12, border: '1px solid #e8edf5', boxShadow: '0 10px 30px -10px rgba(30,64,175,.25)', fontSize: 13 }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
        {(centerValue != null || centerLabel) && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold leading-none tracking-tight text-ink">{centerValue}</span>
            {centerLabel && <span className="mt-1.5 text-xs font-medium uppercase tracking-wider text-ink-muted">{centerLabel}</span>}
          </div>
        )}
      </div>

      {showLegend && (
        <ul className="w-full min-w-[200px] flex-1 space-y-2.5">
          {data.map((d) => {
            const pct = toPercent(d.value, total)
            return (
              <li key={d.label} className="flex items-center justify-between gap-4 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-slate-50">
                <span className="flex items-center gap-2.5 font-medium text-ink-soft">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-md shadow-sm ring-2 ring-white" style={{ backgroundColor: d.color }} />
                  {d.label}
                </span>
                <span className="flex items-baseline gap-1 tabular-nums">
                  <span className="font-bold text-ink">{d.value}</span>
                  <span className="text-xs text-ink-muted">({pct}%)</span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}