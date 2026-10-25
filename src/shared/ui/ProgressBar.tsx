import { cn } from '@/shared/lib/cn'

type Tone = 'brand' | 'success' | 'warning' | 'danger'

const TONES: Record<Tone, string> = {
  brand: 'bg-brand-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500'
}

const HEIGHTS = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5' } as const

interface ProgressBarProps {
  value: number
  tone?: Tone | 'auto'
  size?: keyof typeof HEIGHTS
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, tone = 'auto', size = 'sm', showLabel, className }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  const resolved: Tone = tone === 'auto' ? (v >= 100 ? 'success' : 'brand') : tone
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('relative flex-1 overflow-hidden rounded-full bg-slate-100', HEIGHTS[size])}
      >
        <div className={cn('h-full rounded-full transition-[width] duration-500', TONES[resolved])} style={{ width: `${v}%` }} />
      </div>
      {showLabel && <span className="w-10 shrink-0 text-right text-xs font-medium text-ink-muted">{Math.round(v)}%</span>}
    </div>
  )
}