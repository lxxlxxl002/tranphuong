import { Plus } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import { useDepartments } from '../../hooks/useDepartments'
import { DepartmentFormModal } from '../modules/DepartmentFormModal'
import { DepartmentTable } from '../modules/DepartmentTable'

export default function DepartmentsList() {
  const can = useCan()
  const { openCreate } = useDepartments()
  return (
    <>
      <PageHeader
        title="Phòng / Ban"
        actions={
          can('departments:create') && (
            <Button leftIcon={<Plus />} onClick={openCreate}>
              Thêm phòng/ban
            </Button>
          )
        }
      />
      <DepartmentTable />
      <DepartmentFormModal />
    </>
  )
}