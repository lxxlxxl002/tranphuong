import type { ReactNode } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/Avatar'
import { Tooltip } from '@/shared/ui/Tooltip'
import type { DeleteCheck, Department } from '../../model/types'

function IconButton({ label, danger, disabled, onClick, children }: { label: string; danger?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip content={label} side="left">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition disabled:cursor-not-allowed disabled:opacity-30',
          danger ? 'hover:bg-rose-50 hover:text-rose-600' : 'hover:bg-slate-100 hover:text-ink'
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}

interface DepartmentRowProps {
  dept: Department
  deleteCheck: DeleteCheck
  canEdit: boolean
  canDelete: boolean
  onEdit: () => void
  onDelete: () => void
}

export function DepartmentRow({ dept, deleteCheck, canEdit, canDelete, onEdit, onDelete }: DepartmentRowProps) {
  return (
    <tr className="border-b border-surface-line transition-colors last:border-0 hover:bg-slate-50/60">
      <td className="px-4 py-4 text-xs font-medium text-ink-muted">{dept.code}</td>
      <td className="px-4 py-4">
        <p className="font-semibold text-ink">{dept.name}</p>
        {dept.description && <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{dept.description}</p>}
      </td>
      <td className="px-4 py-4">
        {dept.leaderName ? (
          <span className="flex items-center gap-2">
            <Avatar name={dept.leaderName} size="xs" />
            <span className="text-sm text-ink-soft">{dept.leaderName}</span>
          </span>
        ) : (
          <span className="text-ink-faint">—</span>
        )}
      </td>
      <td className="px-4 py-4 text-center text-sm text-ink-soft">{dept.staffCount} công chức</td>
      <td className="px-4 py-4">
        <span className="flex items-center justify-center gap-0.5">
          {canEdit && (
            <IconButton label="Chỉnh sửa" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </IconButton>
          )}
          {canDelete && (
            <IconButton label={deleteCheck.ok ? 'Xóa' : (deleteCheck.reason ?? 'Không thể xóa')} danger disabled={!deleteCheck.ok} onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          )}
        </span>
      </td>
    </tr>
  )
}