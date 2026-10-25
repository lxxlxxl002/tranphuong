import { ROLE_META, type Role } from '@/shared/constants/roles'
import { cn } from '@/shared/lib/cn'

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const meta = ROLE_META[role]
  return (
    <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', meta.badge, className)}>
      {meta.label}
    </span>
  )
}