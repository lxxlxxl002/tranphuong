import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'soft'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700',
  secondary: 'bg-white text-ink-soft ring-1 ring-inset ring-surface-line hover:bg-slate-50',
  outline: 'bg-white text-ink ring-1 ring-inset ring-slate-300 hover:bg-slate-50',
  ghost: 'text-ink-muted hover:bg-slate-100 hover:text-ink',
  danger: 'bg-rose-500 text-white shadow-sm hover:bg-rose-600',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100'
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9'
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? <Loader2 className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
})