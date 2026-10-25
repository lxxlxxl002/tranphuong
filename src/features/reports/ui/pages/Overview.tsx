import { Award, BookOpen, GraduationCap, Users } from 'lucide-react'
import { formatNumber } from '@/shared/lib/format'
import { PageHeader } from '@/shared/ui/PageHeader'
import { StatCard } from '@/shared/ui/StatCard'
import { useReport } from '../../hooks/useReport'
import { DistributionPanel } from '../modules/DistributionPanel'
import { StaffTable } from '../modules/StaffTable'

export default function ReportsOverview() {
  const { stats, isLoading } = useReport()
  const v = (n?: number) => (n == null ? '—' : formatNumber(n))

  return (
    <>
      <PageHeader title="Báo cáo thống kê" />
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Tổng người dùng" value={v(stats?.totalUsers)} unit="người" unitInline tone="blue" loading={isLoading} />
          <StatCard icon={BookOpen} label="Khóa học" value={v(stats?.totalCourses)} unit="khóa" unitInline tone="green" loading={isLoading} />
          <StatCard icon={GraduationCap} label="Lượt ghi danh" value={v(stats?.totalEnrollments)} unit="lượt" unitInline tone="amber" loading={isLoading} />
          <StatCard icon={Award} label="Chứng chỉ" value={v(stats?.totalCertificates)} unit="cấp" unitInline tone="purple" loading={isLoading} />
        </div>
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <StaffTable />
          <DistributionPanel />
        </div>
      </div>
    </>
  )
}