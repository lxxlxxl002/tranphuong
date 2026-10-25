import { isDemoMode } from '@/features/auth'
import { ApiError } from '@/shared/api/errors'
import { ROLE_META, ROLE_ORDER } from '@/shared/constants/roles'
import type { SortState } from '@/shared/types/common'
import { fetchDeptStats, fetchStats } from '../api/queries'
import { toDashboardStats, toDeptStats } from '../adapters/dashboardAdapter'
import { DASHBOARD_CONFIG } from '../config/dashboard.config'
import type { DashboardStats, DeptSortKey, DeptStat, RoleSlice } from '../model/types'

const demo = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), DASHBOARD_CONFIG.demoDelayMs))

const parseOrThrow = <T>(fn: () => T, message: string): T => {
  try {
    return fn()
  } catch {
    throw new ApiError('SERVER', message)
  }
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    if (isDemoMode()) return demo(DASHBOARD_CONFIG.demo.stats)
    const raw = await fetchStats()
    return parseOrThrow(() => toDashboardStats(raw), 'Dữ liệu thống kê không hợp lệ')
  },

  async getDeptStats(): Promise<DeptStat[]> {
    if (isDemoMode()) return demo(DASHBOARD_CONFIG.demo.deptStats)
    const raw = await fetchDeptStats()
    return parseOrThrow(() => toDeptStats(raw), 'Dữ liệu phòng/ban không hợp lệ')
  },

  /** Luôn đủ 4 vai trò, đúng thứ tự + màu chuẩn */
  buildRoleChart(stats?: DashboardStats | null): RoleSlice[] {
    const counts = new Map(stats?.roleDistribution.map((r) => [r.role, r.count]) ?? [])
    return ROLE_ORDER.map((role) => ({
      role,
      label: ROLE_META[role].label,
      value: counts.get(role) ?? 0,
      color: ROLE_META[role].color
    }))
  },

  sortDeptStats(list: DeptStat[], sort: SortState<DeptSortKey> | null): DeptStat[] {
    if (!sort) return list
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      const x = a[sort.key]
      const y = b[sort.key]
      const diff = typeof x === 'string' && typeof y === 'string' ? x.localeCompare(y, 'vi') : Number(x) - Number(y)
      return diff * dir
    })
  },

  summarize(list: DeptStat[]) {
    const staff = list.reduce((s, d) => s + d.staffCount, 0)
    const weighted = list.reduce((s, d) => s + d.completionRate * d.staffCount, 0)
    return { departments: list.length, staff, avgCompletion: staff ? Math.round(weighted / staff) : 0 }
  }
}