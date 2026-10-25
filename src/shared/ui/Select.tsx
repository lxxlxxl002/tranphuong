import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { Option } from '@/shared/types/common'

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  options: Option<string>[]
  placeholder?: string
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, placeholder, className, containerClassName, id, ...rest },
  ref
) {
  const autoId = useId()
  const selectId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink-soft">
          {label}
          {rest.required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            'h-10 w-full appearance-none rounded-lg border border-surface-line bg-white pl-3 pr-9 text-sm text-ink-soft transition',
            'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50',
            error && 'border-rose-400',
            className
          )}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
})