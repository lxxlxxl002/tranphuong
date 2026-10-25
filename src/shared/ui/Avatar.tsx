import { cn } from '@/shared/lib/cn'
import { getInitials } from '@/shared/lib/format'

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm'
} as const

interface AvatarProps {
  name: string
  src?: string | null
  size?: keyof typeof SIZES
  className?: string
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return <img src={src} alt={name} className={cn('shrink-0 rounded-full object-cover', SIZES[size], className)} />
  }
  return (
    <span
      aria-label={name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-white ring-2 ring-white',
        SIZES[size],
        className
      )}
    >
      {getInitials(name)}
    </span>
  )
}