import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePagination } from '@/shared/hooks/usePagination'
import { reportService } from '../services/reportService'
import { useReportsStore } from '../state/store'
import { selectFilters } from '../state/selectors'
import { reportsActions } from '../state/actions'
import { PAGE_SIZE, REPORTS_QUERY_KEYS } from '../model/constants'
import { REPORTS_CONFIG } from '../config/reports.config'
import type { DeptReport, StaffReport } from '../model/types'

const NO_STAFF: StaffReport[] = []
const NO_DEPTS: DeptReport[] = []

export function useReport() {
  const query = useQuery({
    queryKey: REPORTS_QUERY_KEYS.overview,
    queryFn: () => reportService.getReport(),
    staleTime: REPORTS_CONFIG.staleTime
  })
  const filters = useReportsStore(selectFilters)
  const allStaff = query.data?.staff ?? NO_STAFF
  const departments = query.data?.departments ?? NO_DEPTS

  const staff = useMemo(() => reportService.filterStaff(allStaff, filters), [allStaff, filters])
  const pagination = usePagination({ total: staff.length, pageSize: PAGE_SIZE })
  const { setPage } = pagination
  useEffect(() => setPage(1), [filters, setPage])

  const departmentOptions = useMemo(() => reportService.departmentOptions(departments), [departments])

  return {
    stats: query.data?.stats ?? null,
    roles: query.data?.roles ?? [],
    departments,
    allStaff,
    staff,
    pageStaff: pagination.slice(staff),
    pagination,
    filters,
    departmentOptions,
    roleOptions: reportService.roleOptions(),
    filterSummary: reportService.describeFilters(filters, departments),
    ...reportsActions,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}