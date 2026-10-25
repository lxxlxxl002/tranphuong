import { Card, CardHeader } from '@/shared/ui/Card'
import { DonutChart } from '@/shared/ui/DonutChart'
import { Skeleton } from '@/shared/ui/Skeleton'
import { Table, type Column } from '@/shared/ui/Table'
import { useReport } from '../../hooks/useReport'
import type { DeptReport } from '../../model/types'
import { CompletionBadge } from '../components/CompletionBadge'

const columns: Column<DeptReport>[] = [
  { key: 'name', header: 'Phòng / Ban', render: (r) => <span className="text-ink-soft">{r.departmentName}</span> },
  { key: 'staff', header: 'Số công chức', align: 'center', width: '120px', render: (r) => r.staffCount },
  { key: 'rate', header: 'Tỷ lệ hoàn thành', align: 'center', width: '140px', render: (r) => <CompletionBadge value={r.completionRate} /> }
]

export function DistributionPanel() {
  const { roles, departments, allStaff, isLoading } = useReport()

  return (
    <Card className="min-w-0">
      <CardHeader title="Biểu đồ phân bổ" />
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center gap-8">
            <Skeleton className="h-[210px] w-[210px] shrink-0 rounded-full" />
            <div className="flex-1 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <DonutChart data={roles} size={210} thickness={30} centerValue={allStaff.length} centerLabel="Tổng số" />
        )}
      </div>
      <div className="mx-5 border-t border-surface-line" />
      <div className="px-1 pb-2 pt-4">
        <h3 className="px-4 text-[15px] font-semibold text-ink">Thống kê theo phòng/ban</h3>
        <Table columns={columns} data={departments} rowKey={(r) => r.departmentId ?? 'none'} loading={isLoading} skeletonRows={5} dense className="mt-2" />
      </div>
    </Card>
  )
}