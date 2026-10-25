import { Plus } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import { useRoles } from '../../hooks/useRoles'
import { PermissionMatrix } from '../modules/PermissionMatrix'
import { RoleFormModal } from '../modules/RoleFormModal'
import { RoleList } from '../modules/RoleList'

export default function PermissionsMatrixPage() {
  const can = useCan()
  const { openCreate } = useRoles()
  return (
    <>
      <PageHeader
        title="Phân quyền"
        actions={
          can('permissions:create') && (
            <Button leftIcon={<Plus />} onClick={openCreate}>
              Thêm vai trò
            </Button>
          )
        }
      />
      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <RoleList />
        </div>
        <PermissionMatrix />
      </div>
      <RoleFormModal />
    </>
  )
}
