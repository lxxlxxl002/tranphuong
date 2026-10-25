import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, className, containerClassName, id, ...rest },
  ref
) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-soft">
          {label}
          {rest.required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint [&>svg]:h-4 [&>svg]:w-4">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={cn(
            'h-10 w-full rounded-lg border border-surface-line bg-white px-3 text-sm text-ink placeholder:text-ink-faint transition',
            'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50',
            leftIcon && 'pl-9',
            error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-500/10',
            className
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  )
})