import { AlertCircle, RefreshCw } from 'lucide-react'
import { getErrorMessage } from '@/shared/api/errors'
import { Button } from '@/shared/ui/Button'
import { HeroBanner } from '../components/HeroBanner'
import { StatGrid } from '../components/StatGrid'
import { DeptStatsTable } from '../modules/DeptStatsTable'
import { RoleDonut } from '../modules/RoleDonut'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { DASHBOARD_CONFIG } from '../../config/dashboard.config'

export default function Home() {
  const { stats, isLoading, isError, error, refetch } = useDashboardStats()

  return (
    <div className="space-y-5">
      <HeroBanner imageUrl={DASHBOARD_CONFIG.heroImageUrl} />

      {isError && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {getErrorMessage(error)}
          </span>
          <Button size="sm" variant="secondary" leftIcon={<RefreshCw />} onClick={() => void refetch()}>
            Thử lại
          </Button>
        </div>
      )}

      <StatGrid stats={stats} loading={isLoading} />

      <div className="grid gap-5 xl:grid-cols-2">
        <DeptStatsTable />
        <RoleDonut />
      </div>
    </div>
  )
}