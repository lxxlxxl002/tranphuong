import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  label?: ReactNode
  size?: 'sm' | 'md'
  'aria-label'?: string
}

export function Toggle({ checked, onChange, disabled, label, size = 'md', 'aria-label': ariaLabel }: ToggleProps) {
  const track = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11'
  const knob = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const move = size === 'sm' ? 'translate-x-4' : 'translate-x-5'

  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        track,
        checked ? 'bg-brand-500' : 'bg-slate-200'
      )}
    >
      <span className={cn('rounded-full bg-white shadow transition-transform duration-200', knob, checked ? move : 'translate-x-0')} />
    </button>
  )

  if (!label) return control
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
      {control}
      {label}
    </label>
  )
}