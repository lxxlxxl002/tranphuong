import type { ReactNode } from 'react'
import { Inbox, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface EmptyStateProps {
  icon?: LucideIcon
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  compact?: boolean
  className?: string
}

export function EmptyState({ icon: Icon = Inbox, title, description, action, compact, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'py-6' : 'py-14', className)}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-ink-faint">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm font-semibold text-ink-soft">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}