import { useState } from 'react'
import { AlertTriangle, Building2, Plus, RefreshCw } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useDepartments } from '../../hooks/useDepartments'
import { useDepartmentMutation } from '../../hooks/useDepartmentMutation'
import type { Department } from '../../model/types'
import { DepartmentRow } from '../components/DepartmentRow'

const HEADERS: { label: string; className: string }[] = [
  { label: 'Mã', className: 'w-20 text-left' },
  { label: 'Tên phòng/ban', className: 'text-left' },
  { label: 'Lãnh đạo phòng', className: 'w-64 text-left' },
  { label: 'Số công chức', className: 'w-40 text-center' },
  { label: 'Thao tác', className: 'w-32 text-center' }
]

export function DepartmentTable() {
  const can = useCan()
  const list = useDepartments()
  const m = useDepartmentMutation()
  const [deleting, setDeleting] = useState<Department | null>(null)

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await m.deleteDepartment(deleting)
      setDeleting(null)
    } catch {
      /* toast */
    }
  }

  if (list.isError) {
    return (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được phòng/ban"
          description={getErrorMessage(list.error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void list.refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto px-1 py-2 scrollbar-thin">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-surface-line">
              {HEADERS.map((h) => (
                <th key={h.label} className={`whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-faint ${h.className}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-surface-line last:border-0">
                  {HEADERS.map((h) => (
                    <td key={h.label} className="px-4 py-4">
                      <Skeleton className="h-4 w-full max-w-[180px]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : list.departments.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length}>
                  <EmptyState
                    icon={Building2}
                    title="Chưa có phòng/ban nào"
                    action={
                      can('departments:create') && (
                        <Button size="sm" leftIcon={<Plus />} onClick={list.openCreate}>
                          Thêm phòng/ban
                        </Button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              list.departments.map((d) => (
                <DepartmentRow
                  key={d.id}
                  dept={d}
                  deleteCheck={list.canDelete(d)}
                  canEdit={can('departments:update')}
                  canDelete={can('departments:delete')}
                  onEdit={() => list.openEdit(d.id)}
                  onDelete={() => setDeleting(d)}
                />
              ))
            )}
          </tbody>
          {!list.isLoading && list.departments.length > 0 && (
            <tfoot>
              <tr className="border-t border-surface-line text-sm text-ink-muted">
                <td colSpan={3} className="px-4 py-3">
                  Tổng cộng {list.departments.length} phòng/ban
                </td>
                <td className="px-4 py-3 text-center font-semibold text-ink-soft">{list.totalStaff} công chức</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Xóa phòng/ban?"
        message={deleting ? `Phòng "${deleting.name}" (${deleting.code}) sẽ bị xóa khỏi hệ thống.` : undefined}
        confirmText="Xóa phòng/ban"
        loading={m.isDeleting}
        onConfirm={confirmDelete}
      />
    </Card>
  )
}