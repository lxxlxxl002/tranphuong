import { create } from 'zustand'
import type { SortState } from '@/shared/types/common'
import type { DeptSortKey } from '../model/types'

export interface DashboardState {
  deptSort: SortState<DeptSortKey> | null
}

export const useDashboardStore = create<DashboardState>(() => ({
  deptSort: null
}))