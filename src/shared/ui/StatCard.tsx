import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Skeleton } from './Skeleton'

export type StatTone = 'blue' | 'green' | 'amber' | 'purple' | 'rose'

const TONES: Record<StatTone, { icon: string; glow: string; bar: string }> = {
  blue: { icon: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white', glow: 'shadow-blue-500/25', bar: 'bg-blue-500' },
  green: { icon: 'bg-gradient-to-br from-emerald-500 to-green-600 text-white', glow: 'shadow-emerald-500/25', bar: 'bg-emerald-500' },
  amber: { icon: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white', glow: 'shadow-amber-500/25', bar: 'bg-amber-400' },
  purple: { icon: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white', glow: 'shadow-violet-500/25', bar: 'bg-violet-500' },
  rose: { icon: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white', glow: 'shadow-rose-500/25', bar: 'bg-rose-500' }
}

interface StatCardProps {
  icon: LucideIcon
  label: ReactNode
  value: ReactNode
  unit?: ReactNode
  hint?: ReactNode
  tone?: StatTone
  /** true: "9 người" cùng dòng — false: đơn vị nằm dòng dưới */
  unitInline?: boolean
  loading?: boolean
  className?: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  hint,
  tone = 'blue',
  unitInline,
  loading,
  className
}: StatCardProps) {
  const t = TONES[tone]
  return (
    <div
      className={cn(
        'group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-surface-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop',
        className
      )}
    >
      <span className={cn('absolute inset-y-0 left-0 w-1 rounded-r-full opacity-80', t.bar)} />
      <div
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-transform duration-200 group-hover:scale-105',
          t.icon,
          t.glow
        )}
      >
        <Icon className="h-7 w-7" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-ink-muted">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-20" />
        ) : (
          <p className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-[28px] font-extrabold leading-tight tracking-tight tabular-nums text-ink">{value}</span>
            {unit && unitInline && <span className="text-sm font-medium text-ink-muted">{unit}</span>}
          </p>
        )}
        {unit && !unitInline && !loading && <p className="text-xs font-medium text-ink-faint">{unit}</p>}
        {hint && <p className="text-xs text-ink-faint">{hint}</p>}
      </div>
    </div>
  )
}