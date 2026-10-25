import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'
import { DASHBOARD_QUERY_KEYS } from '../model/constants'
import { DASHBOARD_CONFIG } from '../config/dashboard.config'

export function useDashboardStats() {
  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.stats,
    queryFn: () => dashboardService.getStats(),
    staleTime: DASHBOARD_CONFIG.staleTime
  })

  const roleChart = useMemo(() => dashboardService.buildRoleChart(query.data), [query.data])

  return {
    stats: query.data,
    roleChart,
    totalUsers: query.data?.totalUsers ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}