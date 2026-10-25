import { Card, CardHeader } from '@/shared/ui/Card'
import { DonutChart } from '@/shared/ui/DonutChart'
import { EmptyState } from '@/shared/ui/EmptyState'
import { Skeleton } from '@/shared/ui/Skeleton'
import { useDashboardStats } from '../../hooks/useDashboardStats'

export function RoleDonut() {
  const { roleChart, totalUsers, isLoading } = useDashboardStats()

  return (
    <Card className="flex flex-col">
      <CardHeader title="Biểu đồ phân bổ vai trò" />
      <div className="flex flex-1 items-center justify-center p-6 lg:p-8">
        {isLoading ? (
          <div className="flex w-full max-w-[560px] items-center gap-8">
            <Skeleton className="h-[220px] w-[220px] shrink-0 rounded-full" />
            <div className="flex-1 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ) : totalUsers === 0 ? (
          <EmptyState title="Chưa có người dùng" compact />
        ) : (
          <DonutChart data={roleChart} size={220} className="w-full max-w-[560px]" />
        )}
      </div>
    </Card>
  )
}