import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface DropdownItem {
  key: string
  label?: ReactNode
  icon?: LucideIcon
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  header?: ReactNode
  className?: string
}

export function Dropdown({ trigger, items, align = 'right', header, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-lg"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-40 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-surface-line bg-white py-1.5 shadow-pop',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {header && <div className="border-b border-surface-line px-4 py-3">{header}</div>}
          {items.map((it) =>
            it.divider ? (
              <div key={it.key} className="my-1.5 h-px bg-surface-line" />
            ) : (
              <button
                key={it.key}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                onClick={() => {
                  setOpen(false)
                  it.onClick?.()
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors disabled:opacity-50',
                  it.danger ? 'text-rose-600 hover:bg-rose-50' : 'text-ink-soft hover:bg-slate-50'
                )}
              >
                {it.icon && <it.icon className="h-4 w-4" />}
                {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}