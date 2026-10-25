import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

const SIDES = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2'
} as const

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: keyof typeof SIDES
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <span className={cn('group/tt relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg',
          'transition-opacity duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100',
          SIDES[side]
        )}
      >
        {content}
      </span>
    </span>
  )
}