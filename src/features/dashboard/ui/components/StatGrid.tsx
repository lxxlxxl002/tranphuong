import { Award, BookOpen, GraduationCap, Users, type LucideIcon } from 'lucide-react'
import { formatNumber } from '@/shared/lib/format'
import { StatCard, type StatTone } from '@/shared/ui/StatCard'
import type { DashboardStats } from '../../model/types'

type StatKey = Exclude<keyof DashboardStats, 'roleDistribution'>

const ITEMS: { key: StatKey; icon: LucideIcon; label: string; unit: string; tone: StatTone }[] = [
  { key: 'totalUsers', icon: Users, label: 'Tổng người dùng', unit: 'người', tone: 'blue' },
  { key: 'totalCourses', icon: BookOpen, label: 'Khóa học', unit: 'khóa', tone: 'green' },
  { key: 'totalEnrollments', icon: GraduationCap, label: 'Lượt ghi danh', unit: 'lượt', tone: 'amber' },
  { key: 'totalCertificates', icon: Award, label: 'Chứng chỉ đã cấp', unit: 'cấp', tone: 'purple' }
]

interface StatGridProps {
  stats?: DashboardStats
  loading?: boolean
}

export function StatGrid({ stats, loading }: StatGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ITEMS.map((item) => (
        <StatCard
          key={item.key}
          icon={item.icon}
          label={item.label}
          value={stats ? formatNumber(stats[item.key]) : '—'}
          unit={item.unit}
          tone={item.tone}
          loading={loading}
        />
      ))}
    </div>
  )
}