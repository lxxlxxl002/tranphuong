import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple'

const TONES: Record<BadgeTone, string> = {
  success: 'bg-green-50 text-green-600 ring-green-100',
  warning: 'bg-amber-50 text-amber-500 ring-amber-100',
  danger: 'bg-rose-50 text-rose-400 ring-rose-100',
  info: 'bg-blue-50 text-blue-600 ring-blue-100',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  purple: 'bg-purple-50 text-purple-600 ring-purple-100'
}

interface BadgeProps {
  tone?: BadgeTone
  dot?: boolean
  className?: string
  children: ReactNode
}

export function Badge({ tone = 'neutral', dot, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        TONES[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

/** Badge % hoàn thành: 100% xanh, còn lại đỏ nhạt (theo giao diện gốc) */
export const percentTone = (value: number): BadgeTone => (value >= 100 ? 'success' : 'danger')