import { useCallback, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ShieldX } from 'lucide-react'
import { selectPermissions, selectRole, useAuthStore } from '@/features/auth'
import { hasPermission, type PermissionKey } from '@/shared/constants/permissions'
import { Card } from '@/shared/ui/Card'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PATHS } from './paths'

/** can(key) — key rỗng = cho phép */
export function useCan() {
  const role = useAuthStore(selectRole)
  const permissions = useAuthStore(selectPermissions)
  return useCallback((key?: PermissionKey) => !key || hasPermission(permissions, key, role), [permissions, role])
}

export function RoleGuard({ permission, children }: { permission?: PermissionKey; children: ReactNode }) {
  const can = useCan()
  if (!can(permission)) return <ForbiddenView />
  return <>{children}</>
}

export function ForbiddenView() {
  return (
    <Card>
      <EmptyState
        icon={ShieldX}
        title="Không có quyền truy cập"
        description="Tài khoản của bạn chưa được cấp quyền cho chức năng này. Vui lòng liên hệ quản trị viên."
        action={
          <Link to={PATHS.home} className="text-sm font-semibold text-brand-600 hover:underline">
            Về trang chủ
          </Link>
        }
      />
    </Card>
  )
}