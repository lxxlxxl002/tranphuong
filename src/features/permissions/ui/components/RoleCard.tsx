import { Pencil, ShieldCheck } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { RoleDef } from '../../model/types'

interface RoleCardProps {
  role: RoleDef
  summary: string
  active: boolean
  dirty: boolean
  canEdit: boolean
  onSelect: () => void
  onEdit: () => void
}

export function RoleCard({ role, summary, active, dirty, canEdit, onSelect, onEdit }: RoleCardProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 transition',
        active ? 'border-brand-300 bg-brand-50/70 ring-1 ring-brand-200' : 'border-surface-line bg-white hover:border-brand-200 hover:bg-slate-50'
      )}
    >
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition',
            active ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-ink-muted'
          )}
        >
          <ShieldCheck className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-ink">{role.name}</span>
            {dirty && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" title="Có thay đổi chưa lưu" />}
          </span>
          <span className="block truncate text-xs text-ink-muted">
            {summary}
            {role.userCount > 0 && ` · ${role.userCount} người`}
          </span>
        </span>
      </button>
      {canEdit && (
        <button
          type="button"
          aria-label={`Sửa vai trò ${role.name}`}
          onClick={onEdit}
          className="rounded-lg p-1.5 text-ink-faint transition hover:bg-white hover:text-brand-600"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}