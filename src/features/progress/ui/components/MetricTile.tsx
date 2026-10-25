import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@/shared/ui/Skeleton'

interface MetricTileProps {
  icon: LucideIcon
  label: string
  value: ReactNode
  loading?: boolean
}

export function MetricTile({ icon: Icon, label, value, loading }: MetricTileProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-5 text-center">
      <Icon className="h-5 w-5 text-ink-soft" strokeWidth={1.75} />
      <p className="mt-3 text-xs text-ink-muted">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-6 w-16" />
      ) : (
        <p className="mt-1.5 text-lg font-bold tabular-nums text-ink">{value}</p>
      )}
    </div>
  )
}