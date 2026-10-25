import { useNavigate } from 'react-router'
import { CheckCircle2, FileUp, Lock, UserPlus, Users } from 'lucide-react'
import { useCan } from '@/app/router/RoleGuard'
import { PATHS } from '@/app/router/paths'
import { Button } from '@/shared/ui/Button'
import { PageHeader } from '@/shared/ui/PageHeader'
import { StatCard } from '@/shared/ui/StatCard'
import { useUserList } from '../../hooks/useUserList'
import { percentOf } from '../../lib/utils'
import { ImportExcelModal } from '../modules/ImportExcelModal'
import { UserDetailPanel } from '../modules/UserDetailPanel'
import { UserTable } from '../modules/UserTable'

export default function UsersList() {
  const navigate = useNavigate()
  const can = useCan()
  const { stats, isLoading, openImport } = useUserList()

  return (
    <>
      <PageHeader
        title="Quản trị người dùng"
        actions={
          can('users:create') && (
            <>
              <Button variant="secondary" leftIcon={<FileUp />} onClick={openImport}>
                Import Excel
              </Button>
              <Button leftIcon={<UserPlus />} onClick={() => navigate(PATHS.userNew)}>
                Thêm người dùng
              </Button>
            </>
          )
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Tổng số công chức" value={stats.total} unit="Người" tone="blue" loading={isLoading} />
        <StatCard icon={CheckCircle2} label="Hoạt động" value={stats.active} unit={percentOf(stats.active, stats.total)} tone="green" loading={isLoading} />
        <StatCard icon={UserPlus} label="Chưa kích hoạt" value={stats.pending} unit={percentOf(stats.pending, stats.total)} tone="amber" loading={isLoading} />
        <StatCard icon={Lock} label="Đã khóa" value={stats.locked} unit={percentOf(stats.locked, stats.total)} tone="rose" loading={isLoading} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <UserTable />
        <UserDetailPanel />
      </div>

      <ImportExcelModal />
    </>
  )
}
