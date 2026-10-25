import { create } from 'zustand'
import type { ReportFilterState } from '../model/types'

export interface ReportsState {
  filters: ReportFilterState
}

export const initialFilters: ReportFilterState = { departmentId: 'ALL', role: 'ALL', rate: 'ALL' }

export const useReportsStore = create<ReportsState>(() => ({
  filters: initialFilters
}))