import type { ReactNode } from 'react'

interface SettingFieldProps {
  label: string
  description?: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: ReactNode
}

export function SettingField({ label, description, htmlFor, required, error, children }: SettingFieldProps) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-8">
      <div>
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
        {description && <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{description}</p>}
      </div>
      <div>
        {children}
        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>
    </div>
  )
}