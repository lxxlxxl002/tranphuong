import { AlertTriangle, Info, RefreshCw, RotateCcw, Save } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { getErrorMessage } from '@/shared/api/errors'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { usePermissions } from '../../hooks/usePermissions'
import { useRoleMutation } from '../../hooks/useRoleMutation'
import { useRoles } from '../../hooks/useRoles'
import { PermissionToggle } from '../components/PermissionToggle'

export function PermissionMatrix() {
  const can = useCan()
  const { selected: role, isLoading, isError, error, refetch } = useRoles()
  const p = usePermissions(role)
  const m = useRoleMutation()
  const readOnly = p.locked || !can('permissions:update')

  if (isError) {
    return (
      <Card>
        <EmptyState
          icon={AlertTriangle}
          title="Không tải được phân quyền"
          description={getErrorMessage(error)}
          action={
            <Button variant="secondary" size="sm" leftIcon={<RefreshCw />} onClick={() => void refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    )
  }

  if (isLoading || !role) {
    return (
      <Card className="space-y-3 p-5">
        <Skeleton className="h-6 w-72" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </Card>
    )
  }

  return (
    <Card className="min-w-0">
      <div className="sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-surface-line bg-white/95 px-5 py-4 backdrop-blur">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Quyền của vai trò: {role.name}</h3>
          {p.isDirty && <p className="mt-0.5 text-xs font-medium text-amber-600">{p.changes} thay đổi chưa lưu</p>}
        </div>
        {p.isDirty && !readOnly && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={<RotateCcw />} onClick={p.reset}>
              Hủy thay đổi
            </Button>
            <Button
              size="sm"
              leftIcon={<Save />}
              loading={m.isSavingPermissions}
              onClick={() => void m.savePermissions({ roleKey: role.key, permissions: p.current }).catch(() => undefined)}
            >
              Lưu thay đổi
            </Button>
          </div>
        )}
      </div>

      <div className="px-5 pt-4">
        {p.locked && (
          <p className="flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-700">
            <Info className="h-4 w-4 shrink-0" />
            Vai trò Quản trị viên (ADMIN) luôn có toàn quyền, không thể chỉnh sửa.
          </p>
        )}
        {role.description && !p.locked && <p className="text-sm text-ink-muted">{role.description}</p>}
      </div>

      <div className="px-5 pb-5 pt-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-line text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
              <th className="px-3 py-3 text-left">Chức năng</th>
              <th className="w-24 px-3 py-3 text-center">Cho phép</th>
            </tr>
          </thead>
          {p.groups.map((g) => (
            <tbody key={g.module}>
              <tr className="border-b border-surface-line bg-slate-50">
                <td className="px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-ink-soft">{g.label}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <PermissionToggle
                      label={`Bật/tắt tất cả quyền ${g.label}`}
                      checked={g.state === 'all'}
                      disabled={readOnly}
                      onChange={() => p.setModule(g.module, g.state !== 'all')}
                    />
                  </div>
                </td>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.key} className="border-b border-surface-line last:border-0">
                  <td className={cn('px-3 py-2.5 pl-6', r.granted ? 'text-ink-soft' : 'text-ink-muted')}>{r.label}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center">
                      <PermissionToggle label={`${g.label} — ${r.label}`} checked={r.granted} disabled={readOnly} onChange={() => p.toggle(r.key)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </Card>
  )
}