import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'
import { useDashboardStore } from '../state/store'
import { selectDeptSort } from '../state/selectors'
import { dashboardActions } from '../state/actions'
import { DASHBOARD_QUERY_KEYS } from '../model/constants'
import { DASHBOARD_CONFIG } from '../config/dashboard.config'

export function useDeptStats() {
  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.deptStats,
    queryFn: () => dashboardService.getDeptStats(),
    staleTime: DASHBOARD_CONFIG.staleTime
  })
  const sort = useDashboardStore(selectDeptSort)

  const rows = useMemo(() => dashboardService.sortDeptStats(query.data ?? [], sort), [query.data, sort])
  const summary = useMemo(() => dashboardService.summarize(query.data ?? []), [query.data])

  return {
    rows,
    summary,
    sort,
    toggleSort: dashboardActions.toggleDeptSort,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}